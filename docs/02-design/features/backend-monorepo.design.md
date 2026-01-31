---
template: design
version: 1.0
feature: backend-monorepo
date: 2026-01-31
author: BenefitCal Team
project: Benefit Calendar
status: Draft
plan_ref: docs/01-plan/features/backend-monorepo.plan.md
---

# 백엔드 모노레포 상세 설계 문서

> **Summary**: Turborepo 모노레포 전환 + NestJS 백엔드 상세 설계
>
> **Plan Reference**: `docs/01-plan/features/backend-monorepo.plan.md`
> **ADR Reference**: `docs/01-plan/adr/001-backend-stack-selection.md`
> **MVP Design Reference**: `docs/02-design/features/mvp-benefit-calendar.design.md`

---

## 1. 모노레포 설정 상세

### 1.1 Root package.json

```json
{
  "name": "benefit-calendar",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "clean": "turbo clean",
    "db:generate": "turbo db:generate",
    "db:migrate": "turbo db:migrate",
    "db:seed": "turbo db:seed"
  },
  "devDependencies": {
    "turbo": "^2.4.0",
    "typescript": "^5.7.0"
  },
  "packageManager": "pnpm@9.15.0",
  "engines": {
    "node": ">=24.0.0"
  }
}
```

### 1.2 pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 1.3 .npmrc

```
auto-install-peers=true
strict-peer-dependencies=false
```

### 1.4 turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"],
      "env": ["NODE_ENV", "DATABASE_URL"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "db:seed": {
      "cache": false
    }
  }
}
```

### 1.5 tsconfig.base.json (루트)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "exclude": ["node_modules"]
}
```

---

## 2. packages/shared-types 설계

### 2.1 package.json

```json
{
  "name": "@benefit-calendar/shared-types",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc --build",
    "clean": "rm -rf dist",
    "lint": "eslint src/"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

### 2.2 tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

### 2.3 타입 정의

MVP Design 문서의 타입을 그대로 가져오되, 모노레포 패키지로 분리한다.

#### src/enums/index.ts

```typescript
export enum BenefitCategory {
  HOUSING = '주거',
  TRANSPORT = '교통',
  CULTURE = '문화',
  STARTUP = '창업',
  LIVING = '생활',
  EDUCATION = '교육',
  MEDICAL = '의료',
}

export enum BenefitStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum UserBenefitStatus {
  BOOKMARKED = 'BOOKMARKED',
  PREPARING = 'PREPARING',
  APPLIED = 'APPLIED',
  RECEIVED = 'RECEIVED',
}

export enum EmploymentStatus {
  JOB_SEEKER = 'JOB_SEEKER',
  EMPLOYED = 'EMPLOYED',
  STUDENT = 'STUDENT',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
}
```

#### src/entities/user.ts

```typescript
import { EmploymentStatus, NotificationChannel } from '../enums'

export interface User {
  id: string
  email: string
  age: number
  region: string
  employmentStatus: EmploymentStatus
  isSelfEmployed: boolean
  notificationChannel: NotificationChannel
  createdAt: string
  updatedAt: string
}

export interface NotificationSettings {
  channel: NotificationChannel
  enabled: boolean
  leadDays: number
}
```

#### src/entities/benefit.ts

```typescript
import { BenefitCategory, BenefitStatus } from '../enums'

export interface ApplyPeriod {
  start: string // ISO 8601
  end: string   // ISO 8601
}

export interface Benefit {
  id: string
  title: string
  agency: string
  category: BenefitCategory
  region: string
  amount: string
  applyPeriod: ApplyPeriod
  deadline: string // ISO 8601
  applicationLink: string
  requirements: string[]
  documents: string[]
  status: BenefitStatus
  createdAt: string
  updatedAt: string
}

export interface BenefitSummary {
  id: string
  title: string
  agency: string
  category: string
  region: string
  amount: string
  deadline: string
  status: BenefitStatus
}
```

#### src/entities/user-benefit.ts

```typescript
import { UserBenefitStatus } from '../enums'

