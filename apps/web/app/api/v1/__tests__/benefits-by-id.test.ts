import { describe, it, expect } from 'vitest'
import { GET } from '../benefits/[benefitId]/route'

describe('GET /api/v1/benefits/[benefitId]', () => {
  it('returns a benefit by id', async () => {
    const request = new Request('http://localhost/api/v1/benefits/b_001')
    const response = await GET(request, { params: { benefitId: 'b_001' } })
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('b_001')
    expect(json.data.title).toBe('청년 월세 지원')
    expect(json.data.agency).toBe('서울특별시')
    expect(json.meta.requestId).toBeTruthy()
    expect(json.meta.timestamp).toBeTruthy()
  })

  it('returns 404 for non-existent id', async () => {
    const request = new Request('http://localhost/api/v1/benefits/not_exist')
    const response = await GET(request, { params: { benefitId: 'not_exist' } })
    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('NOT_FOUND')
    expect(json.error.message).toContain('not_exist')
  })

  it('returns benefit with all required fields', async () => {
    const request = new Request('http://localhost/api/v1/benefits/b_002')
    const response = await GET(request, { params: { benefitId: 'b_002' } })
    const json = await response.json()

    expect(json.success).toBe(true)
    expect(json.data).toHaveProperty('id')
    expect(json.data).toHaveProperty('title')
    expect(json.data).toHaveProperty('agency')
    expect(json.data).toHaveProperty('category')
    expect(json.data).toHaveProperty('region')
    expect(json.data).toHaveProperty('amount')
    expect(json.data).toHaveProperty('deadline')
  })
})
