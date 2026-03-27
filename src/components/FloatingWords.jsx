import { useEffect, useRef } from 'react'

const WORDS = [
  'sémantique', 'indice', 'chaud', 'froid', 'proche',
  'synonyme', 'cerveau', 'brûlant', 'glacial', 'bingo',
  'mystère', 'énigme', 'secret', 'eureka', 'malin',
  'stagiaire café', 'ctrl+z', '404', 'bug', 'lundi 😭',
  'réunion inutile', 'wifi ?!', 'deadline ⚠️', 'pause clope',
  'alt+f4', 'RTFM', 'copier-coller', 'ça marche pas',
  'c\'est en prod', 'ça compile', 'oups', 'GG', 'EZ',
  'ragequit', 'tricheur 👀', 'big brain 🧠', '200 IQ',
  'pain au chocolat', 'chocolatine', '42',
]

const RESTITUTION = 0.92
const FRICTION = 0.999
const ANG_FRICTION = 0.997
const WALL_RESTITUTION = 0.95

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

    function createParticle(word, is67 = false) {
      const size = is67 ? 36 : 18 + Math.random() * 22
      ctx.font = `700 ${Math.round(size)}px Inter, system-ui, sans-serif`
      const textW = ctx.measureText(word).width
      const textH = size * 1.3
      const mass = is67 ? 5 : textW * textH * 0.0008
      const inertia = (mass / 12) * (textW * textW + textH * textH)

      return {
        word, size, is67,
        x: is67 ? -150 : 60 + Math.random() * (w - 120),
        y: is67 ? Math.random() * h : 60 + Math.random() * (h - 120),
        vx: is67 ? 8 : (Math.random() - 0.5) * 2.5,
        vy: is67 ? (Math.random() - 0.5) * 3 : (Math.random() - 0.5) * 2.5,
        angle: is67 ? 0 : (Math.random() - 0.5) * 0.8,
        angVel: is67 ? 0.2 : (Math.random() - 0.5) * 0.015,
        halfW: textW / 2,
        halfH: textH / 2,
        radius: Math.sqrt(textW * textW + textH * textH) / 2,
        mass, invMass: 1 / mass,
        inertia, invInertia: 1 / inertia,
        opacity: is67 ? 0.95 : 0.45 + Math.random() * 0.3,
        flashTimer: 0,
        hidden: is67,
        hiddenTimer: is67 ? 5 * 60 : 0, // 67 first appears after 5sec
        respawnCooldown: 20 * 60,
      }
    }

    // Shuffle words and pick 17 + force 67
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5).slice(0, 17)
    const particles = shuffled.map(w => createParticle(w))
    particles.push(createParticle('67', true)) // Force 67

    // === SAT COLLISION DETECTION ===
    function getCorners(p) {
      const c = Math.cos(p.angle), s = Math.sin(p.angle)
      const hw = p.halfW, hh = p.halfH
      return [
        { x: p.x - c * hw + s * hh, y: p.y - s * hw - c * hh },
        { x: p.x + c * hw + s * hh, y: p.y + s * hw - c * hh },
        { x: p.x + c * hw - s * hh, y: p.y + s * hw + c * hh },
        { x: p.x - c * hw - s * hh, y: p.y - s * hw + c * hh },
      ]
    }

    function getAxes(corners) {
      const axes = []
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4
        const ex = corners[j].x - corners[i].x
        const ey = corners[j].y - corners[i].y
        const len = Math.sqrt(ex * ex + ey * ey)
        if (len > 0.01) axes.push({ x: -ey / len, y: ex / len })
      }
      return axes
    }

    function project(corners, axis) {
      let min = Infinity, max = -Infinity
      for (const c of corners) {
        const d = c.x * axis.x + c.y * axis.y
        if (d < min) min = d
        if (d > max) max = d
      }
      return [min, max]
    }

    function satTest(p, q) {
      const cp = getCorners(p), cq = getCorners(q)
      const axes = [...getAxes(cp), ...getAxes(cq)]
      let minOverlap = Infinity, bestAxis = null

      for (const ax of axes) {
        const [a0, a1] = project(cp, ax)
        const [b0, b1] = project(cq, ax)
        const overlap = Math.min(a1, b1) - Math.max(a0, b0)
        if (overlap <= 0) return null
        if (overlap < minOverlap) {
          minOverlap = overlap
          const dx = p.x - q.x, dy = p.y - q.y
          bestAxis = (dx * ax.x + dy * ax.y >= 0) ? ax : { x: -ax.x, y: -ax.y }
        }
      }
      return { overlap: minOverlap, nx: bestAxis.x, ny: bestAxis.y }
    }

    // === IMPULSE RESOLUTION ===
    function resolveCollision(p, q, col) {
      const { nx, ny, overlap } = col
      const tm = p.mass + q.mass

      // Separate
      p.x += nx * overlap * (q.mass / tm) * 1.01
      p.y += ny * overlap * (q.mass / tm) * 1.01
      q.x -= nx * overlap * (p.mass / tm) * 1.01
      q.y -= ny * overlap * (p.mass / tm) * 1.01

      // Contact point
      const cpx = (p.x * q.mass + q.x * p.mass) / tm
      const cpy = (p.y * q.mass + q.y * p.mass) / tm

      // Radius vectors
      const rap = { x: cpx - p.x, y: cpy - p.y }
      const rbp = { x: cpx - q.x, y: cpy - q.y }

      // Relative velocity at contact
      const rvx = (p.vx - p.angVel * rap.y) - (q.vx - q.angVel * rbp.y)
      const rvy = (p.vy + p.angVel * rap.x) - (q.vy + q.angVel * rbp.x)
      const rvn = rvx * nx + rvy * ny
      if (rvn > 0) return

      // Angular cross products
      const raCn = rap.x * ny - rap.y * nx
      const rbCn = rbp.x * ny - rbp.y * nx

      // Impulse magnitude
      const denom = p.invMass + q.invMass +
        raCn * raCn * p.invInertia +
        rbCn * rbCn * q.invInertia
      const j = -(1 + RESTITUTION) * rvn / denom

      // Apply linear impulse
      p.vx += j * nx * p.invMass
      p.vy += j * ny * p.invMass
      q.vx -= j * nx * q.invMass
      q.vy -= j * ny * q.invMass

      // Apply angular impulse
      p.angVel += raCn * j * p.invInertia
      q.angVel -= rbCn * j * q.invInertia

      // Tangential friction (makes words spin more naturally)
      const tx = rvx - rvn * nx
      const ty = rvy - rvn * ny
      const tLen = Math.sqrt(tx * tx + ty * ty)
      if (tLen > 0.01) {
        const fric = 0.3
        const tnx = tx / tLen, tny = ty / tLen
        const jt = Math.min(fric * Math.abs(j), tLen)
        p.angVel -= (rap.x * tny - rap.y * tnx) * jt * p.invInertia * 0.5
        q.angVel += (rbp.x * tny - rbp.y * tnx) * jt * q.invInertia * 0.5
      }

      p.flashTimer = 20
      q.flashTimer = 20
    }

    // === MAIN LOOP ===
    function animate() {
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // --- 67 SPECIAL ---
        if (p.is67) {
          if (p.hidden) {
            p.hiddenTimer--
            if (p.hiddenTimer > 0) continue
            // Respawn from random edge
            const edge = Math.floor(Math.random() * 4)
            const spd = 7 + Math.random() * 4
            if (edge === 0) { p.x = -80; p.y = 100 + Math.random() * (h - 200); p.vx = spd; p.vy = (Math.random() - 0.5) * 5 }
            else if (edge === 1) { p.x = w + 80; p.y = 100 + Math.random() * (h - 200); p.vx = -spd; p.vy = (Math.random() - 0.5) * 5 }
            else if (edge === 2) { p.x = 100 + Math.random() * (w - 200); p.y = -80; p.vx = (Math.random() - 0.5) * 5; p.vy = spd }
            else { p.x = 100 + Math.random() * (w - 200); p.y = h + 80; p.vx = (Math.random() - 0.5) * 5; p.vy = -spd }
            p.angVel = (Math.random() > 0.5 ? 1 : -1) * (0.15 + Math.random() * 0.2)
            p.hidden = false
            p.flashTimer = 0
          }

          // Move — no drag, stays fast
          p.x += p.vx
          p.y += p.vy
          p.angle += p.angVel

          // Off screen → hide
          if (p.x < -200 || p.x > w + 200 || p.y < -200 || p.y > h + 200) {
            p.hidden = true
            p.hiddenTimer = p.respawnCooldown
            continue
          }

          // Collide with normal words
          for (let j = 0; j < particles.length; j++) {
            if (j === i || particles[j].hidden || particles[j].is67) continue
            const q = particles[j]
            const dx = p.x - q.x, dy = p.y - q.y
            if (Math.sqrt(dx * dx + dy * dy) > p.radius + q.radius) continue
            const col = satTest(p, q)
            if (col) resolveCollision(p, q, col)
          }

          if (p.flashTimer > 0) p.flashTimer--

        } else {
          // --- NORMAL WORDS ---
          p.x += p.vx
          p.y += p.vy
          p.angle += p.angVel
          p.vx *= FRICTION
          p.vy *= FRICTION
          p.angVel *= ANG_FRICTION

          // Min/max speed
          const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
          if (spd < 0.4) {
            const a = Math.random() * Math.PI * 2
            p.vx += Math.cos(a) * 0.12
            p.vy += Math.sin(a) * 0.12
          }
          if (spd > 5) { p.vx *= 5 / spd; p.vy *= 5 / spd }

          // Walls
          const m = 15
          if (p.x < m + p.halfW) { p.x = m + p.halfW; p.vx = Math.abs(p.vx) * WALL_RESTITUTION; p.angVel += p.vy * 0.004 }
          if (p.x > w - m - p.halfW) { p.x = w - m - p.halfW; p.vx = -Math.abs(p.vx) * WALL_RESTITUTION; p.angVel -= p.vy * 0.004 }
          if (p.y < m + p.halfH) { p.y = m + p.halfH; p.vy = Math.abs(p.vy) * WALL_RESTITUTION; p.angVel -= p.vx * 0.004 }
          if (p.y > h - m - p.halfH) { p.y = h - m - p.halfH; p.vy = -Math.abs(p.vy) * WALL_RESTITUTION; p.angVel += p.vx * 0.004 }

          // Word-word collisions
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j]
            if (q.is67 || q.hidden) continue
            const dx = p.x - q.x, dy = p.y - q.y
            if (Math.sqrt(dx * dx + dy * dy) > p.radius + q.radius) continue
            const col = satTest(p, q)
            if (col) resolveCollision(p, q, col)
          }

          if (p.flashTimer > 0) p.flashTimer--
        }

        // === DRAW ===
        if (p.hidden) continue

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)

        const flash = p.flashTimer > 0 ? (p.flashTimer / 20) * 0.25 : 0
        const alpha = Math.min(1, p.opacity + flash)

        if (p.is67) {
          // 67 glows red-orange
          ctx.shadowColor = 'rgba(249, 115, 22, 0.6)'
          ctx.shadowBlur = 15
          ctx.font = `900 ${Math.round(p.size)}px Inter, system-ui, sans-serif`
          ctx.fillStyle = `rgba(249, 115, 22, ${alpha})`
        } else {
          ctx.font = `600 ${Math.round(p.size)}px Inter, system-ui, sans-serif`
          const grad = ctx.createLinearGradient(-p.halfW, 0, p.halfW, 0)
          grad.addColorStop(0, `rgba(139, 92, 246, ${alpha})`)
          grad.addColorStop(1, `rgba(249, 115, 22, ${alpha})`)
          ctx.fillStyle = grad
        }

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
