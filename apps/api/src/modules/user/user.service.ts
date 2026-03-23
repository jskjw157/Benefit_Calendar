import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.')
    const { passwordHash, ...profile } = user
    return profile
  }

  async update(id: string, data: UpdateProfileDto) {
    const { passwordHash, ...updated } = await this.prisma.user.update({
      where: { id },
      data,
    })
    return updated
  }
}
