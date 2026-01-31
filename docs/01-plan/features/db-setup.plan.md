---
template: plan
version: 1.0
feature: db-setup
date: 2026-01-31
author: BenefitCal Team
project: Benefit Calendar
status: Draft
level: Dynamic
depends_on: backend-monorepo
---

# DB 셋업 및 API 서버 구동 확인

> **Summary**: Docker 인프라 기동, Prisma 마이그레이션/시드 실행, NestJS API 서버 구동 및 전체 엔드포인트 동작 확인

## 1. 배경 및 목적

backend-monorepo 구현이 완료되었으나 아직 실제 DB 연결 및 API 서버 구동을 확인하지 않았다.
이 feature에서는:

1. Docker Compose로 PostgreSQL + Redis 기동
2. Prisma migration으로 실제 테이블 생성
3. Prisma seed로 테스트 데이터 삽입
4. NestJS API 서버 구동 및 모든 엔드포인트 동작 확인
5. 발견되는 런타임 에러 수정

## 2. 선행 조건

- [x] Docker Desktop 설치 및 실행 중
- [x] pnpm 설치 (packageManager: pnpm@9.15.0)
- [x] Node.js 24 LTS
- [x] docker-compose.yml 작성 완료 (PostgreSQL 16 + Redis 7)
- [x] Prisma schema 작성 완료 (3 models, 3 enums)
- [x] prisma/seed.ts 작성 완료 (10개 혜택 + 테스트 유저)
- [x] NestJS 6개 모듈 스캐폴딩 완료

## 3. 작업 범위

### 3.1 Docker 인프라 기동
- `docker compose up -d` 실행
- PostgreSQL 16-alpine (port 5432) 정상 기동 확인
- Redis 7-alpine (port 6379) 정상 기동 확인

### 3.2 Prisma 셋업
- `apps/api/.env.local` 파일 생성 (DATABASE_URL 등)
- `pnpm --filter api db:generate` → Prisma Client 생성
- `pnpm --filter api db:migrate` → 초기 마이그레이션 실행
- `pnpm --filter api db:seed` → 시드 데이터 삽입

### 3.3 API 서버 구동
- `pnpm --filter api dev` → NestJS watch mode 구동
- http://localhost:4000/api/v1/health 응답 확인
- http://localhost:4000/api/docs Swagger UI 접근 확인

### 3.4 엔드포인트 동작 확인
- POST /api/v1/auth/register → 회원가입
- POST /api/v1/auth/login → JWT 토큰 발급
- GET /api/v1/users/me → 프로필 조회 (JWT 인증)
- GET /api/v1/benefits → 혜택 목록 조회
- GET /api/v1/benefits/:id → 혜택 상세 조회
- GET /api/v1/dashboard/summary → 대시보드 요약
- POST /api/v1/users/me/benefits/:id/bookmark → 북마크 토글
- GET /api/v1/users/me/benefits → 내 혜택 목록
- GET /api/v1/users/me/notifications → 알림 설정 조회
- PATCH /api/v1/users/me/notifications → 알림 설정 변경

### 3.5 런타임 에러 수정
- 컴파일 에러 수정
- 모듈 의존성 주입 에러 수정
- Prisma 쿼리 에러 수정
- API 응답 형식 검증

## 4. 성공 기준

| # | 기준 | 검증 방법 |
|---|------|----------|
| 1 | Docker 컨테이너 정상 기동 | `docker ps` 확인 |
| 2 | Prisma migration 성공 | migrations/ 폴더 생성 |
| 3 | Seed 데이터 삽입 | DB에 1명 유저 + 10개 혜택 존재 |
| 4 | API 서버 구동 | localhost:4000 응답 |
| 5 | Swagger UI 접근 | /api/docs 페이지 로드 |
| 6 | 인증 플로우 동작 | register → login → JWT 토큰 발급 |
| 7 | 전체 엔드포인트 200 응답 | 13개 엔드포인트 모두 정상 |

## 5. 기술 스택

| 항목 | 기술 |
|------|------|
| DB | PostgreSQL 16-alpine |
| Cache | Redis 7-alpine |
| ORM | Prisma 6.3+ |
| Runtime | Node.js 24 LTS |
| Framework | NestJS 10.4+ |
| Container | Docker Compose 3.8 |

## 6. 리스크

| 리스크 | 대응 |
|--------|------|
| Docker Desktop 미설치 | 설치 가이드 제공 |
| 포트 충돌 (5432, 6379) | 기존 프로세스 중지 또는 포트 변경 |
| Prisma Client 생성 실패 | node_modules 재설치 |
| NestJS 모듈 의존성 에러 | Module imports/providers 수정 |

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-31 | 초기 Plan 작성 | BenefitCal Team |
