import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '../empty-state'

describe('EmptyState', () => {
  it('renders message', () => {
    render(<EmptyState message="혜택이 없습니다" />)
    expect(screen.getByText('혜택이 없습니다')).toBeDefined()
  })

  it('renders with custom icon text', () => {
    render(<EmptyState message="검색 결과 없음" description="다른 검색어를 시도해보세요" />)
    expect(screen.getByText('검색 결과 없음')).toBeDefined()
    expect(screen.getByText('다른 검색어를 시도해보세요')).toBeDefined()
  })
})
