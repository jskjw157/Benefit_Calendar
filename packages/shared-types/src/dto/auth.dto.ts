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
}
