export interface ApiMeta {
  requestId: string
  timestamp: string
}

export interface ApiSuccess<T> {
  success: true
  data: T
  meta: ApiMeta
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: Array<{ field: string; reason: string }>
  }
  meta: ApiMeta
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface PaginatedData<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export interface DashboardSummary {
  matchedCount: number
  urgentCount: number
  appliedCount: number
}
