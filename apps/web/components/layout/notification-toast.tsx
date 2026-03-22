'use client'

import { useWebSocket } from '@/shared/contexts/websocket-context'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, X, Flame, Sparkles, Info } from 'lucide-react'
import { useState, useEffect } from 'react'

export function NotificationToast() {
  const { notifications } = useWebSocket()
  const [visible, setVisible] = useState(false)
  const [currentNotification, setCurrentNotification] = useState(notifications[0])

  useEffect(() => {
    const latest = notifications[0]
    if (latest && latest.id !== currentNotification?.id) {
      setCurrentNotification(latest)
      setVisible(true)

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [notifications, currentNotification])

  if (!currentNotification) return null

  const getIcon = () => {
    switch (currentNotification.type) {
      case 'NEW_BENEFIT':
        return <Sparkles className="h-5 w-5 text-blue-500" />
      case 'DEADLINE_SOON':
        return <Flame className="h-5 w-5 text-orange-500" />
      case 'STATUS_CHANGE':
        return <Info className="h-5 w-5 text-violet-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const getBorderColor = () => {
    switch (currentNotification.type) {
      case 'NEW_BENEFIT':
        return 'border-blue-500'
      case 'DEADLINE_SOON':
        return 'border-orange-500'
      case 'STATUS_CHANGE':
        return 'border-violet-500'
      default:
        return 'border-blue-500'
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-20 right-4 z-50 w-80"
        >
          <div className={`glass-card p-4 border-l-4 ${getBorderColor()} shadow-lg backdrop-blur-xl bg-white/90`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-slate-900 mb-1">
                  {currentNotification.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentNotification.message}
                </p>
              </div>
              <button
                onClick={() => setVisible(false)}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
