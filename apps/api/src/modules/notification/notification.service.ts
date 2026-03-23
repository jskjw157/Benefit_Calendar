import { Injectable, NotFoundException } from '@nestjs/common'
import { NotificationChannel } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdateNotificationDto } from './dto/update-notification.dto'

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.')

    return {
      channel: user.notificationChannel,
      enabled: user.notificationEnabled,
      leadDays: user.notificationLeadDays,
    }
  }

  async updateSettings(userId: string, data: UpdateNotificationDto) {
    const updateData: {
      notificationChannel?: NotificationChannel
      notificationEnabled?: boolean
      notificationLeadDays?: number
    } = {}
    if (data.channel !== undefined) updateData.notificationChannel = data.channel
    if (data.enabled !== undefined) updateData.notificationEnabled = data.enabled
    if (data.leadDays !== undefined) updateData.notificationLeadDays = data.leadDays

    await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    return this.getSettings(userId)
  }
}
