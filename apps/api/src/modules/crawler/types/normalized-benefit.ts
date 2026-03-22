export interface NormalizedBenefit {
  externalId: string
  source: 'BIZINFO' | 'YOUTHCENTER' | 'BOKJIRO' | 'SMES' | 'GOV24'
  title: string
  agency: string
  category: string
  region: string
  amount: string
  targetAge?: string
  employmentType?: string
  applyStart?: Date
  applyEnd?: Date
  applicationUrl?: string
  description?: string
  rawData: Record<string, unknown>
}
