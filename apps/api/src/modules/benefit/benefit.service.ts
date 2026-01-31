import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

interface FindAllParams {
  q?: string
  category?: string
  region?: string
  sort?: string
  page?: number
  pageSize?: number
}

@Injectable()
export class BenefitService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: FindAllParams) {
    const page = Number(params.page) || 1
    const pageSize = Number(params.pageSize) || 20
    const skip = (page - 1) * pageSize

    const where: Record<string, unknown> = {}
    if (params.q) {
      where.title = { contains: params.q, mode: 'insensitive' }
    }
    if (params.category) where.category = params.category
    if (params.region) where.region = params.region

    let orderBy: Record<string, string> = { deadline: 'asc' }
    if (params.sort) {
      const [field, direction] = params.sort.split(':')
      orderBy = { [field]: direction || 'asc' }
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

    return { items, page, pageSize, total }
  }

  async findOne(id: string) {
    const benefit = await this.prisma.benefit.findUnique({ where: { id } })
    if (!benefit) throw new NotFoundException('혜택을 찾을 수 없습니다.')
    return benefit
  }
}
