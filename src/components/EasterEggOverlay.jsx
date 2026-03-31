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
  spider: SpiderAnimation,
  lightning: LightningAnimation,
  bat: BatAnimation,
  shield: ShieldAnimation,
  snap: SnapAnimation,
  force: ForceAnimation,
  matrix: MatrixAnimation,
  firework: FireworkAnimation,
  tornado: TornadoAnimation,
  ocean: OceanAnimation,
  rocket: RocketAnimation,
  disco: DiscoAnimation,
  explosion: ExplosionAnimation,
  portal: PortalAnimation,
  tsunami: TsunamiAnimation,
  volcano: VolcanoAnimation,
  blackhole: BlackHoleAnimation,
  butterfly: ButterflyAnimation,
  casino: CasinoAnimation,
  ninja: NinjaAnimation,
  heartsZarina: HeartsZarinaAnimation,
  danceLucie: DanceLucieAnimation,
  nurseTraveler: NurseTravelerAnimation,
  kpopNoemie: KpopNoemieAnimation,
  kcorpWedding: KcorpWeddingAnimation,
  disneyTravel: DisneyTravelAnimation,
  orangeSport: OrangeSportAnimation,
  flameAstro: FlameAstroAnimation,
  cyberJade: CyberJadeAnimation,
  adventureThomas: AdventureThomasAnimation,
  spiralJonas: SpiralJonasAnimation,
  ghostDev: GhostDevAnimation,
  seoLoud: SeoLoudAnimation,
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

// 🕷️ Spiderman — web shoots across screen + spider swings
function SpiderAnimation() {
  const [active, setActive] = useState(true)
  const canvasRef = { current: null }
  useEffect(() => { const t = setTimeout(() => setActive(false), 4000); return () => clearTimeout(t) }, [])
  if (!active) return null
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Web lines shooting from corners */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i}
            x1="50%" y1="0"
            x2={`${10 + i * 20}%`} y2="100%"
            stroke="rgba(200,200,200,0.15)"
            strokeWidth="1.5"
            style={{ animation: `web-draw 0.8s ${i * 0.1}s ease-out forwards`, strokeDasharray: 2000, strokeDashoffset: 2000 }}
          />
        ))}
        {[0, 1, 2, 3].map(i => (
          <line key={`h${i}`}
            x1="0" y1={`${20 + i * 20}%`}
            x2="100%" y2={`${25 + i * 18}%`}
            stroke="rgba(200,200,200,0.1)"
            strokeWidth="1"
            style={{ animation: `web-draw 0.6s ${0.3 + i * 0.15}s ease-out forwards`, strokeDasharray: 2000, strokeDashoffset: 2000 }}
          />
        ))}
      </svg>
      {/* Spider swinging */}
      <div style={{
        position: 'absolute', fontSize: '4rem',
        left: '-10%', top: '15%',
        animation: 'spider-swing 2s 0.5s ease-in-out forwards',
      }}>🕷️</div>
      {/* Spiderman emoji swinging */}
      <div style={{
        position: 'absolute', fontSize: '5rem',
        right: '-10%', top: '40%',
        animation: 'spidey-swing 2.5s 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      }}>🦸</div>
      <style>{`
        @keyframes web-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes spider-swing {
          0% { left: -10%; top: 15%; transform: rotate(-30deg); }
          30% { left: 30%; top: 5%; transform: rotate(15deg); }
          60% { left: 55%; top: 25%; transform: rotate(-10deg); }
          100% { left: 110%; top: 10%; transform: rotate(20deg); opacity: 0; }
        }
        @keyframes spidey-swing {
          0% { right: -10%; top: 40%; transform: rotate(20deg) scale(1); }
          25% { right: 25%; top: 10%; transform: rotate(-25deg) scale(1.3); }
          50% { right: 45%; top: 35%; transform: rotate(15deg) scale(1); }
          75% { right: 65%; top: 5%; transform: rotate(-20deg) scale(1.2); }
          100% { right: 110%; top: 20%; transform: rotate(10deg) scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ⚡ Lightning — Harry Potter / Thor / Pikachu
function LightningAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 2500); return () => clearTimeout(t) }, [])
  if (!active) return null
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {/* Screen flash */}
      <div style={{
        position: 'absolute', inset: 0,
        animation: 'lightning-flash 0.6s ease-out 3',
      }} />
      {/* Lightning bolts */}
      {[0, 1, 2].map(i => (
        <svg key={i} style={{
          position: 'absolute',
          left: `${20 + i * 25}%`, top: 0,
          width: '80px', height: '100%',
          animation: `bolt-strike 0.3s ${i * 0.2}s ease-out forwards`,
          opacity: 0,
        }}>
          <path
            d={`M40,0 L25,${35 + i * 5}% L45,${35 + i * 5}% L15,${70 + i * 3}% L50,${70 + i * 3}% L30,100%`}
            fill="none" stroke="#fbbf24" strokeWidth="3"
            filter="drop-shadow(0 0 10px #fbbf24) drop-shadow(0 0 30px #f59e0b)"
          />
        </svg>
      ))}
      {/* Central emoji */}
      <div style={{
        position: 'absolute', top: '35%', left: '50%',
        transform: 'translate(-50%,-50%)',
        fontSize: '6rem',
        animation: 'bolt-emoji 1s 0.5s ease-out forwards',
        opacity: 0,
      }}>⚡</div>
      <style>{`
        @keyframes lightning-flash {
          0%, 100% { background: transparent; }
          10% { background: rgba(251, 191, 36, 0.2); }
          20% { background: rgba(255, 255, 255, 0.4); }
          30% { background: transparent; }
        }
        @keyframes bolt-strike {
          0% { opacity: 0; transform: scaleY(0); transform-origin: top; }
          50% { opacity: 1; transform: scaleY(1); }
          100% { opacity: 0; }
        }
        @keyframes bolt-emoji {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0) rotate(-20deg); }
          40% { opacity: 1; transform: translate(-50%,-50%) scale(1.5) rotate(10deg); }
          70% { transform: translate(-50%,-50%) scale(1) rotate(0deg); opacity: 1; }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(0.5) rotate(-10deg); }
        }
      `}</style>
    </div>
  )
}

// 🦇 Batman — bats fly across + bat signal
function BatAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 3500); return () => clearTimeout(t) }, [])
  if (!active) return null
  const bats = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: -10 + Math.random() * 20,
    y: 20 + Math.random() * 60,
    delay: Math.random() * 1.5,
    speed: 1.5 + Math.random() * 2,
    size: 1.5 + Math.random() * 1.5,
    wobble: Math.random() * 30 - 15,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.5) 100%)',
        animation: 'bat-dark 3s ease-in-out forwards',
      }} />
      {/* Bat signal */}
      <div style={{
        position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%,-50%)',
        fontSize: '8rem',
        animation: 'bat-signal 2s ease-out forwards',
        opacity: 0,
        filter: 'drop-shadow(0 0 40px rgba(251,191,36,0.6))',
      }}>🦇</div>
      {/* Flying bats */}
      {bats.map(b => (
        <div key={b.id} style={{
          position: 'absolute',
          left: `${b.x}%`, top: `${b.y}%`,
          fontSize: `${b.size}rem`,
          animation: `bat-fly ${b.speed}s ${b.delay}s ease-in forwards`,
          opacity: 0,
        }}>🦇</div>
      ))}
      <style>{`
        @keyframes bat-dark {
          0% { opacity: 0; }
          30% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes bat-signal {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0); }
          30% { opacity: 1; transform: translate(-50%,-50%) scale(1.2); }
          70% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(0.8); }
        }
        @keyframes bat-fly {
          0% { opacity: 0; transform: translateX(0) translateY(0) scaleX(-1); }
          10% { opacity: 0.8; }
          50% { transform: translateX(50vw) translateY(${Math.random() > 0.5 ? '-' : ''}15vh) scaleX(-1); opacity: 0.6; }
          100% { transform: translateX(110vw) translateY(${Math.random() > 0.5 ? '-' : ''}30vh) scaleX(-1); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// 🛡️ Shield — Captain America bouclier qui rebondit
function ShieldAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 3000); return () => clearTimeout(t) }, [])
  if (!active) return null
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        fontSize: '5rem',
        animation: 'shield-bounce 2.5s ease-in-out forwards',
      }}>🛡️</div>
      {/* Impact sparks */}
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          position: 'absolute', fontSize: '2rem',
          animation: `shield-spark 0.4s ${0.5 + i * 0.5}s ease-out forwards`,
          opacity: 0,
        }}>💥</div>
      ))}
      <style>{`
        @keyframes shield-bounce {
          0% { left: -10%; top: 50%; transform: rotate(0deg); }
          15% { left: 25%; top: 30%; transform: rotate(360deg); }
          20% { left: 25%; top: 30%; transform: rotate(400deg) scale(0.9); }
          35% { left: 60%; top: 60%; transform: rotate(720deg); }
          40% { left: 60%; top: 60%; transform: rotate(760deg) scale(0.9); }
          55% { left: 35%; top: 20%; transform: rotate(1080deg); }
          60% { left: 35%; top: 20%; transform: rotate(1120deg) scale(0.9); }
          80% { left: 80%; top: 40%; transform: rotate(1440deg); }
          100% { left: 110%; top: 30%; transform: rotate(1800deg); opacity: 0; }
        }
        @keyframes shield-spark {
          0% { opacity: 0; transform: scale(0); left: 25%; top: 30%; }
          50% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(0.5); }
        }
      `}</style>
    </div>
  )
}

// 💫 Thanos Snap — particles dissolve
function SnapAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 4000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: 30 + Math.random() * 40,
    y: 20 + Math.random() * 60,
    size: 3 + Math.random() * 8,
    delay: 0.5 + Math.random() * 1.5,
    dx: (Math.random() - 0.5) * 200,
    dy: (Math.random() - 0.5) * 200,
    color: ['#f97316', '#eab308', '#8b5cf6', '#ef4444', '#ec4899'][Math.floor(Math.random() * 5)],
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Gauntlet snap */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        fontSize: '6rem',
        animation: 'snap-hand 1.5s ease-out forwards',
        transform: 'translate(-50%,-50%)',
      }}>🫰</div>
      {/* Dissolving particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: `${p.size}px`, height: `${p.size}px`,
          borderRadius: '50%',
          backgroundColor: p.color,
          animation: `snap-dissolve 2s ${p.delay}s ease-out forwards`,
          opacity: 0,
          '--dx': `${p.dx}px`,
          '--dy': `${p.dy}px`,
        }} />
      ))}
      {/* Flash */}
      <div style={{
        position: 'absolute', inset: 0,
        animation: 'snap-flash 0.5s 0.3s ease-out forwards',
        opacity: 0,
      }} />
      <style>{`
        @keyframes snap-hand {
          0% { transform: translate(-50%,-50%) scale(0) rotate(-30deg); opacity: 0; }
          30% { transform: translate(-50%,-50%) scale(1.3) rotate(0deg); opacity: 1; }
          50% { transform: translate(-50%,-50%) scale(1) rotate(5deg); }
          100% { transform: translate(-50%,-50%) scale(0.5); opacity: 0; }
        }
        @keyframes snap-dissolve {
          0% { opacity: 1; transform: translate(0,0) scale(1); }
          100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0); }
        }
        @keyframes snap-flash {
          0% { opacity: 0; background: transparent; }
          50% { opacity: 1; background: rgba(234,179,8,0.15); }
          100% { opacity: 0; background: transparent; }
        }
      `}</style>
    </div>
  )
}

// ✨ Force — Star Wars force push
function ForceAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 3000); return () => clearTimeout(t) }, [])
  if (!active) return null
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Force wave rings */}
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: 'absolute', top: '45%', left: '50%',
          width: '10px', height: '10px',
          borderRadius: '50%',
          border: '2px solid rgba(100,200,255,0.4)',
          animation: `force-wave 1.5s ${i * 0.3}s ease-out forwards`,
          transform: 'translate(-50%,-50%)',
          opacity: 0,
        }} />
      ))}
      {/* Lightsaber */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        fontSize: '5rem',
        animation: 'saber-appear 2s ease-out forwards',
        transform: 'translate(-50%,-50%)',
        opacity: 0,
        filter: 'drop-shadow(0 0 20px rgba(100,200,255,0.8))',
      }}>⚔️</div>
      {/* Stars pushed away */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * 360
        const rad = angle * Math.PI / 180
        return (
          <div key={i} style={{
            position: 'absolute', top: '45%', left: '50%',
            fontSize: '1.2rem',
            animation: `force-push 1.5s ${0.3 + i * 0.05}s ease-out forwards`,
            opacity: 0,
            '--dx': `${Math.cos(rad) * 50}vw`,
            '--dy': `${Math.sin(rad) * 50}vh`,
          }}>✨</div>
        )
      })}
      <style>{`
        @keyframes force-wave {
          0% { width: 10px; height: 10px; opacity: 0.8; }
          100% { width: 120vw; height: 120vw; opacity: 0; }
        }
        @keyframes saber-appear {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0) rotate(-90deg); }
          30% { opacity: 1; transform: translate(-50%,-50%) scale(1.3) rotate(20deg); }
          50% { transform: translate(-50%,-50%) scale(1) rotate(0deg); }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(0.5) rotate(-30deg); }
        }
        @keyframes force-push {
          0% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3); }
        }
      `}</style>
    </div>
  )
}

// 💚 Matrix — green characters rain down
function MatrixAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 4000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789'
  const columns = Array.from({ length: 30 }, (_, i) => ({
    id: i, x: (i / 30) * 100, delay: Math.random() * 2, speed: 2 + Math.random() * 3,
    chars: Array.from({ length: 15 }, () => chars[Math.floor(Math.random() * chars.length)]),
    opacity: 0.3 + Math.random() * 0.7,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden', background: 'rgba(0,0,0,0.3)' }}>
      {columns.map(col => (
        <div key={col.id} style={{ position: 'absolute', left: `${col.x}%`, top: '-20%', display: 'flex', flexDirection: 'column', gap: '2px', animation: `matrix-fall ${col.speed}s ${col.delay}s linear forwards`, opacity: 0 }}>
          {col.chars.map((c, j) => (
            <span key={j} style={{ color: j === 0 ? '#fff' : `rgba(0,255,65,${col.opacity - j * 0.04})`, fontSize: '14px', fontFamily: 'monospace', textShadow: j === 0 ? '0 0 10px #0f0' : '0 0 5px rgba(0,255,65,0.3)' }}>{c}</span>
          ))}
        </div>
      ))}
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', gap: '30px', animation: 'matrix-pills 2s 0.5s ease-out forwards', opacity: 0 }}>
        <span style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px rgba(255,0,0,0.8))' }}>🔴</span>
        <span style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px rgba(0,100,255,0.8))' }}>🔵</span>
      </div>
      <style>{`
        @keyframes matrix-fall { 0% { top: -20%; opacity: 1; } 100% { top: 110%; opacity: 0; } }
        @keyframes matrix-pills { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0); } 50% { opacity: 1; transform: translate(-50%,-50%) scale(1.2); } 100% { opacity: 0; transform: translate(-50%,-50%) scale(0.8); } }
      `}</style>
    </div>
  )
}

