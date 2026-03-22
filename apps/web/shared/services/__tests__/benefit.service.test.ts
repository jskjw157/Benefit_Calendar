import { describe, it, expect, beforeEach, vi } from 'vitest'
import { benefitService } from '../benefit.service'
import type { Benefit } from '@/shared/types/benefit.types'
import type { ApiSuccess, PaginatedData } from '@/shared/types/api.types'

describe('benefitService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getList', () => {
    it('should fetch benefits with no params', async () => {
      const mockBenefits: Benefit[] = [
        {
          id: 'benefit-1',
          title: '청년 주거 지원금',
          agency: '서울시',
          category: '주거',
          region: '서울',
          amount: '월 30만원',
          applyPeriod: { start: '2024-01-01', end: '2024-12-31' },
          deadline: '2024-12-31',
          applicationLink: 'https://example.com',
          requirements: ['만 19-34세'],
          documents: ['주민등록등본'],
          status: 'OPEN',
        },
      ]

      const mockResponse: ApiSuccess<PaginatedData<Benefit>> = {
        success: true,
        data: {
          items: mockBenefits,
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

      const result = await benefitService.getList()

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/v1/benefits?')
      expect(result).toEqual(mockResponse.data)
    })

    it('should fetch benefits with query params', async () => {
      const mockResponse: ApiSuccess<PaginatedData<Benefit>> = {
        success: true,
        data: {
          items: [],
          page: 1,
          pageSize: 10,
          total: 0,
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

      await benefitService.getList({
        q: '주거',
        category: '주거',
        region: '서울',
        status: 'OPEN',
        sort: 'deadline',
        page: 2,
        pageSize: 10,
      })

      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/v1/benefits?q=%EC%A3%BC%EA%B1%B0&category=%EC%A3%BC%EA%B1%B0&region=%EC%84%9C%EC%9A%B8&status=OPEN&sort=deadline&page=2&pageSize=10'
      )
    })

    it('should handle API errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })

      await expect(benefitService.getList()).rejects.toThrow('HTTP error! status: 500')
    })

    it('should handle network errors', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(benefitService.getList()).rejects.toThrow('Network error')
    })

    it('should handle API error response', async () => {
      const mockErrorResponse = {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Something went wrong',
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

      await expect(benefitService.getList()).rejects.toThrow('Something went wrong')
    })
  })

  describe('getById', () => {
    it('should fetch benefit by id', async () => {
      const mockBenefit: Benefit = {
        id: 'benefit-1',
        title: '청년 주거 지원금',
        agency: '서울시',
        category: '주거',
        region: '서울',
        amount: '월 30만원',
        applyPeriod: { start: '2024-01-01', end: '2024-12-31' },
        deadline: '2024-12-31',
        applicationLink: 'https://example.com',
        requirements: ['만 19-34세'],
        documents: ['주민등록등본'],
        status: 'OPEN',
      }

      const mockResponse: ApiSuccess<Benefit> = {
        success: true,
        data: mockBenefit,
        meta: {
          requestId: 'test-req-id',
          timestamp: '2024-01-01T00:00:00Z',
        },
      }

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await benefitService.getById('benefit-1')

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/v1/benefits/benefit-1')
      expect(result).toEqual(mockBenefit)
    })

    it('should handle 404 errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      })

      await expect(benefitService.getById('non-existent')).rejects.toThrow('HTTP error! status: 404')
    })

    it('should handle API error response', async () => {
      const mockErrorResponse = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Benefit not found',
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

      await expect(benefitService.getById('benefit-1')).rejects.toThrow('Benefit not found')
    })
  })
})
