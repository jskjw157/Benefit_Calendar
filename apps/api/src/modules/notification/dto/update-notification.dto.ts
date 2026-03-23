import { IsEnum, IsBoolean, IsInt, IsOptional, Min, Max } from 'class-validator'
import { NotificationChannel } from '@prisma/client'

export class UpdateNotificationDto {
  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel

  @IsOptional()
  @IsBoolean()
  enabled?: boolean

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  leadDays?: number
}
