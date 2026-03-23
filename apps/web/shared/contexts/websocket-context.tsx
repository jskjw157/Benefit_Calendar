'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface Notification {
  id: string
  type: 'NEW_BENEFIT' | 'DEADLINE_SOON' | 'STATUS_CHANGE'
  title: string
  message: string
  timestamp: string
}

interface WebSocketContextType {
  notifications: Notification[]
  isConnected: boolean
}

const WebSocketContext = createContext<WebSocketContextType>({
  notifications: [],
  isConnected: false
})

interface WebSocketProviderProps {
  children: ReactNode
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Mock WebSocket (to be replaced with real server later)
    const mockNotifications: Notification[] = [
      {
        id: Date.now().toString(),
        type: 'NEW_BENEFIT',
        title: '새로운 혜택',
        message: '청년 창업 지원금 신청이 시작되었습니다',
        timestamp: new Date().toISOString()
      },
      {
        id: (Date.now() + 1).toString(),
        type: 'DEADLINE_SOON',
        title: '마감 임박',
        message: '청년 월세 지원이 3일 후 마감됩니다',
        timestamp: new Date().toISOString()
      }
    ]

    // Simulate initial notification
    const initialTimeout = setTimeout(() => {
      setNotifications([mockNotifications[0]])
      setIsConnected(true)
    }, 2000)

    // Simulate periodic notifications every 30 seconds
    const interval = setInterval(() => {
      const types: Notification['type'][] = ['NEW_BENEFIT', 'DEADLINE_SOON', 'STATUS_CHANGE']
      const messages = {
        NEW_BENEFIT: [
          '청년 창업 지원금 신청이 시작되었습니다',
          '새로운 주거 지원 프로그램이 추가되었습니다',
          '교육 바우처 신청이 열렸습니다'
        ],
        DEADLINE_SOON: [
          '청년 월세 지원이 3일 후 마감됩니다',
          '내일배움카드 신청 마감이 다가옵니다',
          '창업 공간 지원 신청 기한이 얼마 남지 않았습니다'
        ],
        STATUS_CHANGE: [
          '신청하신 혜택의 심사가 진행 중입니다',
          '저장한 혜택의 조건이 변경되었습니다'
        ]
      }

      const randomType = types[Math.floor(Math.random() * types.length)]
      const typeMessages = messages[randomType]
      const randomMessage = typeMessages[Math.floor(Math.random() * typeMessages.length)]

      const mockNotification: Notification = {
        id: Date.now().toString(),
        type: randomType,
        title: randomType === 'NEW_BENEFIT' ? '새로운 혜택' : randomType === 'DEADLINE_SOON' ? '마감 임박' : '상태 변경',
        message: randomMessage,
        timestamp: new Date().toISOString()
      }

      setNotifications(prev => [mockNotification, ...prev.slice(0, 4)])
    }, 30000) // Every 30 seconds

    setIsConnected(true)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [])

  return (
    <WebSocketContext.Provider value={{ notifications, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => useContext(WebSocketContext)