// 🎆 Firework — multi-color bursts
function FireworkAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 3500); return () => clearTimeout(t) }, [])
  if (!active) return null
  const fireworks = [
    { x: 25, y: 30, delay: 0, color: '#ff6b6b' }, { x: 60, y: 25, delay: 0.4, color: '#ffd93d' },
    { x: 40, y: 40, delay: 0.8, color: '#6bcb77' }, { x: 75, y: 35, delay: 1.2, color: '#4d96ff' }, { x: 50, y: 20, delay: 0.6, color: '#ff6bcb' },
  ]
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {fireworks.map((fw, fi) => (
        <div key={fi} style={{ position: 'absolute', left: `${fw.x}%`, top: `${fw.y}%` }}>
          <div style={{ position: 'absolute', width: '3px', height: '60px', background: `linear-gradient(to top, transparent, ${fw.color})`, left: '50%', bottom: 0, transform: 'translateX(-50%)', animation: `fw-trail 0.4s ${fw.delay}s ease-out forwards`, opacity: 0 }} />
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2; const d = 60 + Math.random() * 80
            return <div key={i} style={{ position: 'absolute', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: fw.color, boxShadow: `0 0 6px ${fw.color}`, animation: `fw-burst 1.2s ${fw.delay + 0.4}s ease-out forwards`, opacity: 0, '--dx': `${Math.cos(a) * d}px`, '--dy': `${Math.sin(a) * d}px` }} />
          })}
        </div>
      ))}
      <style>{`
        @keyframes fw-trail { 0% { opacity: 0; transform: translateX(-50%) translateY(200px); } 80% { opacity: 1; } 100% { opacity: 0; transform: translateX(-50%) translateY(0); } }
        @keyframes fw-burst { 0% { opacity: 1; transform: translate(0,0) scale(1); } 100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.2); } }
      `}</style>
    </div>
  )
}

// 🌪️ Tornado — spinning vortex with debris
function TornadoAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 3500); return () => clearTimeout(t) }, [])
  if (!active) return null
  const debris = ['🏠', '🚗', '🐄', '🌳', '📦', '🪑', '🎒', '📱', '👟', '🧢']
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '20px', height: '100%', animation: 'tornado-sway 2s ease-in-out infinite' }}>
        {[0,1,2,3,4,5,6,7].map(i => (
          <div key={i} style={{ position: 'absolute', bottom: `${i*12}%`, left: '50%', width: `${20+i*25}px`, height: `${20+i*25}px`, borderRadius: '50%', border: `2px solid rgba(150,150,150,${0.5-i*0.05})`, transform: 'translateX(-50%)', animation: `tornado-spin ${0.5+i*0.15}s linear infinite` }} />
        ))}
      </div>
      {debris.map((d, i) => (
        <div key={i} style={{ position: 'absolute', fontSize: '2rem', left: `${30+Math.random()*40}%`, bottom: `${10+Math.random()*60}%`, animation: `tornado-debris ${1.5+Math.random()}s ${Math.random()*1.5}s ease-in-out forwards`, opacity: 0 }}>{d}</div>
      ))}
      <style>{`
        @keyframes tornado-sway { 0%,100% { transform: translateX(-50%) rotate(-3deg); } 50% { transform: translateX(-40%) rotate(3deg); } }
        @keyframes tornado-spin { from { transform: translateX(-50%) rotate(0deg); } to { transform: translateX(-50%) rotate(360deg); } }
        @keyframes tornado-debris { 0% { opacity: 0; transform: translate(0,0) rotate(0deg); } 20% { opacity: 1; } 100% { opacity: 0; transform: translate(100px, -300px) rotate(720deg) scale(0.3); } }
      `}</style>
    </div>
  )
}

// 🌊 Ocean — waves with sea creatures
function OceanAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 4000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const creatures = ['🐠','🐟','🦈','🐙','🐳','🦀','🐚','🪸','🐡','🦑']
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,100,200,0) 40%, rgba(0,100,200,0.15) 60%, rgba(0,50,150,0.25) 100%)', animation: 'ocean-fade 3.5s ease-in-out forwards' }} />
      {[0,1,2].map(i => <div key={i} style={{ position: 'absolute', bottom: `${45+i*5}%`, left: '-5%', width: '110%', height: '30px', borderRadius: '50% 50% 0 0', background: `rgba(0,${120+i*30},${200+i*20},${0.15-i*0.03})`, animation: `ocean-wave 2s ${i*0.3}s ease-in-out infinite` }} />)}
      {creatures.map((c, i) => <div key={i} style={{ position: 'absolute', fontSize: `${1.5+Math.random()}rem`, left: '-10%', top: `${50+Math.random()*40}%`, animation: `ocean-swim ${3+Math.random()*2}s ${Math.random()*2}s ease-in-out forwards`, opacity: 0 }}>{c}</div>)}
      <div style={{ position: 'absolute', fontSize: '5rem', right: '-10%', top: '55%', animation: 'ocean-whale 4s 0.5s ease-in-out forwards', opacity: 0 }}>🐋</div>
      <style>{`
        @keyframes ocean-fade { 0% { opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes ocean-wave { 0%,100% { transform: translateX(0) translateY(0); } 50% { transform: translateX(15px) translateY(-10px); } }
        @keyframes ocean-swim { 0% { left: -10%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { left: 110%; opacity: 0; } }
        @keyframes ocean-whale { 0% { right: -10%; opacity: 0; } 15% { opacity: 1; } 50% { right: 40%; } 85% { opacity: 1; } 100% { right: 110%; opacity: 0; } }
      `}</style>
    </div>
  )
}

// 🚀 Rocket — launch with flames and stars
function RocketAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 3000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const stars = Array.from({ length: 20 }, (_, i) => ({ id: i, x: Math.random()*100, y: Math.random()*100, size: 0.8+Math.random()*1.5, delay: Math.random() }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {stars.map(s => <div key={s.id} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, fontSize: `${s.size}rem`, animation: `rocket-star 1.5s ${s.delay}s linear forwards`, opacity: 0 }}>⭐</div>)}
      <div style={{ position: 'absolute', bottom: '-10%', left: '50%', fontSize: '5rem', animation: 'rocket-launch 2s 0.3s ease-in forwards', transform: 'translateX(-50%)' }}>🚀</div>
      {[0,1,2,3,4].map(i => <div key={i} style={{ position: 'absolute', bottom: '-15%', left: `${48+Math.random()*4}%`, fontSize: '3rem', animation: `rocket-flame 2s ${0.3+i*0.15}s ease-in forwards`, opacity: 0 }}>{['🔥','💨','☁️'][i%3]}</div>)}
      <style>{`
        @keyframes rocket-launch { 0% { bottom: -10%; } 60% { bottom: 50%; } 100% { bottom: 120%; } }
        @keyframes rocket-flame { 0% { opacity: 1; bottom: -15%; } 50% { opacity: 0.8; bottom: 30%; } 100% { opacity: 0; bottom: -20%; transform: scale(2); } }
        @keyframes rocket-star { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(300px); } }
      `}</style>
    </div>
  )
}

// 🪩 Disco — rotating mirror ball with color beams
function DiscoAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 3500); return () => clearTimeout(t) }, [])
  if (!active) return null
  const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6bcb','#a855f7','#f97316']
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', animation: 'disco-dark 3s ease-in-out forwards' }} />
      <div style={{ position: 'absolute', top: '5%', left: '50%', fontSize: '5rem', transform: 'translateX(-50%)', animation: 'disco-ball 1s linear infinite', filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.5))' }}>🪩</div>
      {colors.map((c, i) => <div key={i} style={{ position: 'absolute', top: '15%', left: '50%', width: '4px', height: '120vh', background: `linear-gradient(to bottom, ${c}, transparent 70%)`, transformOrigin: 'top center', transform: `rotate(${-60+i*20}deg)`, animation: `disco-beam 2s ${i*0.2}s ease-in-out infinite alternate`, opacity: 0.4 }} />)}
      {['💃','🕺','💃','🕺'].map((e, i) => <div key={i} style={{ position: 'absolute', bottom: '10%', left: `${15+i*22}%`, fontSize: '3rem', animation: `disco-dance 0.5s ${i*0.1}s ease-in-out infinite alternate` }}>{e}</div>)}
      <style>{`
        @keyframes disco-dark { 0% { opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes disco-ball { from { transform: translateX(-50%) rotate(0deg); } to { transform: translateX(-50%) rotate(360deg); } }
        @keyframes disco-beam { from { opacity: 0.2; } to { opacity: 0.6; } }
        @keyframes disco-dance { from { transform: translateY(0) scaleX(1); } to { transform: translateY(-20px) scaleX(-1); } }
      `}</style>
    </div>
  )
}

// 💥 Explosion — boom with shockwave
function ExplosionAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 2500); return () => clearTimeout(t) }, [])
  if (!active) return null
  const shrapnel = Array.from({ length: 25 }, (_, i) => {
    const a = (i/25)*Math.PI*2
    return { id: i, dx: Math.cos(a)*(100+Math.random()*150), dy: Math.sin(a)*(100+Math.random()*150), emoji: ['💥','🔥','✨','💫','⚡'][i%5], delay: Math.random()*0.2 }
  })
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, animation: 'explode-flash 0.5s ease-out forwards' }} />
      {[0,1,2].map(i => <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', width: '10px', height: '10px', borderRadius: '50%', border: `3px solid rgba(255,${150+i*30},0,0.5)`, animation: `explode-ring 1s ${i*0.15}s ease-out forwards`, transform: 'translate(-50%,-50%)' }} />)}
      {shrapnel.map(s => <div key={s.id} style={{ position: 'absolute', top: '50%', left: '50%', fontSize: '1.5rem', animation: `explode-frag 1s ${s.delay}s ease-out forwards`, opacity: 0, '--dx': `${s.dx}px`, '--dy': `${s.dy}px` }}>{s.emoji}</div>)}
      <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '5rem', animation: 'explode-boom 0.8s 0.1s ease-out forwards', opacity: 0 }}>💥</div>
      <style>{`
        @keyframes explode-flash { 0% { background: rgba(255,200,0,0.6); } 30% { background: rgba(255,255,255,0.4); } 100% { background: transparent; } }
        @keyframes explode-ring { 0% { width: 10px; height: 10px; opacity: 1; } 100% { width: 150vw; height: 150vw; opacity: 0; } }
        @keyframes explode-frag { 0% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3) rotate(360deg); } }
        @keyframes explode-boom { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0); } 30% { opacity: 1; transform: translate(-50%,-50%) scale(2); } 100% { opacity: 0; transform: translate(-50%,-50%) scale(0.5); } }
      `}</style>
    </div>
  )
}

// 🌀 Portal — swirling interdimensional portal
function PortalAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 3500); return () => clearTimeout(t) }, [])
  if (!active) return null
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{ position: 'absolute', top: '45%', left: '50%', width: `${80+i*40}px`, height: `${80+i*40}px`, borderRadius: '50%', border: `3px solid rgba(${168-i*20},85,${247-i*10},${0.8-i*0.12})`, boxShadow: `0 0 ${10+i*5}px rgba(168,85,247,0.3), inset 0 0 ${10+i*5}px rgba(168,85,247,0.1)`, transform: 'translate(-50%,-50%)', animation: `portal-spin ${2+i*0.3}s linear infinite${i%2 ? ' reverse' : ''}`, opacity: 0 }}>
          <div style={{ position: 'absolute', top: '-5px', left: '50%', width: '10px', height: '10px', borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 10px #a855f7' }} />
        </div>
      ))}
      <div style={{ position: 'absolute', top: '45%', left: '50%', width: '60px', height: '60px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)', transform: 'translate(-50%,-50%)', animation: 'portal-glow 1s ease-in-out infinite alternate' }} />
      {Array.from({ length: 15 }, (_, i) => { const a = (i/15)*Math.PI*2; const d = 200+Math.random()*100; return <div key={i} style={{ position: 'absolute', top: '45%', left: '50%', fontSize: '1rem', animation: `portal-pull 2s ${i*0.1}s ease-in forwards`, opacity: 0, '--sx': `${Math.cos(a)*d}px`, '--sy': `${Math.sin(a)*d}px` }}>✨</div> })}
      <style>{`
        @keyframes portal-spin { 0% { transform: translate(-50%,-50%) rotate(0deg); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translate(-50%,-50%) rotate(360deg); opacity: 0; } }
        @keyframes portal-glow { from { transform: translate(-50%,-50%) scale(1); } to { transform: translate(-50%,-50%) scale(1.5); } }
        @keyframes portal-pull { 0% { opacity: 1; transform: translate(calc(-50% + var(--sx)), calc(-50% + var(--sy))) scale(1); } 100% { opacity: 0; transform: translate(-50%,-50%) scale(0) rotate(360deg); } }
      `}</style>
    </div>
  )
}

// 🌊 Tsunami — massive wave crashes across screen
function TsunamiAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 4500); return () => clearTimeout(t) }, [])
  if (!active) return null
  const droplets = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    x: 20 + Math.random() * 70,
    y: 10 + Math.random() * 60,
    delay: 1.2 + Math.random() * 1.5,
    size: 0.8 + Math.random() * 1.5,
    emoji: ['💧', '💦', '🫧', '🌊'][Math.floor(Math.random() * 4)],
    dx: Math.random() * 200 - 100,
    dy: Math.random() * -150 - 50,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Dark water tint */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,40,80,0) 30%, rgba(0,60,120,0.2) 70%, rgba(0,30,80,0.35) 100%)', animation: 'tsunami-tint 4s ease-in-out forwards' }} />
      {/* The massive wave */}
      <div style={{ position: 'absolute', left: '-120%', top: '15%', width: '200%', height: '85%', animation: 'tsunami-wave 2.5s 0.3s cubic-bezier(0.2, 0.8, 0.3, 1) forwards' }}>
        {/* Wave crest with foam */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} viewBox="0 0 1000 600" preserveAspectRatio="none">
          <path d="M0,200 Q100,50 200,150 Q300,250 400,100 Q500,0 600,120 Q700,200 800,80 Q900,0 1000,150 L1000,600 L0,600 Z" fill="rgba(0,100,180,0.35)" />
          <path d="M0,250 Q150,100 300,200 Q450,300 600,170 Q750,80 900,200 L1000,250 L1000,600 L0,600 Z" fill="rgba(0,80,160,0.25)" />
        </svg>
        {/* Foam line at top of wave */}
        <div style={{ position: 'absolute', top: '5%', left: '30%', width: '50%', height: '40px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), rgba(200,230,255,0.3), transparent)', borderRadius: '50%', animation: 'tsunami-foam 0.8s ease-in-out infinite alternate', filter: 'blur(3px)' }} />
      </div>
      {/* Water droplets scatter after impact */}
      {droplets.map(d => (
        <div key={d.id} style={{
          position: 'absolute', fontSize: `${d.size}rem`,
          left: `${d.x}%`, top: `${d.y}%`,
          animation: `tsunami-droplet 1.5s ${d.delay}s ease-out forwards`,
          opacity: 0,
          '--dx': `${d.dx}px`, '--dy': `${d.dy}px`,
        }}>{d.emoji}</div>
      ))}
      {/* Big splash text */}
      <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '6rem', animation: 'tsunami-splash 1s 1.5s ease-out forwards', opacity: 0 }}>🌊</div>
      <style>{`
        @keyframes tsunami-tint { 0% { opacity: 0; } 25% { opacity: 1; } 75% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes tsunami-wave { 0% { left: -120%; } 40% { left: -20%; } 100% { left: 120%; } }
        @keyframes tsunami-foam { 0% { opacity: 0.3; transform: scaleX(0.9); } 100% { opacity: 0.6; transform: scaleX(1.1); } }
        @keyframes tsunami-droplet { 0% { opacity: 1; transform: translate(0,0) scale(1); } 100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.3); } }
        @keyframes tsunami-splash { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0) rotate(-20deg); } 40% { opacity: 1; transform: translate(-50%,-50%) scale(1.5) rotate(10deg); } 100% { opacity: 0; transform: translate(-50%,-50%) scale(0.6) translateY(-60px); } }
      `}</style>
    </div>
  )
}

