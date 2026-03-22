import { describe, it, expect } from 'vitest'
import { POST } from '../auth/login/route'

describe('POST /api/v1/auth/login', () => {
  it('returns token for valid email', async () => {
    const request = new Request('http://localhost/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'jisu@example.com', password: 'any' })
    })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.token).toBeTruthy()
    expect(json.data.user.email).toBe('jisu@example.com')
    expect(json.data.user.id).toBe('u_001')
    expect(json.meta.requestId).toBeTruthy()
  })

  it('returns token for another valid email', async () => {
    const request = new Request('http://localhost/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'minho@example.com', password: 'test123' })
    })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.token).toBeTruthy()
    expect(json.data.user.email).toBe('minho@example.com')
    expect(json.data.user.id).toBe('u_002')
  })

  it('returns 401 for invalid email', async () => {
    const request = new Request('http://localhost/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'notfound@example.com', password: 'any' })
    })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('UNAUTHORIZED')
  })

  it('returns 400 for missing email', async () => {
    const request = new Request('http://localhost/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'test123' })
    })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('INVALID_REQUEST')
  })

  it('returns 400 for missing password', async () => {
    const request = new Request('http://localhost/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'jisu@example.com' })
    })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('INVALID_REQUEST')
  })

  it('returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json'
    })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('INVALID_REQUEST')
  })
})
