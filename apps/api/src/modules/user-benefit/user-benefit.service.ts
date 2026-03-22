import { Injectable } from '@nestjs/common'
import { UserBenefitStatus } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class UserBenefitService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, status?: string) {
    const where: Record<string, unknown> = { userId }
    if (status) where.status = status as UserBenefitStatus

    const items = await this.prisma.userBenefit.findMany({
      where,
      include: { benefit: true },
      orderBy: { updatedAt: 'desc' },
    })

    return { items, total: items.length }
  }

  async setBookmark(userId: string, benefitId: string, active: boolean) {
    const existing = await this.prisma.userBenefit.findUnique({
      where: { userId_benefitId: { userId, benefitId } },
    })

    if (active) {
      if (!existing) {
        await this.prisma.userBenefit.create({
          data: { userId, benefitId, status: 'BOOKMARKED' },
        })
      }
      return { benefitId, bookmarked: true }
    } else {
      if (existing) {
        await this.prisma.userBenefit.delete({
          where: { userId_benefitId: { userId, benefitId } },
        })
      }
      return { benefitId, bookmarked: false }
    }
  }

  async toggleBookmark(userId: string, benefitId: string) {
    const existing = await this.prisma.userBenefit.findUnique({
      where: { userId_benefitId: { userId, benefitId } },
    })

    // Toggle: if exists, delete it; if not, create it
    if (existing) {
      await this.prisma.userBenefit.delete({
        where: { userId_benefitId: { userId, benefitId } },
      })
      return { benefitId, bookmarked: false }
    } else {
      await this.prisma.userBenefit.create({
        data: { userId, benefitId, status: 'BOOKMARKED' },
      })
      return { benefitId, bookmarked: true }
    }
  }

  async updateStatus(userId: string, benefitId: string, status: string) {
    return this.prisma.userBenefit.update({
      where: { userId_benefitId: { userId, benefitId } },
      data: { status: status as UserBenefitStatus },
    })
  }
}
