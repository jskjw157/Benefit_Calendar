import { describe, it, expect } from 'vitest'
import { formatDate, formatRelativeDate, getDaysUntil, isDeadlineSoon } from '../format-date'

describe('formatDate', () => {
  it('formats ISO date to Korean format', () => {
    expect(formatDate('2026-03-15')).toBe('2026년 3월 15일')
  })

  it('formats with custom options', () => {
    const result = formatDate('2026-01-01', { withDay: true })
    expect(result).toContain('2026년')
    expect(result).toContain('1월')
  })
})

describe('getDaysUntil', () => {
  it('returns positive days for future date', () => {
    const future = new Date()
    future.setDate(future.getDate() + 5)
    expect(getDaysUntil(future.toISOString().split('T')[0])).toBe(5)
  })

  it('returns negative days for past date', () => {
    const past = new Date()
    past.setDate(past.getDate() - 3)
    expect(getDaysUntil(past.toISOString().split('T')[0])).toBe(-3)
  })

  it('returns 0 for today', () => {
    const today = new Date().toISOString().split('T')[0]
    expect(getDaysUntil(today)).toBe(0)
  })
})

describe('isDeadlineSoon', () => {
  it('returns true when deadline is within 7 days', () => {
    const soon = new Date()
    soon.setDate(soon.getDate() + 3)
    expect(isDeadlineSoon(soon.toISOString().split('T')[0])).toBe(true)
  })

  it('returns false when deadline is more than 7 days away', () => {
    const far = new Date()
    far.setDate(far.getDate() + 30)
    expect(isDeadlineSoon(far.toISOString().split('T')[0])).toBe(false)
  })

  it('returns true for custom threshold', () => {
    const date = new Date()
    date.setDate(date.getDate() + 10)
    expect(isDeadlineSoon(date.toISOString().split('T')[0], 14)).toBe(true)
  })
})

describe('formatRelativeDate', () => {
  it('returns "오늘 마감" for today', () => {
    const today = new Date().toISOString().split('T')[0]
    expect(formatRelativeDate(today)).toBe('오늘 마감')
  })

  it('returns "D-N" for future dates', () => {
    const future = new Date()
    future.setDate(future.getDate() + 5)
    expect(formatRelativeDate(future.toISOString().split('T')[0])).toBe('D-5')
  })

  it('returns "마감됨" for past dates', () => {
    const past = new Date()
    past.setDate(past.getDate() - 1)
    expect(formatRelativeDate(past.toISOString().split('T')[0])).toBe('마감됨')
  })
})
