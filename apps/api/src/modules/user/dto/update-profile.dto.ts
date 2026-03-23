import { IsInt, IsString, IsEnum, IsBoolean, IsOptional, Min, Max } from 'class-validator'
import { EmploymentStatus } from '@prisma/client'

export class UpdateProfileDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  age?: number

  @IsOptional()
  @IsString()
  region?: string

  @IsOptional()
  @IsEnum(EmploymentStatus)
  employmentStatus?: EmploymentStatus

  @IsOptional()
  @IsBoolean()
  isSelfEmployed?: boolean
}
