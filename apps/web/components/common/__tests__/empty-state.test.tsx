import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EmptyState from '../empty-state'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="혜택이 없습니다" />)
    expect(screen.getByText('혜택이 없습니다')).toBeDefined()
  })

  it('renders the description when provided', () => {
    render(<EmptyState title="혜택이 없습니다" description="새로운 혜택을 추가해보세요." />)
    expect(screen.getByText('새로운 혜택을 추가해보세요.')).toBeDefined()
  })

  it('does not render description when not provided', () => {
    render(<EmptyState title="혜택이 없습니다" />)
    expect(screen.queryByText('새로운 혜택을 추가해보세요.')).toBeNull()
  })

  it('renders link action as an <a> tag with correct href', () => {
    render(
      <EmptyState
        title="결과 없음"
        action={{ type: 'link', href: '/benefits', label: '혜택 찾기' }}
      />
    )
    const link = screen.getByRole('link', { name: '혜택 찾기' })
    expect(link).toBeDefined()
    expect((link as HTMLAnchorElement).href).toContain('/benefits')
  })

  it('renders button action as a <button> element', () => {
    render(
      <EmptyState
        title="결과 없음"
        action={{ type: 'button', onClick: vi.fn(), label: '새로 추가' }}
      />
    )
    const button = screen.getByRole('button', { name: '새로 추가' })
    expect(button).toBeDefined()
    expect(button.tagName).toBe('BUTTON')
  })

  it('calls onClick when button action is clicked', () => {
    const onClick = vi.fn()
    render(
      <EmptyState
        title="결과 없음"
        action={{ type: 'button', onClick, label: '새로 추가' }}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: '새로 추가' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('has role="region" with aria-label matching the title', () => {
    render(<EmptyState title="검색 결과 없음" />)
    const region = screen.getByRole('region', { name: '검색 결과 없음' })
    expect(region).toBeDefined()
  })

  it('uses default illustration when none is provided', () => {
    const { container } = render(<EmptyState title="기본 상태" />)
    // The default illustration renders an SVG inside the illustration slot
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('renders custom illustration when provided', () => {
    const { container } = render(
      <EmptyState
        title="커스텀 일러스트"
        illustration={<img src="/empty.png" alt="empty" />}
      />
    )
    // illustration slot has aria-hidden="true", so use DOM query
    const img = container.querySelector('img[alt="empty"]')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).toBe('/empty.png')
  })

  it('renders no action elements when action is not provided', () => {
    render(<EmptyState title="No action" />)
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.queryByRole('link')).toBeNull()
  })
})
