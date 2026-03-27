export default function HintBar({ guessCount, found }) {
  if (found || guessCount === 0) return null

  // Progressive hints based on guess count
  const hints = []

  if (guessCount >= 30) {
    hints.push({ icon: '📏', label: 'Indice disponible apres 30 essais', unlocked: true })
  } else if (guessCount >= 20) {
    hints.push({ icon: '🔒', label: `Indice dans ${30 - guessCount} essais`, unlocked: false })
  }

  if (guessCount >= 50) {
    hints.push({ icon: '🔤', label: 'Indice disponible apres 50 essais', unlocked: true })
  } else if (guessCount >= 35) {
    hints.push({ icon: '🔒', label: `Indice dans ${50 - guessCount} essais`, unlocked: false })
  }

  if (guessCount >= 80) {
    hints.push({ icon: '📂', label: 'Indice disponible apres 80 essais', unlocked: true })
  } else if (guessCount >= 60) {
    hints.push({ icon: '🔒', label: `Indice dans ${80 - guessCount} essais`, unlocked: false })
  }

  if (hints.length === 0) return null

  return (
    <div className="flex gap-2 flex-wrap">
      {hints.map((hint, i) => (
        <div
          key={i}
          className={`glass rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 ${
            hint.unlocked ? 'text-accent-violet border-accent-violet/20' : 'text-gray-600'
          }`}
        >
          <span>{hint.icon}</span>
          <span>{hint.label}</span>
        </div>
      ))}
    </div>
  )
}
