/**
 * D-day 계산 (마감일까지 남은 일수)
 * @returns 양수: 남은 일수, 0: 오늘, 음수: 지남
 */
export function calculateDday(deadline: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(deadline)
  target.setHours(0, 0, 0, 0)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * D-day 라벨 포맷
 */
export function formatDday(deadline: string): string {
  const dday = calculateDday(deadline)
  if (dday > 0) return `D-${dday}`
  if (dday === 0) return 'D-Day'
  return '마감'
}

/**
 * 날짜 포맷 (YYYY.MM.DD)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

/**
 * 기간 포맷 (YYYY.MM.DD ~ YYYY.MM.DD)
 */
export function formatPeriod(start: string, end: string): string {
  return `${formatDate(start)} ~ ${formatDate(end)}`
}
