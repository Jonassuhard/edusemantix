import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

export class GameEngine {
  constructor(dataDir) {
    this.schedule = []
    this.players = new Map()
    this.dataDir = dataDir

    // Vector data
    this.wordIndex = {}   // word -> position in vectors file
    this.vectors = null    // Float32Array of all vectors
    this.vecDim = 0
    this.vocabWords = []

    // Current day
    this.currentWord = null
    this.currentVec = null
    this.topRanked = null  // pre-sorted top 1000 for rank assignment

    this.loadData()
  }

  loadData() {
    // Load schedule
    try {
      const raw = readFileSync(join(this.dataDir, 'schedule.json'), 'utf-8')
      this.schedule = JSON.parse(raw)
    } catch {
      this.schedule = []
    }

    // Load vector index
    const indexPath = join(this.dataDir, 'vectors.json')
    if (existsSync(indexPath)) {
      console.log('Loading vector index...')
      const raw = readFileSync(indexPath, 'utf-8')
      const data = JSON.parse(raw)
      this.vocabWords = data.words
      this.vecDim = data.dim

      // Build word -> index lookup
      for (let i = 0; i < this.vocabWords.length; i++) {
        this.wordIndex[this.vocabWords[i]] = i
      }

      // Load binary vectors (may be split into parts)
      const vecPath = join(this.dataDir, 'vectors.bin')
      const vecPathA = join(this.dataDir, 'vectors_a.bin')
      const vecPathB = join(this.dataDir, 'vectors_b.bin')

      if (existsSync(vecPath)) {
        const buf = readFileSync(vecPath)
        this.vectors = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4)
      } else if (existsSync(vecPathA) && existsSync(vecPathB)) {
        const bufA = readFileSync(vecPathA)
        const bufB = readFileSync(vecPathB)
        const combined = Buffer.concat([bufA, bufB])
        this.vectors = new Float32Array(combined.buffer, combined.byteOffset, combined.byteLength / 4)
      }

      if (this.vectors) {
        console.log(`Loaded ${this.vocabWords.length} word vectors (${this.vecDim}d)`)
      }
    } else {
      console.log('No vector index found, falling back to JSON files...')
      this.loadJsonFallback()
    }

    if (this.schedule.length === 0) {
      this.schedule = ['parapluie']
    }

