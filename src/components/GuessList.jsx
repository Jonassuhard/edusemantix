import { useState } from 'react'

const TEMP_COLORS = {
  '🥳': { bg: 'bg-temp-bingo/10', text: 'text-temp-bingo', border: 'border-temp-bingo/30' },
  '😱': { bg: 'bg-temp-fire/10', text: 'text-temp-fire', border: 'border-temp-fire/30' },
  '🔥': { bg: 'bg-temp-hot/10', text: 'text-temp-hot', border: 'border-temp-hot/30' },
  '🥵': { bg: 'bg-temp-warm/10', text: 'text-temp-warm', border: 'border-temp-warm/30' },
  '😎': { bg: 'bg-temp-cool/10', text: 'text-temp-cool', border: 'border-temp-cool/30' },
  '🥶': { bg: 'bg-temp-cold/10', text: 'text-temp-cold', border: 'border-temp-cold/30' },
  '🧊': { bg: 'bg-temp-ice/10', text: 'text-temp-ice', border: 'border-temp-ice/30' }
}

function ScoreBar({ score }) {
  const pct = Math.max(0, Math.min(100, (score + 10) / 110 * 100))
  return (
    <div className="w-28 sm:w-40 h-2.5 rounded-full bg-white/5 overflow-hidden">
      <div
        className="h-full temp-gradient rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export default function GuessList({ guesses, lastResult }) {
  const [sortBy, setSortBy] = useState('score') // 'score' or 'order'

  if (guesses.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center text-gray-500">
        <p className="text-4xl mb-3">🤔</p>
        <p>Tape ton premier mot pour commencer</p>
        <p className="text-xs mt-2 text-gray-600">350 000+ mots francais reconnus</p>
        <p className="text-xs text-gray-600">Noms communs, adjectifs, verbes a l'infinitif</p>
      </div>
    )
  }

  const sorted = sortBy === 'score'
    ? [...guesses].sort((a, b) => b.score - a.score)
    : [...guesses].sort((a, b) => b.guessNumber - a.guessNumber)

  const bestScore = Math.max(...guesses.map(g => g.score))

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-white/5">
        <div className="grid grid-cols-[36px_1fr_70px_32px_50px] sm:grid-cols-[40px_1fr_80px_40px_60px] gap-1 sm:gap-2 flex-1 text-xs text-gray-500 font-medium">
          <span>#</span>
          <span>Mot</span>
          <span className="text-right">Score</span>
          <span className="text-center">°C</span>
          <span className="text-right">Rang</span>
        </div>
        <button
          onClick={() => setSortBy(s => s === 'score' ? 'order' : 'score')}
          className="ml-2 text-[10px] text-gray-600 hover:text-gray-400 transition-colors px-2 py-1 rounded border border-white/5 hover:border-white/10"
          title={sortBy === 'score' ? 'Trier par ordre de saisie' : 'Trier par score'}
        >
          {sortBy === 'score' ? '↕ score' : '↕ ordre'}
        </button>
      </div>

      {/* Rows */}
      <div className="max-h-[55vh] overflow-y-auto">
        {sorted.map((guess) => {
          const colors = TEMP_COLORS[guess.emoji] || TEMP_COLORS['🥶']
          const isNew = lastResult?.word === guess.word
          const isBingo = guess.found
          const isBest = guess.score === bestScore && !isBingo

          return (
            <div
              key={guess.word}
              className={`
                guess-row grid grid-cols-[36px_1fr_70px_32px_50px] sm:grid-cols-[40px_1fr_80px_40px_60px] gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 items-center
                border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors
                ${isBingo ? 'bg-temp-bingo/5 animate-bingo' : ''}
                ${isBest ? 'bg-accent-violet/5 border-l-2 border-l-accent-violet/40' : ''}
                ${isNew && !isBingo && !isBest ? 'bg-white/[0.03]' : ''}
              `}
            >
              <span className="text-xs text-gray-600 font-mono">{guess.guessNumber}</span>

              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`font-medium truncate text-sm sm:text-base ${isBingo ? 'text-temp-bingo font-bold' : isBest ? 'text-accent-violet' : 'text-white'}`}>
                  {guess.word}
                </span>
                {isBingo && <span className="text-xs sm:text-sm text-temp-bingo shrink-0">BINGO !</span>}
                {isBest && !isBingo && <span className="text-[10px] text-accent-violet shrink-0">meilleur</span>}
              </div>

              <div className="flex items-center justify-end gap-1 sm:gap-2">
                <ScoreBar score={guess.score} />
                <span className={`font-mono text-xs sm:text-sm ${colors.text}`}>
                  {guess.score.toFixed(1)}
                </span>
              </div>

              <span className="text-center text-base sm:text-lg">{guess.emoji}</span>

              <span className={`text-right font-mono text-xs sm:text-sm ${guess.rank ? colors.text : 'text-gray-600'}`}>
                {guess.rank || '—'}
              </span>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-3 sm:px-4 py-2 border-t border-white/5 text-xs text-gray-500 flex justify-between">
        <span>{guesses.length} mot{guesses.length > 1 ? 's' : ''}</span>
        <span>Top : {bestScore.toFixed(1)}°</span>
      </div>
    </div>
  )
}
