import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BaseProvider } from './base.provider'
import { NormalizedBenefit } from '../types/normalized-benefit'

interface BizinfoItem {
  pblancId?: string
  pblancNm?: string
  jrsdInsttNm?: string
  hashTags?: string
  reqstBeginEndDe?: string
  pblancUrl?: string
  bsnsSumryCn?: string
  trgetNm?: string
  [key: string]: unknown
}

interface BizinfoResponse {
  jsonArray?: BizinfoItem[]
  [key: string]: unknown
}

@Injectable()
export class BizinfoProvider extends BaseProvider {
  private readonly apiKey: string
  private readonly baseUrl = 'https://www.bizinfo.go.kr/uss/rss/bizinfoApi.do'

  constructor(private readonly config: ConfigService) {
    super('BizinfoProvider')
    this.apiKey = this.config.get<string>('BIZINFO_API_KEY') ?? ''
  }

  async fetchAll(): Promise<NormalizedBenefit[]> {
    const results: NormalizedBenefit[] = []
    let pageIndex = 1

    while (true) {
      const data = await this.safeGet<BizinfoResponse>(this.baseUrl, {
        params: {
          crtfcKey: this.apiKey,
          dataType: 'json',
          pageIndex,
          pageUnit: 100,
        },
      })

      const items: BizinfoItem[] = data?.jsonArray ?? []
      if (items.length === 0) break

      for (const item of items) {
        const normalized = this.normalizeItem(item)
        if (normalized) results.push(normalized)
      }

      this.logger.debug(`Fetched page ${pageIndex}, items: ${items.length}`)
      pageIndex++
      await this.sleep(500)
    }

    this.logger.log(`Total fetched from BIZINFO: ${results.length}`)
    return results
  }

  private normalizeItem(item: BizinfoItem): NormalizedBenefit | null {
    const externalId = item.pblancId
    const title = item.pblancNm
    if (!externalId || !title) return null

    // Parse apply period: "2026.01.01~2026.12.31" or "2026.01.01 ~ 2026.12.31"
    let applyStart: Date | undefined
    let applyEnd: Date | undefined
    if (item.reqstBeginEndDe) {
      const parts = item.reqstBeginEndDe.split(/~/)
      applyStart = this.parseDate(parts[0]?.trim())
      applyEnd = this.parseDate(parts[1]?.trim())
    }

    const category = this.mapCategory(
      `${title} ${item.hashTags ?? ''} ${item.bsnsSumryCn ?? ''}`,
    )
    const region = this.extractRegion(item.trgetNm)

    return {
      externalId,
      source: 'BIZINFO',
      title: title.slice(0, 200),
      agency: (item.jrsdInsttNm ?? '').slice(0, 100),
      category,
      region,
      amount: '',
      targetAge: item.trgetNm?.slice(0, 100),
      applyStart,
      applyEnd,
      applicationUrl: item.pblancUrl?.slice(0, 500),
      description: item.bsnsSumryCn,
      rawData: item as Record<string, unknown>,
    }
  }
}
