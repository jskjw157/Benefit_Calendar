import { describe, it, expect } from 'vitest'
import { GET, PATCH } from '../users/me/notifications/route'

describe('GET /api/v1/users/me/notifications', () => {
  it('returns notification settings', async () => {
    const request = new Request('http://localhost/api/v1/users/me/notifications')
    const response = await GET(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data).toHaveProperty('channel')
    expect(json.data).toHaveProperty('enabled')
    expect(json.data).toHaveProperty('leadDays')
    expect(json.meta.requestId).toBeTruthy()
  })

  it('returns valid notification channel', async () => {
    const request = new Request('http://localhost/api/v1/users/me/notifications')
    const response = await GET(request)
    const json = await response.json()

    expect(['EMAIL', 'PUSH', 'SMS']).toContain(json.data.channel)
    expect(typeof json.data.enabled).toBe('boolean')
    expect(typeof json.data.leadDays).toBe('number')
  })
})

describe('PATCH /api/v1/users/me/notifications', () => {
  it('updates notification settings', async () => {
    const request = new Request('http://localhost/api/v1/users/me/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 'PUSH', enabled: false, leadDays: 7 })
    })
    const response = await PATCH(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.channel).toBe('PUSH')
    expect(json.data.enabled).toBe(false)
    expect(json.data.leadDays).toBe(7)
  })

  it('updates notification settings partially', async () => {
    const request = new Request('http://localhost/api/v1/users/me/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadDays: 5 })
    })
    const response = await PATCH(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.leadDays).toBe(5)
    expect(json.data).toHaveProperty('channel')
    expect(json.data).toHaveProperty('enabled')
  })

  it('returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/v1/users/me/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid'
    })
    const response = await PATCH(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('INVALID_REQUEST')
  })
})
