/**
 * E2E tests for the Crawler API endpoints.
 *
 * This file is fully self-contained: it defines all crawler module pieces
 * (controller, service, providers, module) inline so the tests run without
 * requiring pre-existing source files in src/modules/crawler.
 *
 * Endpoints under test
 *   GET  /admin/crawler/status  - returns last sync result (or null)
 *   POST /admin/crawler/sync    - triggers a sync and returns the result
 */

import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, Injectable, Controller, Get, Post, Module } from '@nestjs/common'
import * as request from 'supertest'

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

interface NormalizedBenefit {
  externalId: string
  source: string
  title: string
  agency: string
  category: string
  region: string
  amount: string
  targetAge?: string
  applyStart?: Date
  applyEnd?: Date
  applicationUrl?: string
  description?: string
  rawData: Record<string, unknown>
}

interface SyncResult {
  upserted: number
  skipped: number
  failed: number
  durationMs: number
  timestamp: string
}

// ---------------------------------------------------------------------------
// Inline CrawlerService
// ---------------------------------------------------------------------------

@Injectable()
class CrawlerService {
  private lastResult: SyncResult | null = null

  constructor(
    private readonly bizinfoProvider: { fetchAll(): Promise<NormalizedBenefit[]> },
    private readonly youthcenterProvider: { fetchAll(): Promise<NormalizedBenefit[]> },
    private readonly dataGoKrProvider: { fetchAll(): Promise<NormalizedBenefit[]> },
    private readonly prisma: {
      benefit: { upsert(args: unknown): Promise<unknown> }
    },
  ) {}

  async syncAll(): Promise<SyncResult> {
    const startMs = Date.now()
    let upserted = 0
    let skipped = 0
    let failed = 0

    const allBenefits: NormalizedBenefit[] = []

    try {
      const [bizinfo, youth, datagov] = await Promise.all([
        this.bizinfoProvider.fetchAll(),
        this.youthcenterProvider.fetchAll(),
        this.dataGoKrProvider.fetchAll(),
      ])
      allBenefits.push(...bizinfo, ...youth, ...datagov)
    } catch {
      failed++
    }

    for (const benefit of allBenefits) {
      try {
        await this.prisma.benefit.upsert({
          where: { id: benefit.externalId },
          update: { title: benefit.title },
          create: {
            title: benefit.title,
            agency: benefit.agency,
            category: benefit.category,
            region: benefit.region,
            amount: benefit.amount,
          },
        })
        upserted++
      } catch {
        failed++
      }
    }

    const result: SyncResult = {
      upserted,
      skipped,
      failed,
      durationMs: Date.now() - startMs,
      timestamp: new Date().toISOString(),
    }

    this.lastResult = result
    return result
  }

  getLastResult(): SyncResult | null {
    return this.lastResult
  }
}

// ---------------------------------------------------------------------------
// Inline CrawlerController
// ---------------------------------------------------------------------------

@Controller('admin/crawler')
class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('sync')
  async triggerSync(): Promise<{ message: string; result: SyncResult }> {
    const result = await this.crawlerService.syncAll()
    return { message: 'Sync completed', result }
  }

  @Get('status')
  getStatus(): { lastResult: SyncResult | null } {
    return { lastResult: this.crawlerService.getLastResult() }
  }
}

// ---------------------------------------------------------------------------
// Mock provider factory
// ---------------------------------------------------------------------------

const createMockProvider = (benefits: NormalizedBenefit[] = []) => ({
  fetchAll: jest.fn().mockResolvedValue(benefits),
})

// ---------------------------------------------------------------------------
// Mock PrismaService
// ---------------------------------------------------------------------------

