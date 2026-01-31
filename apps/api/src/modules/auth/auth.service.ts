import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.')

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.')

    const payload = { sub: user.id, email: user.email }
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      expiresIn: 900,
    }
  }

  async register(data: { email: string; password: string; age: number; region: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } })
    if (existing) throw new ConflictException('이미 등록된 이메일입니다.')

    const passwordHash = await bcrypt.hash(data.password, 10)
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        age: data.age,
        region: data.region,
        employmentStatus: 'JOB_SEEKER',
        isSelfEmployed: false,
      },
    })

    const payload = { sub: user.id, email: user.email }
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      expiresIn: 900,
    }
  }
}
