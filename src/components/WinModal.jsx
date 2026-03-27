import { useEffect, useState } from 'react'

export default function WinModal({ guessCount, guesses, stats, topWords, round, roundCount, hasNextRound, onNextRound, onClose, elapsedTime, targetWord }) {
  const [visible, setVisible] = useState(false)
  const [definition, setDefinition] = useState(null)
  const [defLoading, setDefLoading] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 300)
  }, [])

  // Fetch definition
  useEffect(() => {
    if (!targetWord) return
    setDefLoading(true)
    fetch(`/api/definition/${encodeURIComponent(targetWord)}`)
      .then(r => r.json())
      .then(data => {
        setDefinition(data.definition || 'Pas de définition trouvée')
        setDefLoading(false)
      })
      .catch(() => { setDefinition(null); setDefLoading(false) })
  }, [targetWord])

  if (!visible) return null

  const sorted = [...guesses].sort((a, b) => a.guessNumber - b.guessNumber)
  const last10 = sorted.slice(-10)
  const emojiStr = sorted.map(g => g.emoji).join('')
  const emojiPreview = last10.map(g => g.emoji).join('')

  const formatTime = (secs) => {
    if (!secs && secs !== 0) return null
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const timeStr = formatTime(elapsedTime)

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <div className="relative glass-strong rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center animate-bingo glow-gold max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-11 h-11 rounded-full border border-white/10 text-gray-500 hover:text-white hover:border-white/30 transition-all flex items-center justify-center text-sm"
            aria-label="Fermer"
          >
            ✕
          </button>

          <div className="text-6xl mb-3">🥳</div>
          <h2 className="text-2xl font-bold mb-1">
            <span className="bg-gradient-to-r from-temp-bingo to-accent-orange bg-clip-text text-transparent">
              BINGO !
            </span>
          </h2>

          {/* Target word reveal */}
          {targetWord && (
            <p className="text-xl font-bold text-white mb-1">
              Le mot était : <span className="bg-gradient-to-r from-accent-violet to-accent-orange bg-clip-text text-transparent">{targetWord}</span>
            </p>
          )}

          {/* Definition */}
          {targetWord && (
            <div className="glass rounded-lg px-3 py-2 mb-3 text-xs text-gray-400 italic">
              {defLoading ? '...' : definition || 'Pas de définition disponible'}
            </div>
          )}

          <div className="flex items-center justify-center gap-3 mb-3">
            <p className="text-gray-400 text-sm">
              en <span className="text-white font-bold font-mono text-lg">{guessCount}</span> essai{guessCount > 1 ? 's' : ''}
            </p>
            {timeStr && (
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <span>⏱️</span>
                <span className="font-mono text-white">{timeStr}</span>
              </p>
            )}
          </div>

          {/* Emoji recap */}
          <div className="flex justify-center gap-0.5 text-xl mb-3 flex-wrap">
            {last10.map((g, i) => (
              <span key={i}>{g.emoji}</span>
            ))}
            {sorted.length > 10 && <span className="text-gray-500 text-xs self-center ml-1">+{sorted.length - 10}</span>}
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-4 gap-2 mb-3">
              <StatBox label="Joués" value={stats.played} />
              <StatBox label="Gagnés" value={stats.won} />
              <StatBox label="Série" value={stats.streak} />
              <StatBox label="Moy." value={stats.avgGuesses || '—'} />
            </div>
          )}

          {/* Share */}
          <div className="glass rounded-xl p-3 mb-3">
            <p className="text-xs text-gray-500 mb-2">Partage ton résultat</p>
            <div className="flex gap-2">
              <ShareButton guessCount={guessCount} emojiStr={emojiStr} timeStr={timeStr} round={round} />
              <ShareTeamsButton guessCount={guessCount} emojiStr={emojiStr} timeStr={timeStr} />
            </div>
          </div>

          {/* Top closest words */}
          {topWords && topWords.length > 0 && (
            <div className="glass rounded-xl p-3 mb-3 text-left">
              <p className="text-xs text-gray-500 mb-2 text-center">Les 10 mots les plus proches</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {topWords.map((tw, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-300 truncate">{tw.word}</span>
                    <span className="text-gray-500 font-mono ml-1">#{tw.rank}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasNextRound ? (
            <button
              onClick={onNextRound}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-violet to-accent-orange text-white font-semibold hover:opacity-90 active:scale-95 transition-all"
            >
              Mot suivant ({round + 2}/{roundCount}) →
            </button>
          ) : (
            <p className="text-sm text-temp-bingo font-medium">
              Tu as trouvé les {roundCount} mots du jour ! 🏆
            </p>
          )}

          <button
            onClick={onClose}
            className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors underline"
          >
            Fermer et voir mes essais
          </button>
        </div>
      </div>
    </>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="glass rounded-lg p-2">
      <div className="text-white font-bold font-mono">{value}</div>
      <div className="text-[10px] text-gray-500">{label}</div>
    </div>
  )
}

function ShareButton({ guessCount, emojiStr, timeStr, round }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const roundLabel = ['Mot 1', 'Mot Eduservices', 'Mot 3'][round] || `Mot ${round + 1}`
    let text = `🔤 EduSemantix — ${roundLabel}\n`
    text += `Trouvé en ${guessCount} essai${guessCount > 1 ? 's' : ''}`
    if (timeStr) text += ` (${timeStr})`
    text += `\n${emojiStr}\nhttps://edusemantix.onrender.com`
    navigator.clipboard.writeText(text)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => { /* Clipboard not available */ })
  }

  return (
    <button
      onClick={handleCopy}
      className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-accent-violet to-accent-orange text-white font-medium text-sm hover:opacity-90 active:scale-95 transition-all"
    >
      {copied ? '✓ Copié !' : '📋 Copier'}
    </button>
  )
}

function ShareTeamsButton({ guessCount, emojiStr, timeStr }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    let text = `🔤 EduSemantix\n`
    text += `J'ai trouvé en ${guessCount} essai${guessCount > 1 ? 's' : ''}`
    if (timeStr) text += ` (⏱️ ${timeStr})`
    text += ` !\n${emojiStr}\nA toi → edusemantix.onrender.com`
    navigator.clipboard.writeText(text)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => { /* Clipboard not available */ })
  }

  return (
    <button
      onClick={handleCopy}
      className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-300 font-medium text-sm hover:bg-white/5 active:scale-95 transition-all"
    >
      {copied ? '✓ Copié !' : '💬 Teams'}
    </button>
  )
}
