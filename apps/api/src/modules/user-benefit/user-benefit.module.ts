import { Module } from '@nestjs/common'
import { UserBenefitController } from './user-benefit.controller'
import { UserBenefitService } from './user-benefit.service'
import { PrismaService } from '../../prisma/prisma.service'

@Module({
  controllers: [UserBenefitController],
  providers: [UserBenefitService, PrismaService],
})
export class UserBenefitModule {}
