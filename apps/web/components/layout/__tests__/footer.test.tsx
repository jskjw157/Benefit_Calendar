import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '../footer'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))

describe('Footer', () => {
  it('renders "BenefitCal" brand text', () => {
    render(<Footer />)
    expect(screen.getByText('BenefitCal')).toBeDefined()
  })

  it('renders footer nav link: 혜택 찾기', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: '혜택 찾기' })
    expect(link).toBeDefined()
    expect((link as HTMLAnchorElement).href).toContain('/benefits')
  })

  it('renders footer nav link: 캘린더', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: '캘린더' })
    expect(link).toBeDefined()
    expect((link as HTMLAnchorElement).href).toContain('/calendar')
  })

  it('renders footer nav link: 내 혜택', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: '내 혜택' })
    expect(link).toBeDefined()
    expect((link as HTMLAnchorElement).href).toContain('/my-benefits')
  })

  it('renders footer nav link: 피드백', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: '피드백' })
    expect(link).toBeDefined()
    expect((link as HTMLAnchorElement).href).toContain('/feedback')
  })

  it('renders copyright with current year', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    // The copyright paragraph contains the year
    expect(screen.getByText(new RegExp(`${currentYear}`))).toBeDefined()
  })

  it('has role="contentinfo"', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeDefined()
  })

  it('has aria-label on the footer element', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer.getAttribute('aria-label')).toBe('사이트 푸터')
  })
})
