export const ROUTES = {
  HOME: '/',
  BENEFITS: '/benefits',
  BENEFIT_DETAIL: (id: string) => `/benefits/${id}`,
  CALENDAR: '/calendar',
  MY_BENEFITS: '/my-benefits',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  LOGIN: '/login',
} as const

export const API_ROUTES = {
  BENEFITS: '/api/v1/benefits',
  BENEFIT_DETAIL: (id: string) => `/api/v1/benefits/${id}`,
  USER_PROFILE: '/api/v1/users/me',
  USER_BENEFITS: '/api/v1/users/me/benefits',
  NOTIFICATIONS: '/api/v1/users/me/notifications',
  DASHBOARD: '/api/v1/dashboard/summary',
} as const
