import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { AuthService } from './auth.service'
import { PrismaService } from '../../prisma/prisma.service'

jest.mock('bcrypt')
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

const mockUser = (overrides = {}) => ({
  id: 'user-1',
  email: 'test@test.com',
  passwordHash: 'hashed_pw',
  age: 25,
  region: '서울',
  employmentStatus: 'JOB_SEEKER',
  isSelfEmployed: false,
  notificationChannel: 'EMAIL',
  notificationEnabled: true,
  notificationLeadDays: 3,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
})

describe('AuthService', () => {
  let service: AuthService
  let prisma: { user: { findUnique: jest.Mock; create: jest.Mock } }
  let jwtService: { sign: jest.Mock }

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    }
    jwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  describe('login', () => {
    it('정상 로그인 시 토큰을 반환한다', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser())
      ;(mockedBcrypt.compare as jest.Mock).mockResolvedValue(true)

      const result = await service.login('test@test.com', 'password123')

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
      expect(result.expiresIn).toBe(900)
      expect(jwtService.sign).toHaveBeenCalledTimes(2)
    })

    it('존재하지 않는 이메일은 UnauthorizedException을 발생시킨다', async () => {
      prisma.user.findUnique.mockResolvedValue(null)

      await expect(service.login('wrong@test.com', 'pw')).rejects.toThrow(UnauthorizedException)
    })

    it('잘못된 비밀번호는 UnauthorizedException을 발생시킨다', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser())
      ;(mockedBcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(service.login('test@test.com', 'wrong')).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('register', () => {
    const registerData = { email: 'new@test.com', password: 'pw123', age: 25, region: '서울' }

    beforeEach(() => {
      prisma.user.findUnique.mockResolvedValue(null)
      ;(mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashed_pw')
    })

    it('토큰과 user 프로필을 반환한다 (passwordHash 제외)', async () => {
      prisma.user.create.mockResolvedValue(mockUser({ email: 'new@test.com' }))

      const result = await service.register(registerData)

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
      expect(result.expiresIn).toBe(900)
      expect(result).toHaveProperty('user')
      expect(result.user).toHaveProperty('email')
      expect(result.user).not.toHaveProperty('passwordHash')
    })

    it('employmentStatus 미제공 시 JOB_SEEKER 기본값을 사용한다', async () => {
      prisma.user.create.mockResolvedValue(mockUser())

      await service.register(registerData)

      const createCall = prisma.user.create.mock.calls[0][0].data
      expect(createCall.employmentStatus).toBe('JOB_SEEKER')
      expect(createCall.isSelfEmployed).toBe(false)
    })

    it('SELF_EMPLOYED 시 isSelfEmployed를 true로 설정한다', async () => {
      prisma.user.create.mockResolvedValue(
        mockUser({ employmentStatus: 'SELF_EMPLOYED', isSelfEmployed: true })
      )

      await service.register({ ...registerData, employmentStatus: 'SELF_EMPLOYED' })

      const createCall = prisma.user.create.mock.calls[0][0].data
      expect(createCall.employmentStatus).toBe('SELF_EMPLOYED')
      expect(createCall.isSelfEmployed).toBe(true)
    })

    it('중복 이메일은 ConflictException을 발생시킨다', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser())

      await expect(service.register(registerData)).rejects.toThrow(ConflictException)
    })
  })
})
