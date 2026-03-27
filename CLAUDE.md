# CLAUDE.md — EduSemantix

## Projet
Jeu de mots semantique type Cemantix, prive pour l'equipe Eduservices.
Chaque jour un mot secret, les joueurs devinent par proximite semantique.
Scores en direct entre collegues, mots restes secrets.

## Stack
- **Frontend** : React 19 + Vite 6 + Tailwind CSS 3
- **Backend** : Node.js + Express + Socket.io
- **Embeddings** : spaCy fr_core_news_lg (500K vecteurs) → PCA 100d → binaire
- **Deploy** : Render free tier (auto-deploy depuis GitHub)
- **Repo** : github.com/Jonassuhard/edusemantix
- **URL** : https://edusemantix.onrender.com

## Architecture
```
[React SPA] <--Socket.io--> [Express server]
                                   |
                          [vectors.bin + vectors.json]
                          342K mots francais, 100d
                          Cosine similarity en temps reel
```

## Fichiers cles
- `server/index.js` — Express + Socket.io, sert le frontend build
- `server/game.js` — GameEngine : chargement vecteurs, similarite, leaderboard
- `data/vectors_a.bin` + `vectors_b.bin` — Vecteurs binaires (split <100MB pour GitHub)
- `data/vectors.json` — Index des 342K mots
- `data/schedule.json` — 80 mots du jour (rotation)
- `src/App.jsx` — App principale + localStorage + stats
- `src/components/` — 9 composants React
- `scripts/export_vectors.py` — Generation des vecteurs depuis spaCy
- `scripts/precompute.py` — Ancien systeme JSON (deprecated)

## Features
- 342 639 mots francais reconnus (n'importe quel mot tape a un score)
- 80 mots du jour (quasi 3 mois de jeu sans repetition)
- Multiplayer live via WebSocket (scores visibles, mots caches)
- Barre resume emojis + compteurs par zone
- Legende temperature (toggle)
- Page "Comment jouer" avec regles completes
- Timer prochain mot (countdown)
- Indices progressifs (30/50/80 essais)
- localStorage : partie + stats sauvegardees entre refresh
- Stats perso : joues, gagnes, serie, moyenne
- Mot d'hier revele
- Confetti canvas sur victoire
- Modal fermable (retour aux essais apres victoire)
- Partage ameliore (emojis + lien)
- Tri score/ordre de saisie (toggle)
- Meilleur mot highlight violet
- Auto-reconnect + banniere deconnexion/reconnexion
- Notice serveur gratuit (sleep 15min)
- PWA installable (manifest.json)
- Responsive mobile
- Gradient temperature bleu→rouge

## Commandes
```bash
npm run dev        # Dev (client + server en parallele)
npm run build      # Build prod
node server/index.js  # Server prod (sert dist/)
```

## Regenerer les vecteurs
```bash
pip install spacy scikit-learn numpy
python -m spacy download fr_core_news_lg
python scripts/export_vectors.py
```

## Ajouter des mots du jour
Editer `data/schedule.json` — tableau de mots. Le mot doit exister dans le vocabulaire (342K mots).

## Render
- Plan : Free (512MB RAM, sleep 15min inactivite)
- Build : `npm install && npm run build`
- Start : `node server/index.js`
- Auto-deploy sur push GitHub