export interface UserBenefit {
  userId: string
  benefitId: string
  status: UserBenefitStatus
  createdAt: string
  updatedAt: string
}
```

#### src/dto/api.ts

```typescript
// 공통 API 응답 타입
export interface ApiMeta {
  requestId: string
  timestamp: string
}

export interface ApiSuccess<T> {
  success: true
  data: T
  meta: ApiMeta
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: Array<{ field: string; reason: string }>
  }
  meta: ApiMeta
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface PaginatedData<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export interface DashboardSummary {
  matchedCount: number
  urgentCount: number
  appliedCount: number
}
```

#### src/dto/benefit.dto.ts

```typescript
import { BenefitCategory } from '../enums'

// GET /benefits 요청 파라미터
export interface BenefitListQuery {
  q?: string
  category?: BenefitCategory
  region?: string
  status?: string
  sort?: string       // 예: 'deadline:asc'
  page?: number       // 기본 1
  pageSize?: number   // 기본 20
}
```

#### src/dto/user.dto.ts

```typescript
import { EmploymentStatus, NotificationChannel } from '../enums'

// PATCH /users/me 요청 바디
export interface UpdateProfileDto {
  age?: number
  region?: string
  employmentStatus?: EmploymentStatus
  isSelfEmployed?: boolean
}

// PATCH /users/me/notifications 요청 바디
export interface UpdateNotificationDto {
  channel?: NotificationChannel
  enabled?: boolean
  leadDays?: number
}
```

#### src/dto/auth.dto.ts

```typescript
// POST /auth/login 요청
export interface LoginDto {
  email: string
  password: string
}

// POST /auth/login 응답
export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// POST /auth/register 요청
export interface RegisterDto {
  email: string
  password: string
  age: number
  region: string
}
```

#### src/index.ts

```typescript
// Enums
export * from './enums'

// Entities
export * from './entities/user'
export * from './entities/benefit'
export * from './entities/user-benefit'

