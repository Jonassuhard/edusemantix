export default function TempLegend() {
  const rows = [
    { rank: '1000', emoji: '🥳', score: '100,00', label: 'BINGO !', color: 'text-temp-bingo' },
    { rank: '999', emoji: '😱', score: '~60+', label: 'Tres proche', color: 'text-temp-fire' },
    { rank: '990', emoji: '🔥', score: '~45+', label: 'Brulant', color: 'text-temp-hot' },
    { rank: '900', emoji: '🥵', score: '~33+', label: 'Chaud', color: 'text-temp-warm' },
    { rank: '1', emoji: '😎', score: '~18+', label: 'Tiede', color: 'text-temp-cool' },
    { rank: '—', emoji: '🥶', score: '≥ 0', label: 'Froid', color: 'text-temp-cold' },
    { rank: '—', emoji: '🧊', score: '< 0', label: 'Glace', color: 'text-temp-ice' },
  ]

  return (
    <div className="glass rounded-xl overflow-hidden animate-slide-up">
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400">Echelle de temperature</span>
        <span className="text-[10px] text-gray-600">Rang = position parmi 1000 mots les plus proches</span>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {rows.map(row => (
          <div key={row.emoji} className="grid grid-cols-[50px_30px_70px_1fr] gap-2 px-4 py-1.5 items-center text-sm">
            <span className={`font-mono text-xs ${row.color}`}>{row.rank}</span>
            <span className="text-center">{row.emoji}</span>
            <span className={`font-mono text-xs ${row.color}`}>{row.score}</span>
            <span className="text-xs text-gray-500">{row.label}</span>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-white/5 text-[10px] text-gray-600">
        Noms communs uniquement — pas de noms propres, verbes conjugues ou pluriels rares
      </div>
    </div>
  )
}
