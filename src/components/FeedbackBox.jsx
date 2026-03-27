import { useState } from 'react'
import socket from '../socket'

export default function FeedbackBox() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!message.trim()) return
    socket.emit('feedback', message.trim().slice(0, 500))
    setSent(true)
    setMessage('')
    setTimeout(() => { setSent(false); setOpen(false) }, 2500)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="glass rounded-xl px-4 py-3 text-xs text-gray-500 hover:text-gray-300 transition-colors w-full text-left flex items-center gap-2"
      >
        <span>💡</span>
        <span>Une idée ? Propose une amélioration</span>
      </button>
    )
  }

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-300">
          <span>💡</span>
          <span>Boîte à idées</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-600 hover:text-gray-400 text-xs min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>

      {sent ? (
        <div className="text-center py-3">
          <span className="text-2xl">✅</span>
          <p className="text-sm text-temp-bingo mt-1">Merci ! Jonas a reçu ton message</p>
        </div>
      ) : (
        <>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Bug, idée de feature, mot à ajouter, easter egg..."
            maxLength={500}
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-white/10 text-white text-sm placeholder-gray-600 resize-none focus:border-accent-violet/50 transition-colors"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-gray-600">{message.length}/500</span>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="px-4 py-2.5 min-h-[44px] rounded-lg bg-gradient-to-r from-accent-violet to-accent-orange text-white text-xs font-medium disabled:opacity-30 hover:opacity-90 active:scale-95 transition-all"
            >
              Envoyer 🚀
            </button>
          </div>
        </>
      )}
    </div>
  )
}