// DTOs
export * from './dto/api'
export * from './dto/benefit.dto'
export * from './dto/user.dto'
export * from './dto/auth.dto'
```

---

## 3. packages/shared-utils 설계

### 3.1 package.json

```json
{
  "name": "@benefit-calendar/shared-utils",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc --build",
    "clean": "rm -rf dist",
    "lint": "eslint src/"
  },
  "dependencies": {
    "@benefit-calendar/shared-types": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

### 3.2 src/date.ts

```typescript
/**
 * D-day 계산 (마감일까지 남은 일수)
 * @returns 양수: 남은 일수, 0: 오늘, 음수: 지남
 */
export function calculateDday(deadline: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(deadline)
  target.setHours(0, 0, 0, 0)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * D-day 라벨 포맷
 * @returns "D-3", "D-Day", "마감" 등
 */
export function formatDday(deadline: string): string {
  const dday = calculateDday(deadline)
  if (dday > 0) return `D-${dday}`
  if (dday === 0) return 'D-Day'
  return '마감'
}

/**
 * 날짜 포맷 (YYYY.MM.DD)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

/**
 * 기간 포맷 (YYYY.MM.DD ~ YYYY.MM.DD)
 */
export function formatPeriod(start: string, end: string): string {
  return `${formatDate(start)} ~ ${formatDate(end)}`
}
```

### 3.3 src/format.ts

```typescript
/**
 * 금액 포맷 (예: "500000" → "50만원")
 */
export function formatAmount(amount: string): string {
  const num = parseInt(amount, 10)
  if (isNaN(num)) return amount // "월 50만원" 같은 문자열은 그대로 반환
  if (num >= 100000000) return `${Math.floor(num / 100000000)}억원`
  if (num >= 10000) return `${Math.floor(num / 10000)}만원`
  return `${num.toLocaleString()}원`
}

/**
 * 숫자 컴마 포맷
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR')
}
```

### 3.4 src/index.ts

```typescript
export * from './date'
export * from './format'
```

---

## 4. apps/api (NestJS) 설계

### 4.1 package.json

```json
{
  "name": "@benefit-calendar/api",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,test}/**/*.ts\"",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "ts-node prisma/seed.ts"
  },
  "dependencies": {
    "@benefit-calendar/shared-types": "workspace:*",
    "@benefit-calendar/shared-utils": "workspace:*",
    "@nestjs/common": "^10.4.0",
    "@nestjs/config": "^3.3.0",
    "@nestjs/core": "^10.4.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/platform-express": "^10.4.0",
    "@nestjs/swagger": "^8.1.0",
    "@prisma/client": "^6.3.0",
    "bcrypt": "^5.1.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.0",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.4.0",
    "@nestjs/testing": "^10.4.0",
    "@types/bcrypt": "^5.0.0",
    "@types/jest": "^29.5.0",
    "@types/passport-jwt": "^4.0.0",
    "jest": "^29.7.0",
    "prisma": "^6.3.0",
    "ts-jest": "^29.2.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.7.0"
  }
}
```

### 4.2 디렉토리 구조

```
apps/api/
├── src/
│   ├── main.ts                         # 앱 엔트리포인트
│   ├── app.module.ts                   # 루트 모듈
│   │
│   ├── modules/
│   │   ├── auth/                       # 인증 모듈
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts      # POST /auth/login, /auth/register
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts     # Passport JWT 전략
│   │   │   └── guards/
│   │   │       └── jwt-auth.guard.ts
│   │   │
│   │   ├── user/                       # 사용자 모듈
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts      # GET/PATCH /users/me
│   │   │   ├── user.service.ts
│   │   │   └── user.repository.ts
│   │   │
│   │   ├── benefit/                    # 혜택 모듈
│   │   │   ├── benefit.module.ts
│   │   │   ├── benefit.controller.ts   # GET /benefits, /benefits/:id
│   │   │   ├── benefit.service.ts
│   │   │   └── benefit.repository.ts
│   │   │
│   │   ├── user-benefit/               # 사용자-혜택 모듈
│   │   │   ├── user-benefit.module.ts
│   │   │   ├── user-benefit.controller.ts  # GET/POST/PATCH /users/me/benefits
│   │   │   ├── user-benefit.service.ts
│   │   │   └── user-benefit.repository.ts
│   │   │
│   │   ├── notification/               # 알림 설정 모듈
│   │   │   ├── notification.module.ts
│   │   │   ├── notification.controller.ts  # GET/PATCH /users/me/notifications
│   │   │   └── notification.service.ts
│   │   │
│   │   └── dashboard/                  # 대시보드 모듈
│   │       ├── dashboard.module.ts
│   │       ├── dashboard.controller.ts # GET /dashboard/summary
│   │       └── dashboard.service.ts
│   │
│   ├── common/                         # 공통 모듈
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts   # @CurrentUser() 파라미터 데코레이터
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts    # 전역 예외 필터
│   │   ├── interceptors/
│   │   │   └── response.interceptor.ts     # ApiResponse 래핑
│   │   └── pipes/
│   │       └── validation.pipe.ts          # class-validator 파이프
│   │
│   ├── config/
│   │   ├── app.config.ts               # 앱 설정 (PORT 등)
│   │   ├── database.config.ts          # DB 설정
│   │   └── jwt.config.ts               # JWT 설정
│   │
│   └── prisma/
│       └── prisma.service.ts           # Prisma 클라이언트 서비스
│
├── prisma/
│   ├── schema.prisma                   # DB 스키마
│   ├── migrations/                     # 마이그레이션 파일
│   └── seed.ts                         # 시드 데이터
│
├── test/
│   └── app.e2e-spec.ts
│
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
└── .env.local
```

### 4.3 Prisma 스키마 (schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum EmploymentStatus {
  JOB_SEEKER
  EMPLOYED
  STUDENT
  SELF_EMPLOYED
}

