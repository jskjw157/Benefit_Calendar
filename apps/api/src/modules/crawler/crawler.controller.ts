import { Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common'
import { CrawlerService, SyncResult } from './crawler.service'

@Controller('admin/crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async triggerSync(): Promise<{ message: string; result: SyncResult }> {
    const result = await this.crawlerService.syncAll()
    return { message: '동기화가 완료되었습니다.', result }
  }

  @Get('status')
  getStatus(): { lastResult: SyncResult | null } {
    return { lastResult: this.crawlerService.getLastResult() }
  }
}
