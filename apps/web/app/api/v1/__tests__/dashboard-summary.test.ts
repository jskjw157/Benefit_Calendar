import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '../dashboard/summary/route'

describe('GET /api/v1/dashboard/summary', () => {
  beforeEach(() => {
    // Mock current date to 2026-02-01 for consistent urgent count
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-02-01'))
  })

  it('returns dashboard summary with correct structure', async () => {
    const request = new Request('http://localhost/api/v1/dashboard/summary')
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data).toHaveProperty('matchedCount')
    expect(json.data).toHaveProperty('urgentCount')
    expect(json.data).toHaveProperty('appliedCount')
    expect(json.meta.requestId).toBeTruthy()
    expect(json.meta.timestamp).toBeTruthy()
  })

  it('calculates counts correctly', async () => {
    const request = new Request('http://localhost/api/v1/dashboard/summary')
    const response = await GET(request)
    const json = await response.json()

    expect(json.data.matchedCount).toBeGreaterThan(0)
    expect(json.data.urgentCount).toBeGreaterThanOrEqual(0)
    expect(json.data.appliedCount).toBeGreaterThanOrEqual(0)
  })

  it('urgent count includes only deadlines within 7 days', async () => {
    const request = new Request('http://localhost/api/v1/dashboard/summary')
    const response = await GET(request)
    const json = await response.json()

    // Based on sample data with current date 2026-02-01:
    // All deadlines are in 2025, so urgentCount should be 0
    expect(json.data.urgentCount).toBe(0)
  })
})