enum NotificationChannel {
  EMAIL
  SMS
  PUSH
}

enum UserBenefitStatus {
  BOOKMARKED
  PREPARING
  APPLIED
  RECEIVED
}

model User {
  id                  String             @id @default(uuid())
  email               String             @unique
  passwordHash        String             @map("password_hash")
  age                 Int
  region              String             @db.VarChar(50)
  employmentStatus    EmploymentStatus   @map("employment_status")
  isSelfEmployed      Boolean            @default(false) @map("is_self_employed")
  notificationChannel NotificationChannel @default(EMAIL) @map("notification_channel")
  notificationEnabled Boolean            @default(true) @map("notification_enabled")
  notificationLeadDays Int               @default(3) @map("notification_lead_days")
  createdAt           DateTime           @default(now()) @map("created_at")
  updatedAt           DateTime           @updatedAt @map("updated_at")

  userBenefits UserBenefit[]

  @@map("users")
}

model Benefit {
  id              String   @id @default(uuid())
  title           String   @db.VarChar(200)
  agency          String   @db.VarChar(100)
  category        String   @db.VarChar(50)
  region          String   @db.VarChar(50)
  amount          String   @db.VarChar(100)
  applyStartDate  DateTime @map("apply_start_date") @db.Date
  applyEndDate    DateTime @map("apply_end_date") @db.Date
  deadline        DateTime @db.Date
  applicationLink String   @map("application_link") @db.VarChar(500)
  requirements    Json     @default("[]")
  documents       Json     @default("[]")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  userBenefits UserBenefit[]

  @@index([deadline])
  @@index([region, category])
  @@map("benefits")
}

model UserBenefit {
  userId    String           @map("user_id")
  benefitId String           @map("benefit_id")
  status    UserBenefitStatus
  createdAt DateTime         @default(now()) @map("created_at")
  updatedAt DateTime         @updatedAt @map("updated_at")

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  benefit Benefit @relation(fields: [benefitId], references: [id], onDelete: Cascade)

  @@id([userId, benefitId])
  @@index([userId, status])
  @@map("user_benefits")
}
```

### 4.4 핵심 파일 설계

#### main.ts

```typescript
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Global prefix
  app.setGlobalPrefix('api/v1')

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  )

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Benefit Calendar API')
    .setDescription('혜택 캘린더 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT || 4000
  await app.listen(port)
}
bootstrap()
```

#### app.module.ts

```typescript
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { BenefitModule } from './modules/benefit/benefit.module'
import { UserBenefitModule } from './modules/user-benefit/user-benefit.module'
import { NotificationModule } from './modules/notification/notification.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    AuthModule,
    UserModule,
    BenefitModule,
    UserBenefitModule,
    NotificationModule,
    DashboardModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
```

#### common/interceptors/response.interceptor.ts

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid'
import type { ApiSuccess } from '@benefit-calendar/shared-types'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiSuccess<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiSuccess<T>> {
    return next.handle().pipe(
      map(data => ({
        success: true as const,
        data,
        meta: {
          requestId: uuidv4(),
          timestamp: new Date().toISOString(),
        },
      }))
    )
  }
}
```

#### common/filters/http-exception.filter.ts

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import type { ApiError } from '@benefit-calendar/shared-types'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    const errorBody: ApiError = {
      success: false,
      error: {
        code: typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).error || 'UNKNOWN_ERROR',
        message: typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || '오류가 발생했습니다.',
      },
      meta: {
        requestId: uuidv4(),
        timestamp: new Date().toISOString(),
      },
    }

    response.status(status).json(errorBody)
  }
}
```

#### common/decorators/current-user.decorator.ts

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user
    return data ? user?.[data] : user
  }
)
```

---

## 5. API 엔드포인트 상세 설계

MVP Design 문서(Section 4)의 API를 NestJS Controller로 매핑한다.

### 5.1 엔드포인트 ↔ Controller 매핑

