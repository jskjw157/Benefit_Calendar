import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MonthSelector } from '../month-selector'

describe('MonthSelector', () => {
  it('displays current month and year', () => {
    render(<MonthSelector year={2026} month={1} onPrev={vi.fn()} onNext={vi.fn()} />)
    expect(screen.getByText(/2026년 2월/)).toBeDefined()
  })

  it('calls onPrev when prev button clicked', () => {
    const onPrev = vi.fn()
    render(<MonthSelector year={2026} month={1} onPrev={onPrev} onNext={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('이전 달'))
    expect(onPrev).toHaveBeenCalledOnce()
  })

  it('calls onNext when next button clicked', () => {
    const onNext = vi.fn()
    render(<MonthSelector year={2026} month={1} onPrev={vi.fn()} onNext={onNext} />)
    fireEvent.click(screen.getByLabelText('다음 달'))
    expect(onNext).toHaveBeenCalledOnce()
  })
})
