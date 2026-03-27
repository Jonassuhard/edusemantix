import { useEffect, useRef } from 'react'

const WORDS = [
  'sémantique', 'indice', 'chaud', 'froid', 'proche',
  'synonyme', 'cerveau', 'brûlant', 'glacial', 'bingo',
  'mystère', 'énigme', 'secret', 'eureka', 'malin',
  // drôles
  'stagiaire café', 'ctrl+z', '404', 'bug', 'lundi 😭',
  'réunion inutile', 'wifi ?!', 'deadline ⚠️', 'pause clope',
  'alt+f4', 'RTFM', 'copier-coller', 'ça marche pas',
  'c\'est en prod', 'ça compile', 'oups', 'GG', 'EZ',
  'ragequit', 'tricheur 👀', 'big brain 🧠', '200 IQ',
  'pain au chocolat', 'chocolatine', '42',
]

export default function FloatingWords() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    let animId

    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Create floating word particles
    const particles = Array.from({ length: 22 }, (_, i) => {
      const word = WORDS[i % WORDS.length]
      const size = 12 + Math.random() * 16
      return {
        word,
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        size,
        opacity: 0.06 + Math.random() * 0.1,
        // Approx width for collision
        width: word.length * size * 0.55,
        height: size * 1.2,
      }
    })

    function animate() {
      ctx.clearRect(0, 0, w, h)

      // Update & draw
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Move
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotSpeed

        // Bounce off edges
        if (p.x < -50) { p.x = -50; p.vx *= -1 }
        if (p.x > w + 50) { p.x = w + 50; p.vx *= -1 }
        if (p.y < -30) { p.y = -30; p.vy *= -1 }
        if (p.y > h + 30) { p.y = h + 30; p.vy *= -1 }

        // Collision with other particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const minDist = (p.width + q.width) * 0.35

          if (dist < minDist && dist > 0) {
            // Elastic-ish bounce
            const nx = dx / dist
            const ny = dy / dist

            // Swap velocity components along collision axis
            const dvx = p.vx - q.vx
            const dvy = p.vy - q.vy
            const dvn = dvx * nx + dvy * ny

            if (dvn > 0) continue // Already separating

            p.vx -= dvn * nx * 0.8
            p.vy -= dvn * ny * 0.8
            q.vx += dvn * nx * 0.8
            q.vy += dvn * ny * 0.8

            // Spin on impact
            p.rotSpeed += (Math.random() - 0.5) * 0.005
            q.rotSpeed += (Math.random() - 0.5) * 0.005

            // Slight push apart
            const overlap = minDist - dist
            p.x += nx * overlap * 0.3
            p.y += ny * overlap * 0.3
            q.x -= nx * overlap * 0.3
            q.y -= ny * overlap * 0.3

            // Brief opacity flash on collision
            p.flashTimer = 30
            q.flashTimer = 30
          }
        }

        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        const maxSpeed = 1.2
        const minSpeed = 0.15
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed
          p.vy = (p.vy / speed) * maxSpeed
        }
        if (speed < minSpeed) {
          p.vx += (Math.random() - 0.5) * 0.05
          p.vy += (Math.random() - 0.5) * 0.05
        }

        // Dampen rotation slowly
        p.rotSpeed *= 0.999

        // Flash timer
        if (p.flashTimer > 0) p.flashTimer--

        // Draw
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        const flashBoost = p.flashTimer > 0 ? (p.flashTimer / 30) * 0.12 : 0
        const alpha = p.opacity + flashBoost

        // Gradient text: violet to orange
        const gradient = ctx.createLinearGradient(-p.width / 2, 0, p.width / 2, 0)
        gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha})`)
        gradient.addColorStop(1, `rgba(249, 115, 22, ${alpha})`)

        ctx.font = `${Math.round(p.size)}px Inter, system-ui, sans-serif`
        ctx.fillStyle = gradient
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.word, 0, 0)

        ctx.restore()
      }

      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
