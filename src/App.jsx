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
import FunMessage from './components/FunMessage'
import EasterEggOverlay from './components/EasterEggOverlay'
import Confetti from './components/Confetti'
import useTimer from './hooks/useTimer'
import useSounds from './hooks/useSounds'

const STORAGE_KEY = 'edusemantix'
const MAX_ROUNDS = 3

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const state = JSON.parse(raw)
    if (state.date !== new Date().toDateString()) return null
    return state
  } catch { return null }
}

function saveState(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, date: new Date().toDateString() }))
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
  const [round, setRound] = useState(0)
  const [roundCount, setRoundCount] = useState(3)
  const [guessesPerRound, setGuessesPerRound] = useState([[], [], []])
  const [foundPerRound, setFoundPerRound] = useState([false, false, false])
  const [topWordsPerRound, setTopWordsPerRound] = useState([[], [], []])
  const [leaderboard, setLeaderboard] = useState([])
  const [playerCount, setPlayerCount] = useState(0)
  const [day, setDay] = useState(0)
  const [error, setError] = useState('')
  const [lastResult, setLastResult] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showLegend, setShowLegend] = useState(false)
  const [showWin, setShowWin] = useState(false)
  const [yesterdayWords, setYesterdayWords] = useState([])
  const [hints, setHints] = useState([null, null, null])
  const [darkMode, setDarkMode] = useState(true)
  const [easterEggAnim, setEasterEggAnim] = useState(null)
  const [easterEggKey, setEasterEggKey] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY + '_sound') !== 'off' } catch { return true }
  })
  const [targetWord, setTargetWord] = useState(null)
  const [timerPerRound, setTimerPerRound] = useState([0, 0, 0])

  const guesses = guessesPerRound[round] || []
  const found = foundPerRound[round]
  const timer = useTimer(!found && guesses.length > 0 && screen === 'game')
  const sounds = useSounds(soundEnabled)

  // Restore from localStorage
  useEffect(() => {
    const saved = loadState()
    if (saved) {
      setUsername(saved.username || '')
      setGuessesPerRound(saved.guessesPerRound || [[], [], []])
      setFoundPerRound(saved.foundPerRound || [false, false, false])
      setTopWordsPerRound(saved.topWordsPerRound || [[], [], []])
      setRound(saved.round || 0)
      setDay(saved.day || 0)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (username && screen === 'game') {
      saveState({ username, guessesPerRound, foundPerRound, topWordsPerRound, round, day })
    }
  }, [guessesPerRound, foundPerRound, topWordsPerRound, round, username, day, screen])

  useEffect(() => {
    socket.on('joined', (data) => {
      setDay(data.day)
      setYesterdayWords(data.yesterdayWords || [])
      setRoundCount(data.roundCount || 3)
      setHints(data.hints || [null, null, null])
      setScreen('game')
    })

    socket.on('guess-result', (result) => {
      setLastResult(result)
      if (!result.known) {
        setError(result.error || 'Mot inconnu')
        sounds.unknown()
        setTimeout(() => setError(''), 2000)
        return
      }
      // Play sound based on emoji
      if (result.emoji) sounds.forEmoji(result.emoji)
      setError('')
      const r = result.round ?? round
      setGuessesPerRound(prev => {
        const copy = [...prev]
        const roundGuesses = [...(copy[r] || [])]
        if (roundGuesses.find(g => g.word === result.word)) return prev
        roundGuesses.push(result)
        roundGuesses.sort((a, b) => b.score - a.score)
        copy[r] = roundGuesses
        return copy
      })
      if (result.found) {
        setFoundPerRound(prev => {
          const copy = [...prev]
          copy[r] = true
          return copy
        })
        if (result.topWords) {
          setTopWordsPerRound(prev => {
            const copy = [...prev]
            copy[r] = result.topWords
            return copy
          })
        }
        setTargetWord(result.word)
        setTimerPerRound(prev => {
          const copy = [...prev]
          copy[r] = timer.elapsed
          return copy
        })
        setShowWin(true)
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
      if (data.name !== username) {
        setError(`${data.name} a trouve le mot ${data.round + 1} !`)
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
  }, [username, round])

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
      const dupeMessages = ['Déjà tenté chef 🫡', 'Alzheimer ? 🤔', 'Tu l\'as déjà mis celui-là 😅', 'Ctrl+Z mental 🔄', 'Déjà vu ! Littéralement.']
      setError(dupeMessages[Math.floor(Math.random() * dupeMessages.length)])
      setTimeout(() => setError(''), 2000)
      return
    }
    socket.emit('guess', { word: cleaned, round })
  }, [found, guesses, round])

  const handleNextRound = () => {
    if (round < roundCount - 1) {
      setRound(round + 1)
      setShowWin(false)
      setLastResult(null)
    }
  }

  if (screen === 'login') {
    return <LoginScreen onLogin={handleLogin} savedName={loadState()?.username} />
  }

  const totalGuesses = guessesPerRound.reduce((sum, g) => sum + g.length, 0)
  const roundLabels = ['Mot 1', 'Mot 2 (Eduservices)', 'Mot 3']

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        day={day}
        guessCount={totalGuesses}
        playerCount={playerCount}
        onHelp={() => setShowHelp(true)}
        onLegend={() => setShowLegend(!showLegend)}
        darkMode={darkMode}
        onToggleTheme={() => { setDarkMode(!darkMode); document.documentElement.classList.toggle('light') }}
        soundEnabled={soundEnabled}
        onToggleSound={() => { const next = !soundEnabled; setSoundEnabled(next); localStorage.setItem(STORAGE_KEY + '_sound', next ? 'on' : 'off') }}
        timer={timer}
        found={found}
      />

      {/* Round tabs */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-3">
        <div className="flex gap-2">
          {Array.from({ length: roundCount }, (_, i) => (
            <button
              key={i}
              onClick={() => { if (i === 0 || foundPerRound[i - 1]) setRound(i) }}
              disabled={i > 0 && !foundPerRound[i - 1]}
              className={`
                flex-1 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5
                ${round === i
                  ? 'bg-gradient-to-r from-accent-violet to-accent-orange text-white'
                  : foundPerRound[i]
                    ? 'glass text-temp-bingo'
                    : i > 0 && !foundPerRound[i - 1]
                      ? 'glass text-gray-600 opacity-50 cursor-not-allowed'
                      : 'glass text-gray-400 hover:text-white'
                }
              `}
            >
              {foundPerRound[i] ? '🥳' : i > 0 && !foundPerRound[i - 1] ? '🔒' : ''}
              <span className="hidden sm:inline">{roundLabels[i] || `Mot ${i + 1}`}</span>
              <span className="sm:hidden">{i + 1}/3</span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="flex flex-col gap-3">
          <GuessInput onGuess={handleGuess} error={error} disabled={found} />
          <FunMessage guesses={guesses} lastResult={lastResult} round={round} foundPerRound={foundPerRound} onEasterEgg={(anim) => { setEasterEggAnim(anim); setEasterEggKey(k => k + 1) }} onBingo={() => setShowConfetti(true)} />
          <EmojiSummary guesses={guesses} />
          <TemperatureBar bestScore={guesses.length > 0 ? Math.max(...guesses.map(g => g.score)) : null} />
          {showLegend && <TempLegend />}
          <HintBar guessCount={guesses.length} found={found} hints={hints[round]} />
          <GuessList guesses={guesses} lastResult={lastResult} />
        </div>

        <aside className="lg:sticky lg:top-4 lg:self-start flex flex-col gap-4">
          <Leaderboard players={leaderboard} currentUser={username} />
          {yesterdayWords.length > 0 && <YesterdayWords words={yesterdayWords} />}
          <ServerNotice />
        </aside>
      </main>

      {showWin && (
        <WinModal
          guessCount={guesses.length}
          guesses={guesses}
          stats={loadStats()}
          topWords={topWordsPerRound[round]}
          round={round}
          roundCount={roundCount}
          hasNextRound={round < roundCount - 1}
          onNextRound={handleNextRound}
          onClose={() => setShowWin(false)}
          elapsedTime={timerPerRound[round]}
          targetWord={targetWord}
        />
      )}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      <ConnectionStatus />
      <EasterEggOverlay anim={easterEggAnim} animKey={easterEggKey} />
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
    </div>
  )
}

function LoginScreen({ onLogin, savedName }) {
  const [name, setName] = useState(savedName || '')

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
          3 mots a trouver par jour — par proximite semantique
        </p>

        <form onSubmit={e => { e.preventDefault(); onLogin(name) }} className="flex flex-col gap-3">
          <input
            type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Ton prenom..." maxLength={20} autoFocus
            className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-white/10 text-white placeholder-gray-500 text-center text-lg focus:border-accent-violet/50 transition-colors"
          />
          <button type="submit" disabled={!name.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-violet to-accent-orange text-white font-semibold text-lg disabled:opacity-30 hover:opacity-90 transition-opacity">
            Jouer
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500 space-y-2">
          <p>Tape un mot et decouvre sa proximite avec le mot secret</p>
          <div className="flex flex-wrap justify-center gap-1">
            <span>🧊 froid</span><span>·</span><span>🥶 frais</span><span>·</span>
            <span>😎 tiede</span><span>·</span><span>🥵 chaud</span><span>·</span>
            <span>🔥 brulant</span><span>·</span><span>😱 proche</span><span>·</span>
            <span>🥳 trouve !</span>
          </div>
          <p className="text-gray-600 mt-2">342 000+ mots francais — noms communs uniquement</p>
        </div>
      </div>
    </div>
  )
}

function YesterdayWords({ words }) {
  return (
    <div className="glass rounded-xl px-4 py-3 text-center">
      <p className="text-[11px] text-gray-500 mb-1">Les mots d'hier</p>
      <div className="flex flex-wrap justify-center gap-2">
        {words.map((w, i) => (
          <span key={i} className="text-sm font-bold bg-gradient-to-r from-accent-violet to-accent-orange bg-clip-text text-transparent">
            {w}
          </span>
        ))}
      </div>
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
      <div className="h-4 rounded-full bg-bg-primary overflow-hidden">
        <div className="h-full temp-gradient rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
