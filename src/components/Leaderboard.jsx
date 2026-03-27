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
                px-4 py-3 flex items-center gap-3 transition-colors
                ${isMe ? 'bg-accent-violet/5' : 'hover:bg-white/[0.02]'}
              `}
            >
              {/* Rank */}
              <span className="w-6 text-center">
                {medal || <span className="text-xs text-gray-600 font-mono">{i + 1}</span>}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium truncate text-sm ${isMe ? 'text-accent-violet' : 'text-white'}`}>
                    {player.name}
                    {isMe && <span className="text-[10px] text-gray-500 ml-1">(toi)</span>}
                  </span>
                  {player.found > 0 && <span className="text-xs">{player.found}/{player.roundsTotal || 3} 🥳</span>}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                  <span>{player.guesses} essai{player.guesses !== 1 ? 's' : ''}</span>
                  {player.bestScore != null && (
                    <>
                      <span>·</span>
                      <span className="font-mono">{player.bestScore.toFixed(1)}°</span>
                      <span>{player.emoji}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Best rank */}
              {player.bestRank && (
                <div className="text-right">
                  <div className="text-xs font-mono text-gray-400">{player.bestRank}</div>
                  <div className="text-[10px] text-gray-600">rang</div>
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