| Method | Path | Controller | Method | Auth |
|--------|------|------------|--------|:----:|
| `POST` | `/auth/login` | AuthController | `login()` | - |
| `POST` | `/auth/register` | AuthController | `register()` | - |
| `GET` | `/users/me` | UserController | `getProfile()` | JWT |
| `PATCH` | `/users/me` | UserController | `updateProfile()` | JWT |
| `GET` | `/benefits` | BenefitController | `findAll()` | - |
| `GET` | `/benefits/:id` | BenefitController | `findOne()` | - |
| `GET` | `/users/me/benefits` | UserBenefitController | `findAll()` | JWT |
| `POST` | `/users/me/benefits/:id/bookmark` | UserBenefitController | `toggleBookmark()` | JWT |
| `PATCH` | `/users/me/benefits/:id` | UserBenefitController | `updateStatus()` | JWT |
| `GET` | `/users/me/notifications` | NotificationController | `getSettings()` | JWT |
| `PATCH` | `/users/me/notifications` | NotificationController | `updateSettings()` | JWT |
| `GET` | `/dashboard/summary` | DashboardController | `getSummary()` | JWT |
| `GET` | `/health` | AppController | `health()` | - |

### 5.2 인증 흐름

```
[Login]
POST /auth/login { email, password }
  → bcrypt.compare(password, user.passwordHash)
  → JWT sign: { sub: user.id, email: user.email }
  → Response: { accessToken, refreshToken, expiresIn }

[Protected Route]
GET /users/me
  Headers: Authorization: Bearer <accessToken>
  → JwtStrategy.validate() → req.user = { id, email }
  → @CurrentUser() 데코레이터로 접근
```

- Access Token: 15분 만료
- Refresh Token: 7일 만료 (DB 저장)

---

## 6. apps/web 마이그레이션 설계

### 6.1 이동 대상 파일

| 현재 위치 | 이동 위치 |
|-----------|----------|
| `app/` | `apps/web/app/` |
| `components/` | `apps/web/components/` |
| `shared/` | `apps/web/shared/` (sample_data.json 등) |
| `public/` | `apps/web/public/` |
| `tailwind.config.ts` | `apps/web/tailwind.config.ts` |
| `postcss.config.mjs` | `apps/web/postcss.config.mjs` |
| `next.config.mjs` | `apps/web/next.config.mjs` |

### 6.2 apps/web/package.json

```json
{
  "name": "@benefit-calendar/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@benefit-calendar/shared-types": "workspace:*",
    "@benefit-calendar/shared-utils": "workspace:*",
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@types/node": "^25.0.0",
    "@types/react": "^19.0.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.7.0"
  }
}
```

### 6.3 apps/web/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "noEmit": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@shared-types/*": ["../../packages/shared-types/src/*"],
      "@shared-utils/*": ["../../packages/shared-utils/src/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 6.4 경로 변경 체크리스트

- [ ] `@/*` 경로 별칭이 `apps/web/` 기준으로 동작하는지 확인
- [ ] shared-types import: `import { Benefit } from '@benefit-calendar/shared-types'`
- [ ] shared-utils import: `import { formatDday } from '@benefit-calendar/shared-utils'`
- [ ] tailwind.config.ts의 content 경로 수정
- [ ] next.config.mjs에 transpilePackages 추가

#### next.config.mjs 수정

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@benefit-calendar/shared-types',
    '@benefit-calendar/shared-utils',
  ],
}

export default nextConfig
```

---

## 7. ESLint 공유 설정

### 7.1 packages/eslint-config/package.json

```json
{
  "name": "@benefit-calendar/eslint-config",
  "version": "0.1.0",
  "private": true,
  "files": ["base.js", "next.js", "nest.js"],
  "devDependencies": {
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0"
  }
}
```

### 7.2 base.js

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
}
```

---

## 8. Docker Compose (로컬 개발 인프라)

