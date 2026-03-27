import { io } from 'socket.io-client'

const URL = import.meta.env.PROD ? '/' : 'http://localhost:3210'
const socket = io(URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 10000,
  timeout: 30000
})

// Re-emit join on reconnect so the server knows who we are
socket.on('reconnect', () => {
  const stored = localStorage.getItem('edusemantix')
  if (stored) {
    try {
      const { username } = JSON.parse(stored)
      if (username) socket.emit('join', username)
    } catch {}
  }
})

export default socket
