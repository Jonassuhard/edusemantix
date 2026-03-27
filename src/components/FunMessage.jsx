import { useState, useEffect } from 'react'

// All fun message triggers and their texts
function getFunMessage(guesses, lastResult, round, foundPerRound) {
  if (!lastResult || !lastResult.known) return null

  const guessCount = guesses.length
  const score = lastResult.score
  const rank = lastResult.rank
  const emoji = lastResult.emoji

  // BINGO messages
  if (lastResult.found) {
    if (guessCount <= 3) return { text: "T'es un robot ou quoi ? 🤖", type: 'gold' }
    if (guessCount <= 5) return { text: "Génie. Pur génie. Ou triche. 🧐", type: 'gold' }
    if (guessCount <= 10) return { text: "Pas mal du tout, respect 👏", type: 'gold' }
    if (guessCount <= 20) return { text: "GG bien joué ! 🎯", type: 'gold' }
    if (guessCount >= 100) return { text: "100+ essais mais t'as jamais lâché. Guerrier. 💪", type: 'gold' }
    if (guessCount >= 50) return { text: "La patience paie toujours 😮‍💨", type: 'gold' }

    // Found Eduservices word (round 1)
    if (round === 1) return { text: "Tu connais trop bien le bureau 😂", type: 'gold' }

    // Found all 3
    const allFound = foundPerRound.every(Boolean)
    if (allFound) return { text: "LE GRAND CHELEM ! T'es chaud patate 👑🔥", type: 'gold' }

    return null
  }

  // First guess of the session and already hot
  if (guessCount === 1 && rank && rank >= 900) {
    return { text: "Premier mot et déjà chaud ? Tu triches pas toi ça va ? 👀", type: 'warm' }
  }

  // Rank 999 — closest possible
  if (rank === 999) {
    return { text: "C'EST CHAUD BOUILLANT ! T'y es presque 🫠", type: 'fire' }
  }

  // Score negative
  if (score < -5) {
    return { text: "T'es parti dans l'autre sens là 🧭", type: 'cold' }
  }

  // Check streaks of cold words
  const lastN = guesses.slice(-1 * guesses.length).map(g => g.emoji)
  const recentGuesses = guesses.slice(-5).map(g => g.emoji)
  const coldStreak = recentGuesses.filter(e => e === '🥶' || e === '🧊').length

  if (guessCount >= 3) {
    const last3 = guesses.slice(-3).map(g => g.score)
    if (last3.every(s => s < 0)) {
      return { text: "Antarctique vibes 🐧 T'as besoin d'un chocolat chaud ?", type: 'cold' }
    }
  }

  if (coldStreak >= 5 && guessCount >= 5) {
    return { text: "C'est le Nord ici ❄️ Change de direction !", type: 'cold' }
  }

  // 10 cold in a row
  if (guessCount >= 10) {
    const last10 = guesses.slice(-10).map(g => g.emoji)
    if (last10.every(e => e === '🥶' || e === '🧊')) {
      return { text: "T'as pas pris ta doudoune ? 🧥 Essaie un mot totalement différent", type: 'cold' }
    }
  }

  // First hot word after cold streak
  if ((emoji === '🥵' || emoji === '🔥' || emoji === '😱') && guessCount >= 5) {
    const prevGuesses = guesses.slice(-6, -1)
    const prevCold = prevGuesses.filter(g => g.emoji === '🥶' || g.emoji === '🧊').length
    if (prevCold >= 3) {
      return { text: "Ça chauffe ENFIN ! T'as mangé quoi ce midi ? 🌶️", type: 'warm' }
    }
  }

  // Big score jump (>20 points improvement)
  if (guessCount >= 2) {
    const prevBest = Math.max(...guesses.slice(0, -1).map(g => g.score))
    if (score > prevBest + 20) {
      return { text: "ENFIN tu réfléchis ! 🧠💡", type: 'warm' }
    }
  }

  // Close then far away
  if (guessCount >= 2) {
    const prev = guesses[guesses.length - 2]
    if (prev && prev.rank && prev.rank >= 900 && (!rank || rank < 100)) {
      return { text: "Mais pourquoi t'es reparti là-bas 😭", type: 'cold' }
    }
  }

  // Milestone messages
  if (guessCount === 50) {
    return { text: "50 essais... T'es au bureau ou tu joues ? 😏", type: 'neutral' }
  }
  if (guessCount === 100) {
    return { text: "100 essais. Respect. Ou acharnement. Au choix. 💪", type: 'neutral' }
  }
  if (guessCount === 25) {
    return { text: "25 essais, t'es échauffé maintenant 🏃", type: 'neutral' }
  }
  if (guessCount === 75) {
    return { text: "75... Sarah te regarde pas au moins ? 👀", type: 'neutral' }
  }

  return null
}

const TYPE_STYLES = {
  gold: 'bg-temp-bingo/20 border-temp-bingo/30 text-temp-bingo',
  fire: 'bg-temp-hot/20 border-temp-hot/30 text-temp-hot',
  warm: 'bg-temp-warm/20 border-temp-warm/30 text-temp-warm',
  cold: 'bg-temp-ice/20 border-temp-ice/30 text-temp-ice',
  neutral: 'bg-accent-violet/20 border-accent-violet/30 text-accent-violet'
}

export default function FunMessage({ guesses, lastResult, round, foundPerRound }) {
  const [message, setMessage] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const msg = getFunMessage(guesses, lastResult, round, foundPerRound)
    if (msg) {
      setMessage(msg)
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [lastResult])

  if (!visible || !message) return null

  return (
    <div className={`
      rounded-xl px-4 py-2.5 text-sm font-medium text-center border
      animate-slide-up transition-opacity
      ${TYPE_STYLES[message.type] || TYPE_STYLES.neutral}
    `}>
      {message.text}
    </div>
  )
}
