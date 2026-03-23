import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { CrawlerService } from './crawler.service'
import { CrawlerScheduler } from './crawler.scheduler'
import { CrawlerController } from './crawler.controller'
import { BizinfoProvider } from './providers/bizinfo.provider'
import { YouthcenterProvider } from './providers/youthcenter.provider'
import { DataGoKrProvider } from './providers/data-go-kr.provider'

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [CrawlerController],
  providers: [
    CrawlerService,
    CrawlerScheduler,
    BizinfoProvider,
    YouthcenterProvider,
    DataGoKrProvider,
  ],
  exports: [CrawlerService],
})
export class CrawlerModule {}
