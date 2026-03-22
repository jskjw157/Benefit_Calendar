export interface LoginDto {
  email: string
  password: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface RegisterDto {
  email: string
  password: string
  age: number
  region: string
  employmentStatus?: string
}

export interface RegisterResponse extends TokenResponse {
  user: {
    id: string
    email: string
    age: number
    region: string
    employmentStatus: string
    isSelfEmployed: boolean
    notificationChannel: string
    notificationEnabled: boolean
    notificationLeadDays: number
    createdAt: string
    updatedAt: string
  }
}