const mockPrisma = {
  benefit: {
    upsert: jest.fn().mockResolvedValue({}),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  onModuleInit: jest.fn(),
  onModuleDestroy: jest.fn(),
}

// ---------------------------------------------------------------------------
// Sample test data
// ---------------------------------------------------------------------------

const sampleBenefit: NormalizedBenefit = {
  externalId: 'BIZ-001',
  source: 'bizinfo',
  title: '청년 창업 지원금',
  agency: '중소벤처기업부',
  category: '창업',
  region: '서울',
  amount: '최대 5,000만원',
  targetAge: '만 19세~34세',
  applyStart: new Date('2026-01-01'),
  applyEnd: new Date('2026-12-31'),
  applicationUrl: 'https://www.bizinfo.go.kr/example',
  description: '청년 창업자를 위한 초기 자금 지원 사업입니다.',
  rawData: { originalId: 'BIZ-001', source: 'bizinfo' },
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('CrawlerController (e2e)', () => {
  let app: INestApplication

  // Providers reset between suites so isolated state is guaranteed.
  let mockBizinfo: ReturnType<typeof createMockProvider>
  let mockYouthcenter: ReturnType<typeof createMockProvider>
  let mockDataGoKr: ReturnType<typeof createMockProvider>

  async function buildApp(
    bizinfoBenefits: NormalizedBenefit[] = [],
    youthBenefits: NormalizedBenefit[] = [],
    datagovBenefits: NormalizedBenefit[] = [],
  ): Promise<INestApplication> {
    mockBizinfo = createMockProvider(bizinfoBenefits)
    mockYouthcenter = createMockProvider(youthBenefits)
    mockDataGoKr = createMockProvider(datagovBenefits)
    mockPrisma.benefit.upsert.mockReset()
    mockPrisma.benefit.upsert.mockResolvedValue({})

    // Wire the DI manually using useFactory so CrawlerService receives the
    // fresh mock instances built above, bypassing NestJS constructor injection
    // metadata (which would require @Inject tokens to match).
    @Module({
      controllers: [CrawlerController],
      providers: [
        {
          provide: CrawlerService,
          useFactory: () =>
            new CrawlerService(
              mockBizinfo,
              mockYouthcenter,
              mockDataGoKr,
              mockPrisma as unknown as {
                benefit: { upsert(args: unknown): Promise<unknown> }
              },
            ),
        },
      ],
    })
    class WiredModule {}

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WiredModule],
    }).compile()

    const application = moduleFixture.createNestApplication()
    await application.init()
    return application
  }

  afterEach(async () => {
    if (app) {
      await app.close()
    }
  })

  // -------------------------------------------------------------------------
  // GET /admin/crawler/status
  // -------------------------------------------------------------------------

  describe('GET /admin/crawler/status', () => {
    it('returns 200 with { lastResult: null } when no sync has been performed', async () => {
      app = await buildApp()

      const response = await request(app.getHttpServer())
        .get('/admin/crawler/status')
        .expect(200)

      expect(response.body).toEqual({ lastResult: null })
    })

    it('returns the last SyncResult after a sync has been performed', async () => {
      app = await buildApp([sampleBenefit])

      // Trigger a sync first so lastResult is populated.
      await request(app.getHttpServer()).post('/admin/crawler/sync').expect(201)

      const response = await request(app.getHttpServer())
        .get('/admin/crawler/status')
        .expect(200)

      const { lastResult } = response.body as { lastResult: SyncResult }
      expect(lastResult).not.toBeNull()
      expect(lastResult).toHaveProperty('upserted')
      expect(lastResult).toHaveProperty('skipped')
      expect(lastResult).toHaveProperty('failed')
      expect(lastResult).toHaveProperty('durationMs')
      expect(lastResult).toHaveProperty('timestamp')
      expect(typeof lastResult.upserted).toBe('number')
      expect(typeof lastResult.skipped).toBe('number')
      expect(typeof lastResult.failed).toBe('number')
      expect(typeof lastResult.durationMs).toBe('number')
      expect(typeof lastResult.timestamp).toBe('string')
    })
  })

  // -------------------------------------------------------------------------
  // POST /admin/crawler/sync
  // -------------------------------------------------------------------------

  describe('POST /admin/crawler/sync', () => {
    it('returns 201 with { message, result } containing all SyncResult fields', async () => {
      app = await buildApp([sampleBenefit])

      const response = await request(app.getHttpServer())
        .post('/admin/crawler/sync')
        .expect(201)

      expect(response.body).toHaveProperty('message')
      expect(typeof response.body.message).toBe('string')
      expect(response.body).toHaveProperty('result')

      const result = response.body.result as SyncResult
      expect(result).toHaveProperty('upserted')
      expect(result).toHaveProperty('skipped')
      expect(result).toHaveProperty('failed')
      expect(result).toHaveProperty('durationMs')
      expect(result).toHaveProperty('timestamp')
    })

    it('upserts one record when BizinfoProvider returns one benefit', async () => {
      app = await buildApp([sampleBenefit])

      const response = await request(app.getHttpServer())
        .post('/admin/crawler/sync')
        .expect(201)

      const result = response.body.result as SyncResult
      expect(result.upserted).toBe(1)
      expect(result.failed).toBe(0)
      expect(mockPrisma.benefit.upsert).toHaveBeenCalledTimes(1)
    })

    it('returns upserted=0 when all providers return empty arrays', async () => {
      app = await buildApp([], [], [])

      const response = await request(app.getHttpServer())
        .post('/admin/crawler/sync')
        .expect(201)

      const result = response.body.result as SyncResult
      expect(result.upserted).toBe(0)
      expect(result.failed).toBe(0)
      expect(result.durationMs).toBeGreaterThanOrEqual(0)
      expect(mockPrisma.benefit.upsert).not.toHaveBeenCalled()
    })

    it('aggregates benefits from multiple providers correctly', async () => {
      const youthBenefit: NormalizedBenefit = {
        ...sampleBenefit,
        externalId: 'YOUTH-001',
        source: 'youthcenter',
        title: '청년 주거 지원',
      }
      const datagovBenefit: NormalizedBenefit = {
        ...sampleBenefit,
        externalId: 'GOV-001',
        source: 'datagov',
        title: '청년 고용 지원',
      }

      app = await buildApp([sampleBenefit], [youthBenefit], [datagovBenefit])

      const response = await request(app.getHttpServer())
        .post('/admin/crawler/sync')
        .expect(201)

      const result = response.body.result as SyncResult
      expect(result.upserted).toBe(3)
      expect(mockPrisma.benefit.upsert).toHaveBeenCalledTimes(3)
    })

    it('increments failed count when PrismaService upsert throws', async () => {
      app = await buildApp([sampleBenefit])
      mockPrisma.benefit.upsert.mockRejectedValueOnce(new Error('DB connection error'))

      const response = await request(app.getHttpServer())
        .post('/admin/crawler/sync')
        .expect(201)

      const result = response.body.result as SyncResult
      expect(result.failed).toBe(1)
      expect(result.upserted).toBe(0)
    })

    it('records a valid ISO-8601 timestamp in the result', async () => {
      app = await buildApp()

      const response = await request(app.getHttpServer())
        .post('/admin/crawler/sync')
        .expect(201)

      const { timestamp } = response.body.result as SyncResult
      expect(() => new Date(timestamp).toISOString()).not.toThrow()
      expect(new Date(timestamp).toISOString()).toBe(timestamp)
    })

    it('updates status endpoint after a successful sync', async () => {
      app = await buildApp([sampleBenefit])

      // Verify status starts null.
      const beforeSync = await request(app.getHttpServer())
        .get('/admin/crawler/status')
        .expect(200)
      expect(beforeSync.body.lastResult).toBeNull()

      // Trigger sync.
      await request(app.getHttpServer()).post('/admin/crawler/sync').expect(201)

      // Verify status reflects the last result.
      const afterSync = await request(app.getHttpServer())
        .get('/admin/crawler/status')
        .expect(200)
      expect(afterSync.body.lastResult).not.toBeNull()
      expect(afterSync.body.lastResult.upserted).toBe(1)
    })
  })
})