// 🌋 Volcano — eruption with lava particles and ash cloud
function VolcanoAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 4500); return () => clearTimeout(t) }, [])
  if (!active) return null
  const lavaParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    dx: (Math.random() - 0.5) * 300,
    dy: -(150 + Math.random() * 350),
    delay: 0.8 + Math.random() * 1.2,
    size: 4 + Math.random() * 10,
    color: ['#ff4500', '#ff6a00', '#ff8c00', '#ffd700', '#ff2200'][Math.floor(Math.random() * 5)],
    duration: 1.5 + Math.random() * 1.5,
  }))
  const ashParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 30 + Math.random() * 40,
    delay: 1.5 + Math.random() * 1.5,
    dx: (Math.random() - 0.5) * 200,
    size: 3 + Math.random() * 6,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Red/orange glow from below */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(255,69,0,0.2) 0%, transparent 60%)', animation: 'volcano-glow 4s ease-in-out forwards' }} />
      {/* Mountain silhouette */}
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', fontSize: '8rem', animation: 'volcano-shake 0.3s 0.5s ease-in-out 6' }}>🌋</div>
      {/* Lava particles shooting up */}
      {lavaParticles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', bottom: '12%', left: '50%',
          width: `${p.size}px`, height: `${p.size}px`,
          borderRadius: '50%',
          backgroundColor: p.color,
          boxShadow: `0 0 ${p.size}px ${p.color}`,
          animation: `volcano-lava ${p.duration}s ${p.delay}s ease-out forwards`,
          opacity: 0,
          '--dx': `${p.dx}px`, '--dy': `${p.dy}px`,
        }} />
      ))}
      {/* Ash cloud expanding at top */}
      <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: '50px', height: '50px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(80,80,80,0.6) 0%, rgba(60,60,60,0.3) 50%, transparent 100%)', animation: 'volcano-ash-cloud 2.5s 1.5s ease-out forwards', opacity: 0 }} />
      {/* Small ash particles falling */}
      {ashParticles.map(a => (
        <div key={a.id} style={{
          position: 'absolute', top: '10%', left: `${a.x}%`,
          width: `${a.size}px`, height: `${a.size}px`,
          borderRadius: '50%',
          backgroundColor: `rgba(100,100,100,${0.3 + Math.random() * 0.4})`,
          animation: `volcano-ash-fall 2s ${a.delay}s ease-in forwards`,
          opacity: 0,
          '--dx': `${a.dx}px`,
        }} />
      ))}
      {/* ERUPTION text */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '2rem', fontWeight: 900, color: '#ff4500', textShadow: '0 0 20px rgba(255,69,0,0.8), 0 0 40px rgba(255,69,0,0.4)', whiteSpace: 'nowrap', animation: 'volcano-text 1.5s 1s ease-out forwards', opacity: 0 }}>
        ERUPTION !
      </div>
      <style>{`
        @keyframes volcano-glow { 0% { opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes volcano-shake { 0%, 100% { transform: translateX(-50%) rotate(0deg); } 25% { transform: translateX(-48%) rotate(-2deg); } 75% { transform: translateX(-52%) rotate(2deg); } }
        @keyframes volcano-lava { 0% { opacity: 1; transform: translate(-50%, 0) scale(1); } 60% { opacity: 0.8; } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), var(--dy)) scale(0.2); } }
        @keyframes volcano-ash-cloud { 0% { opacity: 0; width: 50px; height: 50px; } 40% { opacity: 0.6; } 100% { opacity: 0; width: 80vw; height: 80vw; } }
        @keyframes volcano-ash-fall { 0% { opacity: 0.6; transform: translateY(0) translateX(0); } 100% { opacity: 0; transform: translateY(80vh) translateX(var(--dx)); } }
        @keyframes volcano-text { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0.3); } 40% { opacity: 1; transform: translate(-50%,-50%) scale(1.3); } 70% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 100% { opacity: 0; transform: translate(-50%,-50%) scale(0.8) translateY(-30px); } }
      `}</style>
    </div>
  )
}

// 🕳️ BlackHole — singularity warping with spiraling particles
function BlackHoleAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 4500); return () => clearTimeout(t) }, [])
  if (!active) return null
  const spiralParticles = Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * Math.PI * 4
    const dist = 150 + Math.random() * 250
    return {
      id: i,
      sx: Math.cos(angle) * dist,
      sy: Math.sin(angle) * dist,
      delay: i * 0.05,
      size: 2 + Math.random() * 5,
      color: ['#a855f7', '#7c3aed', '#6366f1', '#818cf8', '#c084fc', '#f472b6', '#fbbf24'][Math.floor(Math.random() * 7)],
      duration: 2 + Math.random() * 1.5,
    }
  })
  const stretchLines = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2
    return { id: i, angle: angle * (180 / Math.PI), delay: 0.5 + i * 0.1 }
  })
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Dark vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 45%, transparent 5%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.6) 100%)', animation: 'bh-darken 4s ease-in-out forwards' }} />
      {/* Accretion disk rings */}
      {[0,1,2,3].map(i => (
        <div key={i} style={{
          position: 'absolute', top: '45%', left: '50%',
          width: `${60 + i * 40}px`, height: `${20 + i * 12}px`,
          borderRadius: '50%',
          border: `2px solid rgba(168,85,247,${0.6 - i * 0.12})`,
          boxShadow: `0 0 ${8 + i * 4}px rgba(168,85,247,${0.3 - i * 0.05}), inset 0 0 ${5 + i * 3}px rgba(168,85,247,0.1)`,
          transform: 'translate(-50%,-50%) rotateX(70deg)',
          animation: `bh-disk ${1.5 + i * 0.4}s ${0.3 + i * 0.1}s linear infinite`,
          opacity: 0,
        }} />
      ))}
      {/* Central singularity */}
      <div style={{
        position: 'absolute', top: '45%', left: '50%',
        width: '30px', height: '30px', borderRadius: '50%',
        background: 'radial-gradient(circle, #000 60%, rgba(168,85,247,0.3) 100%)',
        boxShadow: '0 0 30px rgba(0,0,0,0.8), 0 0 60px rgba(168,85,247,0.3)',
        transform: 'translate(-50%,-50%)',
        animation: 'bh-singularity 4s ease-in-out forwards',
      }} />
      {/* Spaghettification stretch lines */}
      {stretchLines.map(s => (
        <div key={s.id} style={{
          position: 'absolute', top: '45%', left: '50%',
          width: '2px', height: '100px',
          background: `linear-gradient(to bottom, transparent, rgba(168,85,247,0.4), transparent)`,
          transformOrigin: 'top center',
          transform: `translate(-50%, 0) rotate(${s.angle}deg)`,
          animation: `bh-stretch 2s ${s.delay}s ease-in forwards`,
          opacity: 0,
        }} />
      ))}
      {/* Spiraling particles being sucked in */}
      {spiralParticles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', top: '45%', left: '50%',
          width: `${p.size}px`, height: `${p.size}px`,
          borderRadius: '50%',
          backgroundColor: p.color,
          boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          animation: `bh-spiral ${p.duration}s ${p.delay}s ease-in forwards`,
          opacity: 0,
          '--sx': `${p.sx}px`, '--sy': `${p.sy}px`,
        }} />
      ))}
      <style>{`
        @keyframes bh-darken { 0% { opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes bh-disk { 0% { transform: translate(-50%,-50%) rotateX(70deg) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translate(-50%,-50%) rotateX(70deg) rotate(360deg); opacity: 0; } }
        @keyframes bh-singularity { 0% { transform: translate(-50%,-50%) scale(0); } 20% { transform: translate(-50%,-50%) scale(1); } 80% { transform: translate(-50%,-50%) scale(1.2); } 100% { transform: translate(-50%,-50%) scale(0); } }
        @keyframes bh-stretch { 0% { opacity: 0; height: 0; } 50% { opacity: 0.6; height: 200px; } 100% { opacity: 0; height: 0; } }
        @keyframes bh-spiral { 0% { opacity: 1; transform: translate(calc(-50% + var(--sx)), calc(-50% + var(--sy))) scale(1); } 70% { opacity: 0.8; } 100% { opacity: 0; transform: translate(-50%,-50%) scale(0) rotate(720deg); } }
      `}</style>
    </div>
  )
}

// 🦋 Butterfly — colorful butterflies flutter across screen
function ButterflyAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 5000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const butterflies = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    startX: -10 + Math.random() * 30,
    startY: 20 + Math.random() * 60,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2.5,
    size: 1.8 + Math.random() * 2,
    sineAmp: 30 + Math.random() * 50,
    sineFreq: 2 + Math.random() * 3,
  }))
  const flowers = ['🌸', '🌺', '🌻', '🌷', '🌼', '💐']
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Soft green/spring tint */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 80%, rgba(144,238,144,0.08) 0%, transparent 70%)', animation: 'butterfly-tint 4.5s ease-in-out forwards' }} />
      {/* Butterflies */}
      {butterflies.map(b => (
        <div key={b.id} style={{
          position: 'absolute',
          left: `${b.startX}%`,
          top: `${b.startY}%`,
          fontSize: `${b.size}rem`,
          animation: `butterfly-fly-${b.id} ${b.duration}s ${b.delay}s ease-in-out forwards`,
          opacity: 0,
        }}>
          <div style={{ animation: `butterfly-flap 0.3s ease-in-out infinite alternate` }}>
            🦋
          </div>
        </div>
      ))}
      {/* A few flowers popping up at the bottom */}
      {flowers.map((f, i) => (
        <div key={i} style={{
          position: 'absolute',
          bottom: '5%',
          left: `${8 + i * 16}%`,
          fontSize: '2.5rem',
          animation: `butterfly-flower 1s ${0.5 + i * 0.2}s ease-out forwards`,
          opacity: 0,
        }}>{f}</div>
      ))}
      <style>{`
        @keyframes butterfly-tint { 0% { opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes butterfly-flap { 0% { transform: scaleX(1) rotate(-5deg); } 100% { transform: scaleX(0.3) rotate(5deg); } }
        @keyframes butterfly-flower { 0% { opacity: 0; transform: translateY(30px) scale(0); } 60% { opacity: 1; transform: translateY(-10px) scale(1.2); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        ${butterflies.map(b => `
          @keyframes butterfly-fly-${b.id} {
            0% { left: ${b.startX}%; top: ${b.startY}%; opacity: 0; }
            10% { opacity: 1; }
            25% { left: ${b.startX + 25}%; top: ${b.startY + Math.sin(1) * 15}%; }
            50% { left: ${b.startX + 55}%; top: ${b.startY + Math.sin(2.5) * 20}%; }
            75% { left: ${b.startX + 80}%; top: ${b.startY + Math.sin(4) * 15}%; }
            90% { opacity: 1; }
            100% { left: ${b.startX + 110}%; top: ${b.startY + Math.sin(5.5) * 10}%; opacity: 0; }
          }
        `).join('')}
      `}</style>
    </div>
  )
}

// 🎰 Casino — slot machine with jackpot coins
function CasinoAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 4500); return () => clearTimeout(t) }, [])
  if (!active) return null
  const slotEmojis = ['🍒', '🍋', '7️⃣', '💎', '🍀', '⭐', '🔔']
  const col1 = Array.from({ length: 8 }, () => slotEmojis[Math.floor(Math.random() * slotEmojis.length)])
  const col2 = Array.from({ length: 8 }, () => slotEmojis[Math.floor(Math.random() * slotEmojis.length)])
  const col3 = Array.from({ length: 8 }, () => slotEmojis[Math.floor(Math.random() * slotEmojis.length)])
  col1[col1.length - 1] = '7️⃣'; col2[col2.length - 1] = '7️⃣'; col3[col3.length - 1] = '7️⃣'
  const coins = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    delay: 2.5 + Math.random() * 1.5,
    duration: 1.5 + Math.random() * 1.5,
    size: 1 + Math.random() * 1.5,
    emoji: ['🪙', '💰', '💵', '🤑'][Math.floor(Math.random() * 4)],
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Dark overlay with sparkle */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.4) 100%)', animation: 'casino-dark 4s ease-in-out forwards' }} />
      {/* Slot machine frame */}
      <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', background: 'rgba(30,30,30,0.9)', borderRadius: '16px', padding: '15px 20px', border: '3px solid #ffd700', boxShadow: '0 0 30px rgba(255,215,0,0.4)', animation: 'casino-appear 0.8s ease-out forwards', opacity: 0 }}>
        {[col1, col2, col3].map((col, ci) => (
          <div key={ci} style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,215,0,0.3)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: `casino-spin-${ci} ${1.5 + ci * 0.4}s 0.5s cubic-bezier(0.2, 0, 0.2, 1) forwards` }}>
              {col.map((e, ei) => (
                <div key={ei} style={{ fontSize: '2.5rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', flexShrink: 0 }}>{e}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* JACKPOT text */}
      <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '3rem', fontWeight: 900, color: '#ffd700', textShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.4), 2px 2px 0 #b8860b', whiteSpace: 'nowrap', animation: 'casino-jackpot 1.5s 2.5s ease-out forwards', opacity: 0, letterSpacing: '8px' }}>
        JACKPOT !
      </div>
      {/* Falling coins */}
      {coins.map(c => (
        <div key={c.id} style={{
          position: 'absolute', top: '-5%', left: `${c.x}%`,
          fontSize: `${c.size}rem`,
          animation: `casino-coins ${c.duration}s ${c.delay}s ease-in forwards`,
          opacity: 0,
        }}>{c.emoji}</div>
      ))}
      <style>{`
        @keyframes casino-dark { 0% { opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes casino-appear { 0% { opacity: 0; transform: translateX(-50%) scale(0.5) rotate(-5deg); } 60% { transform: translateX(-50%) scale(1.05) rotate(1deg); } 100% { opacity: 1; transform: translateX(-50%) scale(1) rotate(0deg); } }
        @keyframes casino-spin-0 { 0% { transform: translateY(0); } 100% { transform: translateY(calc(-100% + 60px)); } }
        @keyframes casino-spin-1 { 0% { transform: translateY(0); } 100% { transform: translateY(calc(-100% + 60px)); } }
        @keyframes casino-spin-2 { 0% { transform: translateY(0); } 100% { transform: translateY(calc(-100% + 60px)); } }
        @keyframes casino-jackpot { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0.3); } 40% { opacity: 1; transform: translate(-50%,-50%) scale(1.4); } 60% { transform: translate(-50%,-50%) scale(1); } 80% { opacity: 1; } 100% { opacity: 0; transform: translate(-50%,-50%) scale(1.2) translateY(-20px); } }
        @keyframes casino-coins { 0% { opacity: 1; transform: translateY(0) rotate(0deg); } 100% { opacity: 0; transform: translateY(110vh) rotate(720deg); } }
      `}</style>
    </div>
  )
}

