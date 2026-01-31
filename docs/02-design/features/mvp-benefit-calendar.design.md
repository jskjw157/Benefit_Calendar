---
template: design
version: 1.0
feature: mvp-benefit-calendar
date: 2026-01-31
author: BenefitCal Team
project: Benefit Calendar
status: Draft
plan_ref: docs/01-plan/features/mvp-benefit-calendar.plan.md
---

# 혜택 캘린더 MVP 설계 문서

> **Summary**: MVP 프론트엔드/백엔드 상세 설계 (API, DB, 컴포넌트, 라우팅)
>
> **Project**: Benefit Calendar (혜택 캘린더)
> **Version**: 0.1.0
> **Plan Reference**: `docs/01-plan/features/mvp-benefit-calendar.plan.md`

---

## 1. 현재 구현 상태 분석

### 1.1 구현된 화면

| 화면 | 경로 | 상태 | 비고 |
|------|------|:----:|------|
| 홈/대시보드 | `app/page.tsx` | ✅ 구현됨 | 하드코딩 데이터, 단일 파일에 모든 섹션 |
| 혜택 상세 | `app/benefits/[benefitId]/page.tsx` | ✅ 구현됨 | 하드코딩 데이터, 정적 렌더링 |
| 알림 설정 | `app/settings/notifications/page.tsx` | ✅ 구현됨 | 클라이언트 상태만, API 미연결 |
| 혜택 탐색 전용 페이지 | `app/benefits/page.tsx` | ❌ 미구현 | 홈에 포함 |
| 캘린더 전용 페이지 | `app/calendar/page.tsx` | ❌ 미구현 | 홈에 포함 |
| 내 혜택 전용 페이지 | `app/my-benefits/page.tsx` | ❌ 미구현 | 홈에 포함 |
| 로그인/회원가입 | `app/(auth)/login/page.tsx` | ❌ 미구현 | |
| 프로필 설정 | `app/settings/profile/page.tsx` | ❌ 미구현 | |

### 1.2 구현된 컴포넌트

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| `BenefitCard` | `components/BenefitCard.tsx` | 혜택 카드 (태그, 마감일, 금액 표시) |
| `CalendarGrid` | `components/CalendarGrid.tsx` | 월별 캘린더 그리드 |
| `StatCard` | `components/StatCard.tsx` | 통계 위젯 카드 |
| `SectionHeader` | `components/SectionHeader.tsx` | 섹션 제목 + 설명 + 액션 버튼 |

### 1.3 현재 한계점

- **하드코딩 데이터**: 모든 데이터가 컴포넌트 파일 내 상수로 정의됨
- **단일 파일 집중**: `app/page.tsx`에 대시보드, 탐색, 캘린더, 내 혜택이 모두 포함 (595줄)
- **API 미연결**: 데이터 fetch 로직 없음
- **라우팅 미분리**: 개별 페이지로 분리 필요
- **공통 레이아웃 없음**: 헤더/네비게이션이 각 페이지에 중복 정의
- **타입 정의 부재**: `shared/types/` 없음

---

## 2. 아키텍처 설계

### 2.1 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js (App Router) | 14.2.5 |
| Language | TypeScript | 5.5.4 |
| Styling | Tailwind CSS | 3.4.10 |
| Font | Noto Sans KR | Google Fonts |
| State Management | React Context + useState | - |
| Data | JSON 샘플 데이터 (MVP 초기) | - |

### 2.2 폴더 구조 (리팩토링 대상)

```
benefit-calendar/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── benefits/
│   │   ├── [benefitId]/page.tsx    ✅ 있음
│   │   └── page.tsx                ❌ 생성 필요
│   ├── calendar/
│   │   └── page.tsx                ❌ 생성 필요
│   ├── my-benefits/
│   │   └── page.tsx                ❌ 생성 필요
│   ├── settings/
│   │   ├── notifications/page.tsx  ✅ 있음
│   │   └── profile/page.tsx        ❌ 생성 필요
│   ├── layout.tsx                  ✅ 있음 (개선 필요)
│   ├── page.tsx                    ✅ 있음 (리팩토링 필요)
│   └── globals.css                 ✅ 있음
│
├── components/
│   ├── ui/                         ❌ 생성 필요
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── FilterChip.tsx
│   ├── layout/                     ❌ 생성 필요
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── BenefitCard.tsx             ✅ 있음
│   ├── CalendarGrid.tsx            ✅ 있음
│   ├── StatCard.tsx                ✅ 있음
│   └── SectionHeader.tsx           ✅ 있음
│
├── shared/
│   ├── types/                      ❌ 생성 필요
│   │   ├── benefit.types.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts
│   ├── hooks/                      ❌ 생성 필요
│   │   ├── use-benefits.ts
│   │   ├── use-calendar.ts
│   │   └── use-user-benefits.ts
│   ├── services/                   ❌ 생성 필요
│   │   ├── benefit.service.ts
│   │   └── user.service.ts
│   ├── lib/
│   │   ├── constants/              ❌ 생성 필요
│   │   │   ├── status.ts
│   │   │   └── routes.ts
│   │   └── utils/                  ❌ 생성 필요
│   │       ├── format-date.ts
│   │       └── cn.ts
│   ├── config/                     ❌ 생성 필요
│   │   └── site.ts
│   └── sample_data.json            ✅ 있음
│
├── CONVENTIONS.md                  ✅ 있음
├── .env.example                    ✅ 있음
├── .prettierrc                     ✅ 있음
└── ...config files
```

