import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Logger } from '@nestjs/common'
import { NormalizedBenefit } from '../types/normalized-benefit'

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  일자리: ['취업', '채용', '일자리', '고용', '인턴'],
  주거: ['주거', '임대', '전세', '월세', '주택'],
  교육: ['교육', '훈련', '자격증', '학비', '장학'],
  금융: ['금융', '대출', '보증', '이자', '신용'],
  복지: ['복지', '의료', '건강', '돌봄', '상담'],
  창업: ['창업', '사업', '스타트업', '소상공인', '자영업'],
}

const REGION_MAP: Record<string, string> = {
  서울특별시: '서울',
  부산광역시: '부산',
  대구광역시: '대구',
  인천광역시: '인천',
  광주광역시: '광주',
  대전광역시: '대전',
  울산광역시: '울산',
  세종특별자치시: '세종',
  경기도: '경기',
  강원도: '강원',
  강원특별자치도: '강원',
  충청북도: '충북',
  충청남도: '충남',
  전라북도: '전북',
  전북특별자치도: '전북',
  전라남도: '전남',
  경상북도: '경북',
  경상남도: '경남',
  제주특별자치도: '제주',
}

export abstract class BaseProvider {
  protected readonly logger: Logger
  protected readonly http: AxiosInstance

  constructor(providerName: string) {
    this.logger = new Logger(providerName)
    this.http = axios.create({
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  abstract fetchAll(): Promise<NormalizedBenefit[]>

  protected parseDate(raw: string | null | undefined): Date | undefined {
    if (!raw) return undefined
    const str = raw.trim()

    // YYYYMMDD
    if (/^\d{8}$/.test(str)) {
      const y = str.slice(0, 4)
      const m = str.slice(4, 6)
      const d = str.slice(6, 8)
      const dt = new Date(`${y}-${m}-${d}`)
      return isNaN(dt.getTime()) ? undefined : dt
    }

    // YYYY.MM.DD or YYYY-MM-DD or YYYY/MM/DD
    const normalized = str.replace(/[./]/g, '-')
    const dt = new Date(normalized)
    return isNaN(dt.getTime()) ? undefined : dt
  }

  protected extractRegion(text: string | null | undefined): string {
    if (!text) return '전국'
    for (const [full, short] of Object.entries(REGION_MAP)) {
      if (text.includes(full) || text.includes(short)) return short
    }
    return '전국'
  }

  protected mapCategory(text: string | null | undefined): string {
    if (!text) return '복지'
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some((kw) => text.includes(kw))) return category
    }
    return '복지'
  }

  protected async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  protected async safeGet<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T | null> {
    try {
      const res = await this.http.get<T>(url, config)
      return res.data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      this.logger.warn(`GET ${url} failed: ${message}`)
      return null
    }
  }
}
