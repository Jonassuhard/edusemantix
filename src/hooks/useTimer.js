import { useState, useEffect, useRef } from 'react'

export default function useTimer(isRunning) {
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      if (!startRef.current) startRef.current = Date.now()

      const tick = () => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
        frameRef.current = requestAnimationFrame(tick)
      }
      frameRef.current = requestAnimationFrame(tick)

      return () => cancelAnimationFrame(frameRef.current)
    }
  }, [isRunning])

  const reset = () => {
    startRef.current = null
    setElapsed(0)
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return { elapsed, formatted: formatTime(elapsed), reset }
}
