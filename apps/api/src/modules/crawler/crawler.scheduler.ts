import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { CrawlerService } from './crawler.service'

@Injectable()
export class CrawlerScheduler {
  private readonly logger = new Logger(CrawlerScheduler.name)

  constructor(private readonly crawlerService: CrawlerService) {}

  @Cron('0 2 * * *', { name: 'daily-benefit-sync' })
  async handleDailySync(): Promise<void> {
    this.logger.log('Scheduled daily sync started (02:00)')
    try {
      const result = await this.crawlerService.syncAll()
      this.logger.log(
        `Scheduled sync finished: upserted=${result.upserted}, skipped=${result.skipped}, failed=${result.failed}, duration=${result.durationMs}ms`,
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      this.logger.error(`Scheduled sync failed: ${msg}`)
    }
  }
}
