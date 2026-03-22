import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { BizinfoProvider } from './bizinfo.provider'

describe('BizinfoProvider', () => {
  let provider: BizinfoProvider

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BizinfoProvider,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-api-key') },
        },
      ],
    }).compile()

    provider = module.get<BizinfoProvider>(BizinfoProvider)
  })

  describe('parseDate (via protected access)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getParseDate = (p: BizinfoProvider) => (p as any).parseDate.bind(p)

    it('should parse YYYYMMDD format', () => {
      const parseDate = getParseDate(provider)
      const result: Date | undefined = parseDate('20260322')
      expect(result).toBeInstanceOf(Date)
      expect(result?.getFullYear()).toBe(2026)
      expect(result?.getMonth()).toBe(2) // 0-indexed
      expect(result?.getDate()).toBe(22)
    })

    it('should parse YYYY.MM.DD format', () => {
      const parseDate = getParseDate(provider)
      const result: Date | undefined = parseDate('2026.03.22')
      expect(result).toBeInstanceOf(Date)
      expect(result?.getFullYear()).toBe(2026)
    })

    it('should parse YYYY-MM-DD format', () => {
      const parseDate = getParseDate(provider)
      const result: Date | undefined = parseDate('2026-03-22')
      expect(result).toBeInstanceOf(Date)
    })

    it('should return undefined for invalid date', () => {
      const parseDate = getParseDate(provider)
      expect(parseDate('invalid-date')).toBeUndefined()
      expect(parseDate(null)).toBeUndefined()
      expect(parseDate(undefined)).toBeUndefined()
      expect(parseDate('')).toBeUndefined()
    })
  })

  describe('mapCategory (via protected access)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getMapCategory = (p: BizinfoProvider) => (p as any).mapCategory.bind(p)

    it('should map employment-related keywords to 일자리', () => {
      const mapCategory = getMapCategory(provider)
      expect(mapCategory('청년 취업 지원 사업')).toBe('일자리')
      expect(mapCategory('고용 안정 지원금')).toBe('일자리')
      expect(mapCategory('채용 장려금')).toBe('일자리')
    })

    it('should map housing-related keywords to 주거', () => {
      const mapCategory = getMapCategory(provider)
      expect(mapCategory('청년 주거 지원')).toBe('주거')
      expect(mapCategory('전세 대출 지원')).toBe('주거')
    })

    it('should map education-related keywords to 교육', () => {
      const mapCategory = getMapCategory(provider)
      expect(mapCategory('직업 훈련 지원금')).toBe('교육')
      expect(mapCategory('장학금 지원')).toBe('교육')
    })

    it('should map finance-related keywords to 금융', () => {
      const mapCategory = getMapCategory(provider)
      expect(mapCategory('소상공인 대출 지원')).toBe('금융')
    })

    it('should map startup-related keywords to 창업', () => {
      const mapCategory = getMapCategory(provider)
      expect(mapCategory('청년 창업 지원금')).toBe('창업')
      expect(mapCategory('스타트업 육성 사업')).toBe('창업')
    })

    it('should return 복지 as default for unknown text', () => {
      const mapCategory = getMapCategory(provider)
      expect(mapCategory('기타 지원')).toBe('복지')
      expect(mapCategory('')).toBe('복지')
      expect(mapCategory(null)).toBe('복지')
    })
  })

  describe('extractRegion (via protected access)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getExtractRegion = (p: BizinfoProvider) => (p as any).extractRegion.bind(p)

    it('should normalize 서울특별시 to 서울', () => {
      const extractRegion = getExtractRegion(provider)
      expect(extractRegion('서울특별시 거주 청년')).toBe('서울')
    })

    it('should normalize 경기도 to 경기', () => {
      const extractRegion = getExtractRegion(provider)
      expect(extractRegion('경기도 소재 기업')).toBe('경기')
    })

    it('should return 전국 for unknown or null region text', () => {
      const extractRegion = getExtractRegion(provider)
      expect(extractRegion(null)).toBe('전국')
      expect(extractRegion('')).toBe('전국')
      expect(extractRegion('전국 청년 대상')).toBe('전국')
    })
  })

  describe('normalizeItem (integration)', () => {
    it('should return null when externalId or title is missing', async () => {
      // We test via fetchAll with mocked HTTP
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalizeItem = (provider as any).normalizeItem.bind(provider)
      expect(normalizeItem({})).toBeNull()
      expect(normalizeItem({ pblancId: 'x' })).toBeNull()
      expect(normalizeItem({ pblancNm: 'title' })).toBeNull()
    })

    it('should correctly parse apply period with tilde separator', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalizeItem = (provider as any).normalizeItem.bind(provider)
      const result = normalizeItem({
        pblancId: 'test-001',
        pblancNm: '청년 취업 지원',
        jrsdInsttNm: '고용노동부',
        reqstBeginEndDe: '2026.01.01~2026.12.31',
        hashTags: '취업',
      })
      expect(result).not.toBeNull()
      expect(result?.source).toBe('BIZINFO')
      expect(result?.applyStart).toBeInstanceOf(Date)
      expect(result?.applyEnd).toBeInstanceOf(Date)
      expect(result?.category).toBe('일자리')
    })
  })
})
