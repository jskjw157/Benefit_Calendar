import type { UserBenefit, UserBenefitStatus } from '@/shared/types/user.types'
import type { ApiResponse, PaginatedData } from '@/shared/types/api.types'
import { API_ROUTES } from '@/shared/lib/constants/routes'

export const userBenefitService = {
  async getList(status?: UserBenefitStatus): Promise<PaginatedData<UserBenefit>> {
    let url = API_ROUTES.USER_BENEFITS

    if (status) {
      url += `?status=${status}`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json: ApiResponse<PaginatedData<UserBenefit>> = await response.json()

    if (!json.success) {
      throw new Error(json.error.message)
    }

    return json.data
  },

  async toggleBookmark(benefitId: string, active: boolean): Promise<UserBenefit | { success: boolean }> {
    const response = await fetch(`${API_ROUTES.USER_BENEFITS}/${benefitId}/bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json: ApiResponse<UserBenefit | { success: boolean }> = await response.json()

    if (!json.success) {
      throw new Error(json.error.message)
    }

    return json.data
  },

  async updateStatus(benefitId: string, status: UserBenefitStatus): Promise<UserBenefit> {
    const response = await fetch(`${API_ROUTES.USER_BENEFITS}/${benefitId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json: ApiResponse<UserBenefit> = await response.json()

    if (!json.success) {
      throw new Error(json.error.message)
    }

    return json.data
  },
}