// 🥷 Ninja — smoke poof, shuriken, ninja slide
function NinjaAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 4000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const smokeParticles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    dx: (Math.random() - 0.5) * 200,
    dy: (Math.random() - 0.5) * 200,
    size: 20 + Math.random() * 40,
    delay: Math.random() * 0.3,
  }))
  const shurikenCorners = [
    { x: '10%', y: '10%' },
    { x: '90%', y: '10%' },
    { x: '10%', y: '85%' },
    { x: '90%', y: '85%' },
  ]
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Dark flash */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', animation: 'ninja-dark 0.6s ease-out forwards' }} />
      {/* Smoke poof at center */}
      {smokeParticles.map(s => (
        <div key={s.id} style={{
          position: 'absolute', top: '45%', left: '50%',
          width: `${s.size}px`, height: `${s.size}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(150,150,150,0.6) 0%, transparent 70%)`,
          animation: `ninja-smoke 1s ${s.delay}s ease-out forwards`,
          opacity: 0,
          '--dx': `${s.dx}px`, '--dy': `${s.dy}px`,
        }} />
      ))}
      {/* Shuriken flying to corners */}
      {shurikenCorners.map((corner, i) => (
        <div key={i} style={{
          position: 'absolute', top: '45%', left: '50%',
          fontSize: '2.5rem',
          color: '#c0c0c0',
          textShadow: '0 0 10px rgba(192,192,192,0.6)',
          animation: `ninja-shuriken-${i} 1s ${0.5 + i * 0.1}s ease-out forwards`,
          opacity: 0,
        }}>✦</div>
      ))}
      {/* Ninja sliding across */}
      <div style={{
        position: 'absolute', top: '40%', left: '-10%',
        fontSize: '5rem',
        animation: 'ninja-slide 1.5s 1.2s ease-in-out forwards',
        opacity: 0,
      }}>🥷</div>
      {/* Slash effect */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <line x1="20%" y1="30%" x2="80%" y2="60%"
          stroke="rgba(255,255,255,0.6)" strokeWidth="2"
          strokeLinecap="round"
          style={{ strokeDasharray: 2000, strokeDashoffset: 2000, animation: 'ninja-slash 0.4s 2s ease-out forwards', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))' }}
        />
      </svg>
      <style>{`
        @keyframes ninja-dark { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes ninja-smoke { 0% { opacity: 0.8; transform: translate(-50%,-50%) scale(0.5); } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(2); } }
        @keyframes ninja-shuriken-0 { 0% { opacity: 1; transform: translate(-50%,-50%) rotate(0deg); } 100% { opacity: 0; left: 10%; top: 10%; transform: rotate(1080deg) scale(0.5); } }
        @keyframes ninja-shuriken-1 { 0% { opacity: 1; transform: translate(-50%,-50%) rotate(0deg); } 100% { opacity: 0; left: 90%; top: 10%; transform: rotate(1080deg) scale(0.5); } }
        @keyframes ninja-shuriken-2 { 0% { opacity: 1; transform: translate(-50%,-50%) rotate(0deg); } 100% { opacity: 0; left: 10%; top: 85%; transform: rotate(1080deg) scale(0.5); } }
        @keyframes ninja-shuriken-3 { 0% { opacity: 1; transform: translate(-50%,-50%) rotate(0deg); } 100% { opacity: 0; left: 90%; top: 85%; transform: rotate(1080deg) scale(0.5); } }
        @keyframes ninja-slide { 0% { left: -10%; opacity: 0; } 15% { opacity: 1; } 50% { left: 45%; top: 40%; } 85% { opacity: 1; } 100% { left: 110%; top: 35%; opacity: 0; } }
        @keyframes ninja-slash { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  )
}

// 💖 Cascade de coeurs — easter egg Zarina
function HeartsZarinaAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 6000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const hearts = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    size: 1 + Math.random() * 3,
    duration: 2.5 + Math.random() * 2,
    wobble: (Math.random() - 0.5) * 60,
    emoji: ['❤️', '💖', '💗', '💕', '💓', '💘', '💝', '🩷'][Math.floor(Math.random() * 8)],
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Soft pink glow pulse */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 40%, rgba(255,105,180,0.15) 0%, transparent 70%)',
        animation: 'zarina-glow 2s ease-in-out 3 alternate',
      }} />
      {/* Central message */}
      <div style={{
        position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%,-50%)',
        fontSize: '2.5rem', textAlign: 'center',
        animation: 'zarina-text 5s 0.5s ease-out forwards', opacity: 0,
        textShadow: '0 0 20px rgba(255,105,180,0.6)',
        fontWeight: 'bold',
      }}>
        💖
        <div style={{ fontSize: '1.2rem', marginTop: '4px', color: '#ff69b4' }}>Zarina</div>
      </div>
      {/* Cascade of hearts */}
      {hearts.map(h => (
        <div key={h.id} style={{
          position: 'absolute',
          left: `${h.left}%`,
          top: '-50px',
          fontSize: `${h.size}rem`,
          animation: `zarina-fall ${h.duration}s ${h.delay}s ease-in forwards`,
          opacity: 0,
          '--wobble': `${h.wobble}px`,
        }}>
          {h.emoji}
        </div>
      ))}
      <style>{`
        @keyframes zarina-fall {
          0% { transform: translateY(0) translateX(0) rotate(0deg) scale(0.3); opacity: 0; }
          10% { opacity: 1; transform: translateY(10vh) translateX(calc(var(--wobble) * 0.3)) rotate(20deg) scale(1); }
          50% { opacity: 0.9; transform: translateY(50vh) translateX(var(--wobble)) rotate(180deg) scale(1.1); }
          100% { transform: translateY(110vh) translateX(calc(var(--wobble) * -0.5)) rotate(360deg) scale(0.6); opacity: 0; }
        }
        @keyframes zarina-glow {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes zarina-text {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.5); }
          20% { opacity: 1; transform: translate(-50%,-50%) scale(1.2); }
          30% { transform: translate(-50%,-50%) scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(0.8); }
        }
      `}</style>
    </div>
  )
}

// 💃 Dance party — easter egg Lucie
function DanceLucieAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 7000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const dancers = ['💃', '🕺', '💃', '🕺', '💃', '🕺', '💃']
  const notes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: 5 + Math.random() * 90,
    delay: Math.random() * 4,
    size: 1.2 + Math.random() * 1.5,
    emoji: ['🎵', '🎶', '✨', '🪩', '⭐'][Math.floor(Math.random() * 5)],
  }))
  const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff6600', '#ff0099', '#6600ff']
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Disco lights */}
      {colors.map((c, i) => (
        <div key={`light-${i}`} style={{
          position: 'absolute',
          top: '-20%', left: `${15 + i * 14}%`,
          width: '120px', height: '300%',
          background: `linear-gradient(180deg, ${c}44 0%, transparent 60%)`,
          transformOrigin: 'top center',
          animation: `lucie-light 1.5s ${i * 0.2}s ease-in-out infinite alternate`,
          opacity: 0.4,
        }} />
      ))}
      {/* Disco ball */}
      <div style={{
        position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)',
        fontSize: '4rem',
        animation: 'lucie-ball 2s ease-in-out infinite',
      }}>🪩</div>
      {/* Dancing emojis across the bottom */}
      <div style={{
        position: 'absolute', bottom: '8%', left: 0, right: 0,
        display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
        padding: '0 5%',
      }}>
        {dancers.map((d, i) => (
          <div key={`dancer-${i}`} style={{
            fontSize: `${2.5 + (i % 2) * 0.8}rem`,
            animation: `lucie-dance-${i % 2 === 0 ? 'a' : 'b'} ${0.5 + Math.random() * 0.3}s ${i * 0.1}s ease-in-out infinite alternate`,
            filter: `hue-rotate(${i * 50}deg)`,
          }}>
            {d}
          </div>
        ))}
      </div>
      {/* Central name */}
      <div style={{
        position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)',
        textAlign: 'center', animation: 'lucie-name 6s 0.3s ease-out forwards', opacity: 0,
      }}>
        <div style={{ fontSize: '3rem', animation: 'lucie-bounce 0.6s ease-in-out infinite alternate' }}>💃</div>
        <div style={{
          fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px',
          background: 'linear-gradient(90deg, #ff00ff, #00ffff, #ffff00, #ff00ff)',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'lucie-gradient 2s linear infinite',
        }}>Lucie</div>
      </div>
      {/* Floating notes */}
      {notes.map(n => (
        <div key={n.id} style={{
          position: 'absolute', left: `${n.left}%`, bottom: '15%',
          fontSize: `${n.size}rem`,
          animation: `lucie-note ${2 + Math.random()}s ${n.delay}s ease-out forwards`,
          opacity: 0,
        }}>{n.emoji}</div>
      ))}
      <style>{`
        @keyframes lucie-light {
          0% { transform: rotate(-15deg); opacity: 0.3; }
          100% { transform: rotate(15deg); opacity: 0.5; }
        }
        @keyframes lucie-ball {
          0%, 100% { transform: translateX(-50%) rotate(0deg) scale(1); }
          50% { transform: translateX(-50%) rotate(180deg) scale(1.1); }
        }
        @keyframes lucie-dance-a {
          0% { transform: translateY(0) rotate(-8deg) scale(1); }
          100% { transform: translateY(-30px) rotate(8deg) scale(1.15); }
        }
        @keyframes lucie-dance-b {
          0% { transform: translateY(-20px) rotate(10deg) scale(1.1); }
          100% { transform: translateY(0) rotate(-10deg) scale(1); }
        }
        @keyframes lucie-bounce {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-15px) scale(1.15); }
        }
        @keyframes lucie-name {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.3); }
          15% { opacity: 1; transform: translate(-50%,-50%) scale(1.1); }
          25% { transform: translate(-50%,-50%) scale(1); }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes lucie-gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @keyframes lucie-note {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          15% { opacity: 1; transform: translateY(-10vh) scale(1); }
          100% { transform: translateY(-60vh) translateX(${20 - Math.random() * 40}px) rotate(${Math.random() * 360}deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// 👩‍⚕️✈️ Infirmière en voyage — easter egg Meigan
function NurseTravelerAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 7000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const landmarks = ['🗼', '🗽', '🏯', '🕌', '🏝️', '🌋', '🎡']
  const clouds = Array.from({ length: 8 }, (_, i) => ({
    id: i, top: 5 + Math.random() * 25, size: 2 + Math.random() * 2, delay: Math.random() * 3, speed: 4 + Math.random() * 3,
  }))
  const sparkles = Array.from({ length: 15 }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100, delay: Math.random() * 5, size: 0.8 + Math.random() * 1,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Sky gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #1a0533 0%, #2d1b69 30%, #ff7eb3 70%, #ff758c 100%)',
        opacity: 0.4, animation: 'meigan-sky 7s ease-in-out forwards',
      }} />
      {/* Clouds drifting */}
      {clouds.map(c => (
        <div key={c.id} style={{
          position: 'absolute', top: `${c.top}%`, left: '-15%',
          fontSize: `${c.size}rem`, opacity: 0.7,
          animation: `meigan-cloud ${c.speed}s ${c.delay}s linear forwards`,
        }}>☁️</div>
      ))}
      {/* Landmarks scrolling by at the bottom */}
      <div style={{
        position: 'absolute', bottom: '5%', left: 0, right: 0, height: '80px',
        display: 'flex', alignItems: 'flex-end',
        animation: 'meigan-landmarks 6s 0.5s linear forwards',
        opacity: 0,
      }}>
        {landmarks.map((l, i) => (
          <div key={i} style={{
            fontSize: '3rem', marginLeft: `${8 + i * 12}%`, flexShrink: 0,
            animation: `meigan-landmark-bob 1.5s ${i * 0.2}s ease-in-out infinite alternate`,
          }}>{l}</div>
        ))}
      </div>
      {/* Nurse with suitcase flying across */}
      <div style={{
        position: 'absolute', top: '30%', left: '-15%',
        animation: 'meigan-fly 5s 0.8s ease-in-out forwards', opacity: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '3.5rem' }}>
          <span style={{ animation: 'meigan-wave 0.4s ease-in-out infinite alternate' }}>👩‍⚕️</span>
          <span>🧳</span>
          <span style={{ fontSize: '2rem' }}>✈️</span>
        </div>
      </div>
      {/* Central name */}
      <div style={{
        position: 'absolute', top: '55%', left: '50%',
        transform: 'translate(-50%,-50%)', textAlign: 'center',
        animation: 'meigan-name 6s 1s ease-out forwards', opacity: 0,
      }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#ff758c', textShadow: '0 0 15px rgba(255,117,140,0.5)' }}>
          Meigan 🌍
        </div>
        <div style={{ fontSize: '0.75rem', color: '#ffb6c1', marginTop: '4px' }}>off to see the world</div>
      </div>
      {/* Sparkles */}
      {sparkles.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.left}%`, top: `${s.top}%`,
          fontSize: `${s.size}rem`,
          animation: `meigan-sparkle 1.5s ${s.delay}s ease-in-out forwards`,
          opacity: 0,
        }}>✨</div>
      ))}
      <style>{`
        @keyframes meigan-sky {
          0% { opacity: 0; } 15% { opacity: 0.45; } 85% { opacity: 0.45; } 100% { opacity: 0; }
        }
        @keyframes meigan-cloud {
          0% { left: -15%; opacity: 0; } 10% { opacity: 0.7; } 90% { opacity: 0.7; } 100% { left: 110%; opacity: 0; }
        }
        @keyframes meigan-fly {
          0% { left: -15%; top: 35%; opacity: 0; }
          10% { opacity: 1; }
          30% { top: 25%; }
          50% { top: 35%; }
          70% { top: 28%; }
          90% { opacity: 1; }
          100% { left: 110%; top: 32%; opacity: 0; }
        }
        @keyframes meigan-wave {
          0% { transform: rotate(-5deg); }
          100% { transform: rotate(5deg); }
        }
        @keyframes meigan-landmarks {
          0% { opacity: 0; transform: translateX(10%); }
          15% { opacity: 0.8; }
          85% { opacity: 0.8; }
          100% { opacity: 0; transform: translateX(-80%); }
        }
        @keyframes meigan-landmark-bob {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
        @keyframes meigan-name {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.5); }
          15% { opacity: 1; transform: translate(-50%,-50%) scale(1.1); }
          25% { transform: translate(-50%,-50%) scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes meigan-sparkle {
          0% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
          100% { opacity: 0; transform: scale(0) rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// 🎤💜 K-pop fan — easter egg Noemie
function KpopNoemieAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 7000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const lightsticks = Array.from({ length: 25 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 3,
    color: ['#b388ff', '#ea80fc', '#80d8ff', '#ff80ab', '#ffe57f'][Math.floor(Math.random() * 5)],
  }))
  const hearts = Array.from({ length: 18 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: 0.5 + Math.random() * 4,
    emoji: ['💜', '💗', '🩷', '💫', '⭐'][Math.floor(Math.random() * 5)],
    size: 1 + Math.random() * 1.5,
  }))
  const members = ['🧑‍🎤', '👩‍🎤', '🧑‍🎤', '👩‍🎤', '🧑‍🎤']
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Stage lights */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(179,136,255,0.2) 0%, rgba(234,128,252,0.15) 50%, rgba(128,216,255,0.2) 100%)',
        animation: 'kpop-bg 7s ease-in-out forwards',
      }} />
      {/* Lightsticks waving */}
      {lightsticks.map(l => (
        <div key={l.id} style={{
          position: 'absolute', bottom: '0', left: `${l.left}%`,
          width: '3px', height: '60px',
          background: `linear-gradient(to top, transparent, ${l.color})`,
          borderRadius: '2px', transformOrigin: 'bottom center',
          animation: `kpop-stick 0.8s ${l.delay}s ease-in-out infinite alternate`, opacity: 0.8,
        }}>
          <div style={{
            position: 'absolute', top: '-8px', left: '-5px',
            width: '12px', height: '12px', borderRadius: '50%',
            background: l.color, boxShadow: `0 0 10px ${l.color}`,
          }} />
        </div>
      ))}
      {/* K-pop group */}
      <div style={{
        position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '20px',
        animation: 'kpop-group 6s 0.5s ease-out forwards', opacity: 0,
      }}>
        {members.map((m, i) => (
          <div key={i} style={{
            fontSize: '2.8rem',
            animation: `kpop-member ${0.4 + Math.random() * 0.3}s ${i * 0.1}s ease-in-out infinite alternate`,
          }}>{m}</div>
        ))}
      </div>
      {/* Name */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)', textAlign: 'center',
        animation: 'kpop-name 6s 0.8s ease-out forwards', opacity: 0,
      }}>
        <div style={{
          fontSize: '1.5rem', fontWeight: 'bold',
          background: 'linear-gradient(90deg, #b388ff, #ea80fc, #80d8ff, #ff80ab)',
          backgroundSize: '300% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'kpop-gradient 2s linear infinite',
        }}>Noemie 🎤</div>
        <div style={{ fontSize: '0.7rem', color: '#b388ff', marginTop: '3px', letterSpacing: '3px' }}>STAN FOREVER 💜</div>
      </div>
      {/* Floating hearts */}
      {hearts.map(h => (
        <div key={h.id} style={{
          position: 'absolute', left: `${h.left}%`, bottom: '10%',
          fontSize: `${h.size}rem`,
          animation: `kpop-heart ${2 + Math.random()}s ${h.delay}s ease-out forwards`, opacity: 0,
        }}>{h.emoji}</div>
      ))}
      <style>{`
        @keyframes kpop-bg { 0% { opacity: 0; } 10% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes kpop-stick { 0% { transform: rotate(-12deg); } 100% { transform: rotate(12deg); } }
        @keyframes kpop-member { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-15px) scale(1.1); } }
        @keyframes kpop-group { 0% { opacity: 0; transform: translateX(-50%) translateY(20px); } 15% { opacity: 1; transform: translateX(-50%) translateY(0); } 85% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes kpop-name { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0.5); } 15% { opacity: 1; transform: translate(-50%,-50%) scale(1.15); } 25% { transform: translate(-50%,-50%) scale(1); } 80% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes kpop-gradient { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }
        @keyframes kpop-heart { 0% { transform: translateY(0) scale(0.3); opacity: 0; } 15% { opacity: 1; transform: translateY(-15vh) scale(1); } 100% { transform: translateY(-70vh) scale(0.5); opacity: 0; } }
      `}</style>
    </div>
  )
}

