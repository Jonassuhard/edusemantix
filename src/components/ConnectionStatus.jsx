import { useState, useEffect } from 'react'
import socket from '../socket'

export default function ConnectionStatus() {
  const [status, setStatus] = useState('connected') // connected, disconnected, reconnecting

  useEffect(() => {
    const onConnect = () => setStatus('connected')
    const onDisconnect = () => setStatus('disconnected')
    const onReconnecting = () => setStatus('reconnecting')
    const onReconnect = () => setStatus('connected')

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('reconnect_attempt', onReconnecting)
    socket.on('reconnect', onReconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('reconnect_attempt', onReconnecting)
      socket.off('reconnect', onReconnect)
    }
  }, [])

  if (status === 'connected') return null

  return (
    <div className={`
      fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-xl text-sm font-medium
      animate-slide-up flex items-center gap-2
      ${status === 'disconnected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : ''}
      ${status === 'reconnecting' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : ''}
    `}>
      {status === 'disconnected' && (
        <>
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>Deconnecte — le serveur s'est endormi</span>
        </>
      )}
      {status === 'reconnecting' && (
        <>
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          <span>Reconnexion en cours...</span>
        </>
      )}
    </div>
  )
}
