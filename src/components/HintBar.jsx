export default function HintBar({ guessCount, found, hints, coldStreak }) {
  if (found || guessCount === 0 || !hints) return null

  const items = []

  // Hint 1: letter count at 10 guesses OR 10 cold streak
  const hint1Trigger = Math.min(guessCount, coldStreak >= 10 ? 10 : guessCount)
  if (guessCount >= 10 || coldStreak >= 10) {
    items.push({ icon: '📏', text: `${hints.letterCount} lettres`, unlocked: true })
  } else if (guessCount >= 5) {
    items.push({ icon: '🔒', text: `Nombre de lettres dans ${10 - guessCount} essais`, unlocked: false })
  }

  // Hint 2: first letter at 20 guesses OR 20 cold streak
  if (guessCount >= 20 || coldStreak >= 20) {
    items.push({ icon: '🔤', text: `Commence par "${hints.firstLetter}"`, unlocked: true })
  } else if (guessCount >= 12) {
    items.push({ icon: '🔒', text: `Première lettre dans ${20 - guessCount} essais`, unlocked: false })
  }

  // Hint 3: category at 30 guesses OR 30 cold streak
  if (guessCount >= 30 || coldStreak >= 30) {
    items.push({ icon: '📂', text: `Catégorie : ${hints.category}`, unlocked: true })
  } else if (guessCount >= 22) {
    items.push({ icon: '🔒', text: `Catégorie dans ${30 - guessCount} essais`, unlocked: false })
  }

  if (items.length === 0) return null

  return (
    <div className="flex gap-2 flex-wrap">
      {items.map((item, i) => (
        <div
          key={i}
          className={`glass rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all ${
            item.unlocked
              ? 'text-accent-violet border border-accent-violet/20 bg-accent-violet/5 animate-pulse-slow'
              : 'text-gray-600'
          }`}
        >
          <span>{item.icon}</span>
          <span className={item.unlocked ? 'font-medium' : ''}>{item.text}</span>
        </div>
      ))}
    </div>
  )
}
