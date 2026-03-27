import { useState, useEffect, useRef } from 'react'

const COLORS = [
  '#8b5cf6', '#f97316', '#ef4444', '#eab308', '#22c55e',
  '#3b82f6', '#ec4899', '#14b8a6', '#f59e0b', '#a855f7',
  '#06b6d4', '#f43f5e', '#84cc16', '#6366f1', '#fb923c',
]

const EMOJIS = ['🎉', '🥳', '🎊', '✨', '⭐', '🌟', '💫', '🔥', '🏆', '👑']

export default function Confetti({ onDone }) {
  const canvasRef = useRef(null)
  const [emojis, setEmojis] = useState([])

  useEffect(() => {
    // Create emoji confetti
    const emojiParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 2,
      size: 1.5 + Math.random() * 2,
      rotation: Math.random() * 720 - 360,
      drift: (Math.random() - 0.5) * 30,
    }))
    setEmojis(emojiParticles)

    // Canvas confetti
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 150 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.5,
      y: canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 20,
      vy: -Math.random() * 18 - 5,
      w: 4 + Math.random() * 8,
      h: 3 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 15,
      gravity: 0.25 + Math.random() * 0.15,
      friction: 0.99,
      opacity: 1,
      shape: Math.random() > 0.3 ? 'rect' : 'circle',
    }))

    let frame = 0
    const maxFrames = 200

    function animate() {
      frame++
      if (frame > maxFrames) {
        onDone?.()
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.vx *= p.friction
        p.rotation += p.rotSpeed

        if (frame > maxFrames * 0.6) {
          p.opacity -= 0.02
        }

        if (p.opacity <= 0) return

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation * Math.PI / 180)
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillStyle = p.color

        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const timer = setTimeout(() => onDone?.(), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10000 }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
      {emojis.map(e => (
        <div
          key={e.id}
          style={{
            position: 'absolute',
            left: `${e.x}%`,
            top: '-50px',
            fontSize: `${e.size}rem`,
            opacity: 0,
            animation: `confetti-fall ${e.duration}s ${e.delay}s ease-out forwards`,
            '--drift': `${e.drift}vw`,
            '--rotation': `${e.rotation}deg`,
          }}
        >
          {e.emoji}
        </div>
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) translateX(0) rotate(0deg) scale(0);
          }
          15% {
            opacity: 1;
            transform: translateY(5vh) translateX(calc(var(--drift) * 0.2)) rotate(calc(var(--rotation) * 0.2)) scale(1.3);
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) translateX(var(--drift)) rotate(var(--rotation)) scale(0.5);
          }
        }
      `}</style>
    </div>
  )
}
