export default function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-5 sm:p-6 max-w-md w-full animate-slide-up max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Fermer">✕</button>

        <h2 className="text-xl font-bold mb-4">
          <span className="bg-gradient-to-r from-accent-violet to-accent-orange bg-clip-text text-transparent">
            Comment jouer ?
          </span>
        </h2>

        <div className="space-y-4 text-sm text-gray-300">
          <div>
            <h3 className="font-semibold text-white mb-1">🎯 Le principe</h3>
            <p>Chaque jour, <strong>3 mots secrets</strong> a trouver par proximite semantique. Tape un mot, et tu recois un score : plus c'est chaud, plus tu es proche !</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">🧩 Les 3 rounds</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li><strong>Mot 1</strong> — Facile (mot courant)</li>
              <li><strong>Mot 2</strong> — Eduservices (vie de bureau, ecole, com)</li>
              <li><strong>Mot 3</strong> — Difficile (mot rare ou abstrait)</li>
            </ul>
            <p className="mt-1 text-gray-500 text-xs">Trouve le mot 1 pour debloquer le mot 2, puis le mot 3.</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">🧠 La proximite semantique</h3>
            <p>C'est la distance entre les <strong>sens</strong> des mots, pas les lettres. "Chat" est proche de "chien" mais pas de "chapeau". Propulse par ConceptNet Numberbatch (350 000 mots francais).</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">🌡️ Les temperatures</h3>
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
            <h3 className="font-semibold text-white mb-1">📊 Le rang</h3>
            <p>Si ton mot est dans le <strong>top 1000</strong> des mots les plus proches, un rang s'affiche (1 = le plus proche). Rang 999 = tu brules !</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">📝 Quels mots sont acceptes ?</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li><strong>350 000+ mots</strong> francais reconnus</li>
              <li>Noms communs, adjectifs, verbes a l'infinitif</li>
              <li>Pas de noms propres (Paris, France...)</li>
              <li>Les accents sont optionnels (ecole = ecole)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">💡 Indices</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Apres <strong>10 essais</strong> : nombre de lettres</li>
              <li>Apres <strong>20 essais</strong> : premiere lettre</li>
              <li>Apres <strong>30 essais</strong> : categorie du mot</li>
            </ul>
            <p className="mt-1 text-gray-500 text-xs">Les indices se debloquent aussi apres 10/20/30 mots froids d'affilee.</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">👥 Multijoueur</h3>
            <p>Tu vois les scores des autres en temps reel, mais pas leurs mots. Le classement "Live" montre qui joue maintenant, "All-time" montre le classement permanent.</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">🎉 Easter eggs</h3>
            <p>Tape certains mots pour decouvrir des surprises... 👀</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-accent-violet to-accent-orange text-white font-semibold hover:opacity-90 transition-opacity min-h-[48px]"
        >
          C'est parti !
        </button>
      </div>
    </div>
  )
}