// 💍🏆 Mariage + K Corp — easter egg Geoffrey
function KcorpWeddingAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 8000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const confetti = Array.from({ length: 40 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 3,
    size: 0.8 + Math.random() * 1.2,
    emoji: ['💍', '🤍', '💒', '🥂', '✨', '🏆', '⚔️', '👑'][Math.floor(Math.random() * 8)],
    speed: 2.5 + Math.random() * 2,
    wobble: (Math.random() - 0.5) * 80,
  }))
  const kcorpBlue = '#00a8e8'
  const kcorpGold = '#ffd700'
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* K Corp blue/gold split background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, ${kcorpBlue}22 0%, transparent 40%, transparent 60%, ${kcorpGold}22 100%)`,
        animation: 'geof-bg 8s ease-in-out forwards',
      }} />
      {/* KC banner flash */}
      <div style={{
        position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)',
        padding: '8px 30px', borderRadius: '8px',
        background: `linear-gradient(90deg, ${kcorpBlue}, ${kcorpGold})`,
        animation: 'geof-banner 7s 0.3s ease-out forwards', opacity: 0,
      }}>
        <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', letterSpacing: '4px', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
          ⚔️ KC ⚔️
        </span>
      </div>
      {/* Wedding couple center */}
      <div style={{
        position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)',
        textAlign: 'center', animation: 'geof-couple 7s 0.5s ease-out forwards', opacity: 0,
      }}>
        <div style={{ fontSize: '4rem', animation: 'geof-pulse 1s ease-in-out infinite alternate' }}>
          👰‍♀️💍🤵
        </div>
        <div style={{
          fontSize: '1.6rem', fontWeight: 'bold', marginTop: '8px',
          background: `linear-gradient(90deg, ${kcorpBlue}, #fff, ${kcorpGold})`,
          backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'geof-gradient 3s linear infinite',
        }}>Geoffrey</div>
        <div style={{ fontSize: '0.85rem', color: kcorpGold, marginTop: '4px', fontStyle: 'italic' }}>
          GG WP dans la vie 🏆
        </div>
      </div>
      {/* Kameto quote bottom */}
      <div style={{
        position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', animation: 'geof-quote 6s 2s ease-out forwards', opacity: 0,
      }}>
        <div style={{ fontSize: '1.1rem', color: '#fff', textShadow: `0 0 15px ${kcorpBlue}` }}>
          « ON EST LÀ 🔥 »
        </div>
      </div>
      {/* Confetti cascade */}
      {confetti.map(c => (
        <div key={c.id} style={{
          position: 'absolute', left: `${c.left}%`, top: '-40px',
          fontSize: `${c.size}rem`,
          animation: `geof-fall ${c.speed}s ${c.delay}s ease-in forwards`,
          opacity: 0, '--wobble': `${c.wobble}px`,
        }}>{c.emoji}</div>
      ))}
      {/* Swords crossing animation */}
      <div style={{
        position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%,-50%)',
        fontSize: '3rem', animation: 'geof-swords 6s 1.5s ease-out forwards', opacity: 0,
      }}>
        <span style={{ display: 'inline-block', animation: 'geof-sword-l 0.6s 2s ease-out forwards', transform: 'rotate(45deg)' }}>⚔️</span>
      </div>
      <style>{`
        @keyframes geof-bg { 0% { opacity: 0; } 10% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes geof-banner {
          0% { opacity: 0; transform: translateX(-50%) scaleX(0); }
          15% { opacity: 1; transform: translateX(-50%) scaleX(1.05); }
          20% { transform: translateX(-50%) scaleX(1); }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes geof-couple {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.3); }
          12% { opacity: 1; transform: translate(-50%,-50%) scale(1.1); }
          20% { transform: translate(-50%,-50%) scale(1); }
          82% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes geof-pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
        @keyframes geof-gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes geof-quote {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
          15% { opacity: 1; transform: translateX(-50%) translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes geof-fall {
          0% { transform: translateY(0) translateX(0) rotate(0deg) scale(0.3); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(50vh) translateX(var(--wobble)) rotate(180deg) scale(1); opacity: 0.9; }
          100% { transform: translateY(110vh) translateX(calc(var(--wobble) * -0.5)) rotate(360deg) scale(0.5); opacity: 0; }
        }
        @keyframes geof-swords {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0); }
          20% { opacity: 1; transform: translate(-50%,-50%) scale(1.3); }
          30% { transform: translate(-50%,-50%) scale(1); }
          75% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes geof-sword-l {
          0% { transform: rotate(-45deg) scale(0.5); }
          100% { transform: rotate(0deg) scale(1); }
        }
      `}</style>
    </div>
  )
}

// 🏰✈️ Disneyland + Voyages — easter egg Sarah
function DisneyTravelAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 8000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const sparkles = Array.from({ length: 35 }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100,
    delay: Math.random() * 5, size: 0.6 + Math.random() * 1.2,
    emoji: ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)],
  }))
  const destinations = ['🗼', '🏝️', '🗽', '🏯', '🕌', '🌋', '🎡', '🌸']
  const disneyIcons = ['🏰', '🎆', '🎠', '🎢', '🧚‍♀️', '👸', '🐭', '🪄']
  const shootingStars = Array.from({ length: 5 }, (_, i) => ({
    id: i, delay: 1 + i * 1.2, startX: 10 + Math.random() * 30, startY: 5 + Math.random() * 15,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Enchanted night sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0a0033 0%, #1a0a4e 30%, #3d1a8e 60%, #f472b6 90%, #fbbf24 100%)',
        animation: 'sarah-sky 8s ease-in-out forwards', opacity: 0,
      }} />
      {/* Shooting stars */}
      {shootingStars.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.startX}%`, top: `${s.startY}%`,
          width: '3px', height: '3px', borderRadius: '50%',
          background: '#fff', boxShadow: '0 0 6px 2px rgba(255,255,255,0.8), -20px 0 15px 2px rgba(255,255,255,0.3)',
          animation: `sarah-shoot 0.8s ${s.delay}s ease-out forwards`, opacity: 0,
        }} />
      ))}
      {/* Disney castle silhouette center */}
      <div style={{
        position: 'absolute', top: '22%', left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', animation: 'sarah-castle 7s 0.5s ease-out forwards', opacity: 0,
      }}>
        <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 0 20px rgba(244,114,182,0.6))' }}>🏰</div>
        <div style={{
          fontSize: '0.65rem', color: '#f9a8d4', letterSpacing: '5px', marginTop: '4px',
          textTransform: 'uppercase',
        }}>Where dreams come true</div>
      </div>
      {/* Magic wand arc */}
      <div style={{
        position: 'absolute', top: '18%', left: '58%',
        fontSize: '2rem', animation: 'sarah-wand 3s 1s ease-in-out forwards', opacity: 0,
        transformOrigin: 'bottom left',
      }}>🪄</div>
      {/* Name */}
      <div style={{
        position: 'absolute', top: '48%', left: '50%',
        transform: 'translate(-50%,-50%)', textAlign: 'center',
        animation: 'sarah-name 7s 1.2s ease-out forwards', opacity: 0,
      }}>
        <div style={{
          fontSize: '2rem', fontWeight: 'bold',
          background: 'linear-gradient(90deg, #f9a8d4, #fbbf24, #a78bfa, #f9a8d4)',
          backgroundSize: '300% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'sarah-gradient 3s linear infinite',
          textShadow: 'none',
        }}>Sarah ✈️</div>
        <div style={{ fontSize: '0.8rem', color: '#fbbf24', marginTop: '4px' }}>
          princesse globe-trotteuse 👸🌍
        </div>
      </div>
      {/* Destinations parade at bottom */}
      <div style={{
        position: 'absolute', bottom: '12%', left: '0', whiteSpace: 'nowrap',
        animation: 'sarah-parade 10s 1.5s linear forwards', opacity: 0,
      }}>
        {[...destinations, ...disneyIcons, ...destinations].map((d, i) => (
          <span key={i} style={{
            fontSize: '2.2rem', marginRight: '30px', display: 'inline-block',
            animation: `sarah-bob 1s ${i * 0.15}s ease-in-out infinite alternate`,
          }}>{d}</span>
        ))}
      </div>
      {/* Sparkles everywhere */}
      {sparkles.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.left}%`, top: `${s.top}%`,
          fontSize: `${s.size}rem`,
          animation: `sarah-sparkle 1.2s ${s.delay}s ease-in-out forwards`, opacity: 0,
        }}>{s.emoji}</div>
      ))}
      {/* Fireworks bursts */}
      <div style={{ position: 'absolute', top: '10%', left: '20%', fontSize: '3rem', animation: 'sarah-firework 1s 2.5s ease-out forwards', opacity: 0 }}>🎆</div>
      <div style={{ position: 'absolute', top: '8%', left: '75%', fontSize: '2.5rem', animation: 'sarah-firework 1s 3.2s ease-out forwards', opacity: 0 }}>🎇</div>
      <div style={{ position: 'absolute', top: '15%', left: '50%', fontSize: '2.8rem', animation: 'sarah-firework 1s 4s ease-out forwards', opacity: 0 }}>🎆</div>
      <style>{`
        @keyframes sarah-sky { 0% { opacity: 0; } 8% { opacity: 0.5; } 85% { opacity: 0.5; } 100% { opacity: 0; } }
        @keyframes sarah-shoot {
          0% { opacity: 0; transform: translate(0,0); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translate(40vw, 15vh); }
        }
        @keyframes sarah-castle {
          0% { opacity: 0; transform: translateX(-50%) scale(0.3); }
          12% { opacity: 1; transform: translateX(-50%) scale(1.1); }
          18% { transform: translateX(-50%) scale(1); }
          82% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes sarah-wand {
          0% { opacity: 0; transform: rotate(-30deg) scale(0.5); }
          20% { opacity: 1; transform: rotate(0deg) scale(1); }
          40% { transform: rotate(15deg) scale(1.1); }
          60% { transform: rotate(-5deg) scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: rotate(10deg); }
        }
        @keyframes sarah-name {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.5); }
          12% { opacity: 1; transform: translate(-50%,-50%) scale(1.1); }
          20% { transform: translate(-50%,-50%) scale(1); }
          82% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes sarah-gradient {
          0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; }
        }
        @keyframes sarah-parade {
          0% { transform: translateX(100vw); opacity: 0; }
          5% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(-200%); opacity: 0; }
        }
        @keyframes sarah-bob {
          0% { transform: translateY(0); } 100% { transform: translateY(-10px); }
        }
        @keyframes sarah-sparkle {
          0% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
          100% { opacity: 0; transform: scale(0) rotate(360deg); }
        }
        @keyframes sarah-firework {
          0% { opacity: 0; transform: scale(0.2); }
          50% { opacity: 1; transform: scale(1.4); }
          100% { opacity: 0; transform: scale(1.8); }
        }
      `}</style>
    </div>
  )
}

