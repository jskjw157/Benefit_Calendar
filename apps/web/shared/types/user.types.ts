export type EmploymentStatus = 'JOB_SEEKER' | 'EMPLOYED' | 'STUDENT' | 'SELF_EMPLOYED'
export type NotificationChannel = 'EMAIL' | 'SMS' | 'PUSH'
export type UserBenefitStatus = 'BOOKMARKED' | 'PREPARING' | 'APPLIED' | 'RECEIVED'

export interface User {
  id: string
  email: string
  age: number
  region: string
  employmentStatus: EmploymentStatus
  isSelfEmployed: boolean
  notificationChannel: NotificationChannel
}

export interface UserBenefit {
  userId: string
  benefitId: string
  status: UserBenefitStatus
  createdAt: string
}

export interface NotificationSettings {
  channel: NotificationChannel
  enabled: boolean
  leadDays: number
}
