# 혜택 캘린더 (BenefitCal) MVP API 명세서 초안

> 목적: MVP 프론트/백엔드 개발을 위한 최소 API 계약 문서.

## 1) 공통 규칙

### 1.1 Base URL (확정)
- `/api/v1`

### 1.2 인증 (확정)
- **JWT 기반 인증**을 사용합니다.
- 요청 헤더에 `Authorization: Bearer <token>`을 포함합니다.
- 인증이 필요한 엔드포인트는 별도 표기합니다.

### 1.3 공통 응답 포맷 (확정)

**성공**
```json
{
  "success": true,
  "data": { "...": "..." },
  "meta": {
    "requestId": "uuid",
    "timestamp": "2025-01-15T12:34:56Z"
  }
}
```

**에러**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "필수 값이 누락되었습니다.",
    "details": [
      { "field": "age", "reason": "required" }
    ]
  },
  "meta": {
    "requestId": "uuid",
    "timestamp": "2025-01-15T12:34:56Z"
  }
}
```

### 1.4 페이징 (확정)
- `page`, `pageSize` 사용
- 기본값: `page=1`, `pageSize=20`
- 목록 응답은 `data.items`, `data.page`, `data.pageSize`, `data.total` 형태를 사용합니다.

### 1.5 정렬 (확정)
- `sort` 파라미터 형식: `field:direction`
- `direction`: `asc` | `desc`
- 예: `sort=deadline:asc`

### 1.6 날짜 포맷 (확정)
- ISO 8601
- 예: `2025-01-31`, `2025-01-05T09:00:00Z`

---

## 2) 데이터 모델 (확정)

### 2.1 User
**필드 목록**
- `id` (string, UUID)
- `email` (string)
- `passwordHash` (string, 응답에 미포함)
- `age` (number)
- `region` (string)
- `employmentStatus` (string, `JOB_SEEKER` | `EMPLOYED` | `STUDENT` | `SELF_EMPLOYED`)
- `isSelfEmployed` (boolean)
- `notificationChannel` (string, `EMAIL` | `SMS` | `PUSH`)
- `notificationEnabled` (boolean)
- `notificationLeadDays` (number)
- `createdAt` (string, ISO 8601)
- `updatedAt` (string, ISO 8601)

**예시**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "jisu@example.com",
  "age": 25,
  "region": "서울",
  "employmentStatus": "JOB_SEEKER",
  "isSelfEmployed": false,
  "notificationChannel": "EMAIL",
  "notificationEnabled": true,
  "notificationLeadDays": 3,
  "createdAt": "2026-01-31T12:00:00.000Z",
  "updatedAt": "2026-01-31T12:00:00.000Z"
}
```

### 2.2 Benefit
**필드 목록**
- `id` (string, UUID)
- `title` (string)
- `agency` (string)
- `category` (string)
- `region` (string)
- `amount` (string)
- `applyPeriod` (object: `start`, `end`)
- `deadline` (string, ISO 8601 date)
- `applicationLink` (string, URL)
- `requirements` (string[])
- `documents` (string[])
- `status` (string, `OPEN` | `CLOSED` - 서버에서 deadline 기준 계산)

> `status`는 DB 컬럼이 아닌 서버에서 계산하는 파생 필드입니다. `deadline < now`이면 `CLOSED`, 아니면 `OPEN`.
> DB에는 `apply_start_date`, `apply_end_date` 개별 컬럼으로 저장되지만, API 응답에서는 `applyPeriod` 객체로 그룹핑하여 반환합니다.

**예시**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "청년 월세 지원",
  "agency": "서울특별시",
  "category": "주거",
  "region": "서울",
  "amount": "월 20만원",
  "applyPeriod": {
    "start": "2026-01-10",
    "end": "2026-02-10"
  },
  "deadline": "2026-02-10",
  "applicationLink": "https://example.com/apply",
  "requirements": ["만 19~34세", "무주택"],
  "documents": ["주민등록등본", "임대차계약서"],
  "status": "OPEN"
}
```

### 2.3 UserBenefit
**필드 목록**
- `userId` (string)
- `benefitId` (string)
- `status` (string, `BOOKMARKED` | `PREPARING` | `APPLIED` | `RECEIVED`)
- `createdAt` (string, ISO 8601)

**예시**
```json
{
  "userId": "u_001",
  "benefitId": "b_001",
  "status": "BOOKMARKED",
  "createdAt": "2025-01-05T09:00:00Z"
}
```

---

## 3) 인증

### 3.1 회원가입
`POST /auth/register`

**Request**
```json
{
  "email": "jisu@example.com",
  "password": "password123",
  "age": 25,
  "region": "서울",
  "employmentStatus": "JOB_SEEKER"
}
```

**Response** (토큰 + 프로필 함께 반환)
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "email": "jisu@example.com",
      "age": 25,
      "region": "서울",
      "employmentStatus": "JOB_SEEKER",
      "isSelfEmployed": false,
      "notificationChannel": "EMAIL",
      "notificationEnabled": true,
      "notificationLeadDays": 3
    }
  }
}
```

