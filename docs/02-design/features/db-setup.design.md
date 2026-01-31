---
template: design
version: 1.0
feature: db-setup
date: 2026-02-01
author: BenefitCal Team
project: Benefit Calendar
status: Draft
plan_ref: docs/01-plan/features/db-setup.plan.md
depends_on: backend-monorepo
---

# DB 셋업 및 API 서버 구동 확인 - 설계 문서

> **Summary**: Docker 인프라 기동, Prisma 마이그레이션/시드, NestJS API 서버 구동 및 엔드포인트 동작 확인을 위한 상세 절차 설계
>
> **Plan Reference**: `docs/01-plan/features/db-setup.plan.md`
> **Backend Design Reference**: `docs/02-design/features/backend-monorepo.design.md`

---

## 1. 현재 상태 분석

### 1.1 구현 완료 항목

| 항목 | 파일/경로 | 상태 |
|------|----------|:----:|
| Docker Compose | `docker-compose.yml` | ✅ PostgreSQL 16 + Redis 7 |
| Prisma Schema | `apps/api/prisma/schema.prisma` | ✅ 3 models, 3 enums |
| Prisma Seed | `apps/api/prisma/seed.ts` | ✅ 1 user + 10 benefits |
| 환경 변수 | `apps/api/.env.local` | ✅ DB/Redis/JWT 설정 |
| NestJS 모듈 | `apps/api/src/modules/` | ✅ 6개 모듈 스캐폴딩 |
| PrismaService | `apps/api/src/prisma/prisma.service.ts` | ✅ |
| Health Controller | `apps/api/src/health.controller.ts` | ✅ |

### 1.2 미확인 항목 (이 feature에서 검증)

| 항목 | 위험도 | 비고 |
|------|:------:|------|
| Docker 컨테이너 기동 | 낮음 | 포트 충돌 가능성 |
| Prisma Client 생성 | 중간 | node_modules 의존성 |
| DB 마이그레이션 | 중간 | 스키마 오류 가능 |
| Seed 데이터 삽입 | 중간 | bcrypt, JSON 필드 |
| NestJS 컴파일 | 높음 | 모듈 DI, import 누락 |
| API 엔드포인트 동작 | 높음 | 런타임 에러 |

---

## 2. 인프라 구성 상세

### 2.1 Docker Compose 구성 (현재)

```yaml
# docker-compose.yml (루트)
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

### 2.2 헬스체크 추가 설계

Docker 컨테이너 기동 안정성을 위해 healthcheck 설정을 추가한다.

```yaml
services:
  postgres:
    # ... 기존 설정
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U benefit_user -d benefit_calendar"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    # ... 기존 설정
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5
```

### 2.3 연결 정보

| 서비스 | Host | Port | Credentials |
|--------|------|------|-------------|
| PostgreSQL | localhost | 5432 | `benefit_user` / `benefit_pass` |
| Redis | localhost | 6379 | (인증 없음) |
| DATABASE_URL | `postgresql://benefit_user:benefit_pass@localhost:5432/benefit_calendar` |

---

## 3. Prisma 셋업 절차 상세

### 3.1 Prisma Client 생성

```bash
# Prisma Client 코드 생성 (node_modules/.prisma/client/)
pnpm --filter @benefit-calendar/api db:generate
```

**검증**: `apps/api/node_modules/.prisma/client/` 디렉토리 존재 확인

### 3.2 초기 마이그레이션

```bash
# 마이그레이션 파일 생성 + DB 적용
pnpm --filter @benefit-calendar/api db:migrate
```

**마이그레이션 이름**: `init` (초기 스키마)

**생성될 테이블**:

| 테이블명 | Prisma Model | 컬럼 수 |
|---------|-------------|:-------:|
| `users` | User | 11 |
| `benefits` | Benefit | 12 |
| `user_benefits` | UserBenefit | 5 |

**생성될 인덱스**:

| 인덱스 | 테이블 | 컬럼 |
|--------|--------|------|
| `users_email_key` | users | email (UNIQUE) |
| `benefits_deadline_idx` | benefits | deadline |
| `benefits_region_category_idx` | benefits | region, category |
| `user_benefits_user_id_status_idx` | user_benefits | user_id, status |

**생성될 Enum 타입** (PostgreSQL):

| Enum | 값 |
|------|-----|
| `EmploymentStatus` | JOB_SEEKER, EMPLOYED, STUDENT, SELF_EMPLOYED |
| `NotificationChannel` | EMAIL, SMS, PUSH |
| `UserBenefitStatus` | BOOKMARKED, PREPARING, APPLIED, RECEIVED |

**검증**: `apps/api/prisma/migrations/` 폴더에 migration SQL 파일 생성 확인

