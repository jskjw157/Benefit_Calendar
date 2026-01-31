import type { EmploymentStatus, NotificationChannel } from '../enums'

export interface User {
  id: string
  email: string
  age: number
  region: string
  employmentStatus: EmploymentStatus
  isSelfEmployed: boolean
  notificationChannel: NotificationChannel
  createdAt: string
  updatedAt: string
}

export interface NotificationSettings {
  channel: NotificationChannel
  enabled: boolean
  leadDays: number
}
