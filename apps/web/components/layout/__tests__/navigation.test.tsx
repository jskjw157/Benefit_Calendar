import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import Navigation from '../navigation'

// Mock next/navigation — usePathname is a vi.fn so it can be reconfigured per test
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

// Mock next/link — renders a plain <a> so href assertions work in jsdom
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// ---------------------------------------------------------------------------
// localStorage stub helper
// ---------------------------------------------------------------------------

function stubLocalStorage(initial: Record<string, string> = {}) {
  let store: Record<string, string> = { ...initial }
  const fake = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, val: string) => {
      store[key] = val
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (i: number) => Object.keys(store)[i] ?? null,
  }
  Object.defineProperty(window, 'localStorage', {
    value: fake,
    writable: true,
    configurable: true,
  })
  return fake
}

const mockUsePathname = vi.mocked(usePathname)

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Navigation', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
    stubLocalStorage({})
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders logo "BenefitCal" and "혜택 캘린더"', async () => {
    await act(async () => {
      render(<Navigation />)
    })

    expect(screen.getByText('BenefitCal')).toBeDefined()
    expect(screen.getByText('혜택 캘린더')).toBeDefined()
  })

  it('shows public nav items: 홈, 혜택 찾기, 캘린더', async () => {
    await act(async () => {
      render(<Navigation />)
    })

    // Each item appears in both desktop and mobile nav — use getAllByText
    expect(screen.getAllByText('홈').length).toBeGreaterThan(0)
    expect(screen.getAllByText('혜택 찾기').length).toBeGreaterThan(0)
    expect(screen.getAllByText('캘린더').length).toBeGreaterThan(0)
  })

  it('hides "내 혜택" when not logged in (no bc_token in localStorage)', async () => {
    stubLocalStorage({})

    await act(async () => {
      render(<Navigation />)
    })

    expect(screen.queryByText('내 혜택')).toBeNull()
  })

  it('shows "내 혜택" when logged in (bc_token exists)', async () => {
    stubLocalStorage({ bc_token: 'test-jwt-token' })

    await act(async () => {
      render(<Navigation />)
    })

    expect(screen.getAllByText('내 혜택').length).toBeGreaterThan(0)
  })

  it('shows "로그인" link when not authenticated', async () => {
    stubLocalStorage({})

    await act(async () => {
      render(<Navigation />)
    })

    const loginLinks = screen.getAllByText('로그인')
    expect(loginLinks.length).toBeGreaterThan(0)
    // At least one should be wrapped in an anchor element
    const loginAnchors = loginLinks.filter(
      (el) => el.tagName === 'A' || el.closest('a') !== null
    )
    expect(loginAnchors.length).toBeGreaterThan(0)
  })

  it('shows "내 계정" button when authenticated', async () => {
    stubLocalStorage({ bc_token: 'test-jwt-token' })

    await act(async () => {
      render(<Navigation />)
    })

    expect(screen.getByText('내 계정')).toBeDefined()
  })

  it('active nav item gets aria-current="page" for matching pathname', async () => {
    mockUsePathname.mockReturnValue('/benefits')

    await act(async () => {
      render(<Navigation />)
    })

    const activeLinks = document.querySelectorAll('[aria-current="page"]')
    expect(activeLinks.length).toBeGreaterThan(0)

    const benefitLinks = Array.from(activeLinks).filter((el) =>
      (el as HTMLAnchorElement).getAttribute('href')?.includes('/benefits')
    )
    expect(benefitLinks.length).toBeGreaterThan(0)
  })

  it('mobile hamburger button toggles aria-expanded', async () => {
    await act(async () => {
      render(<Navigation />)
    })

    const hamburger = screen.getByLabelText('메뉴 열기')
    expect(hamburger.getAttribute('aria-expanded')).toBe('false')

    await act(async () => {
      fireEvent.click(hamburger)
    })

    // After click the button label changes and aria-expanded becomes true
    const closeButton = screen.getByLabelText('메뉴 닫기')
    expect(closeButton.getAttribute('aria-expanded')).toBe('true')
  })

  it('logout removes bc_token from localStorage', async () => {
    const storage = stubLocalStorage({ bc_token: 'test-jwt-token' })

    await act(async () => {
      render(<Navigation />)
    })

    // Open the profile dropdown to reveal the desktop logout button
    const accountButton = screen.getByLabelText('프로필 메뉴 열기')
    await act(async () => {
      fireEvent.click(accountButton)
    })

    // Click the first logout button (inside the dropdown)
    const logoutButtons = screen.getAllByText('로그아웃')
    await act(async () => {
      fireEvent.click(logoutButtons[0])
    })

    expect(storage.getItem('bc_token')).toBeNull()
  })
})