---

## 3. 타입 설계

### 3.1 도메인 타입 (`shared/types/`)

```typescript
// benefit.types.ts
export type BenefitStatus = 'OPEN' | 'CLOSED'

export type BenefitCategory = '주거' | '교통' | '문화' | '창업' | '생활' | '교육' | '의료'

export interface ApplyPeriod {
  start: string  // ISO 8601 date
  end: string    // ISO 8601 date
}

export interface Benefit {
  id: string
  title: string
  agency: string
  category: BenefitCategory
  region: string
  amount: string
  applyPeriod: ApplyPeriod
  deadline: string    // ISO 8601 date
  applicationLink: string
  requirements: string[]
  documents: string[]
  status: BenefitStatus
}

// 목록 조회용 (요약)
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

```typescript
// user.types.ts
export type EmploymentStatus = 'JOB_SEEKER' | 'EMPLOYED' | 'STUDENT' | 'SELF_EMPLOYED'
export type NotificationChannel = 'EMAIL' | 'SMS' | 'PUSH'
export type UserBenefitStatus = 'BOOKMARKED' | 'PREPARING' | 'APPLIED' | 'RECEIVED'

export interface User {
  id: string
  email: string
  age: number
  region: string
  employmentStatus: EmploymentStatus
  isSelfEmployed: boolean
  notificationChannel: NotificationChannel
}

export interface UserBenefit {
  userId: string
  benefitId: string
  status: UserBenefitStatus
  createdAt: string
}

export interface NotificationSettings {
  channel: NotificationChannel
  enabled: boolean
  leadDays: number
}
```

```typescript
// api.types.ts
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

---

## 4. API 설계

### 4.1 엔드포인트 목록

| Method | Path | Auth | 설명 | FR |
|--------|------|:----:|------|:--:|
| `POST` | `/api/v1/auth/login` | ❌ | 로그인 | - |
| `GET` | `/api/v1/users/me` | ✅ | 프로필 조회 | FR-01 |
| `PATCH` | `/api/v1/users/me` | ✅ | 프로필 수정 | FR-01 |
| `GET` | `/api/v1/benefits` | ❌ | 혜택 목록 (검색/필터/정렬) | FR-03,04,05 |
| `GET` | `/api/v1/benefits/:id` | ❌ | 혜택 상세 | FR-06 |
| `GET` | `/api/v1/users/me/benefits` | ✅ | 내 혜택 목록 | FR-07,08 |
| `POST` | `/api/v1/users/me/benefits/:id/bookmark` | ✅ | 북마크 토글 | FR-07 |
| `PATCH` | `/api/v1/users/me/benefits/:id` | ✅ | 상태 변경 | FR-08 |
| `GET` | `/api/v1/users/me/notifications` | ✅ | 알림 설정 조회 | FR-11 |
| `PATCH` | `/api/v1/users/me/notifications` | ✅ | 알림 설정 변경 | FR-11 |
| `GET` | `/api/v1/dashboard/summary` | ✅ | 대시보드 요약 | FR-12 |

### 4.2 공통 규칙 (확정)

- **Base URL**: `/api/v1`
- **인증**: JWT Bearer Token
- **페이징**: `page` (기본 1), `pageSize` (기본 20)
- **정렬**: `sort=field:direction` (예: `deadline:asc`)
- **날짜**: ISO 8601

### 4.3 MVP 전략: Next.js API Routes + JSON 데이터

MVP에서는 **별도 백엔드 서버 없이** Next.js API Routes로 구현합니다.

