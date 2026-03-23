import { registerAs } from '@nestjs/config'

export default registerAs('jwt', () => {
  const secret = process.env.AUTH_JWT_SECRET
  if (!secret) {
    throw new Error('AUTH_JWT_SECRET 환경 변수가 설정되지 않았습니다.')
  }
  return {
    secret,
    expiresIn: process.env.AUTH_JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.AUTH_REFRESH_EXPIRES_IN || '7d',
  }
})
