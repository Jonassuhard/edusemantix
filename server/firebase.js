import admin from 'firebase-admin'

let db = null
let firebaseEnabled = false

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY

if (projectId && clientEmail && privateKey) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        // Render stores env vars with literal \n — convert to real newlines
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    })
    db = admin.firestore()
    firebaseEnabled = true
    console.log(`Firebase connected (project: ${projectId})`)
  } catch (err) {
    console.warn('Firebase init failed, falling back to in-memory:', err.message)
  }
} else {
  console.log('Firebase env vars not set — running in-memory only')
}

export { db, firebaseEnabled }