```
app/
├── api/
│   └── v1/
│       ├── auth/
│       │   └── login/route.ts
│       ├── benefits/
│       │   ├── route.ts              GET /benefits
│       │   └── [benefitId]/
│       │       └── route.ts          GET /benefits/:id
│       ├── users/
│       │   └── me/
│       │       ├── route.ts          GET, PATCH /users/me
│       │       ├── benefits/
│       │       │   ├── route.ts      GET /users/me/benefits
│       │       │   └── [benefitId]/
│       │       │       ├── route.ts  PATCH /users/me/benefits/:id
│       │       │       └── bookmark/
│       │       │           └── route.ts  POST
│       │       └── notifications/
│       │           └── route.ts      GET, PATCH
│       └── dashboard/
│           └── summary/
│               └── route.ts          GET
```

데이터 소스: `shared/sample_data.json` → 추후 DB로 교체

---

## 5. DB 스키마 설계

### 5.1 테이블 구조 (향후 마이그레이션 대비)

#### users
| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | VARCHAR(36) | PK | UUID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 |
| password_hash | VARCHAR(255) | NOT NULL | 암호화된 비밀번호 |
| age | INT | NOT NULL | 나이 |
| region | VARCHAR(50) | NOT NULL | 지역 |
| employment_status | ENUM | NOT NULL | JOB_SEEKER, EMPLOYED, STUDENT, SELF_EMPLOYED |
| is_self_employed | BOOLEAN | NOT NULL | 자영업 여부 |
| notification_channel | ENUM | NOT NULL | EMAIL, SMS, PUSH |
| notification_enabled | BOOLEAN | DEFAULT true | 알림 활성화 |
| notification_lead_days | INT | DEFAULT 3 | 마감 n일 전 알림 |
| created_at | TIMESTAMP | NOT NULL | 생성일 |
| updated_at | TIMESTAMP | NOT NULL | 수정일 |

#### benefits
| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | VARCHAR(36) | PK | UUID |
| title | VARCHAR(200) | NOT NULL | 혜택명 |
| agency | VARCHAR(100) | NOT NULL | 기관명 |
| category | VARCHAR(50) | NOT NULL | 카테고리 |
| region | VARCHAR(50) | NOT NULL | 지역 |
| amount | VARCHAR(100) | NOT NULL | 지원 금액 |
| apply_start_date | DATE | NOT NULL | 신청 시작일 |
| apply_end_date | DATE | NOT NULL | 신청 종료일 |
| deadline | DATE | NOT NULL | 마감일 |
| application_link | VARCHAR(500) | NOT NULL | 신청 링크 |
| requirements | JSON | NOT NULL | 자격 요건 배열 |
| documents | JSON | NOT NULL | 제출 서류 배열 |
| created_at | TIMESTAMP | NOT NULL | 생성일 |
| updated_at | TIMESTAMP | NOT NULL | 수정일 |

> `status (OPEN/CLOSED)`는 deadline 기준 파생 필드로 계산 (DB 저장 안 함)

#### user_benefits
| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| user_id | VARCHAR(36) | PK, FK(users.id) | 사용자 ID |
| benefit_id | VARCHAR(36) | PK, FK(benefits.id) | 혜택 ID |
| status | ENUM | NOT NULL | BOOKMARKED, PREPARING, APPLIED, RECEIVED |
| created_at | TIMESTAMP | NOT NULL | 생성일 |
| updated_at | TIMESTAMP | NOT NULL | 수정일 |

### 5.2 인덱스

```sql
CREATE INDEX idx_benefits_deadline ON benefits(deadline);
CREATE INDEX idx_benefits_region_category ON benefits(region, category);
CREATE INDEX idx_user_benefits_user_status ON user_benefits(user_id, status);
```

---

## 6. 컴포넌트 설계

### 6.1 공통 레이아웃 컴포넌트

#### Header (`components/layout/Header.tsx`)

```
┌─────────────────────────────────────────────────────┐
│ BenefitCal MVP                    [알림 N] [사용자명] │
│ 혜택 캘린더       홈  탐색  캘린더  내 혜택  설정     │
└─────────────────────────────────────────────────────┘
```

- Props: `currentPage: string` (현재 활성 페이지 표시용)
- 모바일: 하단 탭 네비게이션 또는 햄버거 메뉴

#### Layout 개선 (`app/layout.tsx`)

현재 body만 감싸는 구조 → Header를 포함한 공통 레이아웃으로 변경

### 6.2 페이지별 컴포넌트 분리

#### 대시보드 (`app/page.tsx`) - 리팩토링

