import type { BenefitCategory } from '../enums'

export interface BenefitListQuery {
  q?: string
  category?: BenefitCategory
  region?: string
  status?: string
  sort?: string
  page?: number
  pageSize?: number
}
