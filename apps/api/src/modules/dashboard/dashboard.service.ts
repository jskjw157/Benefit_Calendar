import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string) {
    const now = new Date()
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    const [matchedCount, urgentCount, appliedCount] = await Promise.all([
      this.prisma.benefit.count({
        where: { deadline: { gte: now } },
      }),
      this.prisma.benefit.count({
        where: {
          deadline: { gte: now, lte: threeDaysLater },
        },
      }),
      this.prisma.userBenefit.count({
        where: { userId, status: 'APPLIED' },
      }),
    ])

    return { matchedCount, urgentCount, appliedCount }
  }
}
