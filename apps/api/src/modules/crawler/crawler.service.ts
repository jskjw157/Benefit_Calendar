import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { BizinfoProvider } from './providers/bizinfo.provider'
import { YouthcenterProvider } from './providers/youthcenter.provider'
import { DataGoKrProvider } from './providers/data-go-kr.provider'
import { NormalizedBenefit } from './types/normalized-benefit'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pLimit = require('p-limit')

export interface SyncResult {
  upserted: number
  skipped: number
  failed: number
  durationMs: number
  timestamp: Date
}

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name)
  private lastResult: SyncResult | null = null

  constructor(
    private readonly prisma: PrismaService,
    private readonly bizinfo: BizinfoProvider,
    private readonly youthcenter: YouthcenterProvider,
    private readonly dataGoKr: DataGoKrProvider,
  ) {}

  async syncAll(): Promise<SyncResult> {
    const start = Date.now()
    this.logger.log('Starting full sync from all providers...')

    const limit = pLimit(2)

    const providerTasks = [
      { name: 'BIZINFO', fn: () => this.fetchWithRetry(this.bizinfo) },
      { name: 'YOUTHCENTER', fn: () => this.fetchWithRetry(this.youthcenter) },
      { name: 'DATA_GO_KR', fn: () => this.fetchWithRetry(this.dataGoKr) },
    ]

    const allBenefits = await Promise.all(
      providerTasks.map(({ name, fn }) =>
        limit(async () => {
          try {
            const items = await fn()
            this.logger.log(`Provider ${name}: fetched ${items.length} items`)
            return items
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err)
            this.logger.error(`Provider ${name} failed after retries: ${msg}`)
            return []
          }
        }),
      ),
    )

    const benefits = (allBenefits as NormalizedBenefit[][]).flat()
    this.logger.log(`Total benefits to upsert: ${benefits.length}`)

    let upserted = 0
    let skipped = 0
    let failed = 0

    for (const benefit of benefits) {
      try {
        if (!benefit.externalId || !benefit.source) {
          skipped++
          continue
        }

        const deadline = benefit.applyEnd ?? new Date('9999-12-31')
        const applyStartDate = benefit.applyStart ?? new Date()
        const applyEndDate = deadline

        await this.prisma.benefit.upsert({
          where: {
            externalId_source: {
              externalId: benefit.externalId,
              source: benefit.source,
            },
          },
          create: {
            title: benefit.title,
            agency: benefit.agency,
            category: benefit.category,
            region: benefit.region,
            amount: benefit.amount,
            applyStartDate,
            applyEndDate,
            deadline,
            applicationLink: benefit.applicationUrl ?? '',
            externalId: benefit.externalId,
            source: benefit.source,
            description: benefit.description,
            targetAge: benefit.targetAge,
          },
          update: {
            title: benefit.title,
            agency: benefit.agency,
            category: benefit.category,
            region: benefit.region,
            amount: benefit.amount,
            applyStartDate,
            applyEndDate,
            deadline,
            applicationLink: benefit.applicationUrl ?? '',
            description: benefit.description,
            targetAge: benefit.targetAge,
          },
        })
        upserted++
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        this.logger.warn(
          `Upsert failed for ${benefit.externalId}@${benefit.source}: ${msg}`,
        )
        failed++
      }
    }

    const durationMs = Date.now() - start
    const result: SyncResult = {
      upserted,
      skipped,
      failed,
      durationMs,
      timestamp: new Date(),
    }

    this.lastResult = result
    this.logger.log(
      `Sync complete: upserted=${upserted}, skipped=${skipped}, failed=${failed}, duration=${durationMs}ms`,
    )

    return result
  }

  getLastResult(): SyncResult | null {
    return this.lastResult
  }

  private async fetchWithRetry(
    provider: { fetchAll(): Promise<NormalizedBenefit[]> },
    maxRetries = 3,
  ): Promise<NormalizedBenefit[]> {
    let attempt = 0
    while (attempt < maxRetries) {
      try {
        return await provider.fetchAll()
      } catch (err: unknown) {
        attempt++
        if (attempt >= maxRetries) throw err
        const backoff = Math.pow(2, attempt) * 1000
        this.logger.warn(
          `Provider fetch failed (attempt ${attempt}/${maxRetries}), retrying in ${backoff}ms...`,
        )
        await new Promise((resolve) => setTimeout(resolve, backoff))
      }
    }
    return []
  }
}
