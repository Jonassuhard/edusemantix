import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

export class GameEngine {
  constructor(dataDir) {
    this.words = {}
    this.schedule = []
    this.players = new Map()
    this.dataDir = dataDir
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

    // Load all word files
    const wordsDir = join(this.dataDir, 'words')
    try {
      const files = readdirSync(wordsDir).filter(f => f.endsWith('.json'))
      for (const file of files) {
        const raw = readFileSync(join(wordsDir, file), 'utf-8')
        const data = JSON.parse(raw)
        this.words[data.word] = data.vocab
      }
    } catch (e) {
      console.error('Error loading word data:', e.message)
    }

    // If no schedule, use available words
    if (this.schedule.length === 0) {
      this.schedule = Object.keys(this.words)
    }

    console.log(`Loaded ${Object.keys(this.words).length} word(s), schedule: ${this.schedule.length} day(s)`)
  }

  getTodayWord() {
    const epoch = new Date('2026-03-28')
    const now = new Date()
    const day = Math.floor((now - epoch) / 86400000)
    const index = ((day % this.schedule.length) + this.schedule.length) % this.schedule.length
    return this.schedule[index]
  }

  getTodayInfo() {
    const word = this.getTodayWord()
    const vocab = this.words[word] || {}
    const epoch = new Date('2026-03-28')
    const now = new Date()
    const day = Math.floor((now - epoch) / 86400000) + 1
    return {
      day,
      totalWords: Object.keys(vocab).length
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
    const target = this.getTodayWord()
    const vocab = this.words[target]

    if (!vocab) {
      return { word, known: false, error: 'Jeu non configuré' }
    }

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
        word,
        known: true,
        score: 100,
        rank: 1000,
        emoji: '\u{1F973}',
        found: true,
        guessNumber: player?.guesses || 0
      }
    }

    // Look up in vocabulary
    const entry = vocab[word]
    if (!entry) {
      return { word, known: false, error: 'Mot inconnu' }
    }

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
      word,
      known: true,
      score: Math.round(score * 100) / 100,
      rank,
      emoji,
      found: false,
      guessNumber: player?.guesses || 0
    }
  }

  getEmoji(score, rank) {
    if (score >= 100) return '\u{1F973}' // 🥳
    if (rank >= 999) return '\u{1F631}'  // 😱
    if (rank >= 990) return '\u{1F525}'  // 🔥
    if (rank >= 900) return '\u{1F975}'  // 🥵
    if (rank >= 1) return '\u{1F60E}'    // 😎
    if (score >= 0) return '\u{1F976}'   // 🥶
    return '\u{1F9CA}'                   // 🧊
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
