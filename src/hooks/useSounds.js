import { useRef, useCallback } from 'react'

// Generate simple sounds using Web Audio API — no audio files needed
export default function useSounds(enabled) {
  const ctxRef = useRef(null)

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return ctxRef.current
  }

  const playTone = useCallback((freq, duration, type = 'sine', volume = 0.15) => {
    if (!enabled) return
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.value = freq
      gain.gain.value = volume
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch {}
  }, [enabled])

  const ice = useCallback(() => {
    // Low descending tone
    if (!enabled) return
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 300
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3)
      gain.gain.value = 0.1
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    } catch {}
  }, [enabled])

  const cold = useCallback(() => {
    playTone(250, 0.2, 'sine', 0.1)
  }, [enabled, playTone])

  const cool = useCallback(() => {
    playTone(400, 0.15, 'sine', 0.1)
  }, [enabled, playTone])

  const warm = useCallback(() => {
    // Rising tone
    if (!enabled) return
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 400
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2)
      gain.gain.value = 0.12
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.3)
    } catch {}
  }, [enabled])

  const hot = useCallback(() => {
    // Quick double beep
    if (!enabled) return
    playTone(600, 0.1, 'sine', 0.12)
    setTimeout(() => playTone(800, 0.1, 'sine', 0.12), 120)
  }, [enabled, playTone])

  const fire = useCallback(() => {
    // Rising triple
    if (!enabled) return
    playTone(500, 0.1, 'sine', 0.12)
    setTimeout(() => playTone(700, 0.1, 'sine', 0.12), 100)
    setTimeout(() => playTone(900, 0.15, 'sine', 0.12), 200)
  }, [enabled, playTone])

  const bingo = useCallback(() => {
    // Victory fanfare
    if (!enabled) return
    const notes = [523, 659, 784, 1047] // C E G C
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 'sine', 0.15), i * 150)
    })
  }, [enabled, playTone])

  const unknown = useCallback(() => {
    // Error buzz
    if (!enabled) return
    playTone(150, 0.15, 'square', 0.05)
  }, [enabled, playTone])

  const forEmoji = useCallback((emoji) => {
    const map = {
      '🧊': ice,
      '🥶': cold,
      '😎': cool,
      '🥵': warm,
      '🔥': hot,
      '😱': fire,
      '🥳': bingo,
    }
    const fn = map[emoji]
    if (fn) fn()
  }, [ice, cold, cool, warm, hot, fire, bingo])

  return { ice, cold, cool, warm, hot, fire, bingo, unknown, forEmoji }
}
