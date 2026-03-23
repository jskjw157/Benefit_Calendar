import { Injectable, NotFoundException } from '@nestjs/common'
import { Benefit as PrismaBenefit } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'

interface FindAllParams {
  q?: string
  category?: string
  region?: string
  status?: string
  sort?: string
  page?: number
  pageSize?: number
}

@Injectable()
export class BenefitService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly SORT_FIELDS = ['deadline', 'title', 'agency', 'category', 'region'] as const
  private readonly SORT_DIRECTIONS = ['asc', 'desc'] as const

  async findAll(params: FindAllParams) {
    const page = Number(params.page) || 1
    const pageSize = Math.min(Math.max(Number(params.pageSize) || 20, 1), 100)
    const skip = (page - 1) * pageSize

    const where: Record<string, unknown> = {}
    if (params.q) {
      where.title = { contains: params.q, mode: 'insensitive' }
    }
    if (params.category) where.category = params.category
    if (params.region) where.region = params.region

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (params.status === 'OPEN') {
      where.deadline = { gte: today }
    } else if (params.status === 'CLOSED') {
      where.deadline = { lt: today }
    }

    let orderBy: Record<string, string> = { deadline: 'asc' }
    if (params.sort) {
      const [field, direction] = params.sort.split(':')
      const safeField = this.SORT_FIELDS.includes(field as typeof this.SORT_FIELDS[number]) ? field : 'deadline'
      const safeDirection = this.SORT_DIRECTIONS.includes(direction as typeof this.SORT_DIRECTIONS[number]) ? direction : 'asc'
      orderBy = { [safeField]: safeDirection }
    }

    const [items, total] = await Promise.all([
      this.prisma.benefit.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
      }),
      this.prisma.benefit.count({ where }),
    ])

    return { items: items.map(item => this.toBenefitSummary(item)), page, pageSize, total }
  }

  async findOne(id: string) {
    const benefit = await this.prisma.benefit.findUnique({ where: { id } })
    if (!benefit) throw new NotFoundException('혜택을 찾을 수 없습니다.')
    return this.toBenefitResponse(benefit)
  }

  private toBenefitResponse(raw: PrismaBenefit) {
    const { applyStartDate, applyEndDate, createdAt, updatedAt, ...rest } = raw
    return {
      ...rest,
      applyPeriod: {
        start: applyStartDate.toISOString().split('T')[0],
        end: applyEndDate.toISOString().split('T')[0],
      },
      status: new Date(raw.deadline) >= new Date() ? 'OPEN' : 'CLOSED',
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    }
  }

  private toBenefitSummary(raw: PrismaBenefit) {
    return {
      id: raw.id,
      title: raw.title,
      agency: raw.agency,
      category: raw.category,
      region: raw.region,
      amount: raw.amount,
      deadline: raw.deadline.toISOString().split('T')[0],
      status: new Date(raw.deadline) >= new Date() ? 'OPEN' : 'CLOSED',
    }
  }
}