### 8.1 docker-compose.yml (루트)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: benefit-cal-db
    environment:
      POSTGRES_DB: benefit_calendar
      POSTGRES_USER: benefit_user
      POSTGRES_PASSWORD: benefit_pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: benefit-cal-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 8.2 개발 환경 시작 순서

```bash
# 1. 인프라 시작
docker compose up -d

# 2. 의존성 설치
pnpm install

# 3. Prisma 클라이언트 생성 + 마이그레이션
pnpm db:generate
pnpm db:migrate

# 4. 시드 데이터
pnpm db:seed

# 5. 개발 서버 시작
pnpm dev
```

---

## 9. 시드 데이터 (prisma/seed.ts)

기존 `shared/sample_data.json`의 데이터를 Prisma seed로 변환한다.

```typescript
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 테스트 사용자
  const user = await prisma.user.create({
    data: {
      email: 'test@benefitcal.com',
      passwordHash: await hash('password123', 10),
      age: 28,
      region: '서울',
      employmentStatus: 'JOB_SEEKER',
      isSelfEmployed: false,
    },
  })

  // sample_data.json의 혜택 데이터를 DB에 삽입
  const benefits = [
    {
      title: '청년 월세 지원',
      agency: '서울특별시',
      category: '주거',
      region: '서울',
      amount: '월 20만원',
      applyStartDate: new Date('2026-01-01'),
      applyEndDate: new Date('2026-03-31'),
      deadline: new Date('2026-03-31'),
      applicationLink: 'https://example.com/apply',
      requirements: ['만 19-34세', '서울 거주', '무주택자'],
      documents: ['주민등록등본', '소득증명서'],
    },
    // ... sample_data.json 기반으로 추가
  ]

  for (const benefit of benefits) {
    await prisma.benefit.create({ data: benefit })
  }

  console.log('Seed completed')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
```

---

## 10. 구현 순서 체크리스트

### Step 1: Turborepo 초기화
- [ ] Root package.json 생성
- [ ] pnpm-workspace.yaml 생성
- [ ] turbo.json 생성
- [ ] tsconfig.base.json 생성
- [ ] .npmrc 생성
- [ ] .gitignore 업데이트

### Step 2: apps/web 이동
- [ ] apps/web/ 디렉토리 생성
- [ ] git mv로 파일 이동 (app/, components/, shared/, public/)
- [ ] apps/web/package.json 생성
- [ ] apps/web/tsconfig.json 생성
- [ ] apps/web/next.config.mjs 수정 (transpilePackages)
- [ ] tailwind.config.ts content 경로 수정
- [ ] `pnpm install`
- [ ] `pnpm dev --filter web` 동작 확인

### Step 3: packages/shared-types 생성
- [ ] 디렉토리 + package.json
- [ ] enums, entities, dto 파일 생성
- [ ] index.ts 배럴 export
- [ ] apps/web에서 import 테스트

### Step 4: packages/shared-utils 생성
- [ ] 디렉토리 + package.json
- [ ] date.ts, format.ts 유틸 이동
- [ ] apps/web에서 import 테스트

### Step 5: apps/api 초기화
- [ ] NestJS 프로젝트 생성
- [ ] Prisma 설정 + schema.prisma
- [ ] docker-compose.yml 생성
- [ ] DB 마이그레이션
- [ ] 기본 모듈 구조 생성
- [ ] Health check 엔드포인트
- [ ] Swagger 설정
- [ ] `pnpm dev --filter api` 동작 확인

### Step 6: ESLint 설정
- [ ] packages/eslint-config 생성
- [ ] 각 앱에서 공유 설정 참조
- [ ] `pnpm lint` 전체 통과

### Step 7: 통합 확인
- [ ] `pnpm dev` → web(3000) + api(4000) 동시 구동
- [ ] `pnpm build` 전체 빌드 성공
- [ ] shared-types를 양쪽에서 import 확인
- [ ] API /health, /api/docs 접근 확인

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-31 | 초기 Design 문서 작성 | BenefitCal Team |
