import { Module } from '@nestjs/common'
import { UserBenefitController } from './user-benefit.controller'
import { UserBenefitService } from './user-benefit.service'

@Module({
  controllers: [UserBenefitController],
  providers: [UserBenefitService],
})
export class UserBenefitModule {}
