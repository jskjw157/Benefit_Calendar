import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { UserService } from './user.service'
import { UpdateProfileDto } from './dto/update-profile.dto'

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getProfile(@CurrentUser('id') userId: string) {
    return this.userService.findById(userId)
  }

  @Patch()
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: UpdateProfileDto
  ) {
    return this.userService.update(userId, body)
  }
}
