import { describe, it, expect, beforeEach, vi } from 'vitest'
import { userBenefitService } from '../user-benefit.service'
import type { UserBenefit, UserBenefitStatus } from '@/shared/types/user.types'
import type { ApiSuccess, PaginatedData } from '@/shared/types/api.types'

describe('userBenefitService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getList', () => {
    it('should fetch all user benefits without status filter', async () => {
      const mockUserBenefits: UserBenefit[] = [
        {
          userId: 'user-1',
          benefitId: 'benefit-1',
          status: 'BOOKMARKED',
          createdAt: '2024-01-01T00:00:00Z',
        },
        {
          userId: 'user-1',
          benefitId: 'benefit-2',
          status: 'APPLIED',
          createdAt: '2024-01-02T00:00:00Z',
        },
      ]

      const mockResponse: ApiSuccess<PaginatedData<UserBenefit>> = {
        success: true,
        data: {
          items: mockUserBenefits,
          page: 1,
          pageSize: 20,
          total: 2,
        },
        meta: {
          requestId: 'test-req-id',
          timestamp: '2024-01-01T00:00:00Z',
        },
      }

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await userBenefitService.getList()

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/v1/users/me/benefits')
      expect(result).toEqual(mockResponse.data)
    })

    it('should fetch user benefits with status filter', async () => {
      const mockUserBenefits: UserBenefit[] = [
        {
          userId: 'user-1',
          benefitId: 'benefit-1',
          status: 'BOOKMARKED',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ]

      const mockResponse: ApiSuccess<PaginatedData<UserBenefit>> = {
        success: true,
        data: {
          items: mockUserBenefits,
          page: 1,
          pageSize: 20,
          total: 1,
        },
        meta: {
          requestId: 'test-req-id',
          timestamp: '2024-01-01T00:00:00Z',
        },
      }

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await userBenefitService.getList('BOOKMARKED')

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/v1/users/me/benefits?status=BOOKMARKED')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle API errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      })

      await expect(userBenefitService.getList()).rejects.toThrow('HTTP error! status: 401')
    })
  })

  describe('toggleBookmark', () => {
    it('should add bookmark when active is true', async () => {
      const mockUserBenefit: UserBenefit = {
        userId: 'user-1',
        benefitId: 'benefit-1',
        status: 'BOOKMARKED',
        createdAt: '2024-01-01T00:00:00Z',
      }

      const mockResponse: ApiSuccess<UserBenefit> = {
        success: true,
        data: mockUserBenefit,
        meta: {
          requestId: 'test-req-id',
          timestamp: '2024-01-01T00:00:00Z',
        },
      }

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await userBenefitService.toggleBookmark('benefit-1', true)

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/v1/users/me/benefits/benefit-1/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: true }),
      })
      expect(result).toEqual(mockUserBenefit)
    })

    it('should remove bookmark when active is false', async () => {
      const mockResponse: ApiSuccess<{ success: boolean }> = {
        success: true,
        data: { success: true },
        meta: {
          requestId: 'test-req-id',
          timestamp: '2024-01-01T00:00:00Z',
        },
      }

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await userBenefitService.toggleBookmark('benefit-1', false)

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/v1/users/me/benefits/benefit-1/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: false }),
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle API errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      })

      await expect(userBenefitService.toggleBookmark('benefit-1', true)).rejects.toThrow(
        'HTTP error! status: 404'
      )
    })
  })

  describe('updateStatus', () => {
    it('should update user benefit status', async () => {
      const mockUserBenefit: UserBenefit = {
        userId: 'user-1',
        benefitId: 'benefit-1',
        status: 'APPLIED',
        createdAt: '2024-01-01T00:00:00Z',
      }

      const mockResponse: ApiSuccess<UserBenefit> = {
        success: true,
        data: mockUserBenefit,
        meta: {
          requestId: 'test-req-id',
          timestamp: '2024-01-01T00:00:00Z',
        },
      }

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await userBenefitService.updateStatus('benefit-1', 'APPLIED')

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/v1/users/me/benefits/benefit-1/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'APPLIED' }),
      })
      expect(result).toEqual(mockUserBenefit)
    })

    it('should handle all status types', async () => {
      const statuses: UserBenefitStatus[] = ['BOOKMARKED', 'PREPARING', 'APPLIED', 'RECEIVED']

      for (const status of statuses) {
        const mockResponse: ApiSuccess<UserBenefit> = {
          success: true,
          data: {
            userId: 'user-1',
            benefitId: 'benefit-1',
            status,
            createdAt: '2024-01-01T00:00:00Z',
          },
          meta: {
            requestId: 'test-req-id',
            timestamp: '2024-01-01T00:00:00Z',
          },
        }

        globalThis.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockResponse,
        })

        const result = await userBenefitService.updateStatus('benefit-1', status)
        expect(result.status).toBe(status)
      }
    })

    it('should handle validation errors', async () => {
      const mockErrorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid status transition',
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

      await expect(userBenefitService.updateStatus('benefit-1', 'APPLIED')).rejects.toThrow(
        'Invalid status transition'
      )
    })
  })
})
