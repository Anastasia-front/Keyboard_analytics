import { useEffect } from 'react'

import { runInAction } from 'mobx'

import { io } from 'socket.io-client'

import { StatsStore } from '@/stores'

export const useWebSocket = (store: StatsStore) => {
  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000',
      {
        transports: ['websocket'], // force websocket, skip polling
      },
    )

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server')
    })

    socket.on('stats', (stats) => {
      runInAction(() => {
        store.setStats(stats)
      })
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server')
    })

    const handleKeyPress = (e: KeyboardEvent) => {
      socket.emit('keyPress', { key: e.key })
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      socket.disconnect()
    }
  }, [store])
}
