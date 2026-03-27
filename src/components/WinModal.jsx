import { useEffect, useState, useRef } from 'react'

export default function WinModal({ guessCount, guesses, stats, topWords, round, roundCount, hasNextRound, onNextRound, onClose }) {
  const [visible, setVisible] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    setTimeout(() => setVisible(true), 300)
  }, [])

  // Confetti animation
  useEffect(() => {
    if (!visible || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#eab308', '#f97316', '#8b5cf6', '#3b82f6', '#22c55e', '#ef4444', '#ec4899', '#06b6d4']
    const confetti = []

    for (let i = 0; i < 150; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      })
    }

    let animId
    let frame = 0
    const maxFrames = 300

    function draw() {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const c of confetti) {
        c.x += c.vx
        c.vy += 0.05
        c.y += c.vy
        c.rot += c.rotSpeed

        if (frame > maxFrames - 60) {
          c.opacity = Math.max(0, c.opacity - 0.02)
        }

        ctx.save()
        ctx.translate(c.x, c.y)
        ctx.rotate((c.rot * Math.PI) / 180)
        ctx.globalAlpha = c.opacity
        ctx.fillStyle = c.color
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h)
        ctx.restore()
      }

      if (frame < maxFrames) {
        animId = requestAnimationFrame(draw)
      }
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [visible])

  if (!visible) return null

  const sorted = [...guesses].sort((a, b) => a.guessNumber - b.guessNumber)
  const last10 = sorted.slice(-10)
  const emojiStr = last10.map(g => g.emoji).join('')

  return (
    <>
      {/* Confetti canvas — full screen, behind modal */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-50 pointer-events-none"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop — click to close */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div className="relative glass-strong rounded-2xl p-8 max-w-sm w-full text-center animate-bingo glow-gold">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full border border-white/10 text-gray-500 hover:text-white hover:border-white/30 transition-all flex items-center justify-center text-sm"
          >
            ✕
          </button>

          <div className="text-6xl mb-4">🥳</div>
          <h2 className="text-2xl font-bold mb-2">
            <span className="bg-gradient-to-r from-temp-bingo to-accent-orange bg-clip-text text-transparent">
              BINGO !
            </span>
          </h2>
          <p className="text-gray-300 mb-1">Tu as trouve le mot du jour !</p>
          <p className="text-gray-500 text-sm mb-4">
            en <span className="text-white font-bold font-mono">{guessCount}</span> essai{guessCount > 1 ? 's' : ''}
          </p>

          {/* Emoji recap */}
          <div className="flex justify-center gap-0.5 text-xl mb-4">
            {last10.map((g, i) => (
              <span key={i}>{g.emoji}</span>
            ))}
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              <StatBox label="Joues" value={stats.played} />
              <StatBox label="Gagnes" value={stats.won} />
              <StatBox label="Serie" value={stats.streak} />
              <StatBox label="Moy." value={stats.avgGuesses || '—'} />
            </div>
          )}

          <div className="glass rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 mb-2">Partage ton resultat</p>
            <ShareButton guessCount={guessCount} emojiStr={emojiStr} />
          </div>

          {/* Top closest words */}
          {topWords && topWords.length > 0 && (
            <div className="glass rounded-xl p-3 mb-4 text-left">
              <p className="text-xs text-gray-500 mb-2 text-center">Les 10 mots les plus proches</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {topWords.map((tw, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-300 truncate">{tw.word}</span>
                    <span className="text-gray-500 font-mono ml-1">#{tw.rank}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasNextRound ? (
            <button
              onClick={onNextRound}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-violet to-accent-orange text-white font-semibold hover:opacity-90 active:scale-95 transition-all"
            >
              Mot suivant ({round + 2}/{roundCount}) →
            </button>
          ) : (
            <p className="text-sm text-temp-bingo font-medium">
              Tu as trouve les {roundCount} mots du jour !
            </p>
          )}

          <button
            onClick={onClose}
            className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors underline"
          >
            Fermer et voir mes essais
          </button>
        </div>
      </div>
    </>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="glass rounded-lg p-2">
      <div className="text-white font-bold font-mono">{value}</div>
      <div className="text-[10px] text-gray-500">{label}</div>
    </div>
  )
}

function ShareButton({ guessCount, emojiStr }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = `EduSemantix — Trouve en ${guessCount} essai${guessCount > 1 ? 's' : ''} !\n${emojiStr}\nhttps://edusemantix.onrender.com`
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
      {copied ? '✓ Copie !' : '📋 Copier le resultat'}
    </button>
  )
}
