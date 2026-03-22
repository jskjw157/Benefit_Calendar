import { describe, it, expect, beforeEach, vi } from 'vitest'
import { userService } from '../user.service'
import type { User } from '@/shared/types/user.types'
import type { ApiSuccess } from '@/shared/types/api.types'

describe('userService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getProfile', () => {
    it('should fetch user profile', async () => {
      const mockUser: User = {
        id: 'user-1',
        email: 'test@example.com',
        age: 25,
        region: '서울',
        employmentStatus: 'JOB_SEEKER',
        isSelfEmployed: false,
        notificationChannel: 'EMAIL',
      }

      const mockResponse: ApiSuccess<User> = {
        success: true,
        data: mockUser,
        meta: {
          requestId: 'test-req-id',
          timestamp: '2024-01-01T00:00:00Z',
        },
      }

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await userService.getProfile()

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/v1/users/me')
      expect(result).toEqual(mockUser)
    })

    it('should handle API errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      })

      await expect(userService.getProfile()).rejects.toThrow('HTTP error! status: 401')
    })

    it('should handle API error response', async () => {
      const mockErrorResponse = {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
        meta: {
          requestId: 'test-req-id',
          timestamp: '2024-01-01T00:00:00Z',
        },
      }

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockErrorResponse,
      })

      await expect(userService.getProfile()).rejects.toThrow('User not authenticated')
    })
  })

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateData = {
        age: 26,
        region: '경기',
      }

      const updatedUser: User = {
        id: 'user-1',
        email: 'test@example.com',
        age: 26,
        region: '경기',
        employmentStatus: 'JOB_SEEKER',
        isSelfEmployed: false,
        notificationChannel: 'EMAIL',
      }

      const mockResponse: ApiSuccess<User> = {
        success: true,
        data: updatedUser,
        meta: {
          requestId: 'test-req-id',
          timestamp: '2024-01-01T00:00:00Z',
        },
      }

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await userService.updateProfile(updateData)

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/v1/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
      expect(result).toEqual(updatedUser)
    })

    it('should handle validation errors', async () => {
      const mockErrorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid data',
          details: [
            { field: 'age', reason: 'Age must be between 0 and 150' },
          ],
        },
        meta: {
          requestId: 'test-req-id',
          timestamp: '2024-01-01T00:00:00Z',
        },
      }

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockErrorResponse,
      })

      await expect(userService.updateProfile({ age: 200 })).rejects.toThrow('Invalid data')
    })
  })

  describe('getNotifications', () => {
    it('should fetch notification settings', async () => {
      const mockNotifications = {
        email: true,
        sms: false,
        push: true,
        newBenefit: true,
        deadlineReminder: true,
        applicationStatus: false,
      }

      const mockResponse: ApiSuccess<typeof mockNotifications> = {
        success: true,
        data: mockNotifications,
        meta: {
          requestId: 'test-req-id',
          timestamp: '2024-01-01T00:00:00Z',
        },
      }

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await userService.getNotifications()

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/v1/users/me/notifications')
      expect(result).toEqual(mockNotifications)
    })
  })

  describe('updateNotifications', () => {
    it('should update notification settings', async () => {
      const updateData = {
        email: true,
        sms: true,
        deadlineReminder: true,
      }

      const updatedNotifications = {
        email: true,
        sms: true,
        push: true,
        newBenefit: true,
        deadlineReminder: true,
        applicationStatus: false,
      }

      const mockResponse: ApiSuccess<typeof updatedNotifications> = {
        success: true,
        data: updatedNotifications,
        meta: {
          requestId: 'test-req-id',
          timestamp: '2024-01-01T00:00:00Z',
        },
      }

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await userService.updateNotifications(updateData)

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/v1/users/me/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
      expect(result).toEqual(updatedNotifications)
    })
  })
})
