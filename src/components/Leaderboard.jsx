import { useState } from 'react'

export default function Leaderboard({ players, currentUser, allTimeLeaderboard, firebaseConnected }) {
  const [tab, setTab] = useState('live')

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/5">
        <button
          onClick={() => setTab('live')}
          className={`
            flex-1 px-3 py-2.5 text-xs font-semibold transition-colors
            ${tab === 'live'
              ? 'text-white bg-white/[0.05] border-b-2 border-accent-violet'
              : 'text-gray-500 hover:text-gray-300'
            }
          `}
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live
          </span>
        </button>
        <button
          onClick={() => setTab('alltime')}
          className={`
            flex-1 px-3 py-2.5 text-xs font-semibold transition-colors
            ${tab === 'alltime'
              ? 'text-white bg-white/[0.05] border-b-2 border-accent-orange'
              : 'text-gray-500 hover:text-gray-300'
            }
          `}
        >
          <span className="inline-flex items-center gap-1.5">
            <span>&#127942;</span>
            All-time
          </span>
        </button>
      </div>

      {/* Tab content with fixed min-height to prevent layout jump */}
      <div className="min-h-[200px]">
        {tab === 'live' ? (
          <LiveTab players={players} currentUser={currentUser} />
        ) : (
          <AllTimeTab entries={allTimeLeaderboard} currentUser={currentUser} firebaseConnected={firebaseConnected} />
        )}
      </div>
    </div>
  )
}

function LiveTab({ players, currentUser }) {
  if (players.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-gray-600 text-sm">En attente de joueurs...</p>
      </div>
    )
  }

  return (
    <>
      <div className="divide-y divide-white/[0.03]">
        {players.map((player, i) => {
          const isMe = player.name === currentUser
          const medal = i === 0 ? '\u{1F947}' : i === 1 ? '\u{1F948}' : i === 2 ? '\u{1F949}' : ''

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
                    {player.guesses} essai{player.guesses !== 1 ? 's' : ''} · {player.found}/{player.roundsTotal || 3} trouv&eacute;{player.found > 1 ? 's' : ''}
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
                        {r.found ? '\u{1F973}' : r.guesses > 0 ? r.emoji || '\u{1F50D}' : '\u2014'}
                      </div>
                      <div className="mt-0.5">
                        {r.found
                          ? `${r.guesses}e`
                          : r.guesses > 0
                            ? `${r.bestScore}\u00B0`
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
        Les mots des autres restent secrets &#129323;
      </div>
    </>
  )
}

function AllTimeTab({ entries, currentUser, firebaseConnected }) {
  if (!firebaseConnected) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-gray-500 text-sm">Firebase non connect&eacute;</p>
        <p className="text-gray-600 text-[11px] mt-1">Les stats persistantes ne sont pas disponibles</p>
      </div>
    )
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-gray-600 text-sm">Aucune donn&eacute;e yet...</p>
      </div>
    )
  }

  return (
    <>
      {/* Column headers */}
      <div className="px-4 py-2 flex items-center gap-3 text-[10px] text-gray-600 uppercase tracking-wide border-b border-white/5">
        <span className="w-6 text-center shrink-0">#</span>
        <span className="flex-1">Joueur</span>
        <span className="w-10 text-center">W</span>
        <span className="w-10 text-center">Moy</span>
        <span className="w-10 text-center">&#128293;</span>
      </div>

      <div className="divide-y divide-white/[0.03]">
        {entries.map((entry, i) => {
          const isMe = entry.name === currentUser
          const medal = i === 0 ? '\u{1F947}' : i === 1 ? '\u{1F948}' : i === 2 ? '\u{1F949}' : ''

          return (
            <div
              key={entry.name}
              className={`
                px-4 py-2.5 transition-colors
                ${isMe ? 'bg-accent-violet/5' : 'hover:bg-white/[0.02]'}
              `}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <span className="w-6 text-center shrink-0">
                  {medal || <span className="text-xs text-gray-600 font-mono">{i + 1}</span>}
                </span>

                {/* Name + streaks */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-medium truncate text-sm ${isMe ? 'text-accent-violet' : 'text-white'}`}>
                      {entry.name}
                      {isMe && <span className="text-[10px] text-gray-500 ml-1">(toi)</span>}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {entry.currentStreak > 0 && (
                      <span className="text-accent-orange">&#128293;{entry.currentStreak}j</span>
                    )}
                    {entry.currentStreak > 0 && entry.bestStreak > 0 && ' · '}
                    {entry.bestStreak > 0 && (
                      <span>record {entry.bestStreak}j</span>
                    )}
                  </div>
                </div>

                {/* Wins */}
                <span className="w-10 text-center text-sm font-bold text-white">
                  {entry.wins}
                </span>

                {/* Avg guesses */}
                <span className="w-10 text-center text-xs text-gray-400 font-mono">
                  {entry.avgGuesses}
                </span>

                {/* Best streak */}
                <span className="w-10 text-center text-xs text-gray-400 font-mono">
                  {entry.bestStreak}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="px-4 py-2 border-t border-white/5 text-[10px] text-gray-600 text-center">
        W = victoires · Moy = essais/partie · &#128293; = meilleur streak
      </div>
    </>
  )
}
