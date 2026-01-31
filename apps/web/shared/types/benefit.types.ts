export type BenefitStatus = 'OPEN' | 'CLOSED'
export type BenefitCategory = '주거' | '교통' | '문화' | '창업' | '생활' | '교육' | '의료'

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
}
