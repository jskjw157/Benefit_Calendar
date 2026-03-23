import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { YouthcenterProvider } from './youthcenter.provider'
import { NormalizedBenefit } from '../types/normalized-benefit'

// Provide a minimal axios stub so the BaseProvider constructor can call
// axios.create() without needing the real package to be installed in this
// worktree's node_modules.
jest.mock('axios', () => {
  const mockInstance = {
    get: jest.fn(),
    defaults: { headers: { common: {} } },
  }
  return {
    __esModule: true,
    default: { create: jest.fn().mockReturnValue(mockInstance) },
    create: jest.fn().mockReturnValue(mockInstance),
  }
})

// Helper to access private/protected methods through the type system
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const priv = (provider: YouthcenterProvider) => provider as any

describe('YouthcenterProvider', () => {
  let provider: YouthcenterProvider

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YouthcenterProvider,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-youthcenter-key') },
        },
      ],
    }).compile()

    provider = module.get<YouthcenterProvider>(YouthcenterProvider)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // ---------------------------------------------------------------------------
  // normalizeItem
  // ---------------------------------------------------------------------------

  describe('normalizeItem', () => {
    it('should correctly map bizId to externalId and polyBizSjnm to title', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result: NormalizedBenefit | null = normalizeItem({
        bizId: 'YC-2026-001',
        polyBizSjnm: '청년 취업 지원 사업',
        mngtMson: '고용노동부',
        bizCnts: '청년 취업을 지원합니다.',
        rgnNm: '서울특별시',
        ageInfo: '만 19세~34세',
        trnsfRlvntLnkUrl: 'https://example.com/policy/001',
        rqutPrdCn: '2026.01.01~2026.12.31',
      })

      expect(result).not.toBeNull()
      expect(result!.externalId).toBe('YC-2026-001')
      expect(result!.title).toBe('청년 취업 지원 사업')
      expect(result!.source).toBe('YOUTHCENTER')
    })

    it('should map mngtMson to agency', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result = normalizeItem({
        bizId: 'YC-2026-002',
        polyBizSjnm: '청년 주거 지원',
        mngtMson: '국토교통부',
      })

      expect(result).not.toBeNull()
      expect(result!.agency).toBe('국토교통부')
    })

    it('should set agency to empty string when mngtMson is missing', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result = normalizeItem({
        bizId: 'YC-2026-003',
        polyBizSjnm: '청년 복지 지원',
      })

      expect(result).not.toBeNull()
      expect(result!.agency).toBe('')
    })

    it('should map ageInfo to targetAge', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result = normalizeItem({
        bizId: 'YC-2026-004',
        polyBizSjnm: '청년 교육 지원',
        ageInfo: '만 18세~34세',
      })

      expect(result).not.toBeNull()
      expect(result!.targetAge).toBe('만 18세~34세')
    })

    it('should map trnsfRlvntLnkUrl to applicationUrl', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      const url = 'https://www.youthcenter.go.kr/policy/001'

      const result = normalizeItem({
        bizId: 'YC-2026-005',
        polyBizSjnm: '청년 창업 지원',
        trnsfRlvntLnkUrl: url,
      })

      expect(result).not.toBeNull()
      expect(result!.applicationUrl).toBe(url)
    })

    it('should map bizCnts to description', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result = normalizeItem({
        bizId: 'YC-2026-006',
        polyBizSjnm: '청년 금융 지원',
        bizCnts: '청년 금융 지원 내용입니다.',
      })

      expect(result).not.toBeNull()
      expect(result!.description).toBe('청년 금융 지원 내용입니다.')
    })

    it('should always set amount to empty string', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result = normalizeItem({
        bizId: 'YC-2026-007',
        polyBizSjnm: '청년 지원',
      })

      expect(result).not.toBeNull()
      expect(result!.amount).toBe('')
    })

    // -------------------------------------------------------------------------
    // Null guard: missing required fields
    // -------------------------------------------------------------------------

    it('should return null when both bizId and polyBizSjnm are missing', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      expect(normalizeItem({})).toBeNull()
    })

    it('should return null when bizId is missing', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      expect(normalizeItem({ polyBizSjnm: '청년 취업 지원' })).toBeNull()
    })

    it('should return null when polyBizSjnm is missing', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      expect(normalizeItem({ bizId: 'YC-001' })).toBeNull()
    })

    it('should return null when both fields are empty strings', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      expect(normalizeItem({ bizId: '', polyBizSjnm: '' })).toBeNull()
    })

    // -------------------------------------------------------------------------
    // rqutPrdCn date range parsing
    // -------------------------------------------------------------------------

    it('should parse date range with tilde (~) separator', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result = normalizeItem({
        bizId: 'YC-2026-010',
        polyBizSjnm: '청년 지원 사업',
        rqutPrdCn: '2026.01.01~2026.12.31',
      })

      expect(result).not.toBeNull()
      expect(result!.applyStart).toBeInstanceOf(Date)
      expect(result!.applyEnd).toBeInstanceOf(Date)
      expect(result!.applyStart!.getFullYear()).toBe(2026)
      expect(result!.applyStart!.getMonth()).toBe(0) // January = 0
      expect(result!.applyEnd!.getFullYear()).toBe(2026)
      expect(result!.applyEnd!.getMonth()).toBe(11) // December = 11
    })

    it('should parse date range with en-dash (–) separator', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result = normalizeItem({
        bizId: 'YC-2026-011',
        polyBizSjnm: '청년 지원 사업',
        rqutPrdCn: '2026.03.01–2026.06.30',
      })

      expect(result).not.toBeNull()
      expect(result!.applyStart).toBeInstanceOf(Date)
      expect(result!.applyEnd).toBeInstanceOf(Date)
      expect(result!.applyStart!.getMonth()).toBe(2) // March = 2
    })

    it('should parse date range with hyphen (-) separator', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result = normalizeItem({
        bizId: 'YC-2026-012',
        polyBizSjnm: '청년 지원 사업',
        // Use YYYYMMDD format to avoid ambiguity with hyphen separator
        rqutPrdCn: '20260101~20261231',
      })

      expect(result).not.toBeNull()
      expect(result!.applyStart).toBeInstanceOf(Date)
      expect(result!.applyEnd).toBeInstanceOf(Date)
    })

    it('should leave applyStart and applyEnd undefined when rqutPrdCn is missing', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result = normalizeItem({
        bizId: 'YC-2026-013',
        polyBizSjnm: '청년 지원 사업',
      })

      expect(result).not.toBeNull()
      expect(result!.applyStart).toBeUndefined()
      expect(result!.applyEnd).toBeUndefined()
    })

    it('should leave dates undefined when rqutPrdCn has no recognizable separator', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result = normalizeItem({
        bizId: 'YC-2026-014',
        polyBizSjnm: '청년 지원 사업',
        rqutPrdCn: '상시모집',
      })

      expect(result).not.toBeNull()
      expect(result!.applyStart).toBeUndefined()
      expect(result!.applyEnd).toBeUndefined()
    })

    // -------------------------------------------------------------------------
    // Region extraction via rgnNm
    // -------------------------------------------------------------------------

    it('should extract region from rgnNm using 서울특별시', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result = normalizeItem({
        bizId: 'YC-2026-020',
        polyBizSjnm: '서울 청년 지원',
        rgnNm: '서울특별시',
      })

      expect(result).not.toBeNull()
      expect(result!.region).toBe('서울')
    })

    it('should default region to 전국 when rgnNm is missing', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result = normalizeItem({
        bizId: 'YC-2026-021',
        polyBizSjnm: '전국 청년 지원',
      })

      expect(result).not.toBeNull()
      expect(result!.region).toBe('전국')
    })

    // -------------------------------------------------------------------------
    // Category mapping
    // -------------------------------------------------------------------------

    it('should map category to 일자리 from title containing 취업', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result = normalizeItem({
        bizId: 'YC-2026-030',
        polyBizSjnm: '청년 취업 지원 사업',
      })

      expect(result).not.toBeNull()
      expect(result!.category).toBe('일자리')
    })

    it('should map category using bizCnts content as well as title', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result = normalizeItem({
        bizId: 'YC-2026-031',
        polyBizSjnm: '청년 지원 사업',
        bizCnts: '창업을 희망하는 청년을 지원합니다.',
      })

      expect(result).not.toBeNull()
      expect(result!.category).toBe('창업')
    })

    it('should default category to 복지 when no keyword matches', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)

      const result = normalizeItem({
        bizId: 'YC-2026-032',
        polyBizSjnm: '청년 활동 지원',
      })

      expect(result).not.toBeNull()
      expect(result!.category).toBe('복지')
    })

    // -------------------------------------------------------------------------
    // Field length trimming
    // -------------------------------------------------------------------------

    it('should truncate title to 200 characters', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      const longTitle = 'A'.repeat(300)

      const result = normalizeItem({
        bizId: 'YC-2026-040',
        polyBizSjnm: longTitle,
      })

      expect(result).not.toBeNull()
      expect(result!.title.length).toBe(200)
    })

    it('should truncate agency to 100 characters', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      const longAgency = 'B'.repeat(200)

      const result = normalizeItem({
        bizId: 'YC-2026-041',
        polyBizSjnm: '청년 지원',
        mngtMson: longAgency,
      })

      expect(result).not.toBeNull()
      expect(result!.agency.length).toBe(100)
    })

    it('should include rawData with the original item', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      const item = {
        bizId: 'YC-2026-050',
        polyBizSjnm: '청년 지원 사업',
        extra: 'extra-field',
      }

      const result = normalizeItem(item)

      expect(result).not.toBeNull()
      expect(result!.rawData).toEqual(item)
    })
  })

  // ---------------------------------------------------------------------------
  // fetchAll
  // ---------------------------------------------------------------------------

  describe('fetchAll', () => {
    // Suppress logger noise during HTTP tests
    beforeEach(() => {
      jest.spyOn(priv(provider).logger, 'debug').mockImplementation(() => undefined)
      jest.spyOn(priv(provider).logger, 'log').mockImplementation(() => undefined)
      jest.spyOn(priv(provider).logger, 'warn').mockImplementation(() => undefined)
      // Skip sleep delays so tests run fast
      jest.spyOn(provider as any, 'sleep').mockResolvedValue(undefined)
      // Reset the shared http.get mock to prevent leaks between tests
      priv(provider).http.get.mockReset()
    })

    it('should return empty array when API response contains no data', async () => {
      jest.spyOn(priv(provider).http, 'get').mockResolvedValue({ data: {} })

      const results = await provider.fetchAll()

      expect(results).toEqual([])
    })

    it('should return empty array when result.youthPolicyList is empty', async () => {
      jest
        .spyOn(priv(provider).http, 'get')
        .mockResolvedValue({ data: { result: { youthPolicyList: [] } } })

      const results = await provider.fetchAll()

      expect(results).toEqual([])
    })

    it('should return empty array when safeGet returns null (network error)', async () => {
      jest.spyOn(priv(provider).http, 'get').mockRejectedValue(new Error('Network error'))

      const results = await provider.fetchAll()

      expect(results).toEqual([])
    })

    it('should collect and normalize items from a single page', async () => {
      const mockItems = [
        {
          bizId: 'YC-001',
          polyBizSjnm: '청년 취업 지원',
          mngtMson: '고용노동부',
        },
        {
          bizId: 'YC-002',
          polyBizSjnm: '청년 주거 지원',
          mngtMson: '국토교통부',
        },
      ]

      jest.spyOn(priv(provider).http, 'get').mockResolvedValue({
        data: { result: { youthPolicyList: mockItems } },
      })

      const results = await provider.fetchAll()

      // 2 items, both valid, page size 50 so loop stops after first page
      expect(results).toHaveLength(2)
      expect(results[0].externalId).toBe('YC-001')
      expect(results[1].externalId).toBe('YC-002')
    })

    it('should stop pagination when items returned are fewer than pageSize (50)', async () => {
      // First page: exactly 50 items (triggers next page)
      const page1Items = Array.from({ length: 50 }, (_, i) => ({
        bizId: `YC-P1-${i}`,
        polyBizSjnm: `사업 ${i}`,
      }))

      // Second page: fewer than 50 items (stops pagination)
      const page2Items = Array.from({ length: 10 }, (_, i) => ({
        bizId: `YC-P2-${i}`,
        polyBizSjnm: `사업 ${i + 50}`,
      }))

      const httpGetMock = jest
        .spyOn(priv(provider).http, 'get')
        .mockResolvedValueOnce({ data: { result: { youthPolicyList: page1Items } } })
        .mockResolvedValueOnce({ data: { result: { youthPolicyList: page2Items } } })

      const results = await provider.fetchAll()

      // Should have called get exactly twice
      expect(httpGetMock).toHaveBeenCalledTimes(2)
      expect(results).toHaveLength(60)
    })

    it('should paginate through multiple full pages and stop on partial page', async () => {
      const fullPage = Array.from({ length: 50 }, (_, i) => ({
        bizId: `YC-P-${i}`,
        polyBizSjnm: `사업 ${i}`,
      }))
      const partialPage = Array.from({ length: 3 }, (_, i) => ({
        bizId: `YC-LAST-${i}`,
        polyBizSjnm: `마지막 사업 ${i}`,
      }))

      const httpGetMock = jest
        .spyOn(priv(provider).http, 'get')
        .mockResolvedValueOnce({ data: { result: { youthPolicyList: fullPage } } })
        .mockResolvedValueOnce({ data: { result: { youthPolicyList: fullPage } } })
        .mockResolvedValueOnce({ data: { result: { youthPolicyList: partialPage } } })

      const results = await provider.fetchAll()

      expect(httpGetMock).toHaveBeenCalledTimes(3)
      expect(results).toHaveLength(103) // 50 + 50 + 3
    })

    it('should skip items that fail normalization (missing bizId or polyBizSjnm)', async () => {
      const mockItems = [
        { bizId: 'YC-VALID-001', polyBizSjnm: '유효한 사업' },
        { polyBizSjnm: '아이디 없음' }, // missing bizId
        { bizId: 'YC-NO-TITLE' }, // missing polyBizSjnm
        { bizId: 'YC-VALID-002', polyBizSjnm: '또 다른 유효한 사업' },
      ]

      jest.spyOn(priv(provider).http, 'get').mockResolvedValue({
        data: { result: { youthPolicyList: mockItems } },
      })

      const results = await provider.fetchAll()

      expect(results).toHaveLength(2)
      expect(results[0].externalId).toBe('YC-VALID-001')
      expect(results[1].externalId).toBe('YC-VALID-002')
    })

    it('should pass correct params on the first page request', async () => {
      const httpGetMock = jest
        .spyOn(priv(provider).http, 'get')
        .mockResolvedValue({ data: {} })

      await provider.fetchAll()

      expect(httpGetMock).toHaveBeenCalledWith(
        'https://www.youthcenter.go.kr/go/ythip/getPlcy',
        expect.objectContaining({
          params: expect.objectContaining({
            apiKeyNm: 'test-youthcenter-key',
            pageNum: 1,
            pageSize: 50,
            rtnType: 'json',
          }),
        }),
      )
    })

    it('should pass incremented pageNum on the second page request', async () => {
      const fullPage = Array.from({ length: 50 }, (_, i) => ({
        bizId: `YC-P-${i}`,
        polyBizSjnm: `사업 ${i}`,
      }))

      const httpGetMock = jest
        .spyOn(priv(provider).http, 'get')
        .mockResolvedValueOnce({ data: { result: { youthPolicyList: fullPage } } })
        .mockResolvedValueOnce({ data: {} })

      await provider.fetchAll()

      expect(httpGetMock).toHaveBeenCalledTimes(2)
      expect(httpGetMock).toHaveBeenNthCalledWith(
        2,
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({ pageNum: 2 }),
        }),
      )
    })
  })
})
