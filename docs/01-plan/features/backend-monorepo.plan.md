---
template: plan
version: 1.0
description: 백엔드 모노레포 전환 계획
feature: backend-monorepo
date: 2026-01-31
author: BenefitCal Team
project: Benefit Calendar
status: In Progress
---

# 백엔드 모노레포 전환 계획

> **Summary**: 현재 Next.js 단일 프로젝트를 Turborepo 모노레포로 전환하고, NestJS 백엔드를 추가하는 구조 수립
>
> **Project**: Benefit Calendar (혜택 캘린더)
> **Version**: 0.2.0
> **Date**: 2026-01-31
> **Status**: In Progress

---

## 1. Overview

### 1.1 Purpose

현재 프론트엔드만 존재하는 프로젝트를 **Turborepo 모노레포**로 전환하여, NestJS 백엔드와 프론트엔드가 타입을 공유하며 통합 개발할 수 있는 구조를 만든다.

### 1.2 현재 상태

```
Benefit_Calendar/          ← 단일 Next.js 프로젝트
├── app/                   ← Next.js App Router (프론트엔드)
├── components/            ← UI 컴포넌트
├── shared/                ← sample_data.json
├── package.json           ← Next.js 14.2.5, React 18.3.1
├── tsconfig.json
├── tailwind.config.ts
└── docs/                  ← PDCA 문서
```

- 백엔드 없음 (API Routes, DB, ORM, 인증 전무)
- 모든 데이터 하드코딩 (sample_data.json)
- 단일 package.json

### 1.3 Related Documents

- MVP 계획: `docs/01-plan/features/mvp-benefit-calendar.plan.md`
- 설계 문서: `docs/02-design/features/mvp-benefit-calendar.design.md`
- 백엔드 스택 선정: `docs/01-plan/adr/001-backend-stack-selection.md`
- TRD 원본: `docs/reference/혜택캘린더_TRD_v1.0 (1).docx`

---

## 2. 목표 모노레포 구조

```
Benefit_Calendar/
├── apps/
│   ├── web/                        ← Next.js 프론트엔드 (기존 코드 이동)
│   │   ├── app/
│   │   ├── components/
│   │   ├── public/
│   │   ├── tailwind.config.ts
│   │   ├── next.config.mjs
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                        ← NestJS 백엔드 (신규)
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── modules/
│       │   │   ├── user/           ← 인증, 프로필
│       │   │   ├── benefit/        ← 혜택 CRUD, 검색
│       │   │   ├── matching/       ← 사용자-혜택 매칭
│       │   │   └── notification/   ← 알림
│       │   ├── common/             ← Guards, Interceptors, Filters
│       │   └── config/             ← 환경변수, DB 설정
│       ├── prisma/
│       │   └── schema.prisma
│       ├── test/
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── shared-types/               ← 프론트/백 공유 타입
│   │   ├── src/
│   │   │   ├── entities/           ← User, Benefit, UserBenefit
│   │   │   ├── dto/                ← API 요청/응답 DTO
│   │   │   ├── enums/              ← BenefitCategory, BenefitStatus 등
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── shared-utils/               ← 공유 유틸리티
│   │   ├── src/
│   │   │   ├── date.ts             ← 날짜 포맷, D-day 계산
│   │   │   ├── format.ts           ← 금액 포맷 등
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── eslint-config/              ← 공유 ESLint 설정
│       ├── base.js
│       ├── next.js
│       ├── nest.js
│       └── package.json
│
├── turbo.json                      ← Turborepo 파이프라인 설정
├── package.json                    ← Root workspace 설정
├── tsconfig.base.json              ← 공통 TS 설정
├── .prettierrc
├── .gitignore
├── .env.example
├── CONVENTIONS.md
└── docs/                           ← PDCA 문서 (위치 유지)
```

---

## 3. 기술 스택

### 3.1 공통

| 영역 | 기술 | 버전 |
|------|------|------|
| Runtime | Node.js | 24 LTS (Krypton) |
| Language | TypeScript | 5.x |
| Package Manager | pnpm | 9.x |
| Monorepo | Turborepo | 2.x |
| Linting | ESLint + Prettier | 공유 설정 |

### 3.2 프론트엔드 (apps/web)

| 영역 | 기술 | 비고 |
|------|------|------|
| Framework | Next.js | 14.x → 15.x 마이그레이션 검토 |
| UI | React 18 | |
| Styling | Tailwind CSS | 기존 유지 |
| State | TanStack Query | 서버 상태 관리 |
| HTTP Client | ky 또는 fetch wrapper | API 호출 |

### 3.3 백엔드 (apps/api)

| 영역 | 기술 | 비고 |
|------|------|------|
| Framework | NestJS 10+ | |
| ORM | Prisma | Type-safe DB 접근 |
| Database | PostgreSQL 16 | TRD 동일 |
| Cache | Redis | TRD 동일 |
| Auth | Passport.js + JWT | Access(15분) + Refresh(7일) |
| Validation | class-validator | DTO 검증 |
| API Docs | @nestjs/swagger | OpenAPI 자동 생성 |
| Testing | Jest | 프론트와 동일 |

