# 혜택 캘린더 (Benefit Calendar) - 코딩 컨벤션

> **Version**: 1.0
> **Last Updated**: 2026-01-31
> **Project Level**: Dynamic
> **Purpose**: AI 협업 및 팀 개발을 위한 일관된 코드 작성 규칙

---

## 목차

1. [네이밍 규칙](#1-네이밍-규칙)
2. [폴더 구조](#2-폴더-구조)
3. [환경 변수 컨벤션](#3-환경-변수-컨벤션)
4. [Clean Architecture](#4-clean-architecture)
5. [코드 스타일](#5-코드-스타일)
6. [재사용성 원칙](#6-재사용성-원칙)
7. [확장성 원칙](#7-확장성-원칙)

---

## 1. 네이밍 규칙

### 1.1 파일 및 폴더

| 대상 | 규칙 | 예시 |
|------|------|------|
| **컴포넌트 파일** | PascalCase.tsx | `BenefitCard.tsx`, `CalendarGrid.tsx` |
| **페이지 파일** | kebab-case/page.tsx | `app/benefits/[benefitId]/page.tsx` |
| **유틸 함수** | kebab-case.ts | `format-date.ts`, `api-client.ts` |
| **Hook 파일** | use-kebab-case.ts | `use-benefits.ts`, `use-auth.ts` |
| **타입 파일** | kebab-case.types.ts | `benefit.types.ts`, `user.types.ts` |
| **폴더명** | kebab-case | `user-profile/`, `benefit-card/` |

### 1.2 코드 네이밍

```typescript
// ✅ 컴포넌트: PascalCase
export function BenefitCard({ benefit }: BenefitCardProps) {}

// ✅ 함수/변수: camelCase
const fetchBenefits = async () => {}
const userProfile = { name: "지수" }

// ✅ 상수: UPPER_SNAKE_CASE
const API_BASE_URL = '/api/v1'
const MAX_RETRIES = 3

// ✅ 타입/인터페이스: PascalCase
interface User {}
type BenefitStatus = 'OPEN' | 'CLOSED'

// ✅ Enum: PascalCase (값: UPPER_SNAKE_CASE)
enum UserBenefitStatus {
  BOOKMARKED = 'BOOKMARKED',
  PREPARING = 'PREPARING',
  APPLIED = 'APPLIED',
  RECEIVED = 'RECEIVED',
}

// ✅ Private 변수/함수: _camelCase (선택)
const _internalHelper = () => {}
```

### 1.3 의미 있는 네이밍

```typescript
// ❌ 나쁜 예
const d = new Date()
const arr = benefits.filter(x => x.status === 'OPEN')
function get() {}

// ✅ 좋은 예
const currentDate = new Date()
const openBenefits = benefits.filter(benefit => benefit.status === 'OPEN')
function getBenefitById(id: string) {}
```

---

## 2. 폴더 구조

### 2.1 프로젝트 구조 (Dynamic Level)

```
benefit-calendar/
├── app/                          # Next.js App Router (Presentation)
│   ├── (auth)/                   # 인증 관련 페이지 그룹
│   │   ├── login/
│   │   └── signup/
│   ├── benefits/                 # 혜택 관련
│   │   ├── [benefitId]/
│   │   └── page.tsx
│   ├── calendar/
│   ├── my-benefits/
│   ├── settings/
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 홈/대시보드
│   └── globals.css
│
├── components/                   # UI 컴포넌트 (Presentation)
│   ├── ui/                       # 기본 UI 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── select.tsx
│   ├── BenefitCard.tsx           # 도메인 컴포넌트
│   ├── CalendarGrid.tsx
│   ├── StatCard.tsx
│   └── SectionHeader.tsx
│
├── shared/                       # 공통 모듈
│   ├── hooks/                    # Custom Hooks (Presentation)
│   │   ├── use-benefits.ts
│   │   ├── use-auth.ts
│   │   └── use-user-profile.ts
│   ├── services/                 # API Services (Application)
│   │   ├── benefit.service.ts
│   │   ├── user.service.ts
│   │   └── auth.service.ts
│   ├── types/                    # 타입 정의 (Domain)
│   │   ├── benefit.types.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts
│   ├── lib/                      # 유틸리티 (Infrastructure)
│   │   ├── api/
│   │   │   ├── client.ts         # Fetch wrapper
│   │   │   └── endpoints.ts
│   │   ├── utils/
│   │   │   ├── format-date.ts
│   │   │   ├── cn.ts             # className 유틸
│   │   │   └── validation.ts
│   │   └── constants/
│   │       ├── status.ts
│   │       ├── routes.ts
│   │       └── env.ts
│   └── config/                   # 설정 파일
│       └── site.ts
│
├── docs/                         # PDCA 문서
├── public/                       # 정적 파일
└── ...config files
```

### 2.2 파일 분리 기준

| 기준 | 설명 | 예시 |
|------|------|------|
| **50줄 이상** | 별도 파일로 분리 | 복잡한 컴포넌트 → 파일 분리 |
| **재사용 2회+** | 공통 폴더로 이동 | 같은 유틸 함수 2번 사용 → `shared/lib/utils/` |
| **독립적 책임** | 별도 모듈로 분리 | API 로직 → `services/` |
| **도메인 단위** | 기능별로 그룹화 | 혜택 관련 → `benefits/` |

---

## 3. 환경 변수 컨벤션

### 3.1 네이밍 규칙

| Prefix | 용도 | 노출 범위 | 예시 |
|--------|------|-----------|------|
| `NEXT_PUBLIC_` | 클라이언트 노출 | Browser | `NEXT_PUBLIC_API_URL` |
| `API_` | 외부 API 키 | Server only | `API_STRIPE_SECRET` |
| `AUTH_` | 인증 관련 | Server only | `AUTH_SECRET`, `AUTH_JWT_SECRET` |
| `DB_` | 데이터베이스 | Server only | `DB_HOST`, `DB_PASSWORD` |
| `SMTP_` | 이메일 서비스 | Server only | `SMTP_HOST`, `SMTP_PASSWORD` |

### 3.2 .env 파일 구조

```bash
# .env.example (Git 포함, 값은 비움)

# ===== App Settings =====
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# ===== Authentication =====
AUTH_SECRET=                    # openssl rand -base64 32
AUTH_JWT_SECRET=
AUTH_JWT_EXPIRES_IN=7d

# ===== Database (향후 확장) =====
DB_HOST=
DB_PORT=5432
DB_NAME=benefit_calendar
DB_USER=
DB_PASSWORD=

# ===== Email Service =====
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@benefitcal.com

# ===== External APIs (향후 확장) =====
API_GOV_DATA_KEY=              # 정부 공공데이터 API
```

### 3.3 환경 변수 검증

```typescript
// shared/lib/constants/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Required
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),

  // Optional (with defaults)
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

// 앱 시작 시 검증
export const env = envSchema.parse(process.env);
```

---

## 4. Clean Architecture

### 4.1 레이어 구조 (Dynamic Level)

```
┌─────────────────────────────────────────────────┐
│ Presentation Layer (app/, components/, hooks/) │
│  - UI 렌더링, 사용자 이벤트                      │
│  - Dependency: Application, Domain               │
├─────────────────────────────────────────────────┤
│ Application Layer (shared/services/)            │
│  - 비즈니스 로직 오케스트레이션                   │
│  - Dependency: Domain, Infrastructure            │
├─────────────────────────────────────────────────┤
│ Domain Layer (shared/types/, shared/constants/) │
│  - 핵심 비즈니스 규칙, 타입                       │
│  - Dependency: 없음 (독립적)                     │
├─────────────────────────────────────────────────┤
│ Infrastructure Layer (shared/lib/)              │
│  - 외부 시스템 연결 (API, DB)                    │
│  - Dependency: Domain                            │
└─────────────────────────────────────────────────┘
```

### 4.2 의존성 규칙

```typescript
// ✅ 허용되는 import 방향

// Presentation에서:
import { Benefit } from '@/shared/types/benefit.types';      // ✅ Domain
import { useBenefits } from '@/shared/hooks/use-benefits';   // ✅ Same layer
import { benefitService } from '@/shared/services/benefit';  // ✅ Application

// Application에서:
import { Benefit } from '@/shared/types/benefit.types';      // ✅ Domain
import { apiClient } from '@/shared/lib/api/client';         // ✅ Infrastructure

// Infrastructure에서:
import { Benefit } from '@/shared/types/benefit.types';      // ✅ Domain

// ❌ 금지되는 import

// Domain에서:
import { apiClient } from '@/shared/lib/api/client';         // ❌ Infrastructure 금지
import { Button } from '@/components/ui/button';             // ❌ Presentation 금지

// Infrastructure에서:
import { useBenefits } from '@/shared/hooks/use-benefits';   // ❌ Presentation 금지
```

### 4.3 실제 적용 예시

```typescript
// ✅ 올바른 레이어 분리

// 1. Domain (shared/types/benefit.types.ts)
export interface Benefit {
  id: string;
  title: string;
  agency: string;
  deadline: string;
  status: 'OPEN' | 'CLOSED';
}

// 2. Infrastructure (shared/lib/api/client.ts)
export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${endpoint}`);
    return response.json();
  }
};

// 3. Application (shared/services/benefit.service.ts)
import { apiClient } from '@/shared/lib/api/client';
import { Benefit } from '@/shared/types/benefit.types';

export const benefitService = {
  async getList(): Promise<Benefit[]> {
    return apiClient.get<Benefit[]>('/benefits');
  }
};

// 4. Presentation (shared/hooks/use-benefits.ts)
import { benefitService } from '@/shared/services/benefit.service';

export function useBenefits() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);

  useEffect(() => {
    benefitService.getList().then(setBenefits);
  }, []);

  return { benefits };
}

// 5. Presentation (components/BenefitCard.tsx)
import { useBenefits } from '@/shared/hooks/use-benefits';

export function BenefitList() {
  const { benefits } = useBenefits();  // ✅ Hook을 통해 호출

  return benefits.map(benefit => <BenefitCard key={benefit.id} {...benefit} />);
}
```

---

## 5. 코드 스타일

### 5.1 기본 규칙

```typescript
// ✅ 권장 스타일

// 1. 세미콜론 사용하지 않음 (Prettier 기본)
const user = { name: "지수" }

// 2. 문자열: 작은따옴표 우선
const message = 'Hello'

// 3. 들여쓰기: 2 spaces
function example() {
  if (condition) {
    return true
  }
}

// 4. 화살표 함수 우선
const handleClick = () => {}  // ✅
function handleClick() {}     // ⚠️ 필요시에만

// 5. 명시적 타입 선언
const userId: string = '123'  // ✅
const userId = '123'          // ⚠️ 자동 추론 가능시 생략 가능

// 6. Optional chaining 적극 사용
const email = user?.profile?.email  // ✅
```

### 5.2 Import 순서

```typescript
// 1. React/Next.js
import { useState, useEffect } from 'react'
import Link from 'next/link'

// 2. 외부 라이브러리
import { z } from 'zod'
import { format } from 'date-fns'

// 3. 내부 절대경로 (도메인)
import { Benefit } from '@/shared/types/benefit.types'
import { API_ENDPOINTS } from '@/shared/lib/constants/endpoints'

// 4. 내부 절대경로 (컴포넌트/서비스)
import { Button } from '@/components/ui/button'
import { benefitService } from '@/shared/services/benefit.service'

// 5. 상대경로
import { formatDeadline } from './utils'

// 6. 스타일
import './styles.css'
```

### 5.3 컴포넌트 구조

```typescript
// ✅ 권장 컴포넌트 구조

// 1. Imports
import { useState } from 'react'
import { Benefit } from '@/shared/types/benefit.types'

// 2. Types (컴포넌트 전용)
interface BenefitCardProps {
  benefit: Benefit
  onBookmark?: (id: string) => void
}

// 3. Constants (컴포넌트 전용)
const STATUS_COLORS = {
  OPEN: 'green',
  CLOSED: 'gray',
} as const

// 4. Component
export function BenefitCard({ benefit, onBookmark }: BenefitCardProps) {
  // 4-1. Hooks
  const [isBookmarked, setIsBookmarked] = useState(false)

  // 4-2. Event handlers
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark?.(benefit.id)
  }

  // 4-3. Render helpers (optional)
  const renderStatus = () => {
    return <span className={STATUS_COLORS[benefit.status]}>{benefit.status}</span>
  }

  // 4-4. JSX
  return (
    <div>
      <h3>{benefit.title}</h3>
      {renderStatus()}
      <button onClick={handleBookmark}>
        {isBookmarked ? '북마크 해제' : '북마크'}
      </button>
    </div>
  )
}

// 5. Helper functions (export 가능)
function formatBenefitTitle(title: string) {
  return title.trim()
}
```

---

## 6. 재사용성 원칙

### 6.1 중복 제거 규칙

```typescript
// ❌ 중복 코드
// components/BenefitCard.tsx
const statusColor = benefit.status === 'OPEN' ? 'green' : 'gray'

// components/BenefitList.tsx
const statusColor = benefit.status === 'OPEN' ? 'green' : 'gray'

// ✅ 공통 함수로 추출
// shared/lib/utils/benefit.ts
export function getBenefitStatusColor(status: string) {
  return status === 'OPEN' ? 'green' : 'gray'
}

// 사용
import { getBenefitStatusColor } from '@/shared/lib/utils/benefit'
const statusColor = getBenefitStatusColor(benefit.status)
```

### 6.2 추출 기준

| 조건 | 액션 |
|------|------|
| 같은 로직 2회+ 사용 | 함수로 추출 → `shared/lib/utils/` |
| 같은 UI 패턴 반복 | 컴포넌트로 추출 → `components/ui/` |
| 하드코딩된 값 | 상수로 추출 → `shared/lib/constants/` |
| 특정 타입에 종속 | 제네릭으로 일반화 |

### 6.3 제네릭 함수 작성

```typescript
// ❌ 특정 타입에 종속
function calculateBenefitTotal(benefits: Benefit[]) {
  return benefits.reduce((sum, b) => sum + parseFloat(b.amount), 0)
}

// ✅ 제네릭으로 일반화
interface HasAmount { amount: string }

function calculateTotal<T extends HasAmount>(items: T[]) {
  return items.reduce((sum, item) => sum + parseFloat(item.amount), 0)
}

// 다양한 곳에서 사용 가능
calculateTotal(benefits)
calculateTotal(invoices)
```

---

## 7. 확장성 원칙

### 7.1 설정 기반 설계

```typescript
// ❌ 조건문 나열
function getStatusLabel(status: string) {
  if (status === 'BOOKMARKED') return '북마크'
  if (status === 'PREPARING') return '준비중'
  if (status === 'APPLIED') return '신청완료'
  if (status === 'RECEIVED') return '수령완료'
  return status
}

// ✅ 설정 객체
// shared/lib/constants/status.ts
export const USER_BENEFIT_STATUS_CONFIG = {
  BOOKMARKED: { label: '북마크', color: 'blue', icon: '📌' },
  PREPARING: { label: '준비중', color: 'yellow', icon: '⏳' },
  APPLIED: { label: '신청완료', color: 'green', icon: '✅' },
  RECEIVED: { label: '수령완료', color: 'purple', icon: '🎉' },
} as const

// 사용
const config = USER_BENEFIT_STATUS_CONFIG[status]
// config.label, config.color, config.icon 모두 사용 가능
```

### 7.2 확장 가능한 타입

```typescript
// ✅ 확장 가능한 인터페이스
interface BaseResponse {
  success: boolean
  meta: {
    requestId: string
    timestamp: string
  }
}

interface SuccessResponse<T> extends BaseResponse {
  success: true
  data: T
}

interface ErrorResponse extends BaseResponse {
  success: false
  error: {
    code: string
    message: string
  }
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

// 새로운 응답 타입 추가 시 쉽게 확장 가능
```

---

## 8. 체크리스트

### 코드 작성 전
- [ ] 비슷한 함수가 `shared/lib/utils/`에 있는가?
- [ ] 비슷한 컴포넌트가 `components/`에 있는가?
- [ ] 프로젝트 전체 검색을 했는가?

### 코드 작성 후
- [ ] 같은 코드가 2곳 이상에 있는가? → 추출
- [ ] 하드코딩된 값이 있는가? → 상수화
- [ ] 특정 타입에 종속되어 있는가? → 일반화
- [ ] 레이어 의존성 규칙을 지켰는가?
- [ ] Import 순서가 올바른가?

---

## 9. Next Steps

1. ✅ Phase 2 완료 - 컨벤션 정의
2. ⏭️ Phase 3 - Mockup 개발
3. ⏭️ Phase 4 - API 설계

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-31 | Initial conventions | BenefitCal Team |