### 3.3 시드 데이터 삽입

```bash
pnpm --filter @benefit-calendar/api db:seed
```

**삽입 데이터**:

| 테이블 | 건수 | 내용 |
|--------|:----:|------|
| users | 1 | test@benefitcal.com (password: password123) |
| benefits | 10 | 다양한 카테고리 혜택 (주거3, 교통1, 문화1, 창업1, 생활1, 교육2, 의료1) |

**검증 쿼리**:

```sql
SELECT COUNT(*) FROM users;          -- 1
SELECT COUNT(*) FROM benefits;       -- 10
SELECT category, COUNT(*) FROM benefits GROUP BY category;
```

---

## 4. API 서버 구동 상세

### 4.1 NestJS 구동 명령

```bash
pnpm --filter @benefit-calendar/api dev
```

**기대 결과**: `http://localhost:4000` 에서 서버 응답

### 4.2 구동 확인 체크포인트

| # | 확인 항목 | URL/명령 | 기대 응답 |
|---|----------|---------|----------|
| 1 | Health check | `GET /api/v1/health` | `{ "status": "ok" }` |
| 2 | Swagger UI | `GET /api/docs` | Swagger HTML 페이지 |
| 3 | 404 처리 | `GET /api/v1/nonexistent` | 적절한 에러 응답 |

---

## 5. 엔드포인트 동작 검증 시나리오

### 5.1 인증 플로우

```bash
# Step 1: 회원가입
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","password":"test1234","age":25,"region":"서울"}'

# 기대 응답: { success: true, data: { accessToken, refreshToken, expiresIn } }

# Step 2: 로그인 (시드 유저)
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@benefitcal.com","password":"password123"}'

# 기대 응답: { success: true, data: { accessToken, refreshToken, expiresIn } }

# Step 3: 토큰으로 인증 요청
curl http://localhost:4000/api/v1/users/me \
  -H "Authorization: Bearer <accessToken>"

# 기대 응답: { success: true, data: { id, email, age, region, ... } }
```

### 5.2 혜택 조회 플로우

```bash
# 혜택 목록 (비인증)
curl http://localhost:4000/api/v1/benefits
# 기대: { success: true, data: { items: [...], page: 1, pageSize: 20, total: 10 } }

# 혜택 목록 (필터)
curl "http://localhost:4000/api/v1/benefits?category=주거&region=서울"
# 기대: 주거+서울 필터된 결과

# 혜택 상세
curl http://localhost:4000/api/v1/benefits/<benefit-id>
# 기대: 단일 혜택 상세 정보
```

### 5.3 사용자-혜택 플로우

```bash
# 북마크 토글 (인증 필요)
curl -X POST http://localhost:4000/api/v1/users/me/benefits/<benefit-id>/bookmark \
  -H "Authorization: Bearer <accessToken>"

# 내 혜택 목록
curl http://localhost:4000/api/v1/users/me/benefits \
  -H "Authorization: Bearer <accessToken>"

# 상태 변경
curl -X PATCH http://localhost:4000/api/v1/users/me/benefits/<benefit-id> \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"status":"PREPARING"}'
```

### 5.4 알림/대시보드 플로우

```bash
# 알림 설정 조회
curl http://localhost:4000/api/v1/users/me/notifications \
  -H "Authorization: Bearer <accessToken>"

# 알림 설정 변경
curl -X PATCH http://localhost:4000/api/v1/users/me/notifications \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"channel":"EMAIL","enabled":true,"leadDays":5}'

# 대시보드 요약
curl http://localhost:4000/api/v1/dashboard/summary \
  -H "Authorization: Bearer <accessToken>"
# 기대: { success: true, data: { matchedCount, urgentCount, appliedCount } }
```

---

## 6. 예상 에러 및 수정 방안

### 6.1 Docker 관련

| 에러 | 원인 | 해결 |
|------|------|------|
| `port 5432 already in use` | 로컬 PostgreSQL 실행 중 | `lsof -i :5432` 후 프로세스 종료 또는 포트 변경 |
| `port 6379 already in use` | 로컬 Redis 실행 중 | `lsof -i :6379` 후 프로세스 종료 |
| `docker: command not found` | Docker 미설치 | Docker Desktop 설치 |

### 6.2 Prisma 관련

| 에러 | 원인 | 해결 |
|------|------|------|
| `Can't reach database server` | PostgreSQL 미기동 | `docker compose up -d` 확인 |
| `P1001: Can't connect` | DATABASE_URL 오류 | `.env.local` 확인 |
| `prisma generate` 실패 | @prisma/client 미설치 | `pnpm --filter @benefit-calendar/api install` |
| Seed bcrypt 에러 | bcrypt native 빌드 실패 | `pnpm rebuild bcrypt` |

