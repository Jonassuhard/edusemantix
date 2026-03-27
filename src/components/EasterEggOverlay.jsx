import { useState, useEffect } from 'react'

// Full-screen animated overlays for easter eggs
const ANIMATIONS = {
  plane: PlaneAnimation,
  snow: SnowAnimation,
  rainbow: RainbowAnimation,
  'shake-gold': SwordAnimation,
  bounce: BounceEmoji,
  heartbeat: HeartAnimation,
  siren: SirenAnimation,
  'slide-politics': PoliticsAnimation,
  glitch: GlitchAnimation,
  wiggle: WiggleAnimation,
  pop: PopAnimation,
  float: FloatAnimation,
}

export default function EasterEggOverlay({ anim, animKey }) {
  if (!anim) return null
  const Component = ANIMATIONS[anim]
  if (!Component) return null
  return <Component key={animKey} />
}

// ✈️ Avion qui fait des loopings
function PlaneAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 4000); return () => clearTimeout(t) }, [])
  if (!active) return null
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        fontSize: '4rem',
        animation: 'plane-looping 4s ease-in-out forwards',
      }}>
        ✈️
      </div>
      <style>{`
        @keyframes plane-looping {
          0% { left: -10%; top: 50%; transform: rotate(0deg) scale(1); }
          10% { left: 15%; top: 40%; transform: rotate(-15deg) scale(1.1); }
          20% { left: 30%; top: 20%; transform: rotate(-30deg) scale(1.2); }
          30% { left: 42%; top: 10%; transform: rotate(0deg) scale(1.3); }
          40% { left: 52%; top: 20%; transform: rotate(45deg) scale(1.2); }
          50% { left: 55%; top: 45%; transform: rotate(120deg) scale(1.1); }
          60% { left: 50%; top: 55%; transform: rotate(200deg) scale(1); }
          70% { left: 55%; top: 40%; transform: rotate(300deg) scale(1.1); }
          80% { left: 65%; top: 25%; transform: rotate(350deg) scale(1.2); }
          90% { left: 85%; top: 30%; transform: rotate(370deg) scale(1); }
          100% { left: 110%; top: 35%; transform: rotate(380deg) scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ❄️ Vraie chute de neige
function SnowAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 4000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const flakes = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    size: 1 + Math.random() * 2,
    emoji: ['❄️', '🧊', '⛄'][Math.floor(Math.random() * 3)],
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {flakes.map(f => (
        <div key={f.id} style={{
          position: 'absolute',
          left: `${f.left}%`,
          top: '-40px',
          fontSize: `${f.size}rem`,
          animation: `snow-drop ${f.duration}s ${f.delay}s ease-in forwards`,
          opacity: 0,
        }}>
          {f.emoji}
        </div>
      ))}
      <style>{`
        @keyframes snow-drop {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(${180 + Math.random() * 180}deg); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

// 🏳️‍🌈 Arc-en-ciel qui traverse l'écran
function RainbowAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 3500); return () => clearTimeout(t) }, [])
  if (!active) return null
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255,0,0,0.12), rgba(255,165,0,0.12), rgba(255,255,0,0.12), rgba(0,128,0,0.12), rgba(0,0,255,0.12), rgba(128,0,128,0.12))',
        animation: 'rainbow-flash 3s ease-out forwards',
      }} />
      {['🏳️‍🌈', '🌈', '✨', '🦄', '🏳️‍🌈', '🌈'].map((e, i) => (
        <div key={i} style={{
          position: 'absolute',
          fontSize: '3rem',
          left: `${10 + i * 15}%`,
          top: '50%',
          animation: `rainbow-bounce 0.8s ${i * 0.1}s ease-out forwards`,
          opacity: 0,
          transform: 'translateY(100px)',
        }}>
          {e}
        </div>
      ))}
      <style>{`
        @keyframes rainbow-flash {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes rainbow-bounce {
          0% { opacity: 0; transform: translateY(100px) scale(0); }
          50% { opacity: 1; transform: translateY(-30px) scale(1.3); }
          100% { opacity: 0; transform: translateY(-80px) scale(0.5); }
        }
      `}</style>
    </div>
  )
}

