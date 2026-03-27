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
  'pain au chocolat', 'chocolatine', '42', '67',
]

const RESTITUTION = 0.85    // Bounciness (1 = perfect elastic)
const FRICTION = 0.998      // Linear drag per frame
const ANG_FRICTION = 0.995  // Rotational drag per frame
const WALL_RESTITUTION = 0.9

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

    // Measure text widths once
    ctx.font = '24px Inter, system-ui, sans-serif'

    const particles = Array.from({ length: 18 }, (_, i) => {
      const word = WORDS[i % WORDS.length]
      const size = 18 + Math.random() * 22
      ctx.font = `${Math.round(size)}px Inter, system-ui, sans-serif`
      const measured = ctx.measureText(word)
      const textW = measured.width
      const textH = size * 1.2

      // Mass proportional to area
      const mass = textW * textH * 0.001
      // Moment of inertia for a rectangle: (1/12) * m * (w² + h²)
      const inertia = (mass / 12) * (textW * textW + textH * textH)

      return {
        word, size,
        x: 80 + Math.random() * (w - 160),
        y: 80 + Math.random() * (h - 160),
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        angle: (Math.random() - 0.5) * 1.5,
        angVel: (Math.random() - 0.5) * 0.02,
        halfW: textW / 2,
        halfH: textH / 2,
        // Collision radius (enclosing circle of the bounding box)
        radius: Math.sqrt(textW * textW + textH * textH) / 2,
        mass,
        invMass: 1 / mass,
        inertia,
        invInertia: 1 / inertia,
        opacity: 0.5 + Math.random() * 0.3,
        flashTimer: 0,
      }
    })

    // Get the 4 corners of a rotated rectangle
    function getCorners(p) {
      const c = Math.cos(p.angle)
      const s = Math.sin(p.angle)
      const hw = p.halfW
      const hh = p.halfH
      return [
        { x: p.x + c * -hw - s * -hh, y: p.y + s * -hw + c * -hh },
        { x: p.x + c *  hw - s * -hh, y: p.y + s *  hw + c * -hh },
        { x: p.x + c *  hw - s *  hh, y: p.y + s *  hw + c *  hh },
        { x: p.x + c * -hw - s *  hh, y: p.y + s * -hw + c *  hh },
      ]
    }

    // Get axes for SAT (normals of edges)
    function getAxes(corners) {
      const axes = []
      for (let i = 0; i < corners.length; i++) {
        const j = (i + 1) % corners.length
        const ex = corners[j].x - corners[i].x
        const ey = corners[j].y - corners[i].y
        const len = Math.sqrt(ex * ex + ey * ey)
        if (len > 0) axes.push({ x: -ey / len, y: ex / len })
      }
      return axes
    }

    // Project corners onto axis, return [min, max]
    function project(corners, axis) {
      let min = Infinity, max = -Infinity
      for (const c of corners) {
        const dot = c.x * axis.x + c.y * axis.y
        if (dot < min) min = dot
        if (dot > max) max = dot
      }
      return [min, max]
    }

    // SAT collision: returns { overlap, axis } or null
    function satCollision(p, q) {
      const cornersP = getCorners(p)
      const cornersQ = getCorners(q)
      const axes = [...getAxes(cornersP), ...getAxes(cornersQ)]

      let minOverlap = Infinity
      let minAxis = null

      for (const axis of axes) {
        const [minP, maxP] = project(cornersP, axis)
        const [minQ, maxQ] = project(cornersQ, axis)

        const overlap = Math.min(maxP, maxQ) - Math.max(minP, minQ)
        if (overlap <= 0) return null // No collision

        if (overlap < minOverlap) {
          minOverlap = overlap
          // Make sure axis points from q to p
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dot = dx * axis.x + dy * axis.y
          minAxis = dot >= 0 ? axis : { x: -axis.x, y: -axis.y }
        }
      }

      return { overlap: minOverlap, nx: minAxis.x, ny: minAxis.y }
    }

    // Resolve collision with impulse + angular momentum transfer
    function resolveCollision(p, q, col) {
      const { nx, ny, overlap } = col

      // Separate objects
      const totalMass = p.mass + q.mass
      p.x += nx * overlap * (q.mass / totalMass)
      p.y += ny * overlap * (q.mass / totalMass)
      q.x -= nx * overlap * (p.mass / totalMass)
      q.y -= ny * overlap * (p.mass / totalMass)

      // Contact point (midpoint between centers projected)
      const cpx = (p.x + q.x) / 2
      const cpy = (p.y + q.y) / 2

      // Vectors from center to contact point
      const rapx = cpx - p.x, rapy = cpy - p.y
      const rbpx = cpx - q.x, rbpy = cpy - q.y

      // Relative velocity at contact point (includes angular contribution)
      const relVx = (p.vx - p.angVel * rapy) - (q.vx - q.angVel * rbpy)
      const relVy = (p.vy + p.angVel * rapx) - (q.vy + q.angVel * rbpx)

      // Relative velocity along collision normal
      const relVn = relVx * nx + relVy * ny
      if (relVn > 0) return // Already separating

      // Cross products for angular impulse
      const raCrossN = rapx * ny - rapy * nx
      const rbCrossN = rbpx * ny - rbpy * nx

      // Impulse scalar
      const denom = p.invMass + q.invMass +
        raCrossN * raCrossN * p.invInertia +
        rbCrossN * rbCrossN * q.invInertia

      const j = -(1 + RESTITUTION) * relVn / denom

      // Apply impulse to linear velocity
      p.vx += j * nx * p.invMass
      p.vy += j * ny * p.invMass
      q.vx -= j * nx * q.invMass
      q.vy -= j * ny * q.invMass

      // Apply impulse to angular velocity
      p.angVel += raCrossN * j * p.invInertia
      q.angVel -= rbCrossN * j * q.invInertia

      // Flash
      p.flashTimer = 25
      q.flashTimer = 25
    }

    function animate() {
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Integrate
        p.x += p.vx
        p.y += p.vy
        p.angle += p.angVel

        // Apply drag
        p.vx *= FRICTION
        p.vy *= FRICTION
        p.angVel *= ANG_FRICTION

        // Keep minimum speed so it doesn't die
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed < 0.5) {
          p.vx += (Math.random() - 0.5) * 0.15
          p.vy += (Math.random() - 0.5) * 0.15
        }
        // Cap max speed
        if (speed > 4) {
          p.vx = (p.vx / speed) * 4
          p.vy = (p.vy / speed) * 4
        }

        // Wall collisions (with rotation transfer on angled hits)
        const margin = 10
        if (p.x - p.halfW < margin) {
          p.x = margin + p.halfW
          p.vx = Math.abs(p.vx) * WALL_RESTITUTION
          p.angVel += p.vy * 0.003 // Wall friction spin
        }
        if (p.x + p.halfW > w - margin) {
          p.x = w - margin - p.halfW
          p.vx = -Math.abs(p.vx) * WALL_RESTITUTION
          p.angVel -= p.vy * 0.003
        }
        if (p.y - p.halfH < margin) {
          p.y = margin + p.halfH
          p.vy = Math.abs(p.vy) * WALL_RESTITUTION
          p.angVel -= p.vx * 0.003
        }
        if (p.y + p.halfH > h - margin) {
          p.y = h - margin - p.halfH
          p.vy = -Math.abs(p.vy) * WALL_RESTITUTION
          p.angVel += p.vx * 0.003
        }

        // Particle-particle collision (broad phase: radius check, narrow: SAT)
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          // Broad phase
          if (dist > p.radius + q.radius) continue

          // Narrow phase: SAT on oriented bounding boxes
          const col = satCollision(p, q)
          if (col) resolveCollision(p, q, col)
        }

        // Flash timer
        if (p.flashTimer > 0) p.flashTimer--

        // Draw
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)

        const flashBoost = p.flashTimer > 0 ? (p.flashTimer / 25) * 0.2 : 0
        const alpha = Math.min(1, p.opacity + flashBoost)

        const gradient = ctx.createLinearGradient(-p.halfW, 0, p.halfW, 0)
        gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha})`)
        gradient.addColorStop(1, `rgba(249, 115, 22, ${alpha})`)

        ctx.font = `600 ${Math.round(p.size)}px Inter, system-ui, sans-serif`
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
