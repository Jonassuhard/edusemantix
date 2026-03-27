import { useState, useEffect, useCallback } from 'react'
import socket from './socket'
import Header from './components/Header'
import GuessInput from './components/GuessInput'
import GuessList from './components/GuessList'
import Leaderboard from './components/Leaderboard'
import WinModal from './components/WinModal'

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

  useEffect(() => {
    socket.on('joined', (data) => {
      setDay(data.day)
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
      if (result.found) setFound(true)
    })

    socket.on('leaderboard', setLeaderboard)
    socket.on('player-count', setPlayerCount)

    return () => {
      socket.off('joined')
      socket.off('guess-result')
      socket.off('leaderboard')
      socket.off('player-count')
    }
  }, [])

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
      setError('Déjà essayé !')
      setTimeout(() => setError(''), 1500)
      return
    }
    socket.emit('guess', cleaned)
  }, [found, guesses])

  if (screen === 'login') {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header day={day} guessCount={guesses.length} playerCount={playerCount} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-4">
          <GuessInput onGuess={handleGuess} error={error} disabled={found} />
          <TemperatureBar bestScore={guesses.length > 0 ? Math.max(...guesses.map(g => g.score)) : null} />
          <GuessList guesses={guesses} lastResult={lastResult} />
        </div>

        <aside className="lg:sticky lg:top-4 lg:self-start">
          <Leaderboard players={leaderboard} currentUser={username} />
        </aside>
      </main>

      {found && <WinModal guessCount={guesses.length} onClose={() => {}} />}
    </div>
  )
}

function LoginScreen({ onLogin }) {
  const [name, setName] = useState('')

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
          Trouve le mot du jour par proximité sémantique
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ton prénom..."
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

        <div className="mt-6 text-xs text-gray-500 space-y-1">
          <p>Tape un mot → découvre sa proximité avec le mot secret</p>
          <p>🧊 froid · 🥶 frais · 😎 tiède · 🥵 chaud · 🔥 brûlant · 😱 très proche · 🥳 trouvé !</p>
        </div>
      </div>
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
        <span>Brûlant 🔥</span>
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
