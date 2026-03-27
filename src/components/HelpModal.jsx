export default function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 max-w-md w-full animate-slide-up max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl">✕</button>

        <h2 className="text-xl font-bold mb-4">
          <span className="bg-gradient-to-r from-accent-violet to-accent-orange bg-clip-text text-transparent">
            Comment jouer ?
          </span>
        </h2>

        <div className="space-y-4 text-sm text-gray-300">
          <div>
            <h3 className="font-semibold text-white mb-1">Le principe</h3>
            <p>Trouve le mot secret du jour en tapant des mots. Chaque mot reçoit un <strong>score de proximite semantique</strong> — plus le score est eleve, plus tu es proche du mot secret.</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">C'est quoi la "proximite semantique" ?</h3>
            <p>C'est la distance entre les <strong>sens</strong> des mots, pas les lettres. Par exemple, "chat" est semantiquement proche de "chien" mais pas de "chapeau".</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">Les temperatures</h3>
            <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
              <span>🥳 100° = Trouve !</span>
              <span>😱 60°+ = Tres proche</span>
              <span>🔥 45°+ = Brulant</span>
              <span>🥵 33°+ = Chaud</span>
              <span>😎 18°+ = Tiede</span>
              <span>🥶 0°+ = Froid</span>
              <span>🧊 Negatif = Glace</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">Le rang</h3>
            <p>Si ton mot est dans le <strong>top 1000</strong> des mots les plus proches, un rang s'affiche (1 a 999). Le rang 999 = le plus proche apres le mot secret.</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">Quels mots sont acceptes ?</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li><strong>342 000+ mots</strong> francais reconnus</li>
              <li>Noms communs, adjectifs, verbes a l'infinitif</li>
              <li>Pas de noms propres (Paris, France...)</li>
              <li>Pas de conjugaisons (mange, mangeait...)</li>
              <li>Accents acceptes (ecole = ecole)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">Indices</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Apres <strong>30 essais</strong> : nombre de lettres</li>
              <li>Apres <strong>50 essais</strong> : premiere lettre</li>
              <li>Apres <strong>80 essais</strong> : categorie du mot</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">Multiplayer</h3>
            <p>Tu vois les scores des autres en temps reel, mais pas leurs mots. Le classement trie par : mot trouve d'abord, puis par meilleur score.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-violet to-accent-orange text-white font-semibold hover:opacity-90 transition-opacity"
        >
          C'est parti !
        </button>
      </div>
    </div>
  )
}
