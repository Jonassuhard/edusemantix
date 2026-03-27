export default function EmojiSummary({ guesses }) {
  if (guesses.length === 0) return null

  // Count emojis by category
  const counts = { '🧊': 0, '🥶': 0, '😎': 0, '🥵': 0, '🔥': 0, '😱': 0, '🥳': 0 }
  guesses.forEach(g => {
    if (counts[g.emoji] !== undefined) counts[g.emoji]++
  })

  // Build emoji string (last 10 guesses by order of entry)
  const sorted = [...guesses].sort((a, b) => a.guessNumber - b.guessNumber)
  const last10 = sorted.slice(-10)

  return (
    <div className="glass rounded-xl px-4 py-2.5 flex items-center justify-between">
      <div className="flex gap-0.5 text-lg">
        {last10.map((g, i) => (
          <span key={i} className="transition-transform hover:scale-125 cursor-default" title={`${g.word}: ${g.score.toFixed(1)}°`}>
            {g.emoji}
          </span>
        ))}
        {guesses.length > 10 && (
          <span className="text-xs text-gray-500 ml-1 self-center">+{guesses.length - 10}</span>
        )}
      </div>
      <div className="flex gap-2 text-[10px] text-gray-500">
        {Object.entries(counts).map(([emoji, count]) =>
          count > 0 && (
            <span key={emoji} className="flex items-center gap-0.5">
              <span>{emoji}</span>
              <span className="font-mono">{count}</span>
            </span>
          )
        )}
      </div>
    </div>
  )
}
