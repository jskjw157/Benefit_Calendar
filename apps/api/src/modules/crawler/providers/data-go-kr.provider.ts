import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { XMLParser } from 'fast-xml-parser'
import { BaseProvider } from './base.provider'
import { NormalizedBenefit } from '../types/normalized-benefit'

/**
 * 한국사회보장정보원_중앙부처복지서비스 API (XML only)
 * @see https://www.data.go.kr/data/15090532/openapi.do
 */

interface ServListItem {
  servId?: string
  servNm?: string
  jurMnofNm?: string
  jurOrgNm?: string
  servDgst?: string
  servDtlLink?: string
  sprtCycNm?: string
  srvPvsnNm?: string
  rprsCtadr?: string
  lifeArray?: string
  intrsThemaArray?: string
  trgterIndvdlArray?: string
  onapPsbltYn?: string
  inqNum?: number
  svcfrstRegTs?: string
  [key: string]: unknown
}

interface ParsedResponse {
  wantedList?: {
    servList?: ServListItem | ServListItem[]
    totalCount?: number
    pageNo?: number
    numOfRows?: number
    resultCode?: number | string
    resultMessage?: string
  }
}

@Injectable()
export class DataGoKrProvider extends BaseProvider {
  private readonly serviceKey: string
  private readonly baseUrl =
    'https://apis.data.go.kr/B554287/NationalWelfareInformationsV001/NationalWelfarelistV001'
  private readonly xmlParser = new XMLParser()

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
      const xml = await this.safeGetXml(pageNo, numOfRows)
      if (!xml) break

      const parsed: ParsedResponse = this.xmlParser.parse(xml)
      const wantedList = parsed?.wantedList
      if (!wantedList || String(wantedList.resultCode) !== '0') break

      // XML parser returns single object if 1 item, array if multiple
      const rawList = wantedList.servList
      const servList: ServListItem[] = rawList
        ? Array.isArray(rawList)
          ? rawList
          : [rawList]
        : []

      if (servList.length === 0) break

      for (const item of servList) {
        const normalized = this.normalizeItem(item)
        if (normalized) results.push(normalized)
      }

      this.logger.debug(`Fetched page ${pageNo}, items: ${servList.length}`)

      if (servList.length < numOfRows) break
      pageNo++
      await this.sleep(500)
    }

    this.logger.log(`Total fetched from DATA_GO_KR: ${results.length}`)
    return results
  }

  /** Fetch raw XML string from the API. */
  private async safeGetXml(
    pageNo: number,
    numOfRows: number,
  ): Promise<string | null> {
    try {
      const res = await this.http.get<string>(this.baseUrl, {
        params: {
          serviceKey: this.serviceKey,
          callTp: 'L',
          pageNo,
          numOfRows,
          srchKeyCode: '003',
        },
        responseType: 'text',
      })
      return res.data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      this.logger.warn(`GET ${this.baseUrl} failed: ${message}`)
      return null
    }
  }

  private normalizeItem(item: ServListItem): NormalizedBenefit | null {
    const externalId = item.servId ? String(item.servId) : undefined
    const title = item.servNm ? String(item.servNm) : undefined
    if (!externalId || !title) return null

    const combinedText = `${title} ${item.lifeArray ?? ''} ${item.intrsThemaArray ?? ''}`
    const category = this.mapCategory(combinedText)
    const region = this.extractRegion(
      item.lifeArray ? String(item.lifeArray) : null,
    )

    return {
      externalId,
      source: 'GOV24',
      title: title.slice(0, 200),
      agency: (item.jurMnofNm ? String(item.jurMnofNm) : '').slice(0, 100),
      category,
      region,
      amount: item.sprtCycNm ? String(item.sprtCycNm).slice(0, 100) : '',
      applyStart: undefined,
      applyEnd: undefined,
      applicationUrl: item.servDtlLink
        ? String(item.servDtlLink).slice(0, 500)
        : undefined,
      description: item.servDgst ? String(item.servDgst) : undefined,
      rawData: item as Record<string, unknown>,
    }
  }
}
