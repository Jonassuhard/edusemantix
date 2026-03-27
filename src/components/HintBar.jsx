export default function HintBar({ guessCount, found, hints }) {
  if (found || guessCount === 0 || !hints) return null

  const items = []

  // Hint 1: letter count at 30 guesses
  if (guessCount >= 30) {
    items.push({ icon: '📏', text: `${hints.letterCount} lettres`, unlocked: true })
  } else if (guessCount >= 20) {
    items.push({ icon: '🔒', text: `Nombre de lettres dans ${30 - guessCount} essais`, unlocked: false })
  }

  // Hint 2: first letter at 50 guesses
  if (guessCount >= 50) {
    items.push({ icon: '🔤', text: `Commence par "${hints.firstLetter}"`, unlocked: true })
  } else if (guessCount >= 35) {
    items.push({ icon: '🔒', text: `Premiere lettre dans ${50 - guessCount} essais`, unlocked: false })
  }

  // Hint 3: category at 80 guesses
  if (guessCount >= 80) {
    items.push({ icon: '📂', text: `Categorie : ${hints.category}`, unlocked: true })
  } else if (guessCount >= 60) {
    items.push({ icon: '🔒', text: `Categorie dans ${80 - guessCount} essais`, unlocked: false })
  }

  if (items.length === 0) return null

  return (
    <div className="flex gap-2 flex-wrap">
      {items.map((item, i) => (
        <div
          key={i}
          className={`glass rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all ${
            item.unlocked
              ? 'text-accent-violet border border-accent-violet/20 bg-accent-violet/5'
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