현재 595줄 단일 파일 → 다음으로 분리:

| 컴포넌트 | 역할 | 위치 |
|---------|------|------|
| `DashboardHero` | 환영 메시지 + CTA | `components/dashboard/` |
| `StatsSection` | 통계 위젯 3개 | `components/dashboard/` |
| `RecommendedBenefits` | 추천 혜택 리스트 | `components/dashboard/` |
| `ProfileSummary` | 프로필 요약 사이드바 | `components/dashboard/` |
| `UrgentBenefits` | 마감 임박 사이드바 | `components/dashboard/` |
| `WeeklySchedule` | 이번 주 일정 사이드바 | `components/dashboard/` |

#### 혜택 탐색 (`app/benefits/page.tsx`) - 신규

| 컴포넌트 | 역할 |
|---------|------|
| `SearchBar` | 검색 입력 + 디바운스 |
| `FilterPanel` | 필터 칩 + 저장 필터 |
| `SortSelect` | 정렬 선택 |
| `BenefitList` | 혜택 카드 목록 |

#### 캘린더 (`app/calendar/page.tsx`) - 신규

| 컴포넌트 | 역할 |
|---------|------|
| `MonthSelector` | 년/월 네비게이션 |
| `CalendarGrid` | 기존 컴포넌트 확장 |
| `DayEventsModal` | 날짜 클릭 이벤트 모달 |

#### 내 혜택 (`app/my-benefits/page.tsx`) - 신규

| 컴포넌트 | 역할 |
|---------|------|
| `StatusTabs` | 북마크/준비중/신청완료/수령완료 탭 |
| `MyBenefitCard` | 내 혜택 카드 + 상태 변경 |
| `EmptyState` | 빈 상태 안내 |

### 6.3 기존 컴포넌트 재사용

| 컴포넌트 | 사용 위치 | 변경 필요 |
|---------|---------|---------|
| `BenefitCard` | 대시보드, 탐색, 상세 | Props 타입을 `Benefit` 인터페이스 기반으로 변경 |
| `CalendarGrid` | 대시보드, 캘린더 | 월 네비게이션 props 추가 |
| `StatCard` | 대시보드 | 변경 없음 |
| `SectionHeader` | 전체 | 변경 없음 |

---

## 7. 서비스 레이어 설계 (`shared/services/`)

### 7.1 benefit.service.ts

```typescript
import { Benefit, BenefitSummary } from '@/shared/types/benefit.types'
import { PaginatedData } from '@/shared/types/api.types'

interface BenefitListParams {
  q?: string
  category?: string
  region?: string
  status?: string
  sort?: string
  page?: number
  pageSize?: number
}

export const benefitService = {
  async getList(params?: BenefitListParams): Promise<PaginatedData<BenefitSummary>> { ... },
  async getById(id: string): Promise<Benefit> { ... },
}
```

### 7.2 user.service.ts

```typescript
import { User, NotificationSettings } from '@/shared/types/user.types'

export const userService = {
  async getProfile(): Promise<User> { ... },
  async updateProfile(data: Partial<User>): Promise<void> { ... },
  async getNotifications(): Promise<NotificationSettings> { ... },
  async updateNotifications(data: Partial<NotificationSettings>): Promise<void> { ... },
}
```

### 7.3 user-benefit.service.ts

```typescript
import { UserBenefit, UserBenefitStatus } from '@/shared/types/user.types'
import { PaginatedData } from '@/shared/types/api.types'

export const userBenefitService = {
  async getList(status?: UserBenefitStatus): Promise<PaginatedData<UserBenefit>> { ... },
  async toggleBookmark(benefitId: string, active: boolean): Promise<void> { ... },
  async updateStatus(benefitId: string, status: UserBenefitStatus): Promise<void> { ... },
}
```

---

## 8. 상수 설계 (`shared/lib/constants/`)

### 8.1 status.ts

```typescript
export const USER_BENEFIT_STATUS = {
  BOOKMARKED: { label: '북마크', color: 'blue' },
  PREPARING: { label: '준비중', color: 'yellow' },
  APPLIED: { label: '신청완료', color: 'green' },
  RECEIVED: { label: '수령완료', color: 'purple' },
} as const

export const BENEFIT_STATUS = {
  OPEN: { label: '신청 가능', color: 'emerald' },
  CLOSED: { label: '마감', color: 'slate' },
} as const

export const EMPLOYMENT_STATUS = {
  JOB_SEEKER: { label: '구직 중' },
  EMPLOYED: { label: '재직 중' },
  STUDENT: { label: '학생' },
  SELF_EMPLOYED: { label: '자영업' },
} as const
```