// 🍊🏅 Oranges + Sport — easter egg Clementine
function OrangeSportAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 7000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const oranges = Array.from({ length: 30 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 3.5,
    size: 1.2 + Math.random() * 1.8, speed: 2 + Math.random() * 2,
    emoji: ['🍊', '🍊', '🍊', '🍋', '🧃'][Math.floor(Math.random() * 5)],
    wobble: (Math.random() - 0.5) * 60,
    spin: 360 + Math.random() * 720,
  }))
  const sports = ['⚽', '🏀', '🏐', '🎾', '🏃‍♀️', '🤸‍♀️', '🏋️‍♀️', '🚴‍♀️', '🏊‍♀️', '⛹️‍♀️']
  const splashes = Array.from({ length: 8 }, (_, i) => ({
    id: i, left: 10 + Math.random() * 80, top: 20 + Math.random() * 60,
    delay: 1 + Math.random() * 4, size: 40 + Math.random() * 30,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Orange gradient bg */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(255,165,0,0.2) 0%, rgba(255,87,34,0.1) 50%, transparent 80%)',
        animation: 'clem-bg 7s ease-in-out forwards',
      }} />
      {/* Juice splashes */}
      {splashes.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.left}%`, top: `${s.top}%`,
          width: `${s.size}px`, height: `${s.size}px`, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,165,0,0.4) 0%, rgba(255,140,0,0.1) 60%, transparent 80%)',
          animation: `clem-splash 0.8s ${s.delay}s ease-out forwards`, opacity: 0,
          transform: 'scale(0)',
        }} />
      ))}
      {/* Raining oranges */}
      {oranges.map(o => (
        <div key={o.id} style={{
          position: 'absolute', left: `${o.left}%`, top: '-50px',
          fontSize: `${o.size}rem`,
          animation: `clem-fall ${o.speed}s ${o.delay}s ease-in forwards`,
          opacity: 0, '--wobble': `${o.wobble}px`, '--spin': `${o.spin}deg`,
        }}>{o.emoji}</div>
      ))}
      {/* Sports icons bouncing across */}
      <div style={{
        position: 'absolute', bottom: '8%', left: 0, right: 0,
        display: 'flex', justifyContent: 'space-around', padding: '0 3%',
      }}>
        {sports.map((s, i) => (
          <div key={i} style={{
            fontSize: '2.2rem',
            animation: `clem-sport ${0.5 + Math.random() * 0.4}s ${0.5 + i * 0.15}s ease-in-out infinite alternate`,
            opacity: 0, animationFillMode: 'forwards',
          }}>{s}</div>
        ))}
      </div>
      {/* Name center */}
      <div style={{
        position: 'absolute', top: '42%', left: '50%',
        transform: 'translate(-50%,-50%)', textAlign: 'center',
        animation: 'clem-name 6.5s 0.8s ease-out forwards', opacity: 0,
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '6px' }}>🍊</div>
        <div style={{
          fontSize: '1.8rem', fontWeight: 'bold',
          background: 'linear-gradient(90deg, #ff9800, #ff5722, #ff9800)',
          backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'clem-gradient 2s linear infinite',
        }}>Clémentine</div>
        <div style={{ fontSize: '0.8rem', color: '#ff9800', marginTop: '4px' }}>
          vitaminée & sportive 🏅
        </div>
      </div>
      <style>{`
        @keyframes clem-bg { 0% { opacity: 0; } 10% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes clem-splash {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 0.8; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(2.5); }
        }
        @keyframes clem-fall {
          0% { transform: translateY(0) translateX(0) rotate(0deg) scale(0.3); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(50vh) translateX(var(--wobble)) rotate(calc(var(--spin) * 0.5)) scale(1); }
          100% { transform: translateY(110vh) translateX(calc(var(--wobble) * -0.3)) rotate(var(--spin)) scale(0.7); opacity: 0; }
        }
        @keyframes clem-sport {
          0% { transform: translateY(0) scale(1); opacity: 0.9; }
          100% { transform: translateY(-25px) scale(1.15); opacity: 1; }
        }
        @keyframes clem-name {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.4); }
          12% { opacity: 1; transform: translate(-50%,-50%) scale(1.1); }
          20% { transform: translate(-50%,-50%) scale(1); }
          82% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes clem-gradient {
          0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  )
}

