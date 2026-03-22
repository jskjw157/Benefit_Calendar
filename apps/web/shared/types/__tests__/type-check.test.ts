import { describe, it, expect } from 'vitest'
import type { Benefit, BenefitSummary, BenefitStatus } from '../benefit.types'
import type { User, UserBenefit, NotificationSettings, EmploymentStatus } from '../user.types'
import type { ApiResponse, PaginatedData, DashboardSummary } from '../api.types'

describe('Type Compatibility', () => {
  it('BenefitSummary has correct shape', () => {
    // This is a compile-time test - if types are wrong, TypeScript will error
    const summary: BenefitSummary = {
      id: 'test-id',
      title: 'Test Benefit',
      agency: 'Test Agency',
      category: '주거',
      region: '서울',
      amount: '100만원',
      deadline: '2024-12-31',
      status: 'OPEN' as BenefitStatus,
    }
    expect(summary).toBeDefined()
  })

  it('Benefit interface is properly defined', () => {
    const benefit: Benefit = {
      id: 'test-id',
      title: 'Test',
      agency: 'Agency',
      category: '주거',
      region: '서울',
      amount: '100만원',
      applyPeriod: { start: '2024-01-01', end: '2024-12-31' },
      deadline: '2024-12-31',
      applicationLink: 'https://test.com',
      requirements: ['req1'],
      documents: ['doc1'],
      status: 'OPEN',
    }
    expect(benefit).toBeDefined()
  })

  it('User interface is properly defined', () => {
    const user: User = {
      id: 'user-1',
      email: 'test@example.com',
      age: 25,
      region: '서울',
      employmentStatus: 'JOB_SEEKER' as EmploymentStatus,
      isSelfEmployed: false,
      notificationChannel: 'EMAIL',
    }
    expect(user).toBeDefined()
  })

  it('UserBenefit interface is properly defined', () => {
    const userBenefit: UserBenefit = {
      userId: 'user-1',
      benefitId: 'benefit-1',
      status: 'BOOKMARKED',
      createdAt: '2024-01-01T00:00:00Z',
    }
    expect(userBenefit).toBeDefined()
  })

  it('NotificationSettings interface is properly defined', () => {
    const settings: NotificationSettings = {
      channel: 'EMAIL',
      enabled: true,
      leadDays: 7,
    }
    expect(settings).toBeDefined()
  })

  it('PaginatedData is exported (not PagedData)', () => {
    const paginatedData: PaginatedData<Benefit> = {
      items: [],
      page: 1,
      pageSize: 20,
      total: 0,
    }
    expect(paginatedData).toBeDefined()
  })

  it('DashboardSummary interface is properly defined', () => {
    const summary: DashboardSummary = {
      matchedCount: 10,
      urgentCount: 3,
      appliedCount: 5,
    }
    expect(summary).toBeDefined()
  })

  it('ApiResponse type works correctly', () => {
    const successResponse: ApiResponse<User> = {
      success: true,
      data: {
        id: 'user-1',
        email: 'test@example.com',
        age: 25,
        region: '서울',
        employmentStatus: 'JOB_SEEKER',
        isSelfEmployed: false,
        notificationChannel: 'EMAIL',
      },
      meta: {
        requestId: 'req-1',
        timestamp: '2024-01-01T00:00:00Z',
      },
    }

    const errorResponse: ApiResponse<User> = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'User not found',
      },
      meta: {
        requestId: 'req-2',
        timestamp: '2024-01-01T00:00:00Z',
      },
    }

    expect(successResponse).toBeDefined()
    expect(errorResponse).toBeDefined()
  })
})
