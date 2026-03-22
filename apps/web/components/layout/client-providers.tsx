'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { WebSocketProvider } from '@/shared/contexts/websocket-context'
import { NotificationToast } from '@/components/layout/notification-toast'

const ThreeBackground = dynamic(
  () => import('@/components/dashboard/three-background').then(mod => ({ default: mod.ThreeBackground })),
  { ssr: false }
)

class ThreeErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('ThreeBackground failed to load:', error.message)
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <WebSocketProvider>
      <ThreeErrorBoundary>
        <ThreeBackground />
      </ThreeErrorBoundary>
      <NotificationToast />
      {children}
    </WebSocketProvider>
  )
}
