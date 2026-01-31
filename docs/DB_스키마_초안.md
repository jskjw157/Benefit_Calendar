# 혜택 캘린더 (BenefitCal) MVP DB 스키마 초안

> 목적: 백엔드 스키마/마이그레이션 착수를 위한 최소 테이블 설계 초안.

## 1) 공통
- 모든 `id`는 문자열(예: `u_001`, `b_001`)을 사용하며, 실제 구현 시 UUID 또는 숫자 PK로 치환 가능합니다.
- 날짜/시간은 ISO 8601을 기준으로 저장합니다.

## 2) 테이블 정의

### 2.1 users
| 컬럼 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| id | varchar | PK | 사용자 ID |
| email | varchar | UNIQUE, NOT NULL | 이메일 |
| age | int | NOT NULL | 나이 |
| region | varchar | NOT NULL | 지역 |
| employment_status | enum | NOT NULL | `JOB_SEEKER` \| `EMPLOYED` \| `STUDENT` \| `SELF_EMPLOYED` |
| is_self_employed | boolean | NOT NULL | 자영업 여부 |
| notification_channel | enum | NOT NULL | `EMAIL` \| `SMS` \| `PUSH` |
| created_at | timestamp | NOT NULL | 생성일 |
| updated_at | timestamp | NOT NULL | 수정일 |

### 2.2 benefits
| 컬럼 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| id | varchar | PK | 혜택 ID |
| title | varchar | NOT NULL | 혜택명 |
| agency | varchar | NOT NULL | 기관명 |
| category | varchar | NOT NULL | 카테고리 |
| region | varchar | NOT NULL | 지역 |
| amount | varchar | NOT NULL | 지원 금액/표현 |
| apply_start_date | date | NOT NULL | 신청 시작일 |
| apply_end_date | date | NOT NULL | 신청 종료일 |
| deadline | date | NOT NULL | 마감일 |
| application_link | varchar | NOT NULL | 신청 링크 |
| requirements | json | NOT NULL | 자격 요건 배열 |
| documents | json | NOT NULL | 제출 서류 배열 |
| created_at | timestamp | NOT NULL | 생성일 |
| updated_at | timestamp | NOT NULL | 수정일 |

> `status(OPEN/CLOSED)`는 `deadline` 기준 파생 필드로 계산하며, DB 컬럼으로 저장하지 않습니다.

### 2.3 user_benefits
| 컬럼 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| user_id | varchar | PK(FK) | 사용자 ID |
| benefit_id | varchar | PK(FK) | 혜택 ID |
| status | enum | NOT NULL | `BOOKMARKED` \| `PREPARING` \| `APPLIED` \| `RECEIVED` |
| created_at | timestamp | NOT NULL | 생성일 |
| updated_at | timestamp | NOT NULL | 수정일 |

## 3) 인덱스 제안
- `benefits(deadline)` 정렬/필터링용
- `benefits(region, category)` 필터링용
- `user_benefits(user_id, status)` 내 혜택 조회용
