import { useState, useEffect, useRef } from 'react'

export default function useTimer(isRunning) {
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      if (!startRef.current) startRef.current = Date.now()

      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
      }, 1000)

      return () => clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const reset = () => {
    startRef.current = null
    setElapsed(0)
    clearInterval(intervalRef.current)
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return { elapsed, formatted: formatTime(elapsed), reset }
}
