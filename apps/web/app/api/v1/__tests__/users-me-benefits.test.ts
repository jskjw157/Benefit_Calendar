import { describe, it, expect } from 'vitest'
import { GET } from '../users/me/benefits/route'

describe('GET /api/v1/users/me/benefits', () => {
  it('returns all benefits for current user', async () => {
    const request = new Request('http://localhost/api/v1/users/me/benefits')
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(Array.isArray(json.data.items)).toBe(true)
    expect(json.data.items.length).toBeGreaterThan(0)
    expect(json.meta.requestId).toBeTruthy()
  })

  it('filters by status BOOKMARKED', async () => {
    const request = new Request('http://localhost/api/v1/users/me/benefits?status=BOOKMARKED')
    const response = await GET(request)
    const json = await response.json()

    expect(json.success).toBe(true)
    expect(json.data.items.every((item: any) => item.status === 'BOOKMARKED')).toBe(true)
  })

  it('filters by status PREPARING', async () => {
    const request = new Request('http://localhost/api/v1/users/me/benefits?status=PREPARING')
    const response = await GET(request)
    const json = await response.json()

    expect(json.success).toBe(true)
    // u_001 has BOOKMARKED, so PREPARING should be empty
    expect(json.data.items.length).toBe(0)
  })

  it('returns benefits with joined data', async () => {
    const request = new Request('http://localhost/api/v1/users/me/benefits')
    const response = await GET(request)
    const json = await response.json()

    const firstItem = json.data.items[0]
    expect(firstItem).toHaveProperty('benefitId')
    expect(firstItem).toHaveProperty('status')
    expect(firstItem).toHaveProperty('title')
    expect(firstItem).toHaveProperty('agency')
    expect(firstItem).toHaveProperty('category')
    expect(firstItem).toHaveProperty('deadline')
  })

  it('includes metadata', async () => {
    const request = new Request('http://localhost/api/v1/users/me/benefits')
    const response = await GET(request)
    const json = await response.json()

    expect(json.data.total).toBe(json.data.items.length)
    expect(json.meta.filters).toHaveProperty('status')
  })
})
