import { describe, it, expect } from 'vitest'
import { PATCH } from '../users/me/benefits/[benefitId]/route'

describe('PATCH /api/v1/users/me/benefits/[benefitId]', () => {
  it('updates benefit status', async () => {
    const request = new Request('http://localhost/api/v1/users/me/benefits/b_001', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PREPARING' })
    })
    const response = await PATCH(request, { params: { benefitId: 'b_001' } })
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.userId).toBe('u_001')
    expect(json.data.benefitId).toBe('b_001')
    expect(json.data.status).toBe('PREPARING')
    expect(json.meta.requestId).toBeTruthy()
  })

  it('returns 404 for non-existent benefit', async () => {
    const request = new Request('http://localhost/api/v1/users/me/benefits/b_999', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PREPARING' })
    })
    const response = await PATCH(request, { params: { benefitId: 'b_999' } })
    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('NOT_FOUND')
  })

  it('returns 400 for missing status', async () => {
    const request = new Request('http://localhost/api/v1/users/me/benefits/b_001', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    const response = await PATCH(request, { params: { benefitId: 'b_001' } })
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('INVALID_REQUEST')
  })

  it('returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/v1/users/me/benefits/b_001', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid'
    })
    const response = await PATCH(request, { params: { benefitId: 'b_001' } })
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
  })
})
