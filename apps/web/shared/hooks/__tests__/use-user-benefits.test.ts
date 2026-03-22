import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useUserBenefits } from '../use-user-benefits'

describe('useUserBenefits', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })

  it('fetches user benefits on mount', async () => {
    const mockData = {
      success: true,
      data: { items: [{ userId: 'u_001', benefitId: 'b_001', status: 'BOOKMARKED', benefit: {} }], total: 1 },
      meta: { requestId: '123', timestamp: new Date().toISOString() }
    }
    ;(globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    const { result } = renderHook(() => useUserBenefits())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.userBenefits).toHaveLength(1)
  })

  it('filters by status', async () => {
    const mockData = {
      success: true,
      data: { items: [], total: 0 },
      meta: { requestId: '123', timestamp: new Date().toISOString() }
    }
    ;(globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    const { result } = renderHook(() => useUserBenefits('BOOKMARKED'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('status=BOOKMARKED'))
  })

  it('handles fetch error', async () => {
    ;(globalThis.fetch as any).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useUserBenefits())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeTruthy()
  })
})
