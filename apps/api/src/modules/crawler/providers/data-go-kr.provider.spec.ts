import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { DataGoKrProvider } from './data-go-kr.provider'
import { NormalizedBenefit } from '../types/normalized-benefit'

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const priv = (provider: DataGoKrProvider) => provider as any

/** Build XML response string matching the real API format. */
function makeXml(items: Array<Record<string, string | number>>, totalCount?: number): string {
  const count = totalCount ?? items.length
  const servListXml = items
    .map((item) => {
      const fields = Object.entries(item)
        .map(([k, v]) => `<${k}>${v}</${k}>`)
        .join('')
      return `<servList>${fields}</servList>`
    })
    .join('')
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><wantedList><totalCount>${count}</totalCount><pageNo>1</pageNo><numOfRows>100</numOfRows><resultCode>0</resultCode><resultMessage>SUCCESS</resultMessage>${servListXml}</wantedList>`
}

function makeXmlResponse(items: Array<Record<string, string | number>>, totalCount?: number) {
  return { data: makeXml(items, totalCount) }
}

function makeEmptyXml() {
  return { data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><wantedList><totalCount>0</totalCount><pageNo>0</pageNo><numOfRows>0</numOfRows><resultCode>10</resultCode><resultMessage>INVALID_REQUEST_PARAMETER_ERROR</resultMessage></wantedList>' }
}

describe('DataGoKrProvider', () => {
  let provider: DataGoKrProvider

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataGoKrProvider,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-service-key') },
        },
      ],
    }).compile()

    provider = module.get<DataGoKrProvider>(DataGoKrProvider)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // ---------------------------------------------------------------------------
  // normalizeItem
  // ---------------------------------------------------------------------------

  describe('normalizeItem', () => {
    it('should map servId to externalId', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      const result: NormalizedBenefit | null = normalizeItem({ servId: 'WLF00001', servNm: '복지 서비스' })
      expect(result).not.toBeNull()
      expect(result!.externalId).toBe('WLF00001')
    })

    it('should map servNm to title', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      const result = normalizeItem({ servId: 'WLF00002', servNm: '저소득층 의료 지원' })
      expect(result!.title).toBe('저소득층 의료 지원')
    })

    it('should always set source to GOV24', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      const result = normalizeItem({ servId: 'WLF00003', servNm: '복지' })
      expect(result!.source).toBe('GOV24')
    })

    it('should map jurMnofNm to agency', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      const result = normalizeItem({ servId: 'WLF00004', servNm: '복지', jurMnofNm: '보건복지부' })
      expect(result!.agency).toBe('보건복지부')
    })

    it('should set agency to empty string when jurMnofNm is missing', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      const result = normalizeItem({ servId: 'WLF00005', servNm: '복지' })
      expect(result!.agency).toBe('')
    })

    it('should map sprtCycNm to amount', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      const result = normalizeItem({ servId: 'WLF00006', servNm: '복지', sprtCycNm: '월' })
      expect(result!.amount).toBe('월')
    })

    it('should map servDtlLink to applicationUrl', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      const result = normalizeItem({ servId: 'WLF00007', servNm: '복지', servDtlLink: 'https://bokjiro.go.kr/detail' })
      expect(result!.applicationUrl).toBe('https://bokjiro.go.kr/detail')
    })

    it('should map servDgst to description', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      const result = normalizeItem({ servId: 'WLF00008', servNm: '복지', servDgst: '개요입니다' })
      expect(result!.description).toBe('개요입니다')
    })

    it('should return null when servId is missing', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      expect(normalizeItem({ servNm: '복지' })).toBeNull()
    })

    it('should return null when servNm is missing', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      expect(normalizeItem({ servId: 'WLF001' })).toBeNull()
    })

    it('should return null when both are missing', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      expect(normalizeItem({})).toBeNull()
    })

    it('should map category to 일자리 from intrsThemaArray', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      const result = normalizeItem({ servId: 'WLF020', servNm: '지원', intrsThemaArray: '취업' })
      expect(result!.category).toBe('일자리')
    })

    it('should default category to 복지', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      const result = normalizeItem({ servId: 'WLF021', servNm: '일반 지원' })
      expect(result!.category).toBe('복지')
    })

    it('should truncate title to 200 characters', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      const result = normalizeItem({ servId: 'WLF040', servNm: 'A'.repeat(300) })
      expect(result!.title.length).toBe(200)
    })

    it('should handle numeric servId from XML parser (coerced to string)', () => {
      const normalizeItem = priv(provider).normalizeItem.bind(provider)
      // XML parser may return numbers for numeric-looking values
      const result = normalizeItem({ servId: 12345, servNm: '복지 서비스' })
      expect(result).not.toBeNull()
      expect(result!.externalId).toBe('12345')
    })
  })

  // ---------------------------------------------------------------------------
  // fetchAll (XML responses)
  // ---------------------------------------------------------------------------

  describe('fetchAll', () => {
    beforeEach(() => {
      jest.spyOn(priv(provider).logger, 'debug').mockImplementation(() => undefined)
      jest.spyOn(priv(provider).logger, 'log').mockImplementation(() => undefined)
      jest.spyOn(priv(provider).logger, 'warn').mockImplementation(() => undefined)
      jest.spyOn(provider as any, 'sleep').mockResolvedValue(undefined)
      priv(provider).http.get.mockReset()
    })

    it('should return empty array when API returns error XML', async () => {
      jest.spyOn(priv(provider).http, 'get').mockResolvedValue(makeEmptyXml())
      const results = await provider.fetchAll()
      expect(results).toEqual([])
    })

    it('should return empty array on network error', async () => {
      jest.spyOn(priv(provider).http, 'get').mockRejectedValue(new Error('timeout'))
      const results = await provider.fetchAll()
      expect(results).toEqual([])
    })

    it('should parse XML and collect items from servList', async () => {
      const items = [
        { servId: 'WLF001', servNm: '산재근로자 지원', jurMnofNm: '고용노동부' },
        { servId: 'WLF002', servNm: '목돈마련 저축', jurMnofNm: '금융위원회' },
      ]
      jest.spyOn(priv(provider).http, 'get').mockResolvedValue(makeXmlResponse(items))

      const results = await provider.fetchAll()

      expect(results).toHaveLength(2)
      expect(results[0].externalId).toBe('WLF001')
      expect(results[0].agency).toBe('고용노동부')
      expect(results[1].externalId).toBe('WLF002')
      expect(results[1].source).toBe('GOV24')
    })

    it('should handle single item (XML parser returns object, not array)', async () => {
      // When XML has only 1 <servList>, fast-xml-parser returns an object, not array
      const xml = '<?xml version="1.0" encoding="UTF-8"?><wantedList><totalCount>1</totalCount><pageNo>1</pageNo><numOfRows>100</numOfRows><resultCode>0</resultCode><resultMessage>SUCCESS</resultMessage><servList><servId>WLF-SINGLE</servId><servNm>단일 서비스</servNm></servList></wantedList>'
      jest.spyOn(priv(provider).http, 'get').mockResolvedValue({ data: xml })

      const results = await provider.fetchAll()

      expect(results).toHaveLength(1)
      expect(results[0].externalId).toBe('WLF-SINGLE')
    })

    it('should stop pagination when items < numOfRows', async () => {
      const page1 = Array.from({ length: 100 }, (_, i) => ({ servId: `WLF-P1-${i}`, servNm: `서비스 ${i}` }))
      const page2 = Array.from({ length: 30 }, (_, i) => ({ servId: `WLF-P2-${i}`, servNm: `서비스 ${i}` }))

      const httpGetMock = jest
        .spyOn(priv(provider).http, 'get')
        .mockResolvedValueOnce(makeXmlResponse(page1, 365))
        .mockResolvedValueOnce(makeXmlResponse(page2, 365))

      const results = await provider.fetchAll()

      expect(httpGetMock).toHaveBeenCalledTimes(2)
      expect(results).toHaveLength(130)
    })

    it('should pass correct params including callTp and srchKeyCode', async () => {
      const httpGetMock = jest.spyOn(priv(provider).http, 'get').mockResolvedValue(makeEmptyXml())
      await provider.fetchAll()

      expect(httpGetMock).toHaveBeenCalledWith(
        'https://apis.data.go.kr/B554287/NationalWelfareInformationsV001/NationalWelfarelistV001',
        expect.objectContaining({
          params: expect.objectContaining({
            serviceKey: 'test-service-key',
            callTp: 'L',
            pageNo: 1,
            numOfRows: 100,
            srchKeyCode: '003',
          }),
          responseType: 'text',
        }),
      )
    })
  })
})
