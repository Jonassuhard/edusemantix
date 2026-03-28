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
          350K mots FR, 100d   Stats persistantes   87 jours x 3 mots
          Cosine similarity    Leaderboard all-time  (148 mots uniques)
```

## Fichiers cles
- `server/index.js` — Express + Socket.io + rate limiting + CORS
- `server/game.js` — GameEngine : vecteurs, similarite, leaderboard live, indices, 3 rounds/jour
- `server/firebase.js` — Init Firebase Admin SDK (env vars ou fichier local)
- `server/db.js` — Firestore CRUD : results, players, leaderboards
- `data/vectors_a.bin` + `vectors_b.bin` — Vecteurs Numberbatch (2x67MB, split pour GitHub)
- `data/vectors.json` — Index des 350K mots
- `data/schedule.json` — 87 jours x 3 mots (facile, Eduservices, difficile)
- `src/App.jsx` — App principale + localStorage + stats + sons + timer + BINGO anims
- `src/components/` — 15 composants React
- `scripts/convert_numberbatch_slim.py` — Generation vecteurs depuis Numberbatch (filtre anti-conjugaisons)

## Structure des 3 rounds/jour
| Round | Theme | Difficulte | Exemples |
|-------|-------|-----------|----------|
| 1 | Facile (mot courant) | Court, accessible | chat, soleil, maison, pomme, lion |
| 2 | Eduservices (bureau/ecole) | Moyen | alternance, marketing, reunion, newsletter |
| 3 | Difficile (rare/abstrait) | Long, abstrait | ephemere, metamorphose, palindrome, oxymoron |

## Features
- 350 000 mots francais (ConceptNet Numberbatch — associations intuitives)
- 87 jours x 3 mots = ~3 mois de jeu (facile / Eduservices / difficile)
- 3 rounds/jour avec tabs — debloquer le suivant en trouvant le precedent
- Multiplayer live via WebSocket (scores visibles, mots caches)
- Leaderboard Live + All-time (Firebase persistant)
- Barre resume emojis + compteurs par zone
- Legende temperature (toggle)
- Page "Comment jouer" avec regles completes (3 rounds, indices, 350K mots)
- Timer jeu + timer prochain mot (countdown)
- Indices progressifs (10/20/30 essais ou 10/20/30 mots froids)
- localStorage : partie + stats + theme sauvegardees
- Stats perso persistantes (Firebase) : joues, gagnes, serie, moyenne
- Mot d'hier revele (les 3)
- Confetti canvas sur victoire (150 particules + 12 emojis)
- 28 mots du schedule avec animations BINGO speciales (ocean, firework, volcano...)
- Modal fermable (retour aux essais apres victoire)
- Partage ameliore (emojis + lien + format Teams)
- Definition du mot (API Wiktionary) apres victoire
- Top 10 mots les plus proches reveles apres victoire
- Tri score/ordre de saisie (toggle)
- Meilleur mot highlight violet
- Auto-reconnect + banniere deconnexion/reconnexion
- Sons Web Audio API (toggle) : ding, splash, fanfare
- 300+ easter eggs avec animations plein ecran
- 32 animations uniques (superheros, weather, mythology, matrix, disco, casino...)
- Page login avec mots flottants + physique 2D realiste (SAT collisions)
- Dark/Light mode persistant (localStorage)
- Notice serveur gratuit (sleep 15min + countdown)
- Feedback box (propositions d'amelioration → data/feedback.txt)
- PWA installable (manifest.json + service worker)
- Responsive mobile (min 44px touch targets, dvh units)
- Rate limiting (10 guesses/5sec, 30 def/min)
- CORS restreint en production
- Tolerance accents (epopee → épopée)
- Meta description + Open Graph tags (SEO/partage social)
- Accessibilite : aria-labels sur tous les boutons

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
# Filtre anti-conjugaisons : penalise -25 les formes verbales, booste +8/+5 noms/adjectifs
```

## Firebase
- Project : edusemantix
- Firestore : eur3 (Europe)
- Auth : via firebase-key.json (local, gitignored) ou env vars sur Render
- Collections : `players` (stats), `results` (daily results)
- Env vars Render : FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY

## Ajouter des mots du jour
Editer `data/schedule.json` — tableau de [facile, eduservices, difficile] par jour.
Chaque mot doit exister dans vectors.json (350K mots).
Verifier avec : `python3 scripts/enrich_schedule_words.py`

## Render
- Plan : Free (512MB RAM, sleep 15min inactivite)
- Build : `npm install && npm run build`
- Start : `node server/index.js`
- Auto-deploy sur push GitHub
- RAM estimee : ~173 MB (vecteurs) + ~50 MB (Node) = ~223 MB