### 3.2 로그인
`POST /auth/login`

**Request**
```json
{
  "email": "jisu@example.com",
  "password": "password123"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "expiresIn": 900
  }
}
```

---

## 4) 사용자 / 프로필

### 4.1 내 프로필 조회 (인증 필요)
`GET /users/me`

**Response**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "jisu@example.com",
    "age": 25,
    "region": "서울",
    "employmentStatus": "JOB_SEEKER",
    "isSelfEmployed": false,
    "notificationChannel": "EMAIL",
    "notificationEnabled": true,
    "notificationLeadDays": 3,
    "createdAt": "2026-01-31T12:00:00.000Z",
    "updatedAt": "2026-01-31T12:00:00.000Z"
  }
}
```

### 4.2 내 프로필 수정 (인증 필요)
`PATCH /users/me`

**Request**
```json
{
  "age": 26,
  "region": "서울",
  "employmentStatus": "JOB_SEEKER",
  "isSelfEmployed": false,
  "notificationChannel": "EMAIL"
}
```

**Response** (변경된 전체 프로필 반환)
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "jisu@example.com",
    "age": 26,
    "region": "서울",
    "employmentStatus": "JOB_SEEKER",
    "isSelfEmployed": false,
    "notificationChannel": "EMAIL",
    "notificationEnabled": true,
    "notificationLeadDays": 3,
    "createdAt": "2026-01-31T12:00:00.000Z",
    "updatedAt": "2026-01-31T12:30:00.000Z"
  }
}
```

---

## 5) 혜택 탐색

### 5.1 혜택 목록 조회
`GET /benefits`

**Query Parameters**
- `q`: 검색어 (혜택명/기관명)
- `category`: 카테고리
- `region`: 지역
- `status`: 신청 가능 상태 (`OPEN`, `CLOSED`)
- `sort`: 정렬 (`deadline:asc`, `createdAt:desc` 등)
- `page`, `pageSize`

**Response**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "청년 월세 지원",
        "agency": "서울특별시",
        "category": "주거",
        "region": "서울",
        "amount": "월 20만원",
        "deadline": "2026-02-10",
        "status": "OPEN"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 120
  }
}
```

### 5.2 혜택 상세 조회
`GET /benefits/{benefitId}`

**Response**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "청년 월세 지원",
    "agency": "서울특별시",
    "category": "주거",
    "region": "서울",
    "amount": "월 20만원",
    "applyPeriod": { "start": "2026-01-10", "end": "2026-02-10" },
    "deadline": "2026-02-10",
    "applicationLink": "https://example.com/apply",
    "requirements": ["만 19~34세", "무주택"],
    "documents": ["주민등록등본", "임대차계약서"],
    "status": "OPEN"
  }
}
```

---

## 6) 내 혜택 (북마크/상태 관리)

### 6.1 내 혜택 목록 (인증 필요)
`GET /users/me/benefits`

**Query Parameters**
- `status`: `BOOKMARKED`, `PREPARING`, `APPLIED`, `RECEIVED`
- `page`, `pageSize`

