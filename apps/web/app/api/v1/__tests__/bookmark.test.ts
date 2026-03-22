import { describe, it, expect } from 'vitest'
import { POST } from '../users/me/benefits/[benefitId]/bookmark/route'

describe('POST /api/v1/users/me/benefits/[benefitId]/bookmark', () => {
  it('toggles bookmark on (when not bookmarked)', async () => {
    const request = new Request('http://localhost/api/v1/users/me/benefits/b_002', {
      method: 'POST'
    })
    const response = await POST(request, { params: { benefitId: 'b_002' } })
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.benefitId).toBe('b_002')
    expect(json.data.bookmarked).toBe(true)
    expect(json.meta.requestId).toBeTruthy()
  })

  it('toggles bookmark off (when already bookmarked)', async () => {
    const request = new Request('http://localhost/api/v1/users/me/benefits/b_001', {
      method: 'POST'
    })
    const response = await POST(request, { params: { benefitId: 'b_001' } })
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.benefitId).toBe('b_001')
    // b_001 is bookmarked in sample data, so toggle should make it false
    expect(json.data.bookmarked).toBe(false)
  })

  it('returns 404 for non-existent benefit', async () => {
    const request = new Request('http://localhost/api/v1/users/me/benefits/b_999', {
      method: 'POST'
    })
    const response = await POST(request, { params: { benefitId: 'b_999' } })
    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('NOT_FOUND')
  })

  it('creates new bookmark entry if user has no relation to benefit', async () => {
    const request = new Request('http://localhost/api/v1/users/me/benefits/b_005', {
      method: 'POST'
    })
    const response = await POST(request, { params: { benefitId: 'b_005' } })
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.bookmarked).toBe(true)
  })
})
