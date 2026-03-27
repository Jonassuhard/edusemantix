import { db, firebaseEnabled } from './firebase.js'

// ── Helpers ──

function todayStr() {
  return new Date().toISOString().slice(0, 10) // "2026-03-27"
}

// ── Public API ──

/**
 * Save a player's result for a specific round.
 * Collection: results/{date}_{name}_{round}
 */
export async function savePlayerResult(playerName, date, round, word, guessCount, timeSeconds, found) {
  if (!firebaseEnabled) return
  try {
    const docId = `${date}_${playerName}_${round}`
    await db.collection('results').doc(docId).set({
      playerName,
      date,
      round,
      word,
      guessCount,
      timeSeconds,
      found,
      createdAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('savePlayerResult error:', err.message)
  }
}

/**
 * Update player document after a game result.
 * Collection: players/{name}
 */
export async function updatePlayerAfterGame(playerName, found, guessCount) {
  if (!firebaseEnabled) return
  try {
    const ref = db.collection('players').doc(playerName)
    const doc = await ref.get()
    const today = todayStr()

    if (!doc.exists) {
      // First time player
      await ref.set({
        totalGames: 1,
        wins: found ? 1 : 0,
        totalGuesses: guessCount,
        bestStreak: found ? 1 : 0,
        currentStreak: found ? 1 : 0,
        lastPlayDate: today,
        createdAt: new Date().toISOString(),
      })
    } else {
      const data = doc.data()
      const isConsecutive = isNextDay(data.lastPlayDate, today)
      let currentStreak = data.currentStreak || 0
      let bestStreak = data.bestStreak || 0

      if (found) {
        currentStreak = isConsecutive || data.lastPlayDate === today
          ? currentStreak + 1
          : 1
        bestStreak = Math.max(bestStreak, currentStreak)
      } else {
        // Only reset streak if it's a new day (not same day)
        if (data.lastPlayDate !== today) {
          currentStreak = 0
        }
      }

      await ref.update({
        totalGames: (data.totalGames || 0) + 1,
        wins: (data.wins || 0) + (found ? 1 : 0),
        totalGuesses: (data.totalGuesses || 0) + guessCount,
        bestStreak,
        currentStreak,
        lastPlayDate: today,
      })
    }
  } catch (err) {
    console.error('updatePlayerAfterGame error:', err.message)
  }
}

/**
 * Get persistent stats for a player.
 */
export async function getPlayerStats(playerName) {
  if (!firebaseEnabled) return null
  try {
    const doc = await db.collection('players').doc(playerName).get()
    if (!doc.exists) return null
    const d = doc.data()
    return {
      totalGames: d.totalGames || 0,
      wins: d.wins || 0,
      avgGuesses: d.totalGames > 0 ? Math.round((d.totalGuesses || 0) / d.totalGames * 10) / 10 : 0,
      bestStreak: d.bestStreak || 0,
      currentStreak: d.currentStreak || 0,
      lastPlayDate: d.lastPlayDate || null,
    }
  } catch (err) {
    console.error('getPlayerStats error:', err.message)
    return null
  }
}

/**
 * Get today's results (daily leaderboard from Firestore).
 */
export async function getDailyLeaderboard(date) {
  if (!firebaseEnabled) return []
  try {
    const snap = await db.collection('results')
      .where('date', '==', date)
      .where('found', '==', true)
      .orderBy('guessCount', 'asc')
      .limit(50)
      .get()
    return snap.docs.map(d => d.data())
  } catch (err) {
    console.error('getDailyLeaderboard error:', err.message)
    return []
  }
}

/**
 * All-time leaderboard: top players ranked by wins.
 */
export async function getAllTimeLeaderboard() {
  if (!firebaseEnabled) return []
  try {
    const snap = await db.collection('players')
      .orderBy('wins', 'desc')
      .limit(50)
      .get()
    return snap.docs.map(d => {
      const data = d.data()
      return {
        name: d.id,
        wins: data.wins || 0,
        totalGames: data.totalGames || 0,
        avgGuesses: data.totalGames > 0 ? Math.round((data.totalGuesses || 0) / data.totalGames * 10) / 10 : 0,
        bestStreak: data.bestStreak || 0,
        currentStreak: data.currentStreak || 0,
      }
    })
  } catch (err) {
    console.error('getAllTimeLeaderboard error:', err.message)
    return []
  }
}

// ── Date helpers ──

function isNextDay(dateStrA, dateStrB) {
  if (!dateStrA || !dateStrB) return false
  const a = new Date(dateStrA)
  const b = new Date(dateStrB)
  const diffMs = b.getTime() - a.getTime()
  const diffDays = Math.round(diffMs / 86400000)
  return diffDays === 1
}
