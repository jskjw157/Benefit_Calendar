import { IsEmail, IsString, MinLength, IsInt, Min, Max, IsOptional, IsEnum } from 'class-validator'
import { EmploymentStatus } from '@prisma/client'

export class RegisterDto {
  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  password!: string

  @IsInt()
  @Min(0)
  @Max(150)
  age!: number

  @IsString()
  region!: string

  @IsOptional()
  @IsEnum(EmploymentStatus)
  employmentStatus?: EmploymentStatus
}
