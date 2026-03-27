import { useState, useEffect, useCallback } from 'react'
import socket from './socket'
import Header from './components/Header'
import GuessInput from './components/GuessInput'
import GuessList from './components/GuessList'
import Leaderboard from './components/Leaderboard'
import WinModal from './components/WinModal'
import EmojiSummary from './components/EmojiSummary'
import TempLegend from './components/TempLegend'
import HelpModal from './components/HelpModal'
import HintBar from './components/HintBar'
import ConnectionStatus from './components/ConnectionStatus'

const STORAGE_KEY = 'edusemantix'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const state = JSON.parse(raw)
    // Check if same day
    const today = new Date().toDateString()
    if (state.date !== today) return null
    return state
  } catch { return null }
}

function saveState(username, guesses, found, day) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    date: new Date().toDateString(),
    username,
    guesses,
    found,
    day
  }))
}

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY + '_stats')
    return raw ? JSON.parse(raw) : { played: 0, won: 0, streak: 0, bestStreak: 0, avgGuesses: 0, totalGuesses: 0 }
  } catch { return { played: 0, won: 0, streak: 0, bestStreak: 0, avgGuesses: 0, totalGuesses: 0 } }
}

function saveStats(stats) {
  localStorage.setItem(STORAGE_KEY + '_stats', JSON.stringify(stats))
}

