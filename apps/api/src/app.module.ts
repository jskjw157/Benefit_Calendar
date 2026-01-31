import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { BenefitModule } from './modules/benefit/benefit.module'
import { UserBenefitModule } from './modules/user-benefit/user-benefit.module'
import { NotificationModule } from './modules/notification/notification.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { HealthController } from './health.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    AuthModule,
    UserModule,
    BenefitModule,
    UserBenefitModule,
    NotificationModule,
    DashboardModule,
  ],
  controllers: [HealthController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
