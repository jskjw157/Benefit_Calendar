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
- `id` (string)
- `email` (string)
- `age` (number)
- `region` (string)
- `employmentStatus` (string, `JOB_SEEKER` | `EMPLOYED` | `STUDENT` | `SELF_EMPLOYED`)
- `isSelfEmployed` (boolean)
- `notificationChannel` (string, `EMAIL` | `SMS` | `PUSH`)

**예시**
```json
{
  "id": "u_001",
  "email": "jisu@example.com",
  "age": 25,
  "region": "서울",
  "employmentStatus": "JOB_SEEKER",
  "isSelfEmployed": false,
  "notificationChannel": "EMAIL"
}
```

### 2.2 Benefit
**필드 목록**
- `id` (string)
- `title` (string)
- `agency` (string)
- `category` (string)
- `region` (string)
- `amount` (string)
- `applyPeriod` (object: `start`, `end`)
- `deadline` (string, ISO 8601)
- `applicationLink` (string, URL)
- `requirements` (string[])
- `documents` (string[])
- `status` (string, `OPEN` | `CLOSED`)

**예시**
```json
{
  "id": "b_001",
  "title": "청년 월세 지원",
  "agency": "서울특별시",
  "category": "주거",
  "region": "서울",
  "amount": "월 20만원",
  "applyPeriod": {
    "start": "2025-01-10",
    "end": "2025-02-10"
  },
  "deadline": "2025-02-10",
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

### 3.1 로그인
`POST /auth/login`

**Request**
```json
{
  "email": "jisu@example.com",
  "password": "********"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt_token",
    "user": { "id": "u_001", "email": "jisu@example.com" }
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
    "id": "u_001",
    "email": "jisu@example.com",
    "age": 25,
    "region": "서울",
    "employmentStatus": "JOB_SEEKER",
    "isSelfEmployed": false,
    "notificationChannel": "EMAIL"
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

**Response**
```json
{
  "success": true,
  "data": { "id": "u_001" }
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
        "id": "b_001",
        "title": "청년 월세 지원",
        "agency": "서울특별시",
        "category": "주거",
        "region": "서울",
        "amount": "월 20만원",
        "deadline": "2025-02-10",
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
    "id": "b_001",
    "title": "청년 월세 지원",
    "agency": "서울특별시",
    "category": "주거",
    "region": "서울",
    "amount": "월 20만원",
    "applyPeriod": { "start": "2025-01-10", "end": "2025-02-10" },
    "deadline": "2025-02-10",
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
  "data": { "benefitId": "b_001", "bookmarked": true }
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

**Response**
```json
{
  "success": true,
  "data": { "updated": true }
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

## 9) 상태/코드 표준 (확정)

### 9.1 UserBenefit 상태
- `BOOKMARKED`
- `PREPARING`
- `APPLIED`
- `RECEIVED`

### 9.2 혜택 상태
- `OPEN`
- `CLOSED`

### 9.3 employmentStatus
- `JOB_SEEKER`
- `EMPLOYED`
- `STUDENT`
- `SELF_EMPLOYED`

---

## 10) 샘플 데이터 (공유)
- 위치: `shared/sample_data.json`
- 구성: `users`, `benefits`, `userBenefits`
- 각 배열은 `id` 또는 복합 키 기준으로 정렬되어 있으며, 예시 JSON과 동일한 키 규칙을 따릅니다.

---

## 11) 로컬 개발 환경 변수 및 실행 가이드

### 11.1 환경 변수 목록
- `API_BASE_URL`: 로컬 API Base URL (예: `http://localhost:3000/api/v1`)
- `JWT_SECRET`: JWT 서명 비밀키
- `NOTIFICATION_CHANNEL`: 기본 알림 채널 (`EMAIL`, `SMS`, `PUSH`)
- `DATABASE_URL`: 로컬 DB 연결 문자열
- `NODE_ENV`: 실행 환경 (`development`, `production`)

### 11.2 실행 가이드 (예시)
1. 프로젝트 루트에 `.env.local` 파일 생성
2. 위 환경 변수를 입력
3. 의존성 설치: `npm install`
4. 개발 서버 실행: `npm run dev`

---

## 12) 변경 공지 및 규칙 준수 체크
- 문서 변경 내역을 팀 채널에 공지합니다.
- 프론트/백엔드 담당자는 **Base URL, 인증 헤더, 공통 응답, 페이징, 정렬, 날짜 포맷, 상태 코드**를 동일 규칙으로 적용했는지 확인합니다.

---

## 13) 비고
- 본 문서는 MVP 개발을 위한 기준 문서이며, 변경 시 팀 합의와 공지를 거칩니다.
- 초기에는 샘플 데이터 기반 응답을 허용합니다.
