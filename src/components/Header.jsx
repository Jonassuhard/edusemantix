import { useState, useEffect } from 'react'

export default function Header({ day, guessCount, playerCount, onHelp, onLegend, darkMode, onToggleTheme }) {
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

        {/* Bottom row: action buttons with labels */}
        <div className="flex gap-2">
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass hover:bg-white/[0.05] transition-all text-gray-400 hover:text-white"
          >
            <span>{darkMode ? '☀️' : '🌙'}</span>
            <span className="hidden sm:inline">{darkMode ? 'Clair' : 'Sombre'}</span>
          </button>
          <button
            onClick={onLegend}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass hover:bg-white/[0.05] transition-all text-gray-400 hover:text-white"
          >
            <span>🌡</span>
            <span className="hidden sm:inline">Echelle</span>
          </button>
          <button
            onClick={onHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass hover:bg-white/[0.05] transition-all text-gray-400 hover:text-white"
          >
            <span>❓</span>
            <span className="hidden sm:inline">Regles</span>
          </button>
        </div>
      </div>
    </header>
  )
}
