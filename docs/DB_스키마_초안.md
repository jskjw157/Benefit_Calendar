# 혜택 캘린더 (BenefitCal) MVP DB 스키마 초안

> 목적: 백엔드 스키마/마이그레이션 착수를 위한 최소 테이블 설계 초안.

## 1) 공통
- 모든 `id`는 UUID 형식 (`TEXT`, Prisma `@default(uuid())`)을 사용합니다.
- 날짜/시간은 ISO 8601을 기준으로 저장합니다.
- ORM: Prisma 6.19 (스키마 위치: `apps/api/prisma/schema.prisma`)

## 2) 테이블 정의

### 2.1 users (12개 컬럼)
| 컬럼 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| id | TEXT (UUID) | PK | 사용자 ID |
| email | TEXT | UNIQUE, NOT NULL | 이메일 |
| password_hash | TEXT | NOT NULL | 비밀번호 해시 (bcrypt) |
| age | INT | NOT NULL | 나이 |
| region | VARCHAR(50) | NOT NULL | 지역 |
| employment_status | EmploymentStatus | NOT NULL | `JOB_SEEKER` \| `EMPLOYED` \| `STUDENT` \| `SELF_EMPLOYED` |
| is_self_employed | BOOLEAN | NOT NULL, DEFAULT false | 자영업 여부 |
| notification_channel | NotificationChannel | NOT NULL, DEFAULT 'EMAIL' | `EMAIL` \| `SMS` \| `PUSH` |
| notification_enabled | BOOLEAN | NOT NULL, DEFAULT true | 알림 수신 여부 |
| notification_lead_days | INT | NOT NULL, DEFAULT 3 | 마감 N일 전 알림 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT now() | 생성일 |
| updated_at | TIMESTAMP | NOT NULL | 수정일 (자동 갱신) |

### 2.2 benefits (14개 컬럼)
| 컬럼 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| id | TEXT (UUID) | PK | 혜택 ID |
| title | VARCHAR(200) | NOT NULL | 혜택명 |
| agency | VARCHAR(100) | NOT NULL | 기관명 |
| category | VARCHAR(50) | NOT NULL | 카테고리 |
| region | VARCHAR(50) | NOT NULL | 지역 |
| amount | VARCHAR(100) | NOT NULL | 지원 금액/표현 |
| apply_start_date | DATE | NOT NULL | 신청 시작일 |
| apply_end_date | DATE | NOT NULL | 신청 종료일 |
| deadline | DATE | NOT NULL | 마감일 |
| application_link | VARCHAR(500) | NOT NULL | 신청 링크 |
| requirements | JSONB | NOT NULL, DEFAULT '[]' | 자격 요건 배열 |
| documents | JSONB | NOT NULL, DEFAULT '[]' | 제출 서류 배열 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT now() | 생성일 |
| updated_at | TIMESTAMP | NOT NULL | 수정일 (자동 갱신) |

> `status(OPEN/CLOSED)`는 `deadline` 기준 파생 필드로 계산하며, DB 컬럼으로 저장하지 않습니다.

### 2.3 user_benefits (5개 컬럼)
| 컬럼 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| user_id | TEXT (UUID) | PK, FK → users.id (CASCADE) | 사용자 ID |
| benefit_id | TEXT (UUID) | PK, FK → benefits.id (CASCADE) | 혜택 ID |
| status | UserBenefitStatus | NOT NULL | `BOOKMARKED` \| `PREPARING` \| `APPLIED` \| `RECEIVED` |
| created_at | TIMESTAMP | NOT NULL, DEFAULT now() | 생성일 |
| updated_at | TIMESTAMP | NOT NULL | 수정일 (자동 갱신) |

## 3) Enum 정의

| Enum | 값 |
|------|-----|
| EmploymentStatus | `JOB_SEEKER`, `EMPLOYED`, `STUDENT`, `SELF_EMPLOYED` |
| NotificationChannel | `EMAIL`, `SMS`, `PUSH` |
| UserBenefitStatus | `BOOKMARKED`, `PREPARING`, `APPLIED`, `RECEIVED` |

## 4) 인덱스 (4개)
- `users(email)` UNIQUE
- `benefits(deadline)` 정렬/필터링용
- `benefits(region, category)` 복합 필터링용
- `user_benefits(user_id, status)` 내 혜택 조회용

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2025-01 | 초기 작성 |
| 2.0 | 2026-02-01 | id → UUID, password_hash/notification_enabled/notification_lead_days 3개 컬럼 추가, Enum 섹션 추가, 인덱스에 email unique 추가, 타입 상세화 (docs-sync PDCA) |
