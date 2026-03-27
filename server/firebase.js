import admin from 'firebase-admin'
import { readFileSync, existsSync } from 'fs'

let db = null
let firebaseEnabled = false

// Try multiple methods to load Firebase credentials:
// 1. Secret file at /etc/secrets/firebase.json (Render Secret Files)
// 2. Environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
// 3. Local file at ./firebase-key.json (dev only, gitignored)

let credential = null

const secretPaths = ['/etc/secrets/firebase.json', './firebase-key.json']
for (const p of secretPaths) {
  if (existsSync(p)) {
    try {
      const raw = readFileSync(p, 'utf-8')
      const json = JSON.parse(raw)
      credential = admin.credential.cert(json)
      console.log(`Firebase credentials loaded from ${p}`)
      break
    } catch (e) {
      console.warn(`Failed to read ${p}:`, e.message)
    }
  }
}

if (!credential) {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
  if (projectId && clientEmail && privateKey) {
    credential = admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    })
    console.log('Firebase credentials loaded from env vars')
  }
}

if (credential) {
  try {
    admin.initializeApp({ credential })
    db = admin.firestore()
    firebaseEnabled = true
    console.log('Firebase Firestore connected!')
  } catch (err) {
    console.warn('Firebase init failed, falling back to in-memory:', err.message)
  }
} else {
  console.log('Firebase not configured — running in-memory only')
}

export { db, firebaseEnabled }
