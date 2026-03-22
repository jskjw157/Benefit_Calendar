import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCalendar } from '../use-calendar'

describe('useCalendar', () => {
  it('initializes with current month/year', () => {
    const { result } = renderHook(() => useCalendar())
    const now = new Date()
    expect(result.current.month).toBe(now.getMonth())
    expect(result.current.year).toBe(now.getFullYear())
  })

  it('navigates to next month', () => {
    const { result } = renderHook(() => useCalendar())
    const initialMonth = result.current.month
    act(() => { result.current.nextMonth() })
    // should advance by 1 (with year wrap)
    expect(result.current.month).toBe((initialMonth + 1) % 12)
  })

  it('navigates to previous month', () => {
    const { result } = renderHook(() => useCalendar())
    const initialMonth = result.current.month
    act(() => { result.current.prevMonth() })
    expect(result.current.month).toBe(initialMonth === 0 ? 11 : initialMonth - 1)
  })

  it('generates calendar days for month', () => {
    const { result } = renderHook(() => useCalendar())
    expect(result.current.days.length).toBeGreaterThan(0)
    expect(result.current.days.length).toBeLessThanOrEqual(42) // 6 weeks max
  })

  it('selects a date', () => {
    const { result } = renderHook(() => useCalendar())
    act(() => { result.current.selectDate(15) })
    expect(result.current.selectedDate).toBe(15)
  })
})
