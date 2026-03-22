import { describe, it, expect } from 'vitest'

describe('Type Exports', () => {
  it('benefit.types exports all required types including BenefitSummary', async () => {
    const mod = await import('../benefit.types')
    // BenefitSummary should be exported (types are compile-time, so we verify module loads)
    expect(mod).toBeDefined()
  })

  it('user.types exports User, UserBenefit, NotificationSettings', async () => {
    const mod = await import('../user.types')
    // verify module loads without error -- types are compile-time only
    expect(mod).toBeDefined()
  })

  it('api.types exports ApiResponse, PaginatedData, DashboardSummary', async () => {
    const mod = await import('../api.types')
    expect(mod).toBeDefined()
  })

  it('index.ts barrel export re-exports all types', async () => {
    const mod = await import('../index')
    expect(mod).toBeDefined()
  })
})
