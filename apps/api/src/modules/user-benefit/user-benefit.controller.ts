import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { UserBenefitService } from './user-benefit.service'

@ApiTags('User Benefits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me/benefits')
export class UserBenefitController {
  constructor(private readonly userBenefitService: UserBenefitService) {}

  @Get()
  findAll(@CurrentUser('id') userId: string, @Query('status') status?: string) {
    return this.userBenefitService.findAll(userId, status)
  }

  @Post(':id/bookmark')
  toggleBookmark(@CurrentUser('id') userId: string, @Param('id') benefitId: string) {
    return this.userBenefitService.toggleBookmark(userId, benefitId)
  }

  @Patch(':id')
  updateStatus(
    @CurrentUser('id') userId: string,
    @Param('id') benefitId: string,
    @Body('status') status: string
  ) {
    return this.userBenefitService.updateStatus(userId, benefitId, status)
  }
}
