/**
 * 금액 포맷 (예: "500000" → "50만원")
 */
export function formatAmount(amount: string): string {
  const num = parseInt(amount, 10)
  if (isNaN(num)) return amount
  if (num >= 100000000) return `${Math.floor(num / 100000000)}억원`
  if (num >= 10000) return `${Math.floor(num / 10000)}만원`
  return `${num.toLocaleString()}원`
}

/**
 * 숫자 컴마 포맷
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR')
}