---

## 4. 마이그레이션 전략

### 4.1 단계별 전환

#### Step 1: Turborepo 초기화

- pnpm workspace 설정
- turbo.json 파이프라인 정의
- tsconfig.base.json 공통 설정
- Root package.json (workspace 루트)

#### Step 2: 기존 프론트엔드 → apps/web 이동

- app/, components/, shared/, public/ → apps/web/
- package.json 의존성 분리
- tsconfig.json 경로 수정 (@/* → 로컬 경로)
- tailwind.config.ts, next.config.mjs 이동
- **기존 기능 동작 확인 필수** (빌드 + 로컬 실행)

#### Step 3: packages/shared-types 생성

- 기존 하드코딩된 타입을 추출
- sample_data.json에서 엔티티 타입 정의
- API DTO 타입 정의
- apps/web과 apps/api 모두에서 import 가능하도록

#### Step 4: packages/shared-utils 생성

- 날짜 계산 (D-day, 포맷)
- 금액 포맷
- 공통 상수

#### Step 5: NestJS 백엔드 초기화 (apps/api)

- NestJS 프로젝트 생성
- Prisma + PostgreSQL 연동
- 기본 모듈 구조 (User, Benefit, Matching, Notification)
- Swagger 설정
- Health check 엔드포인트

#### Step 6: 공유 ESLint 설정

- packages/eslint-config
- Next.js용, NestJS용 분리

### 4.2 주의사항

- Step 2 완료 후 반드시 `pnpm dev --filter web` 동작 확인
- docs/ 폴더는 루트에 유지 (이동 불필요)
- .env 파일은 각 앱별 분리 (apps/web/.env.local, apps/api/.env.local)
- Git 히스토리 보존을 위해 `git mv` 사용

---

## 5. Turborepo 파이프라인

```jsonc
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
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
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    }
  }
}
```

---

## 6. 패키지 의존성 관계

```
packages/shared-types ← 의존성 없음 (순수 타입)
packages/shared-utils ← shared-types
packages/eslint-config ← 의존성 없음

apps/web ← shared-types, shared-utils
apps/api ← shared-types, shared-utils
```

---

## 7. 개발 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 전체 앱 동시 실행 (web + api) |
| `pnpm dev --filter web` | 프론트엔드만 실행 |
| `pnpm dev --filter api` | 백엔드만 실행 |
| `pnpm build` | 전체 빌드 |
| `pnpm lint` | 전체 린트 |
| `pnpm test` | 전체 테스트 |
| `pnpm db:generate` | Prisma 클라이언트 생성 |
| `pnpm db:migrate` | DB 마이그레이션 실행 |

---

## 8. 환경변수 전략

### apps/web/.env.local
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### apps/api/.env.local
```
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/benefit_calendar
REDIS_URL=redis://localhost:6379
AUTH_JWT_SECRET=<generated>
AUTH_JWT_EXPIRES_IN=15m
AUTH_REFRESH_EXPIRES_IN=7d
```

---

## 9. 포트 전략

| 앱 | 포트 | 비고 |
|----|------|------|
| web (Next.js) | 3000 | 기존 유지 |
| api (NestJS) | 4000 | |
| PostgreSQL | 5432 | 기본값 |
| Redis | 6379 | 기본값 |

---

## 10. 성공 기준

- [ ] `pnpm dev` 실행 시 web(3000) + api(4000) 동시 구동
- [ ] apps/web에서 기존 프론트엔드 기능 정상 동작
- [ ] apps/api에서 `/health` 엔드포인트 응답
- [ ] packages/shared-types를 양쪽에서 import 가능
- [ ] `pnpm build` 전체 빌드 성공
- [ ] `pnpm lint` 에러 없음

---

## 11. 리스크

| 리스크 | 영향 | 대응 |
|--------|------|------|
| 프론트엔드 이동 시 경로 깨짐 | 높음 | Step 2 후 반드시 빌드/실행 검증 |
| pnpm workspace 호이스팅 이슈 | 중간 | .npmrc에 shamefully-hoist=true 설정 |
| Turborepo 캐시 문제 | 낮음 | `turbo clean`으로 초기화 |
| Next.js 14 ↔ Node 24 호환성 | 중간 | 필요 시 Next.js 15로 업그레이드 |

---

## 12. 향후 확장 (MSA 전환 시)

모노레포 구조는 MSA 전환 시에도 유지:

```
apps/
├── web/                    ← 프론트엔드 (유지)
├── api/                    ← NestJS 메인 API (유지, 축소)
├── matching-service/       ← Kotlin/Spring Boot (신규)
└── notification-service/   ← 분리 시점에 결정

packages/
├── shared-types/           ← 유지 (API 계약 정의)
├── shared-utils/           ← 유지
├── kafka-contracts/        ← 이벤트 스키마 (신규)
└── eslint-config/          ← 유지
```

Kafka 도입 시 `packages/kafka-contracts`로 이벤트 스키마를 공유하여 서비스 간 계약을 관리한다.
