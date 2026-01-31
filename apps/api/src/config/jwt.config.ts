import { registerAs } from '@nestjs/config'

export default registerAs('jwt', () => ({
  secret: process.env.AUTH_JWT_SECRET || 'your-secret-key-change-in-production',
  expiresIn: process.env.AUTH_JWT_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.AUTH_REFRESH_EXPIRES_IN || '7d',
}))