// 🔥♈ Flammes + Astrologie — easter egg Claire
function FlameAstroAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 7500); return () => clearTimeout(t) }, [])
  if (!active) return null
  const flames = Array.from({ length: 25 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 3,
    size: 1.5 + Math.random() * 2, speed: 2 + Math.random() * 2,
    emoji: ['🔥', '🔥', '🔥', '💥', '✨'][Math.floor(Math.random() * 5)],
  }))
  const zodiac = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 80,
    delay: Math.random() * 5, size: 0.5 + Math.random() * 0.8,
  }))
  const constellationPoints = [
    { x: 25, y: 15 }, { x: 35, y: 22 }, { x: 30, y: 35 }, { x: 40, y: 45 },
    { x: 65, y: 18 }, { x: 72, y: 28 }, { x: 68, y: 40 }, { x: 75, y: 50 },
  ]
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Deep cosmic background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(88,28,135,0.3) 0%, rgba(15,5,30,0.4) 60%, transparent 90%)',
        animation: 'claire-bg 7.5s ease-in-out forwards',
      }} />
      {/* Twinkling stars */}
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.left}%`, top: `${s.top}%`,
          width: `${s.size * 4}px`, height: `${s.size * 4}px`, borderRadius: '50%',
          background: '#fff', boxShadow: `0 0 ${s.size * 6}px rgba(255,255,255,0.6)`,
          animation: `claire-twinkle 1.5s ${s.delay}s ease-in-out infinite alternate`,
          opacity: 0.3,
        }} />
      ))}
      {/* Constellation lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', animation: 'claire-const 6s 1s ease-out forwards', opacity: 0 }}>
        {constellationPoints.slice(0, 4).map((p, i) => i < 3 ? (
          <line key={i} x1={`${p.x}%`} y1={`${p.y}%`} x2={`${constellationPoints[i + 1].x}%`} y2={`${constellationPoints[i + 1].y}%`}
            stroke="rgba(200,170,255,0.3)" strokeWidth="1" strokeDasharray="4 4" />
        ) : null)}
        {constellationPoints.slice(4).map((p, i) => i < 3 ? (
          <line key={`r${i}`} x1={`${p.x}%`} y1={`${p.y}%`} x2={`${constellationPoints[5 + i].x}%`} y2={`${constellationPoints[5 + i].y}%`}
            stroke="rgba(200,170,255,0.3)" strokeWidth="1" strokeDasharray="4 4" />
        ) : null)}
      </svg>
      {/* Zodiac wheel */}
      <div style={{
        position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '180px', height: '180px',
        animation: 'claire-wheel 7s 0.5s ease-out forwards', opacity: 0,
      }}>
        {zodiac.map((z, i) => {
          const angle = (i / 12) * 360
          const rad = angle * Math.PI / 180
          const x = 90 + Math.cos(rad) * 80
          const y = 90 + Math.sin(rad) * 80
          return (
            <div key={i} style={{
              position: 'absolute', left: `${x}px`, top: `${y}px`,
              transform: 'translate(-50%,-50%)',
              fontSize: '1.3rem', color: '#c4b5fd',
              textShadow: '0 0 8px rgba(196,181,253,0.5)',
              animation: `claire-zodiac-pop 0.4s ${0.8 + i * 0.15}s ease-out forwards`, opacity: 0,
            }}>{z}</div>
          )
        })}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '160px', height: '160px', borderRadius: '50%',
          border: '1px solid rgba(196,181,253,0.2)',
          animation: 'claire-ring 8s linear infinite',
        }} />
      </div>
      {/* Flames rising from bottom */}
      {flames.map(f => (
        <div key={f.id} style={{
          position: 'absolute', left: `${f.left}%`, bottom: '-40px',
          fontSize: `${f.size}rem`,
          animation: `claire-flame ${f.speed}s ${f.delay}s ease-out forwards`, opacity: 0,
        }}>{f.emoji}</div>
      ))}
      {/* Name */}
      <div style={{
        position: 'absolute', top: '55%', left: '50%',
        transform: 'translate(-50%,-50%)', textAlign: 'center',
        animation: 'claire-name 6.5s 1s ease-out forwards', opacity: 0,
      }}>
        <div style={{
          fontSize: '1.8rem', fontWeight: 'bold',
          background: 'linear-gradient(90deg, #f97316, #ef4444, #a855f7, #6366f1)',
          backgroundSize: '300% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'claire-gradient 3s linear infinite',
        }}>Claire 🔮</div>
        <div style={{ fontSize: '0.75rem', color: '#c4b5fd', marginTop: '4px' }}>
          fire sign energy ♌🔥
        </div>
      </div>
      <style>{`
        @keyframes claire-bg { 0% { opacity: 0; } 8% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes claire-twinkle { 0% { opacity: 0.2; transform: scale(1); } 100% { opacity: 0.8; transform: scale(1.3); } }
        @keyframes claire-const { 0% { opacity: 0; } 20% { opacity: 0.6; } 80% { opacity: 0.6; } 100% { opacity: 0; } }
        @keyframes claire-wheel { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0.3) rotate(-30deg); } 15% { opacity: 1; transform: translate(-50%,-50%) scale(1) rotate(0deg); } 80% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes claire-ring { 0% { transform: translate(-50%,-50%) rotate(0deg); } 100% { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes claire-zodiac-pop { 0% { opacity: 0; transform: translate(-50%,-50%) scale(0); } 100% { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        @keyframes claire-flame {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          15% { opacity: 1; transform: translateY(-15vh) scale(1.2); }
          100% { transform: translateY(-100vh) scale(0.4); opacity: 0; }
        }
        @keyframes claire-name {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.5); }
          12% { opacity: 1; transform: translate(-50%,-50%) scale(1.1); }
          20% { transform: translate(-50%,-50%) scale(1); }
          82% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes claire-gradient { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }
      `}</style>
    </div>
  )
}

// 💻🛡️ Cyber + Code — easter egg Jade
function CyberJadeAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 7500); return () => clearTimeout(t) }, [])
  if (!active) return null
  const codeLines = [
    'const hack = () => 🔓', 'if (jade.skill > 9000)', 'sudo rm -rf boring/',
    'git push --force life', 'while(true) { learn() }', '> access_granted ✅',
    'import { power } from "jade"', 'firewall.bypass()', 'encrypt(everything)',
    'chmod 777 success', '0x4A414445', 'ping jade@cyber.net',
  ]
  const matrixDrops = Array.from({ length: 30 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 4,
    speed: 2 + Math.random() * 3, chars: Array.from({ length: 8 }, () =>
      String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
    ).join(''),
  }))
  const glitchIcons = ['🛡️', '💻', '🔐', '👾', '🕶️', '⚡', '🧠', '💀']
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Dark cyber bg */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(0,255,65,0.06) 0%, rgba(0,20,0,0.3) 70%)',
        animation: 'jade-bg 7.5s ease-in-out forwards',
      }} />
      {/* Matrix rain */}
      {matrixDrops.map(d => (
        <div key={d.id} style={{
          position: 'absolute', left: `${d.left}%`, top: '-20%',
          fontFamily: 'monospace', fontSize: '0.75rem', color: '#00ff41',
          opacity: 0.6, writingMode: 'vertical-rl',
          animation: `jade-matrix ${d.speed}s ${d.delay}s linear forwards`,
          textShadow: '0 0 8px rgba(0,255,65,0.5)',
        }}>{d.chars}</div>
      ))}
      {/* Scanning line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: '2px',
        background: 'linear-gradient(90deg, transparent, #00ff41, transparent)',
        boxShadow: '0 0 15px rgba(0,255,65,0.5)',
        animation: 'jade-scan 2.5s 0.5s ease-in-out 2',
        opacity: 0,
      }} />
      {/* Terminal window center */}
      <div style={{
        position: 'absolute', top: '28%', left: '50%', transform: 'translate(-50%,-50%)',
        background: 'rgba(0,10,0,0.8)', border: '1px solid rgba(0,255,65,0.3)',
        borderRadius: '8px', padding: '12px 16px', maxWidth: '320px', width: '80%',
        animation: 'jade-terminal 6.5s 0.5s ease-out forwards', opacity: 0,
      }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28c840' }} />
        </div>
        {codeLines.slice(0, 5).map((line, i) => (
          <div key={i} style={{
            fontFamily: 'monospace', fontSize: '0.7rem', color: '#00ff41',
            animation: `jade-type 0.5s ${1 + i * 0.6}s ease-out forwards`, opacity: 0,
            whiteSpace: 'nowrap', overflow: 'hidden',
          }}>
            <span style={{ color: '#666' }}>$ </span>{line}
          </div>
        ))}
      </div>
      {/* Name */}
      <div style={{
        position: 'absolute', top: '55%', left: '50%',
        transform: 'translate(-50%,-50%)', textAlign: 'center',
        animation: 'jade-name 6s 1.5s ease-out forwards', opacity: 0,
      }}>
        <div style={{
          fontSize: '2rem', fontWeight: 'bold', fontFamily: 'monospace',
          color: '#00ff41', textShadow: '0 0 20px rgba(0,255,65,0.5), 2px 2px 0 #003300',
          animation: 'jade-glitch 0.3s 2.5s ease-in-out 3',
        }}>{'<Jade/>'}</div>
        <div style={{ fontSize: '0.7rem', color: '#00cc33', marginTop: '4px', fontFamily: 'monospace' }}>
          cyber queen 🛡️ // access_level: root
        </div>
      </div>
      {/* Floating icons */}
      <div style={{
        position: 'absolute', bottom: '8%', left: 0, right: 0,
        display: 'flex', justifyContent: 'space-around', padding: '0 5%',
      }}>
        {glitchIcons.map((g, i) => (
          <div key={i} style={{
            fontSize: '1.8rem',
            animation: `jade-icon 0.6s ${2 + i * 0.2}s ease-out forwards`, opacity: 0,
          }}>{g}</div>
        ))}
      </div>
      <style>{`
        @keyframes jade-bg { 0% { opacity: 0; } 8% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes jade-matrix { 0% { top: -20%; opacity: 0.6; } 100% { top: 110%; opacity: 0; } }
        @keyframes jade-scan { 0% { top: 0; opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { top: 100%; opacity: 0; } }
        @keyframes jade-terminal {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.8); }
          10% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          82% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes jade-type { 0% { opacity: 0; max-width: 0; } 100% { opacity: 1; max-width: 300px; } }
        @keyframes jade-name {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.5); }
          12% { opacity: 1; transform: translate(-50%,-50%) scale(1.1); }
          20% { transform: translate(-50%,-50%) scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes jade-glitch {
          0% { transform: translate(0); } 25% { transform: translate(-3px, 2px); filter: hue-rotate(90deg); }
          50% { transform: translate(3px, -2px); } 75% { transform: translate(-2px, -1px); filter: hue-rotate(0deg); }
          100% { transform: translate(0); }
        }
        @keyframes jade-icon { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 0.8; transform: translateY(0); } }
      `}</style>
    </div>
  )
}

// 🧭⛰️ Aventure — easter egg Thomas
function AdventureThomasAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 8000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const terrain = ['🏔️', '🌋', '🏜️', '🌊', '🌴', '🏕️', '⛰️', '🗻']
  const items = Array.from({ length: 20 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: 0.5 + Math.random() * 4,
    size: 1 + Math.random() * 1.5,
    emoji: ['🗡️', '🧭', '🗺️', '🔦', '🪂', '🏹', '⚡', '💎', '🦖', '🐉'][Math.floor(Math.random() * 10)],
  }))
  const dinos = [
    { emoji: '🦕', top: 58, delay: 1.5, speed: 5, size: 4, dir: 'left' },
    { emoji: '🦖', top: 52, delay: 3, speed: 4.5, size: 3.5, dir: 'right' },
    { emoji: '🐊', top: 62, delay: 4.5, speed: 6, size: 2.5, dir: 'left' },
    { emoji: '🦖', top: 45, delay: 2, speed: 5.5, size: 3, dir: 'right' },
  ]
  const clouds = Array.from({ length: 6 }, (_, i) => ({
    id: i, top: 5 + Math.random() * 20, delay: Math.random() * 2, speed: 5 + Math.random() * 4,
  }))
  const pathDots = Array.from({ length: 12 }, (_, i) => ({
    id: i, x: 8 + i * 7.5, y: 70 + Math.sin(i * 0.8) * 8,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Epic sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0c1445 0%, #1e3a5f 25%, #e67e22 70%, #f39c12 100%)',
        animation: 'tom-sky 8s ease-in-out forwards', opacity: 0,
      }} />
      {/* Sun/horizon glow */}
      <div style={{
        position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)',
        width: '200px', height: '100px', borderRadius: '100px 100px 0 0',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(243,156,18,0.6) 0%, transparent 70%)',
        animation: 'tom-sun 7s 0.5s ease-out forwards', opacity: 0,
      }} />
      {/* Clouds */}
      {clouds.map(c => (
        <div key={c.id} style={{
          position: 'absolute', top: `${c.top}%`, left: '-10%',
          fontSize: '2.5rem', opacity: 0.5,
          animation: `tom-cloud ${c.speed}s ${c.delay}s linear forwards`,
        }}>☁️</div>
      ))}
      {/* Terrain at bottom */}
      <div style={{
        position: 'absolute', bottom: '3%', left: 0, right: 0,
        display: 'flex', justifyContent: 'space-around', padding: '0 2%',
        animation: 'tom-terrain 7s 0.8s ease-out forwards', opacity: 0,
      }}>
        {terrain.map((t, i) => (
          <div key={i} style={{
            fontSize: '2.5rem',
            animation: `tom-grow 0.5s ${1 + i * 0.15}s ease-out forwards`,
            opacity: 0, transform: 'scale(0) translateY(20px)',
          }}>{t}</div>
        ))}
      </div>
      {/* Dotted trail path */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', animation: 'tom-path 6s 1.5s ease-out forwards', opacity: 0 }}>
        <path
          d={`M ${pathDots.map(p => `${p.x}% ${p.y}%`).join(' L ')}`}
          fill="none" stroke="rgba(243,156,18,0.4)" strokeWidth="2"
          strokeDasharray="8 6" strokeLinecap="round"
        />
        {pathDots.map((p, i) => (
          <circle key={i} cx={`${p.x}%`} cy={`${p.y}%`} r="3"
            fill="#f39c12" opacity="0.6"
            style={{ animation: `tom-dot-pop 0.3s ${1.8 + i * 0.1}s ease-out forwards`, opacity: 0 }}
          />
        ))}
      </svg>
      {/* Explorer walking across */}
      <div style={{
        position: 'absolute', bottom: '20%', left: '-10%',
        fontSize: '3rem',
        animation: 'tom-explorer 5.5s 1.5s ease-in-out forwards', opacity: 0,
      }}>
        <span style={{ display: 'inline-block', animation: 'tom-step 0.4s ease-in-out infinite alternate' }}>🧗</span>
      </div>
      {/* Dinosaurs crossing */}
      {dinos.map((d, i) => (
        <div key={`dino-${i}`} style={{
          position: 'absolute', top: `${d.top}%`,
          left: d.dir === 'left' ? '-12%' : undefined,
          right: d.dir === 'right' ? '-12%' : undefined,
          fontSize: `${d.size}rem`,
          transform: d.dir === 'right' ? 'scaleX(-1)' : 'none',
          animation: `tom-dino-${d.dir} ${d.speed}s ${d.delay}s ease-in-out forwards`,
          opacity: 0, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        }}>
          <div style={{ animation: 'tom-dino-stomp 0.3s ease-in-out infinite alternate' }}>{d.emoji}</div>
        </div>
      ))}
      {/* Dino footprints */}
      {[20, 35, 50, 65, 80].map((x, i) => (
        <div key={`foot-${i}`} style={{
          position: 'absolute', bottom: '13%', left: `${x}%`,
          fontSize: '1rem', opacity: 0,
          animation: `tom-footprint 1.5s ${2.5 + i * 0.4}s ease-out forwards`,
        }}>🦶</div>
      ))}
      {/* Compass spinning top-right */}
      <div style={{
        position: 'absolute', top: '12%', right: '12%',
        fontSize: '3.5rem',
        animation: 'tom-compass 7s 0.5s ease-out forwards', opacity: 0,
      }}>🧭</div>
      {/* Name */}
      <div style={{
        position: 'absolute', top: '42%', left: '50%',
        transform: 'translate(-50%,-50%)', textAlign: 'center',
        animation: 'tom-name 7s 1s ease-out forwards', opacity: 0,
      }}>
        <div style={{
          fontSize: '2rem', fontWeight: 'bold',
          background: 'linear-gradient(90deg, #f39c12, #e74c3c, #f39c12)',
          backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'tom-gradient 2.5s linear infinite',
        }}>Thomas ⚔️</div>
        <div style={{ fontSize: '0.8rem', color: '#f39c12', marginTop: '4px' }}>
          l'aventure ne fait que commencer 🦖🗺️
        </div>
      </div>
      {/* Floating adventure items */}
      {items.map(it => (
        <div key={it.id} style={{
          position: 'absolute', left: `${it.left}%`, top: '-30px',
          fontSize: `${it.size}rem`,
          animation: `tom-item ${2 + Math.random() * 2}s ${it.delay}s ease-in forwards`, opacity: 0,
        }}>{it.emoji}</div>
      ))}
      <style>{`
        @keyframes tom-sky { 0% { opacity: 0; } 8% { opacity: 0.55; } 85% { opacity: 0.55; } 100% { opacity: 0; } }
        @keyframes tom-sun { 0% { opacity: 0; transform: translateX(-50%) scale(0.5); } 15% { opacity: 0.8; transform: translateX(-50%) scale(1); } 80% { opacity: 0.8; } 100% { opacity: 0; } }
        @keyframes tom-cloud { 0% { left: -10%; opacity: 0; } 10% { opacity: 0.5; } 90% { opacity: 0.5; } 100% { left: 110%; opacity: 0; } }
        @keyframes tom-terrain { 0% { opacity: 0; } 10% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes tom-grow { 0% { opacity: 0; transform: scale(0) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes tom-path { 0% { opacity: 0; } 15% { opacity: 0.7; } 80% { opacity: 0.7; } 100% { opacity: 0; } }
        @keyframes tom-dot-pop { 0% { opacity: 0; r: 0; } 100% { opacity: 0.6; r: 3; } }
        @keyframes tom-explorer {
          0% { left: -10%; opacity: 0; bottom: 20%; }
          10% { opacity: 1; }
          30% { bottom: 25%; }
          50% { bottom: 18%; }
          70% { bottom: 24%; }
          90% { opacity: 1; }
          100% { left: 110%; bottom: 20%; opacity: 0; }
        }
        @keyframes tom-step { 0% { transform: translateY(0) rotate(-3deg); } 100% { transform: translateY(-5px) rotate(3deg); } }
        @keyframes tom-compass {
          0% { opacity: 0; transform: rotate(-90deg) scale(0.5); }
          15% { opacity: 0.8; transform: rotate(0deg) scale(1); }
          50% { transform: rotate(360deg) scale(1); }
          80% { opacity: 0.8; }
          100% { opacity: 0; transform: rotate(720deg); }
        }
        @keyframes tom-name {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.4); }
          12% { opacity: 1; transform: translate(-50%,-50%) scale(1.1); }
          20% { transform: translate(-50%,-50%) scale(1); }
          82% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes tom-gradient { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        @keyframes tom-dino-left { 0% { left: -12%; opacity: 0; } 8% { opacity: 1; } 88% { opacity: 1; } 100% { left: 110%; opacity: 0; } }
        @keyframes tom-dino-right { 0% { right: -12%; opacity: 0; } 8% { opacity: 1; } 88% { opacity: 1; } 100% { right: 110%; opacity: 0; } }
        @keyframes tom-dino-stomp { 0% { transform: translateY(0) rotate(-2deg); } 100% { transform: translateY(-6px) rotate(2deg); } }
        @keyframes tom-footprint { 0% { opacity: 0; transform: scale(0); } 30% { opacity: 0.5; transform: scale(1.2); } 60% { opacity: 0.3; transform: scale(1); } 100% { opacity: 0; } }
        @keyframes tom-item {
          0% { transform: translateY(0) rotate(0deg) scale(0.3); opacity: 0; }
          10% { opacity: 0.9; }
          100% { transform: translateY(110vh) rotate(${180 + Math.random() * 360}deg) scale(0.6); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// 🌀 Siphon d'emojis — easter egg Jonas
function SpiralJonasAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 9000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const allEmojis = [
    '😀','😂','🥹','😎','🤩','🥳','😈','👻','💀','🤖','👽','🎃',
    '❤️','🔥','⭐','💎','🌈','🍕','🎸','🚀','🧠','👑','🐉','🦄',
    '🌍','🎯','💡','🎮','🏆','⚡','🌊','🌸','🍊','🎵','🪐','🔮',
    '🦖','🐱','🐶','🦅','🐙','🦋','🌻','🍉','🎪','🏔️','🌙','☀️',
    '🎲','🃏','💣','🧲','🔱','⚔️','🛡️','🪄','💫','✨','🎆','🎇',
    '🧊','💧','🌪️','☄️','🌠','🏴‍☠️','🎭','🎨','📡','💻','🕹️','🫠',
  ]
  // Phase 1: emojis spawn at edges and get sucked into center (siphon)
  const siphonCount = 50
  const siphon = Array.from({ length: siphonCount }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const dist = 50 + Math.random() * 20
    return {
      id: i,
      startX: 50 + Math.cos(angle) * dist,
      startY: 50 + Math.sin(angle) * dist,
      emoji: allEmojis[Math.floor(Math.random() * allEmojis.length)],
      delay: i * 0.08,
      size: 1 + Math.random() * 1.5,
      rotations: 2 + Math.floor(Math.random() * 4),
    }
  })
  // Phase 2: explosion outward from center
  const explodeCount = 60
  const explode = Array.from({ length: explodeCount }, (_, i) => {
    const angle = (i / explodeCount) * Math.PI * 2 + Math.random() * 0.3
    const dist = 40 + Math.random() * 20
    return {
      id: i,
      emoji: allEmojis[Math.floor(Math.random() * allEmojis.length)],
      endX: Math.cos(angle) * dist,
      endY: Math.sin(angle) * dist,
      delay: i * 0.02,
      size: 0.8 + Math.random() * 1.8,
      spin: 360 + Math.random() * 720,
    }
  })
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Vortex bg */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.12) 0%, rgba(10,0,20,0.3) 50%, transparent 80%)',
        animation: 'jonas-bg 9s ease-in-out forwards',
      }} />
      {/* Spinning vortex rings */}
      {[200, 280, 360].map((size, i) => (
        <div key={`ring-${i}`} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: `${size}px`, height: `${size}px`,
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          border: `1px solid rgba(${100 + i * 60},${100 + i * 40},${241 - i * 50},${0.15 + i * 0.05})`,
          animation: `jonas-ring-spin ${3 - i * 0.5}s linear infinite${i % 2 ? ' reverse' : ''}`,
        }} />
      ))}
      {/* Phase 1: Siphon — emojis spiral INTO center */}
      {siphon.map(s => (
        <div key={`s-${s.id}`} style={{
          position: 'absolute',
          left: `${s.startX}%`, top: `${s.startY}%`,
          fontSize: `${s.size}rem`,
          '--sx': `${s.startX}%`, '--sy': `${s.startY}%`,
          '--rot': `${s.rotations * 360}deg`,
          animation: `jonas-siphon 2.5s ${s.delay}s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          opacity: 0,
        }}>{s.emoji}</div>
      ))}
      {/* Center black hole pulse */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '60px', height: '60px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, rgba(30,0,60,0.8) 60%, transparent 80%)',
        animation: 'jonas-hole 8s 0.5s ease-in-out forwards', opacity: 0,
        boxShadow: '0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(99,102,241,0.2)',
      }} />
      {/* Center 🌀 spinning fast */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        fontSize: '3.5rem',
        animation: 'jonas-vortex 8s 0.3s ease-in-out forwards', opacity: 0,
      }}>
        <div style={{ animation: 'jonas-fast-spin 0.8s linear infinite' }}>🌀</div>
      </div>
      {/* Phase 2: EXPLOSION outward */}
      {explode.map(e => (
        <div key={`e-${e.id}`} style={{
          position: 'absolute', top: '50%', left: '50%',
          fontSize: `${e.size}rem`,
          '--ex': `${e.endX}vw`, '--ey': `${e.endY}vh`, '--espin': `${e.spin}deg`,
          animation: `jonas-explode 1.8s ${5.5 + e.delay}s cubic-bezier(0, 0.5, 0.3, 1) forwards`,
          opacity: 0,
        }}>{e.emoji}</div>
      ))}
      {/* Shockwave ring on explosion */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '10px', height: '10px', borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.6)',
        animation: 'jonas-shockwave 1.2s 5.5s ease-out forwards', opacity: 0,
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '10px', height: '10px', borderRadius: '50%',
        border: '2px solid rgba(99,102,241,0.5)',
        animation: 'jonas-shockwave 1.5s 5.7s ease-out forwards', opacity: 0,
      }} />
      {/* Flash on explosion */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)',
        animation: 'jonas-flash 0.4s 5.45s ease-out forwards', opacity: 0,
      }} />
      {/* Name appears after explosion */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)', textAlign: 'center',
        animation: 'jonas-name 3s 6.5s ease-out forwards', opacity: 0,
      }}>
        <div style={{
          fontSize: '2.2rem', fontWeight: 'bold',
          background: 'linear-gradient(90deg, #6366f1, #ec4899, #f59e0b, #10b981, #6366f1)',
          backgroundSize: '400% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'jonas-rainbow 2s linear infinite',
        }}>Jonas 🌀</div>
        <div style={{ fontSize: '0.75rem', color: '#a78bfa', marginTop: '4px' }}>
          the one who built this 🛠️
        </div>
      </div>
      <style>{`
        @keyframes jonas-bg { 0% { opacity: 0; } 5% { opacity: 1; } 90% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes jonas-ring-spin { 0% { transform: translate(-50%,-50%) rotate(0deg); } 100% { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes jonas-siphon {
          0% { opacity: 0; transform: translate(0, 0) scale(1) rotate(0deg); }
          10% { opacity: 1; }
          70% { opacity: 0.9; }
          100% {
            opacity: 0;
            left: 50%; top: 50%;
            transform: translate(-50%, -50%) scale(0) rotate(var(--rot));
          }
        }
        @keyframes jonas-hole {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.5); }
          15% { opacity: 0.8; transform: translate(-50%,-50%) scale(1); }
          50% { transform: translate(-50%,-50%) scale(1.3); box-shadow: 0 0 60px rgba(99,102,241,0.6); }
          58% { transform: translate(-50%,-50%) scale(2); opacity: 1; }
          62% { opacity: 0; transform: translate(-50%,-50%) scale(0); }
          100% { opacity: 0; }
        }
        @keyframes jonas-vortex {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0); }
          10% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          55% { opacity: 1; transform: translate(-50%,-50%) scale(1.3); }
          62% { opacity: 0; transform: translate(-50%,-50%) scale(3); }
          100% { opacity: 0; }
        }
        @keyframes jonas-fast-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes jonas-explode {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.3) rotate(0deg); }
          15% { opacity: 1; transform: translate(-50%,-50%) scale(1.2) rotate(calc(var(--espin) * 0.2)); }
          100% { opacity: 0; transform: translate(calc(-50% + var(--ex)), calc(-50% + var(--ey))) scale(0.4) rotate(var(--espin)); }
        }
        @keyframes jonas-shockwave {
          0% { opacity: 0.8; width: 10px; height: 10px; border-width: 3px; }
          100% { opacity: 0; width: 150vw; height: 150vw; border-width: 1px; }
        }
        @keyframes jonas-flash {
          0% { opacity: 0; }
          30% { opacity: 0.9; }
          100% { opacity: 0; }
        }
        @keyframes jonas-name {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.3); }
          20% { opacity: 1; transform: translate(-50%,-50%) scale(1.15); }
          30% { transform: translate(-50%,-50%) scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes jonas-rainbow { 0% { background-position: 0% 50%; } 100% { background-position: 400% 50%; } }
      `}</style>
    </div>
  )
}

// 👻💻 Dev fantôme — easter egg Michel
function GhostDevAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 8000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const codeSnippets = [
    'git commit -m "fix"', 'npm install', 'console.log("ici")',
    'TODO: finir ça', '// Michel was here', 'git stash',
    'sudo rm -rf node_modules', 'localhost:3000', 'CTRL+Z CTRL+Z',
    '¯\\_(ツ)_/¯', 'merge conflict 💀', 'git blame michel',
  ]
  const ghosts = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    top: 10 + Math.random() * 70,
    delay: 0.5 + Math.random() * 4,
    size: 1.5 + Math.random() * 2,
    duration: 2 + Math.random() * 2,
  }))
  const statusMessages = [
    '🟡 En réunion', '🔴 Absent', '🟡 Revient dans 5 min',
    '🔴 En télétravail (peut-être)', '🟡 Pause café (depuis 2h)',
    '🔴 "Mon micro marche pas"',
  ]
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Glitchy bg */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(30,30,50,0.15) 100%)',
        animation: 'michel-bg 8s ease-in-out forwards',
      }} />
      {/* Michel appearing and disappearing — half opacity */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        fontSize: '5rem',
        animation: 'michel-appear 8s 0.5s ease-in-out forwards', opacity: 0,
      }}>
        <div style={{ animation: 'michel-flicker 0.3s ease-in-out infinite alternate' }}>👨‍💻</div>
      </div>
      {/* "À moitié là" — literally half visible */}
      <div style={{
        position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%,-50%)',
        overflow: 'hidden', animation: 'michel-name 7s 1s ease-out forwards', opacity: 0,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '2rem', fontWeight: 'bold', color: '#a0a0a0',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.9) 50%, transparent 50%, transparent 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Michel</div>
        <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '2px' }}>
          50% présent, 100% dev
        </div>
      </div>
      {/* Ghost copies drifting */}
      {ghosts.map(g => (
        <div key={g.id} style={{
          position: 'absolute', left: `${g.left}%`, top: `${g.top}%`,
          fontSize: `${g.size}rem`,
          animation: `michel-ghost ${g.duration}s ${g.delay}s ease-in-out forwards`,
          opacity: 0,
        }}>👻</div>
      ))}
      {/* Floating code snippets */}
      {codeSnippets.map((s, i) => (
        <div key={`code-${i}`} style={{
          position: 'absolute',
          left: `${5 + Math.random() * 85}%`,
          top: `${10 + Math.random() * 75}%`,
          fontFamily: 'monospace', fontSize: '0.65rem',
          color: 'rgba(0,255,100,0.5)',
          animation: `michel-code 2s ${1.5 + i * 0.4}s ease-out forwards`,
          opacity: 0, whiteSpace: 'nowrap',
        }}>{s}</div>
      ))}
      {/* Status popup cycling */}
      <div style={{
        position: 'absolute', top: '65%', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(30,30,40,0.8)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px', padding: '6px 14px',
        animation: 'michel-status 7s 2s ease-in-out forwards', opacity: 0,
      }}>
        <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '2px' }}>Statut Teams :</div>
        <div style={{
          fontSize: '0.85rem', color: '#ccc',
          animation: 'michel-status-cycle 6s 2.5s steps(6) forwards',
        }}>
          {statusMessages.map((m, i) => (
            <div key={i} style={{
              position: i === 0 ? 'relative' : 'absolute', top: 0, left: 0,
              animation: `michel-status-item 1s ${2.5 + i}s ease-in-out forwards`,
              opacity: i === 0 ? 1 : 0,
            }}>{m}</div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes michel-bg { 0% { opacity: 0; } 5% { opacity: 1; } 88% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes michel-appear {
          0% { opacity: 0; }
          10% { opacity: 0.5; }
          20% { opacity: 0.15; }
          30% { opacity: 0.5; }
          40% { opacity: 0.1; }
          50% { opacity: 0.5; }
          60% { opacity: 0.2; }
          70% { opacity: 0.5; }
          80% { opacity: 0.1; }
          85% { opacity: 0.4; }
          90% { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes michel-flicker {
          0% { transform: scale(1) translateX(0); filter: blur(0); }
          100% { transform: scale(1.02) translateX(2px); filter: blur(0.5px); }
        }
        @keyframes michel-name {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.5); }
          12% { opacity: 0.8; transform: translate(-50%,-50%) scale(1.05); }
          20% { opacity: 0.5; }
          30% { opacity: 0.8; }
          40% { opacity: 0.3; }
          50% { opacity: 0.7; }
          80% { opacity: 0.5; }
          100% { opacity: 0; }
        }
        @keyframes michel-ghost {
          0% { opacity: 0; transform: scale(0.5); }
          30% { opacity: 0.4; transform: scale(1) translateY(-10px); }
          70% { opacity: 0.2; transform: scale(0.9) translateY(-30px); }
          100% { opacity: 0; transform: scale(0.5) translateY(-50px); }
        }
        @keyframes michel-code {
          0% { opacity: 0; transform: translateY(5px); }
          30% { opacity: 0.6; transform: translateY(0); }
          70% { opacity: 0.4; }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes michel-status {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
          10% { opacity: 0.9; transform: translateX(-50%) translateY(0); }
          85% { opacity: 0.9; }
          100% { opacity: 0; }
        }
        @keyframes michel-status-item {
          0% { opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// 📢🔍 SEO mystérieux qui parle fort — easter egg Yassine
function SeoLoudAnimation() {
  const [active, setActive] = useState(true)
  useEffect(() => { const t = setTimeout(() => setActive(false), 8000); return () => clearTimeout(t) }, [])
  if (!active) return null
  const seoTerms = [
    'BACKLINKS', 'H1', 'META DESC', 'SERP', 'CRAWL', 'INDEXATION',
    'CANONICAL', 'SITEMAP.XML', 'SCHEMA.ORG', 'CORE WEB VITALS',
    'ALT TEXT', '301 REDIRECT', 'ROBOTS.TXT', 'KEYWORD DENSITY',
    'FEATURED SNIPPET', 'E-E-A-T', 'PAGE RANK', 'NOFOLLOW',
  ]
  const shouts = [
    'MAIS ATTENDS !!!', 'NON MAIS LÀ C\'EST GRAVE !', 'TU M\'ENTENDS ?!',
    'FAUT OPTIMISER ÇA !!!', 'LE TITLE TAG !!', 'J\'AI DIT QUOI ?!',
  ]
  const floatingTerms = seoTerms.map((t, i) => ({
    id: i, text: t,
    startX: Math.random() * 100, startY: Math.random() * 100,
    delay: 0.5 + Math.random() * 4, size: 0.55 + Math.random() * 0.4,
  }))
  const soundWaves = Array.from({ length: 5 }, (_, i) => ({
    id: i, delay: 1.5 + i * 0.8,
  }))
  const mysterySymbols = Array.from({ length: 12 }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100,
    delay: 1 + Math.random() * 5,
    symbol: ['👁️', '🔮', '🌙', '⚗️', '🗝️', '🔺'][Math.floor(Math.random() * 6)],
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {/* Dark mysterious bg */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(20,0,40,0.3) 0%, rgba(0,10,0,0.2) 60%, transparent 85%)',
        animation: 'yass-bg 8s ease-in-out forwards',
      }} />
      {/* Mystery symbols fading in/out */}
      {mysterySymbols.map(m => (
        <div key={`mys-${m.id}`} style={{
          position: 'absolute', left: `${m.left}%`, top: `${m.top}%`,
          fontSize: '1.5rem', opacity: 0,
          animation: `yass-mystery 2.5s ${m.delay}s ease-in-out forwards`,
        }}>{m.symbol}</div>
      ))}
      {/* Google search bar at top */}
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '24px', padding: '8px 20px', width: '280px',
        animation: 'yass-search 7s 0.5s ease-out forwards', opacity: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1rem' }}>🔍</span>
          <span style={{
            fontFamily: 'monospace', fontSize: '0.75rem', color: '#4ade80',
            overflow: 'hidden', whiteSpace: 'nowrap',
            animation: 'yass-typing 3s 1s steps(20) forwards', width: 0,
          }}>yassine seo expert secrets</span>
        </div>
        <div style={{
          fontSize: '0.55rem', color: '#22c55e', marginTop: '4px',
          animation: 'yass-results 5s 3s ease-out forwards', opacity: 0,
        }}>
          #1 sur Google — 1 340 000 résultats (0.02s)
        </div>
      </div>
      {/* Center: Yassine speaking LOUD */}
      <div style={{
        position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%,-50%)',
        textAlign: 'center',
        animation: 'yass-center 7s 0.8s ease-out forwards', opacity: 0,
      }}>
        <div style={{
          fontSize: '4rem',
          animation: 'yass-shake 0.15s ease-in-out infinite alternate',
        }}>🗣️</div>
      </div>
      {/* Sound waves emanating */}
      {soundWaves.map(w => (
        <div key={`wave-${w.id}`} style={{
          position: 'absolute', top: '36%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '20px', height: '20px', borderRadius: '50%',
          border: '2px solid rgba(239,68,68,0.5)',
          animation: `yass-wave 1s ${w.delay}s ease-out forwards`, opacity: 0,
        }} />
      ))}
      {/* Shout bubbles popping up */}
      {shouts.map((s, i) => (
        <div key={`shout-${i}`} style={{
          position: 'absolute',
          left: `${15 + (i % 3) * 30}%`,
          top: `${25 + Math.floor(i / 3) * 35}%`,
          background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '12px', padding: '4px 10px',
          fontSize: '0.7rem', fontWeight: 'bold', color: '#ef4444',
          animation: `yass-shout 1.5s ${2 + i * 0.7}s ease-out forwards`, opacity: 0,
          whiteSpace: 'nowrap',
        }}>{s}</div>
      ))}
      {/* Name */}
      <div style={{
        position: 'absolute', top: '55%', left: '50%',
        transform: 'translate(-50%,-50%)', textAlign: 'center',
        animation: 'yass-name 6s 1.5s ease-out forwards', opacity: 0,
      }}>
        <div style={{
          fontSize: '2rem', fontWeight: 'bold',
          background: 'linear-gradient(90deg, #4ade80, #22d3ee, #a78bfa)',
          backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'yass-gradient 2s linear infinite',
        }}>YASSINE 📢</div>
        <div style={{ fontSize: '0.7rem', color: '#4ade80', marginTop: '3px', letterSpacing: '2px' }}>
          SEO SORCERER 🔮 · VOLUME: MAX 🔊
        </div>
      </div>
      {/* Floating SEO terms */}
      {floatingTerms.map(t => (
        <div key={`seo-${t.id}`} style={{
          position: 'absolute', left: `${t.startX}%`, top: `${t.startY}%`,
          fontFamily: 'monospace', fontSize: `${t.size}rem`, fontWeight: 'bold',
          color: 'rgba(74,222,128,0.35)',
          animation: `yass-term 2s ${t.delay}s ease-in-out forwards`, opacity: 0,
        }}>{t.text}</div>
      ))}
      {/* Screen shake on shout */}
      <div style={{
        position: 'absolute', inset: 0,
        animation: 'yass-screenshake 0.1s 2.5s ease-in-out 8',
      }} />
      <style>{`
        @keyframes yass-bg { 0% { opacity: 0; } 5% { opacity: 1; } 88% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes yass-mystery {
          0% { opacity: 0; transform: scale(0.5) rotate(-20deg); }
          40% { opacity: 0.4; transform: scale(1.1) rotate(5deg); }
          100% { opacity: 0; transform: scale(0.8) rotate(20deg); }
        }
        @keyframes yass-search {
          0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          10% { opacity: 1; transform: translateX(-50%) translateY(0); }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes yass-typing { 0% { width: 0; } 100% { width: 180px; } }
        @keyframes yass-results { 0% { opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes yass-center {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.3); }
          10% { opacity: 1; transform: translate(-50%,-50%) scale(1.2); }
          15% { transform: translate(-50%,-50%) scale(1); }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes yass-shake {
          0% { transform: scale(1) rotate(-2deg); }
          100% { transform: scale(1.08) rotate(2deg); }
        }
        @keyframes yass-wave {
          0% { opacity: 0.7; width: 20px; height: 20px; border-width: 2px; }
          100% { opacity: 0; width: 60vw; height: 60vw; border-width: 1px; }
        }
        @keyframes yass-shout {
          0% { opacity: 0; transform: scale(0.5); }
          20% { opacity: 1; transform: scale(1.15); }
          30% { transform: scale(1); }
          70% { opacity: 1; }
          100% { opacity: 0; transform: scale(0.9); }
        }
        @keyframes yass-name {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.5); }
          10% { opacity: 1; transform: translate(-50%,-50%) scale(1.1); }
          18% { transform: translate(-50%,-50%) scale(1); }
          82% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes yass-gradient { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        @keyframes yass-term {
          0% { opacity: 0; transform: translateY(5px); }
          30% { opacity: 0.4; transform: translateY(0); }
          70% { opacity: 0.25; }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes yass-screenshake {
          0% { transform: translate(0,0); }
          25% { transform: translate(-3px, 2px); }
          50% { transform: translate(3px, -2px); }
          75% { transform: translate(-2px, -1px); }
          100% { transform: translate(0,0); }
        }
      `}</style>
    </div>
  )
}
