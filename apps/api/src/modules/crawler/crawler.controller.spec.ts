import { Test, TestingModule } from '@nestjs/testing'
import { CrawlerController } from './crawler.controller'
import { CrawlerService, SyncResult } from './crawler.service'

// Prevent the real CrawlerService from being loaded (it has heavy runtime
// dependencies such as p-limit and the provider chain). The spec provides its
// own mock implementation via the NestJS testing module.
jest.mock('./crawler.service', () => ({
  CrawlerService: class CrawlerService {},
}))

// Silence @nestjs/schedule decorator if the package is unavailable in this
// environment (the CrawlerController itself does not use it, but neighbouring
// source files might pull it transitively).
jest.mock('@nestjs/schedule', () => ({
  Cron: () => () => undefined,
  SchedulerRegistry: class {},
}), { virtual: true })

/** Build a realistic SyncResult for use in tests. */
const makeSyncResult = (overrides: Partial<SyncResult> = {}): SyncResult => ({
  upserted: 42,
  skipped: 3,
  failed: 1,
  durationMs: 1500,
  timestamp: new Date('2026-03-23T02:00:00.000Z'),
  ...overrides,
})

describe('CrawlerController', () => {
  let controller: CrawlerController
  let crawlerService: jest.Mocked<Pick<CrawlerService, 'syncAll' | 'getLastResult'>>

  beforeEach(async () => {
    crawlerService = {
      syncAll: jest.fn(),
      getLastResult: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrawlerController],
      providers: [
        {
          provide: CrawlerService,
          useValue: crawlerService,
        },
      ],
    }).compile()

    controller = module.get<CrawlerController>(CrawlerController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // ---------------------------------------------------------------------------
  // POST /admin/crawler/sync  →  triggerSync()
  // ---------------------------------------------------------------------------

  describe('triggerSync', () => {
    it('should call crawlerService.syncAll() once', async () => {
      crawlerService.syncAll.mockResolvedValue(makeSyncResult())

      await controller.triggerSync()

      expect(crawlerService.syncAll).toHaveBeenCalledTimes(1)
    })

    it('should return an object with a message and result property', async () => {
      const syncResult = makeSyncResult()
      crawlerService.syncAll.mockResolvedValue(syncResult)

      const response = await controller.triggerSync()

      expect(response).toHaveProperty('message')
      expect(response).toHaveProperty('result')
    })

    it('should return the Korean completion message', async () => {
      crawlerService.syncAll.mockResolvedValue(makeSyncResult())

      const response = await controller.triggerSync()

      expect(response.message).toBe('동기화가 완료되었습니다.')
    })

    it('should return the exact SyncResult from crawlerService.syncAll()', async () => {
      const syncResult = makeSyncResult({ upserted: 100, skipped: 5, failed: 2 })
      crawlerService.syncAll.mockResolvedValue(syncResult)

      const response = await controller.triggerSync()

      expect(response.result).toBe(syncResult)
      expect(response.result.upserted).toBe(100)
      expect(response.result.skipped).toBe(5)
      expect(response.result.failed).toBe(2)
    })

    it('should propagate errors thrown by crawlerService.syncAll()', async () => {
      crawlerService.syncAll.mockRejectedValue(new Error('Sync failure'))

      await expect(controller.triggerSync()).rejects.toThrow('Sync failure')
    })

    it('should return result with timestamp as a Date', async () => {
      const ts = new Date('2026-03-23T10:00:00.000Z')
      crawlerService.syncAll.mockResolvedValue(makeSyncResult({ timestamp: ts }))

      const response = await controller.triggerSync()

      expect(response.result.timestamp).toBeInstanceOf(Date)
      expect(response.result.timestamp).toEqual(ts)
    })

    it('should return correct durationMs in result', async () => {
      crawlerService.syncAll.mockResolvedValue(makeSyncResult({ durationMs: 3000 }))

      const response = await controller.triggerSync()

      expect(response.result.durationMs).toBe(3000)
    })
  })

  // ---------------------------------------------------------------------------
  // GET /admin/crawler/status  →  getStatus()
  // ---------------------------------------------------------------------------

  describe('getStatus', () => {
    it('should call crawlerService.getLastResult() once', () => {
      crawlerService.getLastResult.mockReturnValue(null)

      controller.getStatus()

      expect(crawlerService.getLastResult).toHaveBeenCalledTimes(1)
    })

    it('should return { lastResult: null } when no sync has run yet', () => {
      crawlerService.getLastResult.mockReturnValue(null)

      const response = controller.getStatus()

      expect(response).toEqual({ lastResult: null })
    })

    it('should return the last SyncResult when a sync has completed', () => {
      const syncResult = makeSyncResult()
      crawlerService.getLastResult.mockReturnValue(syncResult)

      const response = controller.getStatus()

      expect(response.lastResult).toBe(syncResult)
    })

    it('should return lastResult with correct upserted count', () => {
      crawlerService.getLastResult.mockReturnValue(makeSyncResult({ upserted: 77 }))

      const response = controller.getStatus()

      expect(response.lastResult!.upserted).toBe(77)
    })

    it('should return lastResult with correct failed count', () => {
      crawlerService.getLastResult.mockReturnValue(makeSyncResult({ failed: 5 }))

      const response = controller.getStatus()

      expect(response.lastResult!.failed).toBe(5)
    })

    it('should reflect the most recent sync result after multiple calls', () => {
      const firstResult = makeSyncResult({ upserted: 10 })
      const secondResult = makeSyncResult({ upserted: 20 })

      crawlerService.getLastResult
        .mockReturnValueOnce(firstResult)
        .mockReturnValueOnce(secondResult)

      expect(controller.getStatus().lastResult!.upserted).toBe(10)
      expect(controller.getStatus().lastResult!.upserted).toBe(20)
    })

    it('should have a lastResult property even when getLastResult returns null', () => {
      crawlerService.getLastResult.mockReturnValue(null)

      const response = controller.getStatus()

      expect(response).toHaveProperty('lastResult')
      expect(response.lastResult).toBeNull()
    })
  })
})
