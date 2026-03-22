export * from './status'
export * from './routes'

export const SITE_CONFIG = {
  name: 'BenefitCal',
  title: 'BenefitCal - 청년 혜택 캘린더',
  description: '청년을 위한 맞춤 혜택 정보와 일정 관리',
  url: 'https://benefitcal.app',
  ogImage: '/og-image.png',
} as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const
