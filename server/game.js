import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export class GameEngine {
  constructor(dataDir) {
    this.schedule = []
    this.players = new Map()
    this.dataDir = dataDir

    // Vector data
    this.wordIndex = {}
    this.vectors = null
    this.vecDim = 0
    this.vocabWords = []

    // Per-round cache (fixes race condition with multiple rounds)
    this.roundCache = [null, null, null] // { word, vec, topRanked } per round

    this.loadData()
  }

  loadData() {
    // Load schedule (array of [word1, word2, word3])
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

      for (let i = 0; i < this.vocabWords.length; i++) {
        this.wordIndex[this.vocabWords[i]] = i
      }

      // Load binary vectors (split files)
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
    }

    if (this.schedule.length === 0) {
      this.schedule = [['parapluie', 'stagiaire', 'chocolat']]
    }

    console.log(`Schedule: ${this.schedule.length} day(s), 3 rounds each`)
  }

  getDayIndex() {
    const epoch = new Date('2026-03-27')
    const now = new Date()
    const day = Math.floor((now - epoch) / 86400000)
    return ((day % this.schedule.length) + this.schedule.length) % this.schedule.length
  }

  getDayNumber() {
    const epoch = new Date('2026-03-27')
    const now = new Date()
    return Math.floor((now - epoch) / 86400000) + 1
  }

  getTodayWords() {
    const idx = this.getDayIndex()
    const entry = this.schedule[idx]
    return Array.isArray(entry) ? entry : [entry]
  }

  getYesterdayWords() {
    const epoch = new Date('2026-03-27')
    const now = new Date()
    const day = Math.floor((now - epoch) / 86400000) - 1
    const idx = ((day % this.schedule.length) + this.schedule.length) % this.schedule.length
    const entry = this.schedule[idx]
    return Array.isArray(entry) ? entry : [entry]
  }

  loadWordForRound(round) {
    const words = this.getTodayWords()
    const word = words[round] || words[0]

    // Check per-round cache
    if (this.roundCache[round] && this.roundCache[round].word === word) return
    if (!this.vectors) return

    const idx = this.wordIndex[word]
    if (idx === undefined) {
      console.error(`Word '${word}' not in vector index`)
      return
    }

    const start = idx * this.vecDim
    const vec = this.vectors.slice(start, start + this.vecDim)

    // Compute top 1000 rankings
    console.log(`Computing rankings for '${word}' (round ${round + 1})...`)
    const scores = []
    for (let i = 0; i < this.vocabWords.length; i++) {
      if (this.vocabWords[i] === word) continue
      const vStart = i * this.vecDim
      let dot = 0
      for (let d = 0; d < this.vecDim; d++) {
        dot += vec[d] * this.vectors[vStart + d]
      }
      scores.push([i, dot * 100])
    }
    scores.sort((a, b) => b[1] - a[1])
    const topRanked = new Map()
    for (let r = 0; r < Math.min(1000, scores.length); r++) {
      topRanked.set(this.vocabWords[scores[r][0]], 999 - r)
    }

    // Store in per-round cache
    this.roundCache[round] = { word, vec, topRanked }
    console.log(`Rankings ready. Top: ${this.vocabWords[scores[0][0]]} (${scores[0][1].toFixed(1)})`)
  }

  computeSimilarity(word, round) {
    const cache = this.roundCache[round]
    if (!this.vectors || !cache) return null
    const idx = this.wordIndex[word]
    if (idx === undefined) return null

    const start = idx * this.vecDim
    let dot = 0
    for (let d = 0; d < this.vecDim; d++) {
      dot += cache.vec[d] * this.vectors[start + d]
    }
    return { score: dot * 100, rank: cache.topRanked?.get(word) ?? null }
  }

  resetDaily() {
    console.log('Daily reset: clearing players and round cache')
    this.players.clear()
    this.roundCache = [null, null, null]
  }

  getHints(round) {
    const words = this.getTodayWords()
    const word = words[round] || words[0]
    return {
      letterCount: word.length,
      firstLetter: word[0].toUpperCase(),
      category: this.getWordCategory(word)
    }
  }

  getTopWords(round, count = 10) {
    const cache = this.roundCache[round]
    if (!cache || !cache.topRanked) return []
    const entries = Array.from(cache.topRanked.entries())
    entries.sort((a, b) => b[1] - a[1])
    return entries.slice(0, count).map(([word, rank]) => ({ word, rank: 1000 - rank }))
  }

  getWordCategory(word) {
    const categories = {
      parapluie: 'objet', réfrigérateur: 'objet', escalier: 'architecture',
      miroir: 'objet', bougie: 'objet', horloge: 'objet',
      serviette: 'objet', ceinture: 'accessoire',
      papillon: 'animal', volcan: 'nature', corail: 'nature marine',
      hérisson: 'animal', avalanche: 'phenomene naturel', orchidée: 'plante',
      méduse: 'animal marin', caméléon: 'animal',
      croissant: 'nourriture', moutarde: 'condiment', champignon: 'nourriture',
      cannelle: 'epice', anchois: 'nourriture', brioche: 'nourriture',
      ratatouille: 'nourriture', pistache: 'nourriture',
      satellite: 'science', microscope: 'science', molécule: 'science',
      gravité: 'science', galaxie: 'astronomie', fossile: 'science',
      pendule: 'objet', oxygène: 'science',
      cathédrale: 'architecture', gladiateur: 'histoire', pharaon: 'histoire',
      samurai: 'histoire', labyrinthe: 'lieu', calligraphie: 'art',
      mosaïque: 'art', troubadour: 'histoire',
      nostalgie: 'emotion', vertige: 'sensation', silence: 'concept',
      crépuscule: 'moment', paradoxe: 'concept', éphémère: 'concept',
      harmonie: 'concept', mystère: 'concept',
      trampoline: 'objet', kaléidoscope: 'objet', boussole: 'objet',
      sablier: 'objet', toboggan: 'objet', catapulte: 'objet',
      origami: 'art', télescope: 'objet scientifique',
      apiculteur: 'metier', marionnettiste: 'metier', souffleur: 'metier',
      funambule: 'metier', forgeron: 'metier', cartographe: 'metier',
      horloger: 'metier', artificier: 'metier',
      phare: 'lieu', grotte: 'lieu naturel', oasis: 'lieu naturel',
      archipel: 'geographie', catacombes: 'lieu', observatoire: 'lieu',
      aquarium: 'lieu', citadelle: 'architecture',
      métamorphose: 'concept', ventriloque: 'metier', contrebande: 'activite',
      naufrage: 'evenement', stratagème: 'concept', prestidigitation: 'art',
      vagabond: 'personne', épopée: 'litterature',
      // Eduservices
      photocopieuse: 'bureau', stagiaire: 'vie pro', cantine: 'bureau',
      alternance: 'formation', cafétéria: 'bureau', réunion: 'vie pro',
      marketing: 'metier', newsletter: 'communication', présentation: 'vie pro',
      brochure: 'communication', graphisme: 'metier', diaporama: 'outil',
      événement: 'communication', rédaction: 'metier', référencement: 'digital',
      campus: 'formation', diplôme: 'formation', soutenance: 'formation',
      mémoire: 'formation', portfolio: 'creation', imprimante: 'bureau',
      ascenseur: 'lieu', badge: 'objet bureau', publication: 'communication',
      communication: 'metier', illustration: 'art', basketball: 'sport',
      entrepreneur: 'vie pro', animation: 'art', deadline: 'vie pro',
      voilier: 'sport', création: 'art', courage: 'qualite',
      patience: 'qualite', ordinateur: 'objet', maladroit: 'qualite',
      retardataire: 'qualite', gourmandise: 'defaut', cinéphile: 'loisir',
      astronaute: 'metier', dinosaure: 'animal',
      stage: 'vie pro', bureau: 'lieu', café: 'boisson', clavier: 'objet',
      écran: 'objet', agenda: 'objet', wifi: 'technologie', stylo: 'objet',
      salon: 'lieu', dossier: 'objet', tableau: 'objet', congé: 'vie pro',
      mail: 'communication', teams: 'outil', meeting: 'vie pro',
      projet: 'vie pro', rapport: 'document', planning: 'outil',
      collègue: 'personne', logiciel: 'technologie', serveur: 'technologie',
      ticket: 'objet', sandwich: 'nourriture', photocopie: 'bureau',
      comptable: 'metier', recrutement: 'vie pro', sécurité: 'concept',
      comptoir: 'lieu', vestiaire: 'lieu', powerpoint: 'outil',
      tableur: 'outil', cravate: 'accessoire', parking: 'lieu',
      'open-space': 'lieu', formation: 'vie pro', promotion: 'vie pro',
      brainstorming: 'methode', benchmark: 'methode', workshop: 'evenement',
      feedback: 'communication', afterwork: 'evenement', management: 'concept',
      leadership: 'concept', coaching: 'methode', freelance: 'vie pro',
      stratégie: 'concept', innovation: 'concept',
      // Mots courts
      tigre: 'animal', pirate: 'personnage', lune: 'astronomie', robot: 'technologie',
      feu: 'element', ninja: 'personnage', rêve: 'concept', viking: 'histoire',
      ombre: 'concept', sphinx: 'mythologie', orage: 'meteo', bandit: 'personnage',
      plume: 'objet', magie: 'concept', glace: 'nature', dragon: 'mythologie',
      ancre: 'objet', trésor: 'objet', nuage: 'nature', sirène: 'mythologie',
      torche: 'objet', météore: 'astronomie', jade: 'pierre', sable: 'nature',
      aigle: 'animal', cascade: 'nature', perle: 'bijou', fantôme: 'creature',
      cœur: 'organe', sorcier: 'personnage', neige: 'meteo', odyssée: 'litterature',
      flamme: 'element', énigme: 'concept', brise: 'meteo', mirage: 'phenomene',
      roche: 'nature', légende: 'litterature', loup: 'animal', oracle: 'mythologie',
      aube: 'moment', spectre: 'creature', ciel: 'nature', alchimie: 'science',
      étoile: 'astronomie', corsaire: 'personnage', fauve: 'animal', elfe: 'creature',
      masque: 'objet', momie: 'histoire', forge: 'lieu', titan: 'mythologie',
      sève: 'nature', enchanteur: 'personnage', arène: 'lieu', gobelin: 'creature',
      toile: 'art', phénix: 'mythologie', iris: 'fleur', centaure: 'mythologie',
      nacre: 'matiere', cyclope: 'mythologie', dune: 'nature', kraken: 'creature',
      palme: 'nature', chimère: 'mythologie', bûche: 'objet', amazone: 'mythologie',
      givre: 'nature', minotaure: 'mythologie', algue: 'nature', valkyrie: 'mythologie',
      rosée: 'nature', griffon: 'creature', cendre: 'matiere', hydre: 'creature',
      ambre: 'matiere', golem: 'creature', opale: 'pierre', djinn: 'creature',
      zèbre: 'animal', licorne: 'creature', lynx: 'animal', basilic: 'creature',
      cygne: 'animal', pégase: 'mythologie', onyx: 'pierre', cyclone: 'meteo',
      rubis: 'pierre', voltige: 'sport', cobalt: 'element', tempête: 'meteo',
      prisme: 'objet', aurore: 'phenomene', quartz: 'pierre', comète: 'astronomie',
      magma: 'geologie', plasma: 'science', pause: 'concept', samouraï: 'histoire'
    }
    return categories[word] || 'mot courant'
  }

  getTodayInfo() {
    return {
      day: this.getDayNumber(),
      totalWords: this.vocabWords.length,
      yesterdayWords: this.getYesterdayWords(),
      roundCount: this.getTodayWords().length
    }
  }

  addPlayer(name) {
    if (!this.players.has(name)) {
      this.players.set(name, {
        name,
        round: 0,
        guesses: [0, 0, 0],
        bestScore: [-Infinity, -Infinity, -Infinity],
        bestRank: [null, null, null],
        found: [false, false, false]
      })
    }
  }

  // Strip accents from a string
  stripAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  // Try to find word in index, with accent fallback
  resolveWord(word) {
    // Direct match
    if (this.wordIndex[word] !== undefined) return word
    // Try with accents stripped — find the accented version in index
    const stripped = this.stripAccents(word)
    if (this.accentMap && this.accentMap[stripped]) return this.accentMap[stripped]
    // Try adding common accent patterns
    return null
  }

  buildAccentMap() {
    if (this.accentMap) return
    console.log('Building accent fallback map...')
    this.accentMap = {}
    for (const w of this.vocabWords) {
      const stripped = this.stripAccents(w)
      // Only store the first (most common) accented version
      if (!this.accentMap[stripped]) {
        this.accentMap[stripped] = w
      }
    }
    console.log(`Accent map: ${Object.keys(this.accentMap).length} entries`)
  }

  processGuess(playerName, word, round) {
    const words = this.getTodayWords()
    const target = words[round]
    if (!target) return { word, known: false, error: 'Round invalide' }

    // Load vectors for this round
    this.loadWordForRound(round)

    // Build accent map on first guess (lazy init)
    if (!this.accentMap) this.buildAccentMap()

    const player = this.players.get(playerName)

    // Exact match (with accent fallback)
    const targetStripped = this.stripAccents(target)
    const wordStripped = this.stripAccents(word)
    if (word === target || wordStripped === targetStripped) {
      if (player) {
        player.guesses[round]++
        player.bestScore[round] = 100
        player.bestRank[round] = 1000
        player.found[round] = true
      }
      return {
        word: target, known: true, score: 100, rank: 1000,
        emoji: '\u{1F973}', found: true,
        guessNumber: player?.guesses[round] || 0,
        topWords: this.getTopWords(round, 10),
        round
      }
    }

    // Resolve word (try exact, then accent fallback)
    const resolved = this.resolveWord(word)

    // Vector similarity with resolved word
    if (this.vectors && resolved) {
      const result = this.computeSimilarity(resolved, round)
      if (result) {
        const { score, rank } = result
        const emoji = this.getEmoji(score, rank)
        if (player) {
          player.guesses[round]++
          if (score > player.bestScore[round]) {
            player.bestScore[round] = score
            player.bestRank[round] = rank
          }
        }
        return {
          word: resolved, known: true,
          score: Math.round(score * 100) / 100,
          rank, emoji, found: false,
          guessNumber: player?.guesses[round] || 0,
          round
        }
      }
    }

    // Try direct similarity as last resort
    if (this.vectors) {
      const result = this.computeSimilarity(word, round)
      if (result) {
        const { score, rank } = result
        const emoji = this.getEmoji(score, rank)
        if (player) {
          player.guesses[round]++
          if (score > player.bestScore[round]) {
            player.bestScore[round] = score
            player.bestRank[round] = rank
          }
        }
        return {
          word, known: true,
          score: Math.round(score * 100) / 100,
          rank, emoji, found: false,
          guessNumber: player?.guesses[round] || 0,
          round
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
      .map(p => {
        // Overall best across rounds
        const maxScore = Math.max(...p.bestScore.filter(s => s !== -Infinity), -Infinity)
        const roundsFound = p.found.filter(Boolean).length
        const totalGuesses = p.guesses.reduce((a, b) => a + b, 0)
        const bestRoundIdx = p.bestScore.indexOf(Math.max(...p.bestScore))
        return {
          name: p.name,
          guesses: totalGuesses,
          bestScore: maxScore === -Infinity ? null : Math.round(maxScore * 100) / 100,
          bestRank: p.bestRank[bestRoundIdx],
          found: roundsFound,
          roundsTotal: this.getTodayWords().length,
          emoji: maxScore === -Infinity ? '' : this.getEmoji(maxScore, p.bestRank[bestRoundIdx])
        }
      })
      .sort((a, b) => {
        if (a.found !== b.found) return b.found - a.found
        if (a.found > 0 && b.found > 0) return a.guesses - b.guesses
        return (b.bestScore || -999) - (a.bestScore || -999)
      })
  }
}
