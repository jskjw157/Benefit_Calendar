# 혜택 캘린더 (BenefitCal) MVP API 명세서 초안

> 목적: MVP 프론트/백엔드 개발을 위한 최소 API 계약 문서.

## 1) 공통 규칙

### 1.1 Base URL
- `/api/v1`

### 1.2 인증
- MVP 범위에서는 **로그인 이후 토큰(JWT) 기반**을 전제로 하되, 초기 개발 단계에서는 `Authorization: Bearer <token>`을 사용하는 것으로 정의합니다.
- 인증이 필요한 엔드포인트는 표기합니다.

### 1.3 공통 응답 포맷

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

### 1.4 페이징
- `page`, `pageSize` 사용
- 기본값: `page=1`, `pageSize=20`

### 1.5 정렬
- `sort` 파라미터 형식: `field:direction`
- 예: `sort=deadline:asc`

### 1.6 날짜 포맷
- ISO 8601 (예: `2025-01-31`)

---

## 2) 데이터 모델 (요약)

### 2.1 User
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
  "documents": ["주민등록등본", "임대차계약서"]
}
```

### 2.3 UserBenefit
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
    "documents": ["주민등록등본", "임대차계약서"]
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

## 9) 상태/코드 표준

### 9.1 UserBenefit 상태
- `BOOKMARKED`
- `PREPARING`
- `APPLIED`
- `RECEIVED`

### 9.2 신청 가능 상태
- `OPEN`
- `CLOSED`

### 9.3 employmentStatus
- `JOB_SEEKER`
- `EMPLOYED`
- `STUDENT`
- `SELF_EMPLOYED`

---

## 10) 비고
- 본 문서는 MVP 개발을 위한 초안이며, 실제 구현 시 변경될 수 있습니다.
- 초기에는 샘플 데이터 기반 응답을 허용합니다.
