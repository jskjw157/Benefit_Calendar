import type { Benefit } from '@/shared/types/benefit.types'
import type { ApiResponse, PaginatedData } from '@/shared/types/api.types'
import { API_ROUTES } from '@/shared/lib/constants/routes'

export interface BenefitListParams {
  q?: string
  category?: string
  region?: string
  status?: string
  sort?: string
  page?: number
  pageSize?: number
}

export const benefitService = {
  async getList(params?: BenefitListParams): Promise<PaginatedData<Benefit>> {
    const queryParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(`${API_ROUTES.BENEFITS}?${queryParams.toString()}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json: ApiResponse<PaginatedData<Benefit>> = await response.json()

    if (!json.success) {
      throw new Error(json.error.message)
    }

    return json.data
  },

  async getById(id: string): Promise<Benefit> {
    const response = await fetch(API_ROUTES.BENEFIT_DETAIL(id))

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json: ApiResponse<Benefit> = await response.json()

    if (!json.success) {
      throw new Error(json.error.message)
    }

    return json.data
  },
}