// ⚔️ Épées qui s'entrechoquent
function SwordAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 2500); return () => clearTimeout(t) }, [])
  if (!active) return null
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '200px', height: '200px' }}>
        <div style={{ position: 'absolute', fontSize: '4rem', animation: 'sword-left 0.6s ease-out forwards' }}>⚔️</div>
        <div style={{ position: 'absolute', fontSize: '6rem', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', animation: 'sword-flash 0.6s 0.3s ease-out forwards', opacity: 0 }}>💥</div>
        <div style={{ position: 'absolute', fontSize: '2rem', animation: 'pentakill-text 1.5s 0.5s ease-out forwards', opacity: 0, left: '50%', top: '-20px', transform: 'translateX(-50%)', whiteSpace: 'nowrap', color: '#eab308', fontWeight: 900, textShadow: '0 0 20px rgba(234,179,8,0.8)' }}>
          PENTAKILL
        </div>
      </div>
      <style>{`
        @keyframes sword-left {
          0% { left: -50px; top: 50%; transform: rotate(-45deg) scale(0.5); }
          60% { left: 60px; top: 70px; transform: rotate(15deg) scale(1.3); }
          100% { left: 50px; top: 75px; transform: rotate(10deg) scale(1); }
        }
        @keyframes sword-flash {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0); }
          50% { opacity: 1; transform: translate(-50%,-50%) scale(1.5); }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(2); }
        }
        @keyframes pentakill-text {
          0% { opacity: 0; transform: translateX(-50%) scale(0.3); }
          30% { opacity: 1; transform: translateX(-50%) scale(1.3); }
          70% { opacity: 1; transform: translateX(-50%) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-40px) scale(0.8); }
        }
      `}</style>
    </div>
  )
}

// 😛 Emoji qui rebondit partout
function BounceEmoji() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 3000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const emojis = ['😛', '😜', '🤪', '😝', '😛']
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {emojis.map((e, i) => (
        <div key={i} style={{
          position: 'absolute',
          fontSize: '3rem',
          left: `${15 + i * 18}%`,
          bottom: '0',
          animation: `super-bounce 1.5s ${i * 0.15}s ease-out forwards`,
        }}>
          {e}
        </div>
      ))}
      <style>{`
        @keyframes super-bounce {
          0% { transform: translateY(0) scale(1); }
          15% { transform: translateY(-40vh) scale(1.2) rotate(20deg); }
          30% { transform: translateY(-10vh) scale(0.9) rotate(-10deg); }
          45% { transform: translateY(-30vh) scale(1.1) rotate(15deg); }
          60% { transform: translateY(-5vh) scale(0.95) rotate(-5deg); }
          75% { transform: translateY(-20vh) scale(1.05) rotate(10deg); }
          90% { transform: translateY(0) scale(1) rotate(0deg); }
          100% { transform: translateY(20vh) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// 💍 Cœurs qui montent
function HeartAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 3500); return () => clearTimeout(t) }, [])
  if (!active) return null
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    delay: Math.random() * 1.5,
    size: 1.5 + Math.random() * 2,
    emoji: ['❤️', '💕', '💍', '💖', '💗'][Math.floor(Math.random() * 5)],
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {hearts.map(h => (
        <div key={h.id} style={{
          position: 'absolute',
          left: `${h.left}%`,
          bottom: '-40px',
          fontSize: `${h.size}rem`,
          animation: `heart-float 3s ${h.delay}s ease-out forwards`,
          opacity: 0,
        }}>
          {h.emoji}
        </div>
      ))}
      <style>{`
        @keyframes heart-float {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          20% { opacity: 1; transform: translateY(-20vh) scale(1.2); }
          100% { transform: translateY(-110vh) scale(0.5) rotate(${20 - Math.random() * 40}deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// 🚨 Sirène rouge
function SirenAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 2500); return () => clearTimeout(t) }, [])
  if (!active) return null
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      <div style={{
        position: 'absolute', inset: 0,
        animation: 'siren-flash 0.3s ease-in-out 4',
      }} />
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        fontSize: '5rem',
        animation: 'siren-rotate 0.5s ease-in-out 3',
      }}>🚨</div>
      <style>{`
        @keyframes siren-flash {
          0%, 100% { background: transparent; }
          50% { background: rgba(239, 68, 68, 0.15); }
        }
        @keyframes siren-rotate {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          25% { transform: translateX(-50%) rotate(15deg); }
          75% { transform: translateX(-50%) rotate(-15deg); }
        }
      `}</style>
    </div>
  )
}

