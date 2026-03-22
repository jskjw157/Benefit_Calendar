import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BaseProvider } from './base.provider'
import { NormalizedBenefit } from '../types/normalized-benefit'

interface DataGoKrItem {
  wlfareInfoId?: string
  wlfareInfoNm?: string
  lifeArray?: string
  intrsThemaArray?: string
  suprtCycNm?: string
  aplyMthdNm?: string
  inqplCtadr?: string
  wlfareInfoOutlCn?: string
  [key: string]: unknown
}

interface DataGoKrBody {
  items?: {
    item?: DataGoKrItem | DataGoKrItem[]
  }
  totalCount?: number
  numOfRows?: number
  pageNo?: number
}

interface DataGoKrResponse {
  response?: {
    body?: DataGoKrBody
  }
  [key: string]: unknown
}

@Injectable()
export class DataGoKrProvider extends BaseProvider {
  private readonly serviceKey: string
  private readonly baseUrl =
    'http://apis.data.go.kr/B554287/NationalBasisInfoService/wlfareInfoListInqire'

  constructor(private readonly config: ConfigService) {
    super('DataGoKrProvider')
    this.serviceKey =
      this.config.get<string>('DATA_GO_KR_SERVICE_KEY') ?? ''
  }

  async fetchAll(): Promise<NormalizedBenefit[]> {
    const results: NormalizedBenefit[] = []
    let pageNo = 1
    const numOfRows = 100

    while (true) {
      const data = await this.safeGet<DataGoKrResponse>(this.baseUrl, {
        params: {
          serviceKey: this.serviceKey,
          pageNo,
          numOfRows,
          _type: 'json',
        },
      })

      const body = data?.response?.body
      if (!body) break

      const rawItems = body.items?.item
      const items: DataGoKrItem[] = rawItems
        ? Array.isArray(rawItems)
          ? rawItems
          : [rawItems]
        : []

      if (items.length === 0) break

      for (const item of items) {
        const normalized = this.normalizeItem(item)
        if (normalized) results.push(normalized)
      }

      this.logger.debug(`Fetched page ${pageNo}, items: ${items.length}`)

      if (items.length < numOfRows) break
      pageNo++
      await this.sleep(500)
    }

    this.logger.log(`Total fetched from DATA_GO_KR: ${results.length}`)
    return results
  }

  private normalizeItem(item: DataGoKrItem): NormalizedBenefit | null {
    const externalId = item.wlfareInfoId
    const title = item.wlfareInfoNm
    if (!externalId || !title) return null

    const combinedText = `${title} ${item.lifeArray ?? ''} ${item.intrsThemaArray ?? ''}`
    const category = this.mapCategory(combinedText)
    const region = this.extractRegion(item.lifeArray)

    return {
      externalId,
      source: 'GOV24',
      title: title.slice(0, 200),
      agency: '',
      category,
      region,
      amount: item.suprtCycNm?.slice(0, 100) ?? '',
      applyStart: undefined,
      applyEnd: undefined,
      applicationUrl: item.inqplCtadr?.slice(0, 500),
      description: item.wlfareInfoOutlCn,
      rawData: item as Record<string, unknown>,
    }
  }
}
