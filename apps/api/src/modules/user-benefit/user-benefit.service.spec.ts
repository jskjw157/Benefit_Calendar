import { Test, TestingModule } from '@nestjs/testing'
import { UserBenefitService } from './user-benefit.service'
import { PrismaService } from '../../prisma/prisma.service'

const mockUserBenefit = (overrides = {}) => ({
  userId: 'user-1',
  benefitId: 'benefit-1',
  status: 'BOOKMARKED',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  benefit: { id: 'benefit-1', title: '청년 월세 지원' },
  ...overrides,
})

describe('UserBenefitService', () => {
  let service: UserBenefitService
  let prisma: {
    userBenefit: {
      findMany: jest.Mock
      findUnique: jest.Mock
      create: jest.Mock
      delete: jest.Mock
      update: jest.Mock
    }
  }

  beforeEach(async () => {
    prisma = {
      userBenefit: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      },
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserBenefitService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile()

    service = module.get<UserBenefitService>(UserBenefitService)
  })

  describe('findAll', () => {
    it('사용자의 혜택 목록을 반환한다', async () => {
      const items = [mockUserBenefit()]
      prisma.userBenefit.findMany.mockResolvedValue(items)

      const result = await service.findAll('user-1')

      expect(result.items).toHaveLength(1)
      expect(result.total).toBe(1)
      expect(prisma.userBenefit.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
          include: { benefit: true },
        })
      )
    })
  })

  describe('setBookmark', () => {
    it('active=true: 신규 북마크를 생성한다', async () => {
      prisma.userBenefit.findUnique.mockResolvedValue(null)

      const result = await service.setBookmark('user-1', 'benefit-1', true)

      expect(result).toEqual({ benefitId: 'benefit-1', bookmarked: true })
      expect(prisma.userBenefit.create).toHaveBeenCalledWith({
        data: { userId: 'user-1', benefitId: 'benefit-1', status: 'BOOKMARKED' },
      })
    })

    it('active=true: 이미 존재하면 중복 생성하지 않는다 (멱등성)', async () => {
      prisma.userBenefit.findUnique.mockResolvedValue(mockUserBenefit())

      const result = await service.setBookmark('user-1', 'benefit-1', true)

      expect(result).toEqual({ benefitId: 'benefit-1', bookmarked: true })
      expect(prisma.userBenefit.create).not.toHaveBeenCalled()
    })

    it('active=false: 기존 북마크를 삭제한다', async () => {
      prisma.userBenefit.findUnique.mockResolvedValue(mockUserBenefit())

      const result = await service.setBookmark('user-1', 'benefit-1', false)

      expect(result).toEqual({ benefitId: 'benefit-1', bookmarked: false })
      expect(prisma.userBenefit.delete).toHaveBeenCalled()
    })

    it('active=false: 존재하지 않아도 에러 없이 처리한다 (멱등성)', async () => {
      prisma.userBenefit.findUnique.mockResolvedValue(null)

      const result = await service.setBookmark('user-1', 'benefit-1', false)

      expect(result).toEqual({ benefitId: 'benefit-1', bookmarked: false })
      expect(prisma.userBenefit.delete).not.toHaveBeenCalled()
    })
  })

  describe('updateStatus', () => {
    it('혜택 상태를 변경한다', async () => {
      prisma.userBenefit.update.mockResolvedValue(
        mockUserBenefit({ status: 'APPLIED' })
      )

      const result = await service.updateStatus('user-1', 'benefit-1', 'APPLIED')

      expect(result.status).toBe('APPLIED')
      expect(prisma.userBenefit.update).toHaveBeenCalledWith({
        where: { userId_benefitId: { userId: 'user-1', benefitId: 'benefit-1' } },
        data: { status: 'APPLIED' },
      })
    })
  })
})
