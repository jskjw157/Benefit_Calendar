import { describe, it, expect } from 'vitest'
import { GET, PATCH } from '../users/me/route'

describe('GET /api/v1/users/me', () => {
  it('returns current user profile', async () => {
    const request = new Request('http://localhost/api/v1/users/me')
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('u_001')
    expect(json.data.email).toBe('jisu@example.com')
    expect(json.data.age).toBe(25)
    expect(json.data.region).toBe('서울')
    expect(json.meta.requestId).toBeTruthy()
  })

  it('returns user with all required fields', async () => {
    const request = new Request('http://localhost/api/v1/users/me')
    const response = await GET(request)
    const json = await response.json()

    expect(json.data).toHaveProperty('id')
    expect(json.data).toHaveProperty('email')
    expect(json.data).toHaveProperty('age')
    expect(json.data).toHaveProperty('region')
    expect(json.data).toHaveProperty('employmentStatus')
    expect(json.data).toHaveProperty('notificationChannel')
  })
})

describe('PATCH /api/v1/users/me', () => {
  it('updates user profile partially', async () => {
    const request = new Request('http://localhost/api/v1/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ age: 26, region: '경기' })
    })
    const response = await PATCH(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('u_001')
    expect(json.data.age).toBe(26)
    expect(json.data.region).toBe('경기')
    expect(json.data.email).toBe('jisu@example.com') // unchanged
  })

  it('handles empty update', async () => {
    const request = new Request('http://localhost/api/v1/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    const response = await PATCH(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('u_001')
  })

  it('returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/v1/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json'
    })
    const response = await PATCH(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('INVALID_REQUEST')
  })
})