// 🏛️ Slide politique avec drapeau
function PoliticsAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 3000); return () => clearTimeout(t) }, [])
  if (!active) return null
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        fontSize: '5rem',
        right: '-80px',
        top: '30%',
        animation: 'politics-slide 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }}>
        🏛️
      </div>
      {['🇫🇷', '📜', '🗳️'].map((e, i) => (
        <div key={i} style={{
          position: 'absolute',
          fontSize: '2.5rem',
          left: `${20 + i * 25}%`,
          top: '45%',
          animation: `politics-pop 0.6s ${0.8 + i * 0.2}s ease-out forwards`,
          opacity: 0,
        }}>
          {e}
        </div>
      ))}
      <style>{`
        @keyframes politics-slide {
          0% { right: -80px; transform: rotate(10deg); }
          40% { right: calc(50% - 40px); transform: rotate(-5deg); }
          60% { right: calc(50% - 50px); transform: rotate(2deg); }
          100% { right: calc(50% - 40px); transform: rotate(0deg); opacity: 0; }
        }
        @keyframes politics-pop {
          0% { opacity: 0; transform: scale(0) rotate(-20deg); }
          60% { opacity: 1; transform: scale(1.3) rotate(10deg); }
          100% { opacity: 0; transform: scale(0.5) translateY(-50px); }
        }
      `}</style>
    </div>
  )
}

// 🤖 Glitch robotique
function GlitchAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 2000); return () => clearTimeout(t) }, [])
  if (!active) return null
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      <div style={{
        position: 'absolute', inset: 0,
        animation: 'glitch-screen 0.15s ease-in-out 6',
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
        fontSize: '5rem',
        animation: 'glitch-robot 0.3s ease-in-out 3',
      }}>🤖</div>
      <style>{`
        @keyframes glitch-screen {
          0%, 100% { background: transparent; }
          25% { background: rgba(0, 255, 0, 0.03); transform: translateX(2px); }
          75% { background: rgba(255, 0, 255, 0.03); transform: translateX(-2px); }
        }
        @keyframes glitch-robot {
          0%, 100% { transform: translate(-50%,-50%) skewX(0deg); filter: none; }
          25% { transform: translate(-48%,-52%) skewX(5deg); filter: hue-rotate(90deg); }
          75% { transform: translate(-52%,-48%) skewX(-5deg); filter: hue-rotate(270deg); }
        }
      `}</style>
    </div>
  )
}

// 😏 Wiggle avec emoji agrandi
function WiggleAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 2000); return () => clearTimeout(t) }, [])
  if (!active) return null
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        fontSize: '5rem',
        animation: 'wiggle-big 0.8s ease-in-out',
        opacity: 0,
      }}>😏</div>
      <style>{`
        @keyframes wiggle-big {
          0% { opacity: 0; transform: scale(0) rotate(0deg); }
          20% { opacity: 1; transform: scale(1.3) rotate(10deg); }
          40% { transform: scale(1) rotate(-8deg); }
          60% { transform: scale(1.1) rotate(6deg); }
          80% { transform: scale(1) rotate(-3deg); opacity: 1; }
          100% { transform: scale(0.5) rotate(0deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// 🍕 Pop avec emojis qui explosent
function PopAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 2500); return () => clearTimeout(t) }, [])
  if (!active) return null
  const items = ['🍕', '🥖', '🧀', '🥐', '🍺', '☕'].sort(() => Math.random() - 0.5).slice(0, 5)
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {items.map((e, i) => {
        const angle = (i / items.length) * 360
        const rad = angle * Math.PI / 180
        return (
          <div key={i} style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            fontSize: '3rem',
            animation: `pop-explode 1.5s ${i * 0.1}s ease-out forwards`,
            opacity: 0,
            '--dx': `${Math.cos(rad) * 40}vw`,
            '--dy': `${Math.sin(rad) * 40}vh`,
          }}>
            {e}
          </div>
        )
      })}
      <style>{`
        @keyframes pop-explode {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
          100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3) rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// ☕ Float vers le haut
function FloatAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 3000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const items = ['☕', '🍷', '🍺', '🥂', '🧋'].sort(() => Math.random() - 0.5).slice(0, 4)
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {items.map((e, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${20 + i * 20}%`,
          bottom: '-50px',
          fontSize: '3rem',
          animation: `float-gentle 3s ${i * 0.3}s ease-out forwards`,
          opacity: 0,
        }}>
          {e}
          <div style={{
            position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
            fontSize: '1rem', opacity: 0.6,
            animation: `steam 2s ${i * 0.3 + 0.5}s ease-out infinite`,
          }}>♨️</div>
        </div>
      ))}
      <style>{`
        @keyframes float-gentle {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-80vh) rotate(15deg); opacity: 0; }
        }
        @keyframes steam {
          0% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateX(-50%) translateY(-30px) scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
