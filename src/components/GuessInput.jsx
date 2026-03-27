import { useState, useRef, useEffect } from 'react'

export default function GuessInput({ onGuess, error, disabled }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!disabled) inputRef.current?.focus()
  }, [disabled])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim() || disabled) return
    onGuess(value)
    setValue('')
  }

  return (
    <div>
      <p className="text-[11px] text-gray-600 mb-1.5 px-1">
        Noms communs, adjectifs, verbes a l'infinitif — pas de noms propres, conjugaisons ou pluriels rares
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={disabled ? 'Bravo ! Tu as trouvé !' : 'Tape un mot...'}
            disabled={disabled}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className={`
              w-full px-4 py-3.5 rounded-xl bg-bg-surface border text-white
              placeholder-gray-500 text-lg font-medium transition-all
              ${error
                ? 'border-red-500/50 shake'
                : disabled
                  ? 'border-temp-bingo/30 bg-temp-bingo/5'
                  : 'border-white/10 focus:border-accent-violet/40'
              }
            `}
          />
          {error && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 text-sm animate-slide-up">
              {error}
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className="px-6 rounded-xl bg-gradient-to-r from-accent-violet to-accent-orange text-white font-semibold
            disabled:opacity-20 hover:opacity-90 active:scale-95 transition-all text-lg"
        >
          →
        </button>
      </form>
    </div>
  )
}
