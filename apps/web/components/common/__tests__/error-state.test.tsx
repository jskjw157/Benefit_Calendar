import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorState from '../error-state'

describe('ErrorState', () => {
  it('renders default title "오류가 발생했습니다"', () => {
    render(<ErrorState />)
    expect(screen.getByText('오류가 발생했습니다')).toBeDefined()
  })

  it('renders default description "잠시 후 다시 시도해 주세요."', () => {
    render(<ErrorState />)
    expect(screen.getByText('잠시 후 다시 시도해 주세요.')).toBeDefined()
  })

  it('renders custom title when provided', () => {
    render(<ErrorState title="데이터 로드 실패" />)
    expect(screen.getByText('데이터 로드 실패')).toBeDefined()
  })

  it('renders custom description when provided', () => {
    render(<ErrorState description="네트워크 연결을 확인해 주세요." />)
    expect(screen.getByText('네트워크 연결을 확인해 주세요.')).toBeDefined()
  })

  it('renders both custom title and description together', () => {
    render(<ErrorState title="서버 오류" description="서버가 응답하지 않습니다." />)
    expect(screen.getByText('서버 오류')).toBeDefined()
    expect(screen.getByText('서버가 응답하지 않습니다.')).toBeDefined()
  })

  it('shows retry button when onRetry is provided', () => {
    render(<ErrorState onRetry={vi.fn()} />)
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeDefined()
  })

  it('hides retry button when onRetry is not provided', () => {
    render(<ErrorState />)
    expect(screen.queryByRole('button', { name: '다시 시도' })).toBeNull()
  })

  it('uses custom retryLabel on the retry button', () => {
    render(<ErrorState onRetry={vi.fn()} retryLabel="재시도" />)
    expect(screen.getByRole('button', { name: '재시도' })).toBeDefined()
  })

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = vi.fn()
    render(<ErrorState onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('has role="alert"', () => {
    render(<ErrorState />)
    expect(screen.getByRole('alert')).toBeDefined()
  })
})
