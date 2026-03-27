export default function Header({ day, guessCount, playerCount }) {
  return (
    <header className="glass border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔤</span>
          <div>
            <h1 className="text-lg font-bold leading-tight">
              <span className="bg-gradient-to-r from-accent-violet to-accent-orange bg-clip-text text-transparent">
                EduSemantix
              </span>
            </h1>
            <p className="text-[11px] text-gray-500 leading-tight">Jour #{day}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="text-base">💬</span>
            <span className="font-mono">{guessCount}</span>
            <span className="text-gray-600 text-xs">essais</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="font-mono">{playerCount}</span>
            <span className="text-gray-600 text-xs hidden sm:inline">en ligne</span>
          </div>
        </div>
      </div>
    </header>
  )
}