**Response**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "benefitId": "b_001",
        "title": "청년 월세 지원",
        "status": "PREPARING",
        "deadline": "2025-02-10"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 5
  }
}
```

### 6.2 북마크 추가/해제 (인증 필요)
`POST /users/me/benefits/{benefitId}/bookmark`

**Request**
```json
{
  "active": true
}
```

**Response**
```json
{
  "success": true,
  "data": { "benefitId": "uuid", "bookmarked": true }
}
```

### 6.3 내 혜택 상태 변경 (인증 필요)
`PATCH /users/me/benefits/{benefitId}`

**Request**
```json
{
  "status": "APPLIED"
}
```

**Response**
```json
{
  "success": true,
  "data": { "benefitId": "b_001", "status": "APPLIED" }
}
```

---

## 7) 알림

### 7.1 알림 설정 조회 (인증 필요)
`GET /users/me/notifications`

**Response**
```json
{
  "success": true,
  "data": {
    "channel": "EMAIL",
    "enabled": true,
    "leadDays": 3
  }
}
```

### 7.2 알림 설정 변경 (인증 필요)
`PATCH /users/me/notifications`

**Request**
```json
{
  "channel": "EMAIL",
  "enabled": true,
  "leadDays": 3
}
```

**Response** (변경된 설정 전체 반환)
```json
{
  "success": true,
  "data": {
    "channel": "EMAIL",
    "enabled": true,
    "leadDays": 3
  }
}
```

---

## 8) 대시보드

### 8.1 대시보드 요약 (인증 필요)
`GET /dashboard/summary`

**Response**
```json
{
  "success": true,
  "data": {
    "matchedCount": 12,
    "urgentCount": 3,
    "appliedCount": 2
  }
}
```

---

## 9) 헬스체크

### 9.1 헬스체크
`GET /health`

**Response**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-01-31T12:00:00.000Z"
  }
}
```

---

## 10) 상태/코드 표준 (확정)

### 10.1 UserBenefit 상태
- `BOOKMARKED`
- `PREPARING`
- `APPLIED`
- `RECEIVED`

### 10.2 혜택 상태
- `OPEN` / `CLOSED`는 DB 컬럼이 아닌 서버에서 `deadline` 기준으로 계산하는 파생 값
- `deadline >= now` → `OPEN`, `deadline < now` → `CLOSED`

### 10.3 employmentStatus
- `JOB_SEEKER`
- `EMPLOYED`
- `STUDENT`
- `SELF_EMPLOYED`

---

## 11) 샘플 데이터 (공유)
- 위치: `apps/api/prisma/seed.ts`
- 구성: 테스트 사용자 1명 (`test@benefitcal.com`), 혜택 10건 (7개 카테고리)
- Prisma seed 명령으로 적재: `pnpm db:seed`

---

## 12) 로컬 개발 환경 변수 및 실행 가이드

### 12.1 환경 변수 목록 (`apps/api/.env.local`)
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `REDIS_URL`: Redis 연결 문자열
- `AUTH_JWT_SECRET`: JWT 서명 비밀키
- `AUTH_JWT_EXPIRES_IN`: Access Token 만료 시간 (기본 `15m`)
- `AUTH_REFRESH_EXPIRES_IN`: Refresh Token 만료 시간 (기본 `7d`)
- `PORT`: API 서버 포트 (기본 `4000`)

### 12.2 실행 가이드
1. Docker 컨테이너 기동: `docker compose up -d`
2. 의존성 설치: `pnpm install`
3. DB 셋업: `pnpm db:generate && pnpm db:migrate && pnpm db:seed`
4. 개발 서버 실행: `pnpm dev`
5. API 접속: `http://localhost:4000/api/v1`, Swagger: `http://localhost:4000/api/docs`

---

## 13) 변경 공지 및 규칙 준수 체크
- 문서 변경 내역을 팀 채널에 공지합니다.
- 프론트/백엔드 담당자는 **Base URL, 인증 헤더, 공통 응답, 페이징, 정렬, 날짜 포맷, 상태 코드**를 동일 규칙으로 적용했는지 확인합니다.

---

## 14) 비고
- 본 문서는 MVP 개발을 위한 기준 문서이며, 변경 시 팀 합의와 공지를 거칩니다.
- 초기에는 샘플 데이터 기반 응답을 허용합니다.

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2025-01 | 초기 작성 |
| 2.0 | 2026-02-01 | 8곳 불일치 수정: register/health 추가, login 응답(refreshToken/expiresIn), users/me 응답(10필드), PATCH /users/me 전체 반환, benefits status 제거, bookmark 바디 제거(토글), notifications 전체 반환, 샘플 데이터/환경 변수 경로 업데이트 (docs-sync PDCA) |
| 2.1 | 2026-02-01 | 원본 설계 복원: register 응답에 user 프로필 포함, Benefit에 applyPeriod 객체 + status 파생 필드 복원, bookmark에 active 파라미터 복원. 구현 개선 사항 유지: refreshToken/expiresIn, 10필드 프로필, 전체 반환. |
| 2.2 | 2026-02-01 | 구현 완료: 4건 TODO 모두 해소. api-spec-alignment PDCA 완료. |
