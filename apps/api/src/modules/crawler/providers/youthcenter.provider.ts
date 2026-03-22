import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BaseProvider } from './base.provider'
import { NormalizedBenefit } from '../types/normalized-benefit'

interface YouthcenterItem {
  bizId?: string
  polyBizSjnm?: string
  mngtMson?: string
  bizCnts?: string
  rgnNm?: string
  ageInfo?: string
  trnsfRlvntLnkUrl?: string
  rqutPrdCn?: string
  [key: string]: unknown
}

interface YouthcenterResponse {
  result?: {
    youthPolicyList?: YouthcenterItem[]
    totalCount?: number
  }
  [key: string]: unknown
}

@Injectable()
export class YouthcenterProvider extends BaseProvider {
  private readonly apiKey: string
  private readonly baseUrl = 'https://www.youthcenter.go.kr/go/ythip/getPlcy'

  constructor(private readonly config: ConfigService) {
    super('YouthcenterProvider')
    this.apiKey = this.config.get<string>('YOUTHCENTER_API_KEY') ?? ''
  }

  async fetchAll(): Promise<NormalizedBenefit[]> {
    const results: NormalizedBenefit[] = []
    let pageNum = 1
    const pageSize = 50

    while (true) {
      const data = await this.safeGet<YouthcenterResponse>(this.baseUrl, {
        params: {
          apiKeyNm: this.apiKey,
          pageNum,
          pageSize,
          rtnType: 'json',
        },
      })

      const items: YouthcenterItem[] = data?.result?.youthPolicyList ?? []
      if (items.length === 0) break

      for (const item of items) {
        const normalized = this.normalizeItem(item)
        if (normalized) results.push(normalized)
      }

      this.logger.debug(`Fetched page ${pageNum}, items: ${items.length}`)

      if (items.length < pageSize) break
      pageNum++
      await this.sleep(500)
    }

    this.logger.log(`Total fetched from YOUTHCENTER: ${results.length}`)
    return results
  }

  private normalizeItem(item: YouthcenterItem): NormalizedBenefit | null {
    const externalId = item.bizId
    const title = item.polyBizSjnm
    if (!externalId || !title) return null

    let applyStart: Date | undefined
    let applyEnd: Date | undefined
    if (item.rqutPrdCn) {
      const parts = item.rqutPrdCn.split(/~|–|-/)
      if (parts.length >= 2) {
        applyStart = this.parseDate(parts[0]?.trim())
        applyEnd = this.parseDate(parts[1]?.trim())
      }
    }

    const region = this.extractRegion(item.rgnNm)
    const category = this.mapCategory(`${title} ${item.bizCnts ?? ''}`)

    return {
      externalId,
      source: 'YOUTHCENTER',
      title: title.slice(0, 200),
      agency: (item.mngtMson ?? '').slice(0, 100),
      category,
      region,
      amount: '',
      targetAge: item.ageInfo?.slice(0, 100),
      applyStart,
      applyEnd,
      applicationUrl: item.trnsfRlvntLnkUrl?.slice(0, 500),
      description: item.bizCnts,
      rawData: item as Record<string, unknown>,
    }
  }
}
