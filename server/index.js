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
  cors: { origin: '*' }
})

const game = new GameEngine(join(__dirname, '..', 'data'))

// Serve static files in production
const distPath = join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.use(express.json())

// API routes
app.get('/api/status', (req, res) => {
  const today = game.getTodayInfo()
  res.json({
    day: today.day,
    totalWords: today.totalWords,
    playerCount: io.engine.clientsCount
  })
})

// Socket.io
io.on('connection', (socket) => {
  let playerName = null

  socket.on('join', (name) => {
    playerName = name.trim().slice(0, 20)
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
    const r = typeof round === 'number' ? round : 0
    const cleaned = word.trim().toLowerCase().normalize('NFC')
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
    io.emit('player-count', io.engine.clientsCount)
  })
})

const PORT = process.env.PORT || 3210
server.listen(PORT, () => {
  console.log(`EduSemantix server running on http://localhost:${PORT}`)
  console.log(`Today: day #${game.getDayNumber()}, words: ${game.getTodayWords().join(', ')}`)
})
