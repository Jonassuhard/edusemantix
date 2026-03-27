import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { GameEngine } from './game.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? ['https://edusemantix.onrender.com']
      : '*'
  }
})

const game = new GameEngine(join(__dirname, '..', 'data'))

// Serve static files in production
const distPath = join(__dirname, '..', 'dist')
app.use(express.static(distPath))

// Simple rate limiter for definition API
const defRateLimit = new Map()
const DEF_RATE_LIMIT = 30 // max requests per minute per IP

// API routes
app.get('/api/status', (req, res) => {
  const today = game.getTodayInfo()
  res.json({
    day: today.day,
    totalWords: today.totalWords,
    playerCount: io.engine.clientsCount
  })
})

// Definition API (fetches from Wiktionary MediaWiki API)
app.get('/api/definition/:word', async (req, res) => {
  // Rate limit
  const ip = req.ip
  const now = Date.now()
  const entry = defRateLimit.get(ip)
  if (entry) {
    if (now - entry.start < 60000) {
      if (entry.count >= DEF_RATE_LIMIT) return res.json({ definition: 'Trop de requêtes, réessaie dans 1 min' })
      entry.count++
    } else {
      defRateLimit.set(ip, { start: now, count: 1 })
    }
  } else {
    defRateLimit.set(ip, { start: now, count: 1 })
  }

  try {
    const word = req.params.word.toLowerCase().slice(0, 50)
    const url = `https://fr.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(word)}&prop=wikitext&format=json&section=1`
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!response.ok) return res.json({ definition: null })
    const data = await response.json()
    if (data.parse && data.parse.wikitext) {
      const wikitext = data.parse.wikitext['*'] || ''
      const defs = wikitext.split('\n')
        .filter(l => /^# /.test(l))
        .map(l => l.replace(/^# /, '').replace(/\[\[([^\]|]*\|)?([^\]]*)\]\]/g, '$2').replace(/\{\{[^}]*\}\}/g, '').replace(/'{2,}/g, '').trim())
        .filter(l => l.length > 5)
        .slice(0, 2)
      if (defs.length > 0) {
        let def = defs.join(' | ')
        if (def.length > 250) def = def.slice(0, 250) + '...'
        return res.json({ definition: def })
      }
    }
    // Fallback
    const url2 = `https://fr.wiktionary.org/w/api.php?action=query&titles=${encodeURIComponent(word)}&prop=extracts&exintro=1&explaintext=1&format=json`
    const r2 = await fetch(url2, { signal: AbortSignal.timeout(5000) })
    const d2 = await r2.json()
    const pages = d2?.query?.pages
    if (pages) {
      const page = Object.values(pages)[0]
      if (page?.extract) {
        let def = page.extract.trim()
        if (def.length > 250) def = def.slice(0, 250) + '...'
        return res.json({ definition: def })
      }
    }
    res.json({ definition: null })
  } catch {
    res.json({ definition: null })
  }
})

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'))
})

// Rate limiter for socket guesses
const guessRateLimit = new Map()
const GUESS_RATE_LIMIT = 10 // max guesses per 5 seconds

// Socket.io
io.on('connection', (socket) => {
  let playerName = null

  socket.on('join', (name) => {
    if (typeof name !== 'string') return
    playerName = name.trim().replace(/[<>&"']/g, '').slice(0, 20)
    if (!playerName) return
    game.addPlayer(playerName)
    const info = game.getTodayInfo()
    socket.emit('joined', {
      name: playerName,
      day: info.day,
      yesterdayWords: info.yesterdayWords,
      roundCount: info.roundCount,
      hints: [
        game.getHints(0),
        game.getHints(1),
        game.getHints(2)
      ]
    })
    io.emit('leaderboard', game.getLeaderboard())
    io.emit('player-count', io.engine.clientsCount)
  })

  socket.on('guess', ({ word, round }) => {
    if (!playerName) return
    if (typeof word !== 'string' || typeof round !== 'number') return

    // Rate limit: max 10 guesses per 5 seconds
    const now = Date.now()
    const entry = guessRateLimit.get(socket.id)
    if (entry) {
      if (now - entry.start < 5000) {
        if (entry.count >= GUESS_RATE_LIMIT) {
          socket.emit('guess-result', { word, known: false, error: 'Doucement ! Max 10 mots / 5 sec' })
          return
        }
        entry.count++
      } else {
        guessRateLimit.set(socket.id, { start: now, count: 1 })
      }
    } else {
      guessRateLimit.set(socket.id, { start: now, count: 1 })
    }

    const r = Math.max(0, Math.min(2, Math.floor(round)))
    const cleaned = word.trim().toLowerCase().normalize('NFC').slice(0, 50)
    if (!cleaned) return

    const result = game.processGuess(playerName, cleaned, r)
    socket.emit('guess-result', result)

    if (result.known) {
      io.emit('leaderboard', game.getLeaderboard())
      if (result.found) {
        io.emit('player-found', { name: playerName, round: r })
      }
    }
  })

  socket.on('disconnect', () => {
    guessRateLimit.delete(socket.id)
    io.emit('player-count', io.engine.clientsCount)
  })
})

// Clean up rate limit maps periodically
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of defRateLimit) { if (now - v.start > 120000) defRateLimit.delete(k) }
  for (const [k, v] of guessRateLimit) { if (now - v.start > 30000) guessRateLimit.delete(k) }
}, 60000)

// Daily reset: clear players map at midnight UTC
setInterval(() => {
  const now = new Date()
  if (now.getUTCHours() === 0 && now.getUTCMinutes() === 0) {
    game.resetDaily()
  }
}, 60000)

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...')
  server.close(() => process.exit(0))
})

const PORT = process.env.PORT || 3210
server.listen(PORT, () => {
  console.log(`EduSemantix server running on http://localhost:${PORT}`)
  console.log(`Today: day #${game.getDayNumber()}, words: ${game.getTodayWords().join(', ')}`)
})
