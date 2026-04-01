# 💰 혜택 캘린더 (Benefit Calendar)

> **정부 혜택을 한눈에** - 나에게 맞는 혜택을 찾고, 마감을 관리하세요.

![Version](https://img.shields.io/badge/version-0.2.0-blue) ![Node](https://img.shields.io/badge/node-%3E%3D24.0.0-green)

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [주요 특징](#주요-특징)
3. [기술 스택](#기술-스택)
4. [프로젝트 구조](#프로젝트-구조)
5. [빠른 시작](#빠른-시작)
6. [환경 변수](#환경-변수)
7. [개발 가이드](#개발-가이드)
8. [API 명세](#api-명세)
9. [배포](#배포)
10. [로드맵](#로드맵)
11. [기여 가이드](#기여-가이드)

---

## 프로젝트 개요

**혜택 캘린더(BenefitCal)**는 한국의 청년, 자영업자, 취업준비생 등 다양한 계층이 놓치기 쉬운 **정부 지원 혜택**을 쉽게 발견하고 관리할 수 있는 웹 서비스입니다.

### 🎯 MVP 목표
- 신규 사용자가 **3분 이내**에 개인화된 혜택 리스트를 확인
- **검색/필터/캘린더**로 혜택 탐색 및 마감 관리
- **북마크 & 상태 관리**로 신청 준비 흐름 지원
- **마감일 D-7 알림**으로 기회 놓치지 않기

### 🎭 대상 사용자
- **청년 지수 (25세)**: 청년지원금/수당 중심
- **자영업자 민수 (38세)**: 소상공인 지원금 중심
- **취업준비생**: 일자리/훈련 정보

---

## 주요 특징

| 기능 | 설명 |
|------|------|
| 🎯 **개인화 추천** | 나이/지역/직업 기반 자동 매칭 (500개+ 실제 데이터) |
| 🔍 **고급 검색** | 카테고리/지역/신청 가능 여부 필터링 |
| 📅 **마감 관리** | 월별 캘린더 + 마감일 강조 표시 |
| 🔔 **스마트 알림** | 마감일 D-7 이메일 알림 (맞춤 설정 가능) |
| 📌 **북마크 & 상태** | 관심 혜택 저장 + 신청 진행 상태 추적 |
| 📊 **대시보드** | 매칭 혜택 수/마감 임박/신청 완료 통계 |
| 🏥 **7개 카테고리** | 주거, 교통, 문화, 창업, 생활, 교육, 의료 |

---

## 기술 스택

### 🎨 프론트엔드

| 기술 | 용도 |
|------|------|
| **Next.js 14** | React 풀스택 프레임워크 |
| **React 18** | UI 라이브러리 |
| **Tailwind CSS 3** | 유틸리티 CSS |
| **Three.js / Framer Motion** | 3D 애니메이션 & 인터랙션 |
| **TypeScript 5.7** | 정적 타입 언어 |
| **Vitest / Playwright** | 단위 및 E2E 테스트 |

### 🔧 백엔드

| 기술 | 용도 |
|------|------|
| **NestJS 10** | Node.js 엔터프라이즈 프레임워크 |
| **Prisma 6** | ORM (Type-safe DB 쿼리) |
| **PostgreSQL 16** | 주 데이터베이스 |
| **Redis 7** | 캐싱 & 세션 관리 |
| **JWT** | 토큰 기반 인증 (15분 + 7일 리프레시) |
| **Swagger** | API 문서화 자동 생성 |
| **Jest** | 백엔드 단위 테스트 |

### 🏗️ 인프라 & DevOps

| 기술 | 용도 |
|------|------|
| **Turborepo** | 모노레포 빌드 오케스트레이션 |
| **pnpm 9.15** | 패키지 관리자 |
| **Docker Compose** | PostgreSQL + Redis 로컬 개발 환경 |
| **Vercel** | 프론트엔드 배포 (예정) |
| **Railway** | 백엔드 + DB 배포 (예정) |

---

## 프로젝트 구조

```
Benefit_Calendar/
├── apps/
│   ├── web/                       # Next.js 프론트엔드 (포트 3000)
│   │   ├── app/                   # App Router 페이지
│   │   │   ├── (auth)/           # 인증 (로그인, 회원가입)
│   │   │   ├── benefits/         # 혜택 탐색
│   │   │   ├── calendar/         # 캘린더 뷰
│   │   │   ├── my-benefits/      # 내 혜택 (북마크 & 상태)
│   │   │   ├── settings/         # 프로필/알림 설정
│   │   │   └── design-lab/       # 디자인 시스템 미리보기
│   │   ├── components/           # UI 컴포넌트 & 도메인 컴포넌트
│   │   ├── shared/               # 공유 훅, 서비스, 유틸
│   │   └── package.json
│   │
│   └── api/                       # NestJS 백엔드 (포트 4000)
│       ├── src/
│       │   ├── common/           # 공통 필터, 인터셉터, 데코레이터
│       │   └── modules/          # 비즈니스 모듈
│       │       ├── auth/         # 회원가입, 로그인, JWT
│       │       ├── user/         # 프로필 관리
│       │       ├── benefit/      # 혜택 CRUD, 검색
│       │       ├── user-benefit/ # 북마크, 상태 관리
│       │       ├── notification/ # 알림 설정 & 스케줄링
│       │       ├── dashboard/    # 대시보드 통계
│       │       └── crawler/      # 정부 데이터 자동 수집
│       ├── prisma/               # DB 스키마 & 마이그레이션
│       └── package.json
│
├── packages/
│   ├── shared-types/             # 프론트/백엔드 공유 타입 정의
│   ├── shared-utils/             # 공유 유틸리티 (날짜 포맷, 검증 함수 등)
│   └── eslint-config/            # 공유 ESLint 설정
│
├── docs/                         # 프로젝트 문서 & PDCA
│   ├── 로컬_개발_가이드.md        # 개발 환경 셋업
│   ├── MVP_실행계획.md           # MVP 범위 & 마일스톤
│   ├── Phase1_실행계획.md        # 0-3개월 로드맵
│   ├── API_명세서_초안.md        # API 엔드포인트 명세
│   └── ...
│
├── docker-compose.yml            # PostgreSQL + Redis 셋업
├── turbo.json                    # Turborepo 설정
├── pnpm-workspace.yaml           # pnpm 모노레포 설정
├── tsconfig.base.json            # 기본 TypeScript 설정
├── CONVENTIONS.md                # 코딩 컨벤션
└── package.json                  # 루트 스크립트
```

---

## 빠른 시작

### ✅ 필수 요구사항

- Node.js 24.0.0 이상
- pnpm 9.15.0 이상
- Docker Desktop (PostgreSQL + Redis 실행용)
- Git

### 📥 설치 및 실행

#### 1️⃣ 저장소 복제
```bash
git clone https://github.com/jskjw157/Benefit_Calendar.git
cd Benefit_Calendar
```

#### 2️⃣ Docker 컨테이너 시작
```bash
docker compose up -d
```
- **PostgreSQL 16**: `localhost:5432`
- **Redis 7**: `localhost:6379`

상태 확인:
```bash
docker compose ps
```

#### 3️⃣ 의존성 설치
```bash
pnpm install
```

#### 4️⃣ 환경 변수 설정
`.env.example` 파일 참고하여 `apps/api/.env.local` 생성:

```env
DATABASE_URL=postgresql://benefit_user:benefit_pass@localhost:5432/benefit_calendar
REDIS_URL=redis://localhost:6379
AUTH_JWT_SECRET=dev-secret-key-do-not-use-in-production
AUTH_JWT_EXPIRES_IN=15m
AUTH_REFRESH_EXPIRES_IN=7d
PORT=4000
```

#### 5️⃣ 데이터베이스 초기화
```bash
pnpm db:generate      # Prisma Client 생성
pnpm db:migrate       # 마이그레이션 실행
pnpm db:seed          # 샘플 데이터 삽입
```

샘플 데이터:
- **테스트 사용자**: `test@benefitcal.com` / `password123`
- **혜택 10건**: 7개 카테고리 (주거, 교통, 문화, 창업, 생활, 교육, 의료)

#### 6️⃣ 개발 서버 실행
```bash
pnpm dev
```

서버 확인:
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:4000/api/v1
- **Swagger API 문서**: http://localhost:4000/api/docs

---

## 환경 변수

`.env.example` 파일을 참고하여 환경 변수를 설정하세요. 주요 항목은 다음과 같습니다.

| 변수 | 설명 |
|------|------|
| `NODE_ENV` | 실행 환경 (development / production) |
| `NEXT_PUBLIC_API_URL` | 프론트엔드에서 사용할 API 주소 |
| `AUTH_JWT_SECRET` | JWT 서명 시크릿 키 |
| `DATABASE_URL` | PostgreSQL 연결 문자열 |
| `REDIS_URL` | Redis 연결 문자열 |
| `SMTP_*` | 이메일 알림용 SMTP 설정 |

> ⚠️ `.env.local` 파일은 절대 Git에 커밋하지 마세요 (`.gitignore`에 포함됨).

---

## 개발 가이드

### 🚀 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 전체 개발 서버 실행 (web + api) |
| `pnpm build` | 전체 빌드 |
| `pnpm lint` | 코드 린트 검사 |
| `pnpm test` | 전체 테스트 실행 |
| `pnpm clean` | 빌드 아티팩트 제거 |
| `pnpm db:generate` | Prisma Client 생성 |
| `pnpm db:migrate` | DB 마이그레이션 실행 |
| `pnpm db:seed` | 샘플 데이터 삽입 |

### 📝 참고 문서
- **[docs/로컬_개발_가이드.md](./docs/로컬_개발_가이드.md)**: 완벽한 셋업 가이드
- **[CONVENTIONS.md](./CONVENTIONS.md)**: 코딩 컨벤션 & 아키텍처 규칙

### 🏗️ Clean Architecture (4 레이어)

```
┌──────────────────────────────────────┐
│ Presentation Layer (UI, Components)  │
├──────────────────────────────────────┤
│ Application Layer (Services)         │
├──────────────────────────────────────┤
│ Domain Layer (Types, Constants)      │
├──────────────────────────────────────┤
│ Infrastructure Layer (API, DB)       │
└──────────────────────────────────────┘
```

의존성 규칙:
- ✅ **허용**: Presentation → Application → Domain / Infrastructure → Domain
- ❌ **금지**: Domain → Infrastructure, Infrastructure → Presentation

---

## API 명세

### 🔐 인증
- **방식**: JWT (Bearer token)
- **헤더**: `Authorization: Bearer <access_token>`
- **Access Token**: 15분 유효 / **Refresh Token**: 7일 유효

### 🔗 핵심 엔드포인트 (13개)

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|:----:|
| POST | `/api/v1/auth/register` | 회원가입 | ❌ |
| POST | `/api/v1/auth/login` | 로그인 | ❌ |
| GET | `/api/v1/users/me` | 내 프로필 조회 | ✅ |
| PATCH | `/api/v1/users/me` | 내 프로필 수정 | ✅ |
| GET | `/api/v1/benefits` | 혜택 목록 (검색/필터) | ❌ |
| GET | `/api/v1/benefits/{id}` | 혜택 상세 | ❌ |
| GET | `/api/v1/users/me/benefits` | 내 혜택 목록 | ✅ |
| POST | `/api/v1/users/me/benefits/{id}/bookmark` | 북마크 토글 | ✅ |
| PATCH | `/api/v1/users/me/benefits/{id}` | 상태 변경 | ✅ |
| GET | `/api/v1/users/me/notifications` | 알림 설정 조회 | ✅ |
| PATCH | `/api/v1/users/me/notifications` | 알림 설정 변경 | ✅ |
| GET | `/api/v1/dashboard/summary` | 대시보드 요약 | ✅ |
| GET | `/api/v1/health` | 헬스체크 | ❌ |

### 🔍 검색/필터 예제

```bash
# 검색어
GET /api/v1/benefits?q=청년

# 카테고리 + 지역 필터
GET /api/v1/benefits?category=주거&region=서울

# 신청 가능 상태 + 마감일 순 정렬 + 페이지네이션
GET /api/v1/benefits?status=OPEN&sort=deadline:asc&page=1&pageSize=20
```

📖 전체 API 명세: [docs/API_명세서_초안.md](./docs/API_명세서_초안.md)

---

## 배포

### 📡 배포 구성 (계획)

| 계층 | 서비스 | 월 비용 |
|------|--------|--------|
| **Frontend** | Vercel (Hobby) | $0 |
| **Backend + DB** | Railway Starter | $5~15 |
| **이메일** | Resend Free | $0 |
| **모니터링** | Sentry Free | $0 |

---

## 로드맵

### ✅ MVP (완료)
- 기본 레이아웃 및 라우팅
- 인증 시스템 (JWT)
- 13개 API 엔드포인트
- 샘플 데이터 (10개)

### 🔄 Phase 1 (0-3개월, 진행 중)
- 데이터 파이프라인 (500개+ 실제 혜택 데이터)
- 소셜 로그인 (카카오/네이버)
- 알림 시스템 (이메일)
- SEO & 배포 (Vercel + Railway)

### 🎯 Phase 2 (3-6개월, 계획)
- AI 추천 고도화
- 고급 알림 채널 (SMS, 카카오톡)
- 사용자 커뮤니티 기능

---

## 기여 가이드

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'feat: Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

### 📝 커밋 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 추가/변경
style: 코드 스타일 변경 (기능 변화 없음)
refactor: 코드 리팩토링
test: 테스트 추가/변경
chore: 빌드, 의존성 등 유지보수 작업
```

### ✅ PR 체크리스트
- [ ] [CONVENTIONS.md](./CONVENTIONS.md) 준수
- [ ] 테스트 작성 및 통과 (`pnpm test`)
- [ ] 린트 통과 (`pnpm lint`)
- [ ] 빌드 통과 (`pnpm build`)

---

## 문서

| 문서 | 설명 |
|------|------|
| [docs/로컬_개발_가이드.md](./docs/로컬_개발_가이드.md) | 개발 환경 셋업 |
| [docs/MVP_실행계획.md](./docs/MVP_실행계획.md) | MVP 범위 & 기술 스택 |
| [docs/Phase1_실행계획.md](./docs/Phase1_실행계획.md) | 0-3개월 상세 로드맵 |
| [docs/API_명세서_초안.md](./docs/API_명세서_초안.md) | API 엔드포인트 정의 |
| [CONVENTIONS.md](./CONVENTIONS.md) | 코딩 컨벤션 & Clean Architecture |

---

## 라이선스

MIT License
