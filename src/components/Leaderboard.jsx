export default function Leaderboard({ players, currentUser }) {
  if (players.length === 0) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Classement</h2>
        <p className="text-gray-600 text-sm">En attente de joueurs...</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5">
        <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <span>🏆</span> Classement live
        </h2>
      </div>

      <div className="divide-y divide-white/[0.03]">
        {players.map((player, i) => {
          const isMe = player.name === currentUser
          const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''

          return (
            <div
              key={player.name}
              className={`
                px-4 py-3 transition-colors
                ${isMe ? 'bg-accent-violet/5' : 'hover:bg-white/[0.02]'}
              `}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <span className="w-6 text-center shrink-0">
                  {medal || <span className="text-xs text-gray-600 font-mono">{i + 1}</span>}
                </span>

                {/* Name + total */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium truncate text-sm ${isMe ? 'text-accent-violet' : 'text-white'}`}>
                      {player.name}
                      {isMe && <span className="text-[10px] text-gray-500 ml-1">(toi)</span>}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {player.guesses} essai{player.guesses !== 1 ? 's' : ''} · {player.found}/{player.roundsTotal || 3} trouvé{player.found > 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Per-round progress */}
              {player.rounds && (
                <div className="flex gap-1.5 mt-2 ml-9">
                  {player.rounds.map((r, ri) => (
                    <div
                      key={ri}
                      className={`
                        flex-1 rounded-lg px-2 py-1.5 text-center text-[10px] border
                        ${r.found
                          ? 'bg-temp-bingo/10 border-temp-bingo/30 text-temp-bingo'
                          : r.guesses > 0
                            ? 'bg-white/[0.03] border-white/10 text-gray-400'
                            : 'bg-white/[0.01] border-white/5 text-gray-600'
                        }
                      `}
                    >
                      <div className="font-medium">
                        {r.found ? '🥳' : r.guesses > 0 ? r.emoji || '🔍' : '—'}
                      </div>
                      <div className="mt-0.5">
                        {r.found
                          ? `${r.guesses}e`
                          : r.guesses > 0
                            ? `${r.bestScore}°`
                            : `M${ri + 1}`
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="px-4 py-2 border-t border-white/5 text-[11px] text-gray-600 text-center">
        Les mots des autres restent secrets 🤫
      </div>
    </div>
  )
}