export default function App() {
  const [screen, setScreen] = useState('login')
  const [username, setUsername] = useState('')
  const [guesses, setGuesses] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [playerCount, setPlayerCount] = useState(0)
  const [day, setDay] = useState(0)
  const [found, setFound] = useState(false)
  const [error, setError] = useState('')
  const [lastResult, setLastResult] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showLegend, setShowLegend] = useState(false)
  const [showWin, setShowWin] = useState(false)
  const [yesterdayWord, setYesterdayWord] = useState('')

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = loadState()
    if (saved) {
      setUsername(saved.username)
      setGuesses(saved.guesses)
      setFound(saved.found)
      setDay(saved.day)
    }
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    if (username && screen === 'game') {
      saveState(username, guesses, found, day)
    }
  }, [guesses, found, username, day, screen])

  useEffect(() => {
    socket.on('joined', (data) => {
      setDay(data.day)
      setYesterdayWord(data.yesterdayWord || '')
      setScreen('game')
    })

    socket.on('guess-result', (result) => {
      setLastResult(result)
      if (!result.known) {
        setError(result.error || 'Mot inconnu')
        setTimeout(() => setError(''), 2000)
        return
      }
      setError('')
      setGuesses(prev => {
        const exists = prev.find(g => g.word === result.word)
        if (exists) return prev
        return [...prev, result].sort((a, b) => b.score - a.score)
      })
      if (result.found) {
        setFound(true)
        setShowWin(true)
        // Update stats
        const stats = loadStats()
        stats.played++
        stats.won++
        stats.streak++
        if (stats.streak > stats.bestStreak) stats.bestStreak = stats.streak
        stats.totalGuesses += result.guessNumber
        stats.avgGuesses = Math.round(stats.totalGuesses / stats.won)
        saveStats(stats)
      }
    })

    socket.on('leaderboard', setLeaderboard)
    socket.on('player-count', setPlayerCount)
    socket.on('player-found', (data) => {
      // Toast notification when someone finds the word
      if (data.name !== username) {
        setError(`${data.name} a trouvé le mot !`)
        setTimeout(() => setError(''), 3000)
      }
    })

    return () => {
      socket.off('joined')
      socket.off('guess-result')
      socket.off('leaderboard')
      socket.off('player-count')
      socket.off('player-found')
    }
  }, [username])

  const handleLogin = useCallback((name) => {
    if (!name.trim()) return
    setUsername(name.trim())
    socket.connect()
    socket.emit('join', name.trim())
  }, [])

  const handleGuess = useCallback((word) => {
    if (!word.trim() || found) return
    const cleaned = word.trim().toLowerCase()
    if (guesses.find(g => g.word === cleaned)) {
      setError('Deja essaye !')
      setTimeout(() => setError(''), 1500)
      return
    }
    socket.emit('guess', cleaned)
  }, [found, guesses])

  if (screen === 'login') {
    return <LoginScreen onLogin={handleLogin} savedName={loadState()?.username} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        day={day}
        guessCount={guesses.length}
        playerCount={playerCount}
        onHelp={() => setShowHelp(true)}
        onLegend={() => setShowLegend(!showLegend)}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="flex flex-col gap-3">
          <GuessInput onGuess={handleGuess} error={error} disabled={found} />
          <EmojiSummary guesses={guesses} />
          <TemperatureBar bestScore={guesses.length > 0 ? Math.max(...guesses.map(g => g.score)) : null} />
          {showLegend && <TempLegend />}
          <HintBar guessCount={guesses.length} found={found} />
          <GuessList guesses={guesses} lastResult={lastResult} />
        </div>

        <aside className="lg:sticky lg:top-4 lg:self-start flex flex-col gap-4">
          <Leaderboard players={leaderboard} currentUser={username} />
          {yesterdayWord && <YesterdayWord word={yesterdayWord} />}
          <ServerNotice />
        </aside>
      </main>

      {showWin && <WinModal guessCount={guesses.length} guesses={guesses} stats={loadStats()} onClose={() => setShowWin(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      <ConnectionStatus />
    </div>
  )
}

function LoginScreen({ onLogin, savedName }) {
  const [name, setName] = useState(savedName || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(name)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-strong rounded-2xl p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🔤</div>
        <h1 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-accent-violet to-accent-orange bg-clip-text text-transparent">
            EduSemantix
          </span>
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          Trouve le mot du jour par proximite semantique
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ton prenom..."
            maxLength={20}
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-white/10 text-white placeholder-gray-500 text-center text-lg focus:border-accent-violet/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-violet to-accent-orange text-white font-semibold text-lg disabled:opacity-30 hover:opacity-90 transition-opacity"
          >
            Jouer
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500 space-y-2">
          <p>Tape un mot et decouvre sa proximite avec le mot secret</p>
          <div className="flex flex-wrap justify-center gap-1">
            <span>🧊 froid</span><span>·</span>
            <span>🥶 frais</span><span>·</span>
            <span>😎 tiede</span><span>·</span>
            <span>🥵 chaud</span><span>·</span>
            <span>🔥 brulant</span><span>·</span>
            <span>😱 proche</span><span>·</span>
            <span>🥳 trouve !</span>
          </div>
          <p className="text-gray-600 mt-2">Noms communs uniquement — pas de noms propres ni de conjugaisons</p>
        </div>
      </div>
    </div>
  )
}

function YesterdayWord({ word }) {
  return (
    <div className="glass rounded-xl px-4 py-3 text-center">
      <p className="text-[11px] text-gray-500 mb-1">Le mot d'hier etait</p>
      <p className="text-lg font-bold bg-gradient-to-r from-accent-violet to-accent-orange bg-clip-text text-transparent">
        {word}
      </p>
    </div>
  )
}

function ServerNotice() {
  return (
    <div className="glass rounded-xl px-4 py-3 text-[11px] text-gray-500 space-y-1">
      <div className="flex items-center gap-1.5">
        <span>⚡</span>
        <span className="text-gray-400 font-medium">Serveur gratuit</span>
      </div>
      <p>Le serveur s'endort apres 15 min d'inactivite. Le premier chargement peut prendre ~30s. Tes essais sont sauvegardes localement.</p>
    </div>
  )
}

function TemperatureBar({ bestScore }) {
  const pct = bestScore != null ? Math.max(0, Math.min(100, (bestScore + 10) / 110 * 100)) : 0

  return (
    <div className="glass rounded-xl p-3">
      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
        <span>🧊 Froid</span>
        <span className="text-gray-400 font-mono">
          {bestScore != null ? `Meilleur : ${bestScore.toFixed(2)}°` : 'Aucun essai'}
        </span>
        <span>Brulant 🔥</span>
      </div>
      <div className="h-3 rounded-full bg-bg-primary overflow-hidden">
        <div
          className="h-full temp-gradient rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
