# CLAUDE.md — EduSemantix

## Projet
Jeu de mots semantique type Cemantix, prive pour l'equipe Eduservices.
Chaque jour 3 mots secrets, les joueurs devinent par proximite semantique.
Scores en direct entre collegues, mots restes secrets.

## Stack
- **Frontend** : React 19 + Vite 6 + Tailwind CSS 3
- **Backend** : Node.js + Express + Socket.io
- **Embeddings** : ConceptNet Numberbatch 19.08 (350K vecteurs FR) → PCA 100d → binaire
- **DB** : Firebase Firestore (stats persistantes, leaderboard all-time)
- **Deploy** : Render free tier (auto-deploy depuis GitHub)
- **Repo** : github.com/Jonassuhard/edusemantix
- **URL** : https://edusemantix.onrender.com

## Architecture
```
[React SPA] <--Socket.io--> [Express server]
                                   |
                    ┌───────────────┼───────────────┐
                    |               |               |
          [vectors_a/b.bin]  [Firebase Firestore]  [schedule.json]
          350K mots FR, 100d   Stats persistantes   91 jours x 3 mots
          Cosine similarity    Leaderboard all-time  (273 mots uniques)
```

## Fichiers cles
- `server/index.js` — Express + Socket.io + rate limiting + CORS
- `server/game.js` — GameEngine : vecteurs, similarite, leaderboard live, indices, 3 rounds/jour
- `server/firebase.js` — Init Firebase Admin SDK (env vars ou fichier local)
- `server/db.js` — Firestore CRUD : results, players, leaderboards
- `data/vectors_a.bin` + `vectors_b.bin` — Vecteurs Numberbatch (2x67MB, split pour GitHub)
- `data/vectors.json` — Index des 350K mots
- `data/schedule.json` — 91 jours x 3 mots (mot general, mot Eduservices, mot fun)
- `src/App.jsx` — App principale + localStorage + stats + sons + timer
- `src/components/` — ~15 composants React
- `scripts/convert_numberbatch_slim.py` — Generation vecteurs depuis Numberbatch

## Structure des 3 rounds/jour
| Round | Theme | Exemples |
|-------|-------|----------|
| 1 | General (nature/science/concept) | épopée, chocolat, tortue |
| 2 | Eduservices/bureau | photocopieuse, café, stagiaire |
| 3 | Fun/mythologie/créatif | dragon, ninja, pirate |

## Features
- 350 000 mots francais (ConceptNet Numberbatch — associations intuitives)
- 91 jours x 3 mots = 273 mots uniques (3 mois sans repetition)
- 3 rounds/jour avec tabs (mot general, bureau, fun)
- Multiplayer live via WebSocket (scores visibles, mots caches)
- Leaderboard Live + All-time (Firebase persistant)
- Barre resume emojis + compteurs par zone
- Legende temperature (toggle)
- Page "Comment jouer" avec regles completes
- Timer jeu + timer prochain mot (countdown)
- Indices progressifs (10/20/30 essais ou 10/20/30 mots froids)
- localStorage : partie + stats + theme sauvegardees
- Stats perso persistantes (Firebase) : joues, gagnes, serie, moyenne
- Mot d'hier revele (les 3)
- Confetti canvas sur victoire (150 particules + 12 emojis)
- Modal fermable (retour aux essais apres victoire)
- Partage ameliore (emojis + lien + format Teams)
- Definition du mot (API Wiktionary) apres victoire
- Top 10 mots les plus proches reveles apres victoire
- Tri score/ordre de saisie (toggle)
- Meilleur mot highlight violet
- Auto-reconnect + banniere deconnexion/reconnexion
- Sons Web Audio API (toggle) : ding, splash, fanfare
- 300+ easter eggs avec animations plein ecran
- 22 animations uniques (superheros, weather, mythology)
- Page login avec mots flottants + physique 2D realiste
- Dark/Light mode persistant
- Notice serveur gratuit (sleep 15min + countdown)
- Feedback box (propositions d'amelioration)
- PWA installable (manifest.json + service worker)
- Responsive mobile
- Rate limiting (guesses + API)
- CORS restreint en production
- Tolerance accents (epopee → épopée)

## Commandes
```bash
npm run dev        # Dev (client + server en parallele)
npm run build      # Build prod
node server/index.js  # Server prod (sert dist/)
```

## Regenerer les vecteurs (Numberbatch)
```bash
# Telecharger numberbatch-19.08.txt.gz (~2GB) dans data/
pip3 install scikit-learn numpy
python3 scripts/convert_numberbatch_slim.py
# Produit vectors.json + vectors_a.bin + vectors_b.bin
```

## Firebase
- Project : edusemantix
- Firestore : eur3 (Europe)
- Auth : via firebase-key.json (local, gitignored) ou env vars sur Render
- Collections : `players` (stats), `results` (daily results)
- Env vars Render : FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY

## Ajouter des mots du jour
Editer `data/schedule.json` — tableau de [mot1, mot2, mot3] par jour.
Chaque mot doit exister dans vectors.json (350K mots).
Verifier avec : `python3 scripts/enrich_schedule_words.py`

## Render
- Plan : Free (512MB RAM, sleep 15min inactivite)
- Build : `npm install && npm run build`
- Start : `node server/index.js`
- Auto-deploy sur push GitHub
- RAM estimee : ~173 MB (vecteurs) + ~50 MB (Node) = ~223 MB
