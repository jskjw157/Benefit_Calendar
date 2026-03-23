import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CardSkeleton, StatSkeleton } from '../loading-skeleton'

describe('CardSkeleton', () => {
  it('renders correct number of items with default count (3)', () => {
    const { container } = render(<CardSkeleton />)
    // The wrapper has role="status"; direct children are the skeleton items
    const wrapper = screen.getByRole('status')
    // Count immediate children of the status wrapper
    expect(wrapper.children.length).toBe(3)
  })

  it('renders correct number of items when count is specified', () => {
    const { container } = render(<CardSkeleton count={5} />)
    const wrapper = screen.getByRole('status')
    expect(wrapper.children.length).toBe(5)
  })

  it('"card" variant uses grid layout', () => {
    render(<CardSkeleton variant="card" />)
    const wrapper = screen.getByRole('status')
    expect(wrapper.className).toContain('grid')
  })

  it('"list" variant uses flex layout', () => {
    render(<CardSkeleton variant="list" />)
    const wrapper = screen.getByRole('status')
    expect(wrapper.className).toContain('flex')
  })

  it('has aria-busy="true"', () => {
    render(<CardSkeleton />)
    const wrapper = screen.getByRole('status')
    expect(wrapper.getAttribute('aria-busy')).toBe('true')
  })

  it('has role="status"', () => {
    render(<CardSkeleton />)
    expect(screen.getByRole('status')).toBeDefined()
  })

  it('has accessible label', () => {
    render(<CardSkeleton />)
    const wrapper = screen.getByRole('status')
    expect(wrapper.getAttribute('aria-label')).toBe('데이터를 불러오는 중입니다')
  })
})

describe('StatSkeleton', () => {
  it('renders correct number of items with default count (3)', () => {
    render(<StatSkeleton />)
    const wrapper = screen.getByRole('status')
    expect(wrapper.children.length).toBe(3)
  })

  it('renders correct number of items when count is specified', () => {
    render(<StatSkeleton count={4} />)
    const wrapper = screen.getByRole('status')
    expect(wrapper.children.length).toBe(4)
  })

  it('has aria-busy="true" and role="status"', () => {
    render(<StatSkeleton />)
    const wrapper = screen.getByRole('status')
    expect(wrapper.getAttribute('aria-busy')).toBe('true')
  })

  it('has accessible label', () => {
    render(<StatSkeleton />)
    const wrapper = screen.getByRole('status')
    expect(wrapper.getAttribute('aria-label')).toBe('통계 데이터를 불러오는 중입니다')
  })
})
