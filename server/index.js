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
    io.emit('leaderboard', game.getLeaderboard())
    io.emit('player-count', io.engine.clientsCount)
    socket.emit('joined', { name: playerName, day: game.getTodayInfo().day })
  })

  socket.on('guess', (word) => {
    if (!playerName) return
    const cleaned = word.trim().toLowerCase().normalize('NFC')
    if (!cleaned) return

    const result = game.processGuess(playerName, cleaned)
    socket.emit('guess-result', result)

    if (result.known) {
      io.emit('leaderboard', game.getLeaderboard())
    }
  })

  socket.on('disconnect', () => {
    io.emit('player-count', io.engine.clientsCount)
  })
})

const PORT = process.env.PORT || 3210
server.listen(PORT, () => {
  console.log(`EduSemantix server running on http://localhost:${PORT}`)
  console.log(`Today's word: [hidden] (day #${game.getTodayInfo().day})`)
})
