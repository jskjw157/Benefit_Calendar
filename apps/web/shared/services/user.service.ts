import type { User } from '@/shared/types/user.types'
import type { ApiResponse } from '@/shared/types/api.types'
import { API_ROUTES } from '@/shared/lib/constants/routes'

export interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  newBenefit: boolean
  deadlineReminder: boolean
  applicationStatus: boolean
}

export const userService = {
  async getProfile(): Promise<User> {
    const response = await fetch(API_ROUTES.USER_PROFILE)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json: ApiResponse<User> = await response.json()

    if (!json.success) {
      throw new Error(json.error.message)
    }

    return json.data
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await fetch(API_ROUTES.USER_PROFILE, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json: ApiResponse<User> = await response.json()

    if (!json.success) {
      throw new Error(json.error.message)
    }

    return json.data
  },

  async getNotifications(): Promise<NotificationSettings> {
    const response = await fetch(API_ROUTES.NOTIFICATIONS)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json: ApiResponse<NotificationSettings> = await response.json()

    if (!json.success) {
      throw new Error(json.error.message)
    }

    return json.data
  },

  async updateNotifications(data: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const response = await fetch(API_ROUTES.NOTIFICATIONS, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json: ApiResponse<NotificationSettings> = await response.json()

    if (!json.success) {
      throw new Error(json.error.message)
    }

    return json.data
  },
}
