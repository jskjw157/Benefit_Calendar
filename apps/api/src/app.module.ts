import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { BenefitModule } from './modules/benefit/benefit.module'
import { UserBenefitModule } from './modules/user-benefit/user-benefit.module'
import { NotificationModule } from './modules/notification/notification.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { CrawlerModule } from './modules/crawler/crawler.module'
import { HealthController } from './health.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    PrismaModule,
    AuthModule,
    UserModule,
    BenefitModule,
    UserBenefitModule,
    NotificationModule,
    DashboardModule,
    CrawlerModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
