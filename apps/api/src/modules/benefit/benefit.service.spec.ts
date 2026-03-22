import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { BenefitService } from './benefit.service'
import { PrismaService } from '../../prisma/prisma.service'

const mockBenefit = (overrides = {}) => ({
  id: 'benefit-1',
  title: '청년 월세 지원',
  agency: '서울특별시',
  category: '주거',
  region: '서울',
  amount: '월 20만원',
  applyStartDate: new Date('2026-01-10'),
  applyEndDate: new Date('2026-02-10'),
  deadline: new Date('2026-12-31'),
  applicationLink: 'https://example.com/apply',
  requirements: ['만 19~34세'],
  documents: ['주민등록등본'],
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  ...overrides,
})

describe('BenefitService', () => {
  let service: BenefitService
  let prisma: { benefit: { findMany: jest.Mock; count: jest.Mock; findUnique: jest.Mock } }

  beforeEach(async () => {
    prisma = {
      benefit: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
      },
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BenefitService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile()

    service = module.get<BenefitService>(BenefitService)
  })

  describe('findAll', () => {
    it('기본 페이징 응답을 반환한다', async () => {
      const benefits = [mockBenefit()]
      prisma.benefit.findMany.mockResolvedValue(benefits)
      prisma.benefit.count.mockResolvedValue(1)

      const result = await service.findAll({})

      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(20)
      expect(result.total).toBe(1)
      expect(result.items).toHaveLength(1)
      expect(result.items[0]).toHaveProperty('status')
      expect(result.items[0]).not.toHaveProperty('applyStartDate')
    })

    it('status=OPEN 필터 시 deadline >= today 조건을 적용한다', async () => {
      prisma.benefit.findMany.mockResolvedValue([])
      prisma.benefit.count.mockResolvedValue(0)

      await service.findAll({ status: 'OPEN' })

      const where = prisma.benefit.findMany.mock.calls[0][0].where
      expect(where.deadline).toHaveProperty('gte')
    })

    it('status=CLOSED 필터 시 deadline < today 조건을 적용한다', async () => {
      prisma.benefit.findMany.mockResolvedValue([])
      prisma.benefit.count.mockResolvedValue(0)

      await service.findAll({ status: 'CLOSED' })

      const where = prisma.benefit.findMany.mock.calls[0][0].where
      expect(where.deadline).toHaveProperty('lt')
    })

    it('q, category, region 필터를 적용한다', async () => {
      prisma.benefit.findMany.mockResolvedValue([])
      prisma.benefit.count.mockResolvedValue(0)

      await service.findAll({ q: '청년', category: '주거', region: '서울' })

      const where = prisma.benefit.findMany.mock.calls[0][0].where
      expect(where.title).toEqual({ contains: '청년', mode: 'insensitive' })
      expect(where.category).toBe('주거')
      expect(where.region).toBe('서울')
    })
  })

  describe('findOne', () => {
    it('applyPeriod 객체와 status 파생 필드를 포함하여 반환한다', async () => {
      prisma.benefit.findUnique.mockResolvedValue(mockBenefit())

      const result = await service.findOne('benefit-1')

      expect(result.applyPeriod).toEqual({ start: '2026-01-10', end: '2026-02-10' })
      expect(result.status).toBe('OPEN')
      expect(result).not.toHaveProperty('applyStartDate')
      expect(result).not.toHaveProperty('applyEndDate')
      expect(typeof result.createdAt).toBe('string')
    })

    it('존재하지 않는 ID는 NotFoundException을 발생시킨다', async () => {
      prisma.benefit.findUnique.mockResolvedValue(null)

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException)
    })
  })

  describe('toBenefitSummary (via findAll)', () => {
    it('deadline이 지난 혜택은 CLOSED 상태를 반환한다', async () => {
      const pastBenefit = mockBenefit({ deadline: new Date('2020-01-01') })
      prisma.benefit.findMany.mockResolvedValue([pastBenefit])
      prisma.benefit.count.mockResolvedValue(1)

      const result = await service.findAll({})

      expect(result.items[0].status).toBe('CLOSED')
    })
  })
})
