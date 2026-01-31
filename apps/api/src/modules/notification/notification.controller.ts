import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { NotificationService } from './notification.service'

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getSettings(@CurrentUser('id') userId: string) {
    return this.notificationService.getSettings(userId)
  }

  @Patch()
  updateSettings(
    @CurrentUser('id') userId: string,
    @Body() body: Record<string, unknown>
  ) {
    return this.notificationService.updateSettings(userId, body)
  }
}
