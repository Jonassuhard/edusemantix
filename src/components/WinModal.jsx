import { useEffect, useState } from 'react'

export default function WinModal({ guessCount }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 300)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative glass-strong rounded-2xl p-8 max-w-sm w-full text-center animate-bingo glow-gold">
        <div className="text-6xl mb-4">🥳</div>
        <h2 className="text-2xl font-bold mb-2">
          <span className="bg-gradient-to-r from-temp-bingo to-accent-orange bg-clip-text text-transparent">
            BINGO !
          </span>
        </h2>
        <p className="text-gray-300 mb-1">Tu as trouvé le mot du jour !</p>
        <p className="text-gray-500 text-sm mb-6">
          en <span className="text-white font-bold font-mono">{guessCount}</span> essai{guessCount > 1 ? 's' : ''}
        </p>

        <div className="glass rounded-xl p-4 mb-6">
          <p className="text-xs text-gray-500 mb-2">Partage ton résultat</p>
          <ShareButton guessCount={guessCount} />
        </div>

        <p className="text-xs text-gray-600">
          Reviens demain pour un nouveau mot !
        </p>
      </div>
    </div>
  )
}

function ShareButton({ guessCount }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = `EduSemantix — Trouvé en ${guessCount} essai${guessCount > 1 ? 's' : ''} ! 🥳`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-accent-violet to-accent-orange text-white font-medium text-sm hover:opacity-90 active:scale-95 transition-all"
    >
      {copied ? '✓ Copié !' : '📋 Copier le résultat'}
    </button>
  )
}
