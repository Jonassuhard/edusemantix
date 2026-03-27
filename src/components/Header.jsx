import { useState, useEffect } from 'react'

export default function Header({ day, guessCount, playerCount, onHelp, onLegend, darkMode, onToggleTheme, soundEnabled, onToggleSound, timer, found }) {
  const [nextWord, setNextWord] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
      tomorrow.setUTCHours(0, 0, 0, 0)
      const diff = tomorrow - now
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setNextWord(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="glass border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Top row: logo + stats */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔤</span>
            <div>
              <h1 className="text-lg font-bold leading-tight">
                <span className="bg-gradient-to-r from-accent-violet to-accent-orange bg-clip-text text-transparent">
                  EduSemantix
                </span>
              </h1>
              <div className="flex items-center gap-2 text-[11px] text-gray-500 leading-tight">
                <span>Jour #{day}</span>
                <span>·</span>
                <span className="font-mono">{nextWord}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {/* Timer */}
            {timer && guessCount > 0 && (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono ${found ? 'text-temp-bingo bg-temp-bingo/10' : 'text-gray-400 bg-white/5'}`}>
                <span>⏱️</span>
                <span>{timer.formatted}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="text-base">💬</span>
              <span className="font-mono">{guessCount}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-mono">{playerCount}</span>
            </div>
          </div>
        </div>

        {/* Bottom row: action buttons — min 44px touch targets on mobile */}
        <div className="flex gap-1.5 sm:gap-2">
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium glass hover:bg-white/[0.05] active:bg-white/[0.08] transition-all text-gray-400 hover:text-white"
            title={darkMode ? 'Mode clair' : 'Mode sombre'}
            aria-label={darkMode ? 'Mode clair' : 'Mode sombre'}
          >
            <span className="text-base">{darkMode ? '☀️' : '🌙'}</span>
            <span className="hidden sm:inline">{darkMode ? 'Clair' : 'Sombre'}</span>
          </button>
          <button
            onClick={onToggleSound}
            className={`flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium glass hover:bg-white/[0.05] active:bg-white/[0.08] transition-all ${soundEnabled ? 'text-accent-violet' : 'text-gray-500'}`}
            title={soundEnabled ? 'Couper le son' : 'Activer le son'}
            aria-label={soundEnabled ? 'Couper le son' : 'Activer le son'}
          >
            <span className="text-base">{soundEnabled ? '🔊' : '🔇'}</span>
            <span className="hidden sm:inline">{soundEnabled ? 'Son' : 'Muet'}</span>
          </button>
          <button
            onClick={onLegend}
            className="flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium glass hover:bg-white/[0.05] active:bg-white/[0.08] transition-all text-gray-400 hover:text-white"
            title="Échelle de température"
            aria-label="Échelle de température"
          >
            <span className="text-base">🌡</span>
            <span className="hidden sm:inline">Échelle</span>
          </button>
          <button
            onClick={onHelp}
            className="flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium glass hover:bg-white/[0.05] active:bg-white/[0.08] transition-all text-gray-400 hover:text-white"
            title="Règles du jeu"
            aria-label="Règles du jeu"
          >
            <span className="text-base">❓</span>
            <span className="hidden sm:inline">Règles</span>
          </button>
        </div>
      </div>
    </header>
  )
}
