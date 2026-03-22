export const USER_BENEFIT_STATUS = {
  BOOKMARKED: { label: '북마크', color: 'blue' as const },
  PREPARING: { label: '준비중', color: 'yellow' as const },
  APPLIED: { label: '신청완료', color: 'green' as const },
  RECEIVED: { label: '수령완료', color: 'purple' as const },
} as const

export const BENEFIT_STATUS = {
  OPEN: { label: '신청 가능', color: 'emerald' as const },
  CLOSED: { label: '마감', color: 'slate' as const },
} as const

export const EMPLOYMENT_STATUS = {
  JOB_SEEKER: { label: '구직 중' },
  EMPLOYED: { label: '재직 중' },
  STUDENT: { label: '학생' },
  SELF_EMPLOYED: { label: '자영업' },
} as const

export const BENEFIT_CATEGORIES = {
  HOUSING: { label: '주거', color: 'emerald' as const, icon: '🏠' },
  LIVING: { label: '생활', color: 'blue' as const, icon: '🛒' },
  TRANSPORT: { label: '교통', color: 'orange' as const, icon: '🚌' },
  EDUCATION: { label: '교육', color: 'violet' as const, icon: '📚' },
  STARTUP: { label: '창업', color: 'pink' as const, icon: '💼' },
  MEDICAL: { label: '의료', color: 'red' as const, icon: '🏥' },
  CULTURE: { label: '문화', color: 'indigo' as const, icon: '🎭' },
} as const