### 8.2 routes.ts

```typescript
export const ROUTES = {
  HOME: '/',
  BENEFITS: '/benefits',
  BENEFIT_DETAIL: (id: string) => `/benefits/${id}`,
  CALENDAR: '/calendar',
  MY_BENEFITS: '/my-benefits',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  LOGIN: '/login',
} as const
```

---

## 9. 디자인 토큰

### 9.1 현재 Tailwind 확장 (tailwind.config.ts)

```typescript
colors: {
  midnight: '#0f172a',    // 주요 텍스트, 네비게이션
  primary: '#2563eb',     // CTA 버튼, 링크
  accent: '#22c55e',      // 성공 상태
  warning: '#f97316',     // 마감 임박
  danger: '#ef4444',      // 긴급, 에러
  surface: '#f8fafc',     // 배경색
}

boxShadow: {
  card: '0 12px 30px -20px rgba(15, 23, 42, 0.35)'
}
```

### 9.2 CSS 유틸리티 클래스 (`globals.css`)

| 클래스 | 용도 |
|--------|------|
| `.card` | 라운드 + 배경 + 카드 그림자 |
| `.btn-primary` | 주요 CTA 버튼 (파란색) |
| `.btn-secondary` | 보조 버튼 (테두리) |
| `.pill` | 태그/칩 (작은 라운드) |
| `.section-title` | 섹션 제목 (xl, semibold) |
| `.section-subtitle` | 섹션 부제목 (sm, slate-500) |

---

## 10. 구현 우선순위

### Phase 1: 기반 정리 (리팩토링)

1. `shared/types/` 타입 파일 생성
2. `shared/lib/constants/` 상수 파일 생성
3. `components/layout/Header.tsx` 공통 레이아웃 추출
4. `app/layout.tsx` 개선 (Header 포함)
5. `app/page.tsx` 대시보드 컴포넌트 분리

### Phase 2: 페이지 분리

6. `app/benefits/page.tsx` 혜택 탐색 페이지 분리
7. `app/calendar/page.tsx` 캘린더 페이지 분리
8. `app/my-benefits/page.tsx` 내 혜택 페이지 분리
9. `app/settings/profile/page.tsx` 프로필 설정 페이지

### Phase 3: API 연결

10. Next.js API Routes 생성
11. `shared/services/` 서비스 레이어 구현
12. `shared/hooks/` Custom Hooks 구현
13. 하드코딩 데이터 → API 호출로 교체

### Phase 4: 기능 완성

14. 검색/필터/정렬 동작 구현
15. 북마크/상태 변경 API 연결
16. 캘린더 월 네비게이션 동작
17. 알림 설정 API 연결

---

## 11. 요구사항 추적표

| FR | 요구사항 | 화면 | API | 구현 상태 |
|----|---------|------|-----|:--------:|
| FR-01 | 프로필 입력/저장 | settings/profile | PATCH /users/me | ❌ |
| FR-02 | 프로필 기반 추천 | 대시보드 | GET /benefits?matched=true | ❌ |
| FR-03 | 검색 | 탐색 | GET /benefits?q= | ⚠️ UI만 |
| FR-04 | 필터링 | 탐색 | GET /benefits?category=&region= | ⚠️ UI만 |
| FR-05 | 정렬 | 탐색 | GET /benefits?sort= | ⚠️ UI만 |
| FR-06 | 혜택 상세 | benefits/[id] | GET /benefits/:id | ⚠️ 하드코딩 |
| FR-07 | 북마크 | 탐색, 내 혜택 | POST /bookmark | ⚠️ UI만 |
| FR-08 | 상태 변경 | 내 혜택 | PATCH /status | ⚠️ 로컬 상태만 |
| FR-09 | 캘린더 뷰 | 캘린더 | (클라이언트 계산) | ⚠️ 하드코딩 |
| FR-10 | 날짜 클릭 이벤트 | 캘린더 | (클라이언트) | ✅ 모달 구현 |
| FR-11 | 알림 설정 | settings/notifications | GET/PATCH /notifications | ⚠️ UI만 |
| FR-12 | 대시보드 통계 | 대시보드 | GET /dashboard/summary | ⚠️ 하드코딩 |

**범례**: ✅ 완료 | ⚠️ 부분 구현 (UI만) | ❌ 미구현

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-31 | 초기 Design 문서 작성. 현재 구현 분석, API/DB/컴포넌트 설계 | BenefitCal Team |
