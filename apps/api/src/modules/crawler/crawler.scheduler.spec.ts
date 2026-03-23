import { Test, TestingModule } from '@nestjs/testing'
import { CrawlerScheduler } from './crawler.scheduler'
import { CrawlerService, SyncResult } from './crawler.service'

// Prevent the real CrawlerService from being instantiated — it has heavy
// runtime dependencies (p-limit, provider chain) that are irrelevant here.
jest.mock('./crawler.service', () => ({
  CrawlerService: class CrawlerService {},
}))

// Stub @nestjs/schedule so the @Cron() decorator on CrawlerScheduler compiles
// without needing the actual package to be installed in the worktree.
jest.mock('@nestjs/schedule', () => ({
  Cron: () => () => undefined,
  SchedulerRegistry: class {},
}), { virtual: true })

/** Build a minimal SyncResult for mocking purposes. */
const makeSyncResult = (overrides: Partial<SyncResult> = {}): SyncResult => ({
  upserted: 10,
  skipped: 0,
  failed: 0,
  durationMs: 800,
  timestamp: new Date('2026-03-23T02:00:00.000Z'),
  ...overrides,
})

describe('CrawlerScheduler', () => {
  let scheduler: CrawlerScheduler
  let crawlerService: jest.Mocked<Pick<CrawlerService, 'syncAll'>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let loggerLogSpy: jest.SpyInstance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let loggerErrorSpy: jest.SpyInstance

  beforeEach(async () => {
    crawlerService = {
      syncAll: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrawlerScheduler,
        {
          provide: CrawlerService,
          useValue: crawlerService,
        },
      ],
    }).compile()

    scheduler = module.get<CrawlerScheduler>(CrawlerScheduler)

    // Spy on the scheduler's internal logger after instantiation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loggerLogSpy = jest
      .spyOn((scheduler as any).logger, 'log')
      .mockImplementation(() => undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loggerErrorSpy = jest
      .spyOn((scheduler as any).logger, 'error')
      .mockImplementation(() => undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  // ---------------------------------------------------------------------------
  // handleDailySync — happy path
  // ---------------------------------------------------------------------------

  describe('handleDailySync — success', () => {
    it('should call crawlerService.syncAll() once', async () => {
      crawlerService.syncAll.mockResolvedValue(makeSyncResult())

      await scheduler.handleDailySync()

      expect(crawlerService.syncAll).toHaveBeenCalledTimes(1)
    })

    it('should log sync started message before calling syncAll', async () => {
      crawlerService.syncAll.mockResolvedValue(makeSyncResult())

      await scheduler.handleDailySync()

      expect(loggerLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Scheduled daily sync started'),
      )
    })

    it('should log completion message including upserted count', async () => {
      crawlerService.syncAll.mockResolvedValue(makeSyncResult({ upserted: 42 }))

      await scheduler.handleDailySync()

      const logCalls = loggerLogSpy.mock.calls.map((args: unknown[]) => String(args[0]))
      const completionLog = logCalls.find((msg) => msg.includes('upserted=42'))
      expect(completionLog).toBeDefined()
    })

    it('should log completion message including skipped count', async () => {
      crawlerService.syncAll.mockResolvedValue(makeSyncResult({ skipped: 3 }))

      await scheduler.handleDailySync()

      const logCalls = loggerLogSpy.mock.calls.map((args: unknown[]) => String(args[0]))
      const completionLog = logCalls.find((msg) => msg.includes('skipped=3'))
      expect(completionLog).toBeDefined()
    })

    it('should log completion message including failed count', async () => {
      crawlerService.syncAll.mockResolvedValue(makeSyncResult({ failed: 1 }))

      await scheduler.handleDailySync()

      const logCalls = loggerLogSpy.mock.calls.map((args: unknown[]) => String(args[0]))
      const completionLog = logCalls.find((msg) => msg.includes('failed=1'))
      expect(completionLog).toBeDefined()
    })

    it('should log completion message including duration', async () => {
      crawlerService.syncAll.mockResolvedValue(makeSyncResult({ durationMs: 1234 }))

      await scheduler.handleDailySync()

      const logCalls = loggerLogSpy.mock.calls.map((args: unknown[]) => String(args[0]))
      const completionLog = logCalls.find((msg) => msg.includes('duration=1234ms'))
      expect(completionLog).toBeDefined()
    })

    it('should not log an error when syncAll succeeds', async () => {
      crawlerService.syncAll.mockResolvedValue(makeSyncResult())

      await scheduler.handleDailySync()

      expect(loggerErrorSpy).not.toHaveBeenCalled()
    })

    it('should resolve without throwing even on success', async () => {
      crawlerService.syncAll.mockResolvedValue(makeSyncResult())

      await expect(scheduler.handleDailySync()).resolves.toBeUndefined()
    })
  })

  // ---------------------------------------------------------------------------
  // handleDailySync — error path
  // ---------------------------------------------------------------------------

  describe('handleDailySync — error', () => {
    it('should log an error when syncAll throws an Error', async () => {
      crawlerService.syncAll.mockRejectedValue(new Error('DB connection lost'))

      await scheduler.handleDailySync()

      expect(loggerErrorSpy).toHaveBeenCalledTimes(1)
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('DB connection lost'),
      )
    })

    it('should log an error when syncAll throws a non-Error (string)', async () => {
      crawlerService.syncAll.mockRejectedValue('unexpected string error')

      await scheduler.handleDailySync()

      expect(loggerErrorSpy).toHaveBeenCalledTimes(1)
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('unexpected string error'),
      )
    })

    it('should not re-throw the error so the scheduler does not crash', async () => {
      crawlerService.syncAll.mockRejectedValue(new Error('Fatal error'))

      // handleDailySync catches the error internally; this must not reject
      await expect(scheduler.handleDailySync()).resolves.toBeUndefined()
    })

    it('should log the startup message even when syncAll throws', async () => {
      crawlerService.syncAll.mockRejectedValue(new Error('Network timeout'))

      await scheduler.handleDailySync()

      expect(loggerLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Scheduled daily sync started'),
      )
    })

    it('should not log the completion message when syncAll throws', async () => {
      crawlerService.syncAll.mockRejectedValue(new Error('API failure'))

      await scheduler.handleDailySync()

      const logCalls = loggerLogSpy.mock.calls.map((args: unknown[]) => String(args[0]))
      const completionLog = logCalls.find(
        (msg) => msg.includes('upserted=') || msg.includes('Scheduled sync finished'),
      )
      expect(completionLog).toBeUndefined()
    })

    it('should include Scheduled sync failed prefix in the error log', async () => {
      crawlerService.syncAll.mockRejectedValue(new Error('Some error'))

      await scheduler.handleDailySync()

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Scheduled sync failed'),
      )
    })
  })
})
