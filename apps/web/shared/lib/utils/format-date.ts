interface FormatDateOptions {
  withDay?: boolean
}

export function formatDate(dateStr: string, options?: FormatDateOptions): string {
  const date = new Date(dateStr + 'T00:00:00')
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  let result = `${year}년 ${month}월 ${day}일`

  if (options?.withDay) {
    const days = ['일', '월', '화', '수', '목', '금', '토']
    result += ` (${days[date.getDay()]})`
  }

  return result
}

export function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function isDeadlineSoon(dateStr: string, thresholdDays = 7): boolean {
  const days = getDaysUntil(dateStr)
  return days >= 0 && days <= thresholdDays
}

export function formatRelativeDate(dateStr: string): string {
  const days = getDaysUntil(dateStr)
  if (days < 0) return '마감됨'
  if (days === 0) return '오늘 마감'
  return `D-${days}`
}