### 6.3 NestJS 관련

| 에러 | 원인 | 해결 |
|------|------|------|
| `Nest can't resolve dependencies` | Provider 미등록 | Module의 providers/imports 확인 |
| `Cannot find module` | 경로 오류 | tsconfig paths, import 경로 확인 |
| `PrismaService not available` | Module export 누락 | AppModule에서 PrismaService export 및 각 Module에서 import |
| `reflect-metadata` 에러 | 데코레이터 메타데이터 | main.ts 상단 import 확인 |
| Swagger 빈 페이지 | 데코레이터 누락 | Controller에 @ApiTags 등 추가 |

---

## 7. 실행 순서 체크리스트

### Step 1: Docker 인프라 기동

- [ ] Docker Desktop 실행 상태 확인
- [ ] `docker compose up -d` 실행
- [ ] `docker ps` 로 컨테이너 상태 확인 (benefit-cal-db, benefit-cal-redis)
- [ ] PostgreSQL 접속 테스트: `docker exec -it benefit-cal-db psql -U benefit_user -d benefit_calendar`
- [ ] Redis 접속 테스트: `docker exec -it benefit-cal-redis redis-cli ping`

### Step 2: 의존성 설치

- [ ] `pnpm install` (루트에서 전체 의존성 설치)
- [ ] `apps/api/node_modules` 생성 확인

### Step 3: Prisma 셋업

- [ ] `pnpm --filter @benefit-calendar/api db:generate` → Prisma Client 생성
- [ ] `pnpm --filter @benefit-calendar/api db:migrate` → 마이그레이션 실행 (이름: `init`)
- [ ] `apps/api/prisma/migrations/` 폴더에 SQL 파일 생성 확인
- [ ] `pnpm --filter @benefit-calendar/api db:seed` → 시드 데이터 삽입
- [ ] DB에서 데이터 확인 (users: 1건, benefits: 10건)

### Step 4: API 서버 구동

- [ ] `pnpm --filter @benefit-calendar/api dev` → NestJS watch mode 시작
- [ ] 컴파일 에러 없이 구동 확인
- [ ] `GET http://localhost:4000/api/v1/health` → 200 응답
- [ ] `GET http://localhost:4000/api/docs` → Swagger UI 로드

### Step 5: 엔드포인트 동작 확인

- [ ] `POST /api/v1/auth/register` → 회원가입 성공
- [ ] `POST /api/v1/auth/login` → JWT 토큰 발급
- [ ] `GET /api/v1/users/me` → 프로필 조회 (JWT 인증)
- [ ] `GET /api/v1/benefits` → 혜택 목록 (10건)
- [ ] `GET /api/v1/benefits/:id` → 혜택 상세
- [ ] `POST /api/v1/users/me/benefits/:id/bookmark` → 북마크 토글
- [ ] `GET /api/v1/users/me/benefits` → 내 혜택 목록
- [ ] `PATCH /api/v1/users/me/benefits/:id` → 상태 변경
- [ ] `GET /api/v1/users/me/notifications` → 알림 설정 조회
- [ ] `PATCH /api/v1/users/me/notifications` → 알림 설정 변경
- [ ] `GET /api/v1/dashboard/summary` → 대시보드 요약

### Step 6: 런타임 에러 수정

- [ ] 컴파일 에러 수정 (타입, import)
- [ ] 모듈 DI 에러 수정 (providers, imports)
- [ ] Prisma 쿼리 에러 수정 (필드명, 관계)
- [ ] API 응답 형식 검증 (ApiSuccess 래핑)

---

## 8. 성공 기준

| # | 기준 | 검증 방법 | 필수 |
|---|------|----------|:----:|
| 1 | Docker 컨테이너 2개 Running | `docker ps` | ✅ |
| 2 | Prisma migration 성공 | `migrations/` 폴더 존재 | ✅ |
| 3 | Seed 데이터 삽입 완료 | DB에 1 user + 10 benefits | ✅ |
| 4 | NestJS 서버 정상 구동 | `localhost:4000` 응답 | ✅ |
| 5 | Swagger UI 접근 가능 | `/api/docs` 페이지 로드 | ✅ |
| 6 | 인증 플로우 동작 | register → login → JWT 발급 | ✅ |
| 7 | 전체 엔드포인트 정상 응답 | 11개 엔드포인트 모두 2xx | ✅ |
| 8 | 에러 응답 형식 일관성 | ApiError 포맷 준수 | ⚠️ |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-01 | 초기 Design 문서 작성 | BenefitCal Team |
