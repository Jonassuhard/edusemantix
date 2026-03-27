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
    <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
      <div
        className="h-full temp-gradient rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export default function GuessList({ guesses, lastResult }) {
  if (guesses.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center text-gray-500">
        <p className="text-4xl mb-3">🤔</p>
        <p>Tape ton premier mot pour commencer</p>
        <p className="text-xs mt-1 text-gray-600">Plus la température est haute, plus tu es proche</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[40px_1fr_80px_40px_60px] gap-2 px-4 py-2 text-xs text-gray-500 border-b border-white/5 font-medium">
        <span>#</span>
        <span>Mot</span>
        <span className="text-right">Score</span>
        <span className="text-center">°C</span>
        <span className="text-right">Rang</span>
      </div>

      {/* Rows */}
      <div className="max-h-[60vh] overflow-y-auto">
        {guesses.map((guess, i) => {
          const colors = TEMP_COLORS[guess.emoji] || TEMP_COLORS['🥶']
          const isNew = lastResult?.word === guess.word
          const isBingo = guess.found

          return (
            <div
              key={guess.word}
              className={`
                guess-row grid grid-cols-[40px_1fr_80px_40px_60px] gap-2 px-4 py-2.5 items-center
                border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors
                ${isBingo ? 'bg-temp-bingo/5 animate-bingo' : ''}
                ${isNew && !isBingo ? 'bg-white/[0.03]' : ''}
              `}
            >
              <span className="text-xs text-gray-600 font-mono">{guess.guessNumber}</span>

              <span className={`font-medium truncate ${isBingo ? 'text-temp-bingo font-bold' : 'text-white'}`}>
                {guess.word}
                {isBingo && <span className="ml-2 text-sm">BINGO !</span>}
              </span>

              <div className="flex items-center justify-end gap-2">
                <ScoreBar score={guess.score} />
                <span className={`font-mono text-sm ${colors.text}`}>
                  {guess.score.toFixed(2)}
                </span>
              </div>

              <span className="text-center text-lg">{guess.emoji}</span>

              <span className={`text-right font-mono text-sm ${guess.rank ? colors.text : 'text-gray-600'}`}>
                {guess.rank || '—'}
              </span>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/5 text-xs text-gray-500 flex justify-between">
        <span>{guesses.length} mot{guesses.length > 1 ? 's' : ''} essayé{guesses.length > 1 ? 's' : ''}</span>
        <span>Top : {Math.max(...guesses.map(g => g.score)).toFixed(2)}°</span>
      </div>
    </div>
  )
}