    this.loadTodayWord()
    console.log(`Schedule: ${this.schedule.length} day(s)`)
  }

  loadJsonFallback() {
    // Fallback: load pre-computed JSON files
    this.jsonVocabs = {}
    const wordsDir = join(this.dataDir, 'words')
    if (!existsSync(wordsDir)) return
    try {
      const files = readdirSync(wordsDir).filter(f => f.endsWith('.json'))
      for (const file of files) {
        const raw = readFileSync(join(wordsDir, file), 'utf-8')
        const data = JSON.parse(raw)
        this.jsonVocabs[data.word] = data.vocab
      }
      if (this.schedule.length === 0) {
        this.schedule = Object.keys(this.jsonVocabs)
      }
      console.log(`Loaded ${Object.keys(this.jsonVocabs).length} JSON word file(s)`)
    } catch (e) {
      console.error('Error loading JSON fallback:', e.message)
    }
  }

  loadTodayWord() {
    const word = this.getTodayWord()
    if (word === this.currentWord) return
    this.currentWord = word

    if (this.vectors) {
      // Vector mode: get target vector and pre-compute top 1000
      const idx = this.wordIndex[word]
      if (idx === undefined) {
        console.error(`Target word '${word}' not in vector index`)
        return
      }
      const start = idx * this.vecDim
      this.currentVec = this.vectors.slice(start, start + this.vecDim)

      // Pre-compute top 1000 for rank assignment
      console.log(`Computing rankings for '${word}'...`)
      const scores = []
      for (let i = 0; i < this.vocabWords.length; i++) {
        if (this.vocabWords[i] === word) continue
        const vStart = i * this.vecDim
        let dot = 0
        for (let d = 0; d < this.vecDim; d++) {
          dot += this.currentVec[d] * this.vectors[vStart + d]
        }
        scores.push([i, dot * 100])
      }
      scores.sort((a, b) => b[1] - a[1])
      this.topRanked = new Map()
      for (let r = 0; r < Math.min(1000, scores.length); r++) {
        this.topRanked.set(this.vocabWords[scores[r][0]], 999 - r)
      }
      console.log(`Rankings ready. Top word: ${this.vocabWords[scores[0][0]]} (${scores[0][1].toFixed(1)})`)
    }
  }

  computeSimilarity(word) {
    if (!this.vectors || !this.currentVec) return null

    const idx = this.wordIndex[word]
    if (idx === undefined) return null

    const start = idx * this.vecDim
    let dot = 0
    for (let d = 0; d < this.vecDim; d++) {
      dot += this.currentVec[d] * this.vectors[start + d]
    }
    const score = dot * 100
    const rank = this.topRanked?.get(word) ?? null

    return { score, rank }
  }

  getTodayWord() {
    const epoch = new Date('2026-03-28')
    const now = new Date()
    const day = Math.floor((now - epoch) / 86400000)
    const index = ((day % this.schedule.length) + this.schedule.length) % this.schedule.length
    return this.schedule[index]
  }

  getYesterdayWord() {
    const epoch = new Date('2026-03-28')
    const now = new Date()
    const day = Math.floor((now - epoch) / 86400000) - 1
    const index = ((day % this.schedule.length) + this.schedule.length) % this.schedule.length
    return this.schedule[index]
  }

  getTodayInfo() {
    this.loadTodayWord()
    const epoch = new Date('2026-03-28')
    const now = new Date()
    const day = Math.floor((now - epoch) / 86400000) + 1
    return {
      day,
      totalWords: this.vocabWords.length || (this.jsonVocabs?.[this.currentWord] ? Object.keys(this.jsonVocabs[this.currentWord]).length : 0),
      yesterdayWord: this.getYesterdayWord()
    }
  }

  addPlayer(name) {
    if (!this.players.has(name)) {
      this.players.set(name, {
        name,
        guesses: 0,
        bestScore: -Infinity,
        bestRank: null,
        found: false
      })
    }
  }

  processGuess(playerName, word) {
    this.loadTodayWord()
    const target = this.currentWord

    // Exact match
    if (word === target) {
      const player = this.players.get(playerName)
      if (player) {
        player.guesses++
        player.bestScore = 100
        player.bestRank = 1000
        player.found = true
      }
      return {
        word, known: true, score: 100, rank: 1000,
        emoji: '\u{1F973}', found: true,
        guessNumber: player?.guesses || 0
      }
    }

    // Try vector computation first
    if (this.vectors) {
      const result = this.computeSimilarity(word)
      if (result) {
        const { score, rank } = result
        const emoji = this.getEmoji(score, rank)
        const player = this.players.get(playerName)
        if (player) {
          player.guesses++
          if (score > player.bestScore) {
            player.bestScore = score
            player.bestRank = rank
          }
        }
        return {
          word, known: true,
          score: Math.round(score * 100) / 100,
          rank, emoji, found: false,
          guessNumber: player?.guesses || 0
        }
      }
    }

    // Fallback to JSON
    if (this.jsonVocabs) {
      const vocab = this.jsonVocabs[target]
      if (vocab) {
        const entry = vocab[word]
        if (entry) {
          const [score, rank] = entry
          const emoji = this.getEmoji(score, rank)
          const player = this.players.get(playerName)
          if (player) {
            player.guesses++
            if (score > player.bestScore) {
              player.bestScore = score
              player.bestRank = rank
            }
          }
          return {
            word, known: true,
            score: Math.round(score * 100) / 100,
            rank, emoji, found: false,
            guessNumber: player?.guesses || 0
          }
        }
      }
    }

    return { word, known: false, error: 'Mot inconnu' }
  }

  getEmoji(score, rank) {
    if (score >= 100) return '\u{1F973}'
    if (rank >= 999) return '\u{1F631}'
    if (rank >= 990) return '\u{1F525}'
    if (rank >= 900) return '\u{1F975}'
    if (rank >= 1) return '\u{1F60E}'
    if (score >= 0) return '\u{1F976}'
    return '\u{1F9CA}'
  }

  getLeaderboard() {
    return Array.from(this.players.values())
      .map(p => ({
        name: p.name,
        guesses: p.guesses,
        bestScore: p.bestScore === -Infinity ? null : Math.round(p.bestScore * 100) / 100,
        bestRank: p.bestRank,
        found: p.found,
        emoji: p.bestScore === -Infinity ? '' : this.getEmoji(p.bestScore, p.bestRank)
      }))
      .sort((a, b) => {
        if (a.found && !b.found) return -1
        if (!a.found && b.found) return 1
        if (a.found && b.found) return a.guesses - b.guesses
        return (b.bestScore || -999) - (a.bestScore || -999)
      })
  }
}
