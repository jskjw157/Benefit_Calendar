import type { EmploymentStatus, NotificationChannel } from '../enums'

export interface UpdateProfileDto {
  age?: number
  region?: string
  employmentStatus?: EmploymentStatus
  isSelfEmployed?: boolean
}

export interface UpdateNotificationDto {
  channel?: NotificationChannel
  enabled?: boolean
  leadDays?: number
}
