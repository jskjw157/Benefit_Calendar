import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { CrawlerService } from './crawler.service'
import { PrismaService } from '../../prisma/prisma.service'
import { BizinfoProvider } from './providers/bizinfo.provider'
import { YouthcenterProvider } from './providers/youthcenter.provider'
import { DataGoKrProvider } from './providers/data-go-kr.provider'
import { NormalizedBenefit } from './types/normalized-benefit'

const makeBenefit = (
  overrides: Partial<NormalizedBenefit> = {},
): NormalizedBenefit => ({
  externalId: 'test-001',
  source: 'BIZINFO',
  title: '청년 취업 지원금',
  agency: '고용노동부',
  category: '일자리',
  region: '전국',
  amount: '100만원',
  rawData: {},
  ...overrides,
})

describe('CrawlerService', () => {
  let service: CrawlerService
  let bizinfo: jest.Mocked<BizinfoProvider>
  let youthcenter: jest.Mocked<YouthcenterProvider>
  let dataGoKr: jest.Mocked<DataGoKrProvider>
  let prismaMock: {
    benefit: { upsert: jest.Mock }
  }

  beforeEach(async () => {
    prismaMock = {
      benefit: { upsert: jest.fn().mockResolvedValue({}) },
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrawlerService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: BizinfoProvider,
          useValue: { fetchAll: jest.fn() } as unknown,
        },
        {
          provide: YouthcenterProvider,
          useValue: { fetchAll: jest.fn() } as unknown,
        },
        {
          provide: DataGoKrProvider,
          useValue: { fetchAll: jest.fn() } as unknown,
        },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile()

    service = module.get<CrawlerService>(CrawlerService)
    bizinfo = module.get(BizinfoProvider)
    youthcenter = module.get(YouthcenterProvider)
    dataGoKr = module.get(DataGoKrProvider)

    // Suppress logger noise and skip backoff delays
    jest.spyOn((service as any).logger, 'log').mockImplementation(() => undefined)
    jest.spyOn((service as any).logger, 'warn').mockImplementation(() => undefined)
    jest.spyOn((service as any).logger, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('syncAll', () => {
    it('should aggregate benefits from all providers and upsert them', async () => {
      const benefits = [makeBenefit({ externalId: 'biz-001', source: 'BIZINFO' })]
      bizinfo.fetchAll.mockResolvedValue(benefits)
      youthcenter.fetchAll.mockResolvedValue([])
      dataGoKr.fetchAll.mockResolvedValue([])

      const result = await service.syncAll()

      expect(result.upserted).toBe(1)
      expect(result.failed).toBe(0)
      expect(prismaMock.benefit.upsert).toHaveBeenCalledTimes(1)
    })

    it('should count skipped when externalId is missing', async () => {
      const invalid = makeBenefit({ externalId: '' })
      bizinfo.fetchAll.mockResolvedValue([invalid])
      youthcenter.fetchAll.mockResolvedValue([])
      dataGoKr.fetchAll.mockResolvedValue([])

      const result = await service.syncAll()

      expect(result.skipped).toBe(1)
      expect(result.upserted).toBe(0)
    })

    it('should count failed when prisma upsert throws', async () => {
      const benefit = makeBenefit({ externalId: 'err-001' })
      bizinfo.fetchAll.mockResolvedValue([benefit])
      youthcenter.fetchAll.mockResolvedValue([])
      dataGoKr.fetchAll.mockResolvedValue([])
      prismaMock.benefit.upsert.mockRejectedValue(new Error('DB error'))

      const result = await service.syncAll()

      expect(result.failed).toBe(1)
      expect(result.upserted).toBe(0)
    })

    it('should return empty result when all providers fail', async () => {
      // Mock the private fetchWithRetry to skip backoff delays
      jest.spyOn(service as any, 'fetchWithRetry').mockRejectedValue(new Error('API error'))

      const result = await service.syncAll()

      expect(result.upserted).toBe(0)
      expect(result.failed).toBe(0)
    })

    it('should store last result after sync', async () => {
      bizinfo.fetchAll.mockResolvedValue([])
      youthcenter.fetchAll.mockResolvedValue([])
      dataGoKr.fetchAll.mockResolvedValue([])

      expect(service.getLastResult()).toBeNull()
      await service.syncAll()
      expect(service.getLastResult()).not.toBeNull()
      expect(service.getLastResult()?.timestamp).toBeInstanceOf(Date)
    })
  })

  describe('upsert logic', () => {
    it('should use externalId and source as composite key for upsert', async () => {
      const benefit = makeBenefit({
        externalId: 'composite-001',
        source: 'YOUTHCENTER',
      })
      bizinfo.fetchAll.mockResolvedValue([benefit])
      youthcenter.fetchAll.mockResolvedValue([])
      dataGoKr.fetchAll.mockResolvedValue([])

      await service.syncAll()

      expect(prismaMock.benefit.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            externalId_source: {
              externalId: 'composite-001',
              source: 'YOUTHCENTER',
            },
          },
        }),
      )
    })
  })
})
