import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import AuthGuard from '../auth-guard'

const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

// ---------------------------------------------------------------------------
// localStorage stub helpers
// ---------------------------------------------------------------------------

function stubLocalStorage(initial: Record<string, string> = {}) {
  let store: Record<string, string> = { ...initial }
  const fake = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, val: string) => { store[key] = val },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
    get length() { return Object.keys(store).length },
    key: (i: number) => Object.keys(store)[i] ?? null,
  }
  Object.defineProperty(window, 'localStorage', {
    value: fake,
    writable: true,
    configurable: true,
  })
  return fake
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AuthGuard', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    // Default: no token
    stubLocalStorage({})
  })

  it('renders authenticated content and does not redirect when token exists', async () => {
    stubLocalStorage({ bc_token: 'valid-token' })

    await act(async () => {
      render(<AuthGuard><p>Protected content</p></AuthGuard>)
    })

    expect(screen.getByText('Protected content')).toBeDefined()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('renders children when bc_token exists in localStorage', async () => {
    stubLocalStorage({ bc_token: 'valid-token' })

    await act(async () => {
      render(<AuthGuard><p>Protected content</p></AuthGuard>)
    })

    expect(screen.getByText('Protected content')).toBeDefined()
  })

  it('redirects to /login when no token (calls router.replace("/login"))', async () => {
    stubLocalStorage({})

    await act(async () => {
      render(<AuthGuard><p>Protected content</p></AuthGuard>)
    })

    expect(mockReplace).toHaveBeenCalledWith('/login')
  })

  it('returns null for unauthenticated state after redirect is initiated', async () => {
    stubLocalStorage({})

    let container!: HTMLElement
    await act(async () => {
      const result = render(<AuthGuard><p>Protected content</p></AuthGuard>)
      container = result.container
    })

    // After effects run with no token, status is "unauthenticated" → returns null
    expect(screen.queryByText('Protected content')).toBeNull()
    // The container should have no visible content besides empty wrappers
    expect(container.innerHTML).toBe('')
  })
})
