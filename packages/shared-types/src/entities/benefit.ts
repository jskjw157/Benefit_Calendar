import type { BenefitCategory, BenefitStatus } from '../enums'

export interface ApplyPeriod {
  start: string
  end: string
}

export interface Benefit {
  id: string
  title: string
  agency: string
  category: BenefitCategory
  region: string
  amount: string
  applyPeriod: ApplyPeriod
  deadline: string
  applicationLink: string
  requirements: string[]
  documents: string[]
  status: BenefitStatus
  createdAt: string
  updatedAt: string
}

export interface BenefitSummary {
  id: string
  title: string
  agency: string
  category: string
  region: string
  amount: string
  deadline: string
  status: BenefitStatus
}
