import type { UserBenefitStatus } from '../enums'

export interface UserBenefit {
  userId: string
  benefitId: string
  status: UserBenefitStatus
  createdAt: string
  updatedAt: string
}
