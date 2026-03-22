# Phase 1 실행계획: MVP 완성 및 데이터 파이프라인 구축

> 작성일: 2026-03-22
> 목표 기간: 0~3개월
> 목표: 실제 혜택 데이터 500개+ 확보, 핵심 기능 완성, 얼리 어답터 1,000명

---

## 현재 상태 요약

### 완성된 것

| 영역 | 상태 | 상세 |
|------|------|------|
| 백엔드 API | 90% | Auth, Benefit, UserBenefit, Dashboard, Notification 모듈 구현 |
| DB 스키마 | 완성 | User, Benefit, UserBenefit 테이블 + 인덱스 |
| 프론트엔드 페이지 | 85% | 홈, 혜택목록, 상세, 캘린더, 내혜택, 디자인랩 |
| 서비스 레이어 | 완성 | benefit, user-benefit, user 서비스 + 커스텀 훅 3개 |
| 타입 시스템 | 97% | shared-types 패키지, 상수, 라우트 정의 |
| 테스트 | 85% | 백엔드 유닛 20개, 프론트엔드 API/서비스/컴포넌트 테스트 |
| 디자인 | Awwwards 8.7/10 | Three.js, Framer Motion, Glass morphism |

### 미완성 / 부족한 것

| 영역 | 문제 | 우선순위 |
|------|------|---------|
| **혜택 데이터** | 하드코딩 10개 (seed.ts) | **P0 - 최우선** |
| 소셜 로그인 | 이메일/비번만 있음 | P1 |
| 알림 발송 | DB 스키마만 존재, 실제 발송 없음 | P1 |
| 컴포넌트 아키텍처 | 72% (Navigation, Footer 미구현) | P2 |
| 외부 캘린더 동기화 | 자체 캘린더 뷰만 존재 | P2 |
| 빌드 에러 | 일부 페이지 프로덕션 빌드 실패 가능성 | P1 |

---

## 실행 단계

### Step 1: 데이터 파이프라인 구축 (1~3주) - P0

**가장 급선무.** 실제 혜택 데이터 없이는 아무것도 의미 없음.

#### 1-1. API 키 신청 (Day 1~2)

동시에 모두 신청해야 한다. 승인까지 시간이 걸리므로 첫날에 전부 처리.

| 소스 | 신청처 | 인증 방식 | 승인 소요 |
|------|--------|----------|----------|
| **공공데이터포털** | https://data.go.kr 회원가입 | 서비스키 | 즉시~1일 |
| **기업마당** (bizinfo.go.kr) | https://www.bizinfo.go.kr/web/lay1/program/S1T175C174/apiList.do | API 인증키 | 즉시 |
| **온통청년** (youthcenter.go.kr) | https://www.youthcenter.go.kr/myPage/openapi | 담당자 수동 승인 | 1~5일 |
| **중소벤처24** (smes.go.kr) | 이메일 신청 (044-300-0990) | 이메일 발급 | 3~7일 |

**공공데이터포털 활용 신청 대상:**
- `15113968` - 행정안전부 대한민국 공공서비스(혜택) 정보 (보조금24 연동)
- `15090532` - 한국사회보장정보원 중앙부처복지서비스
- `15108347` - 한국사회보장정보원 지자체복지서비스

#### 1-2. Prisma 스키마 확장

현재 `Benefit` 모델에 외부 데이터 소스 추적 필드 추가:

```prisma
model Benefit {
  // 기존 필드 유지
  id              String   @id @default(uuid())
  title           String   @db.VarChar(200)
  agency          String   @db.VarChar(100)
  category        String   @db.VarChar(50)
  region          String   @db.VarChar(50)
  amount          String   @db.VarChar(100)
  applyStartDate  DateTime @map("apply_start_date") @db.Date
  applyEndDate    DateTime @map("apply_end_date") @db.Date
  deadline        DateTime @db.Date
  applicationLink String   @map("application_link") @db.VarChar(500)
  requirements    Json     @default("[]")
  documents       Json     @default("[]")

  // 신규 추가 필드
  externalId      String?  @map("external_id")
  source          String?  @db.VarChar(20)  // BIZINFO | YOUTHCENTER | BOKJIRO | SMES | GOV24
  description     String?  @db.Text
  targetAge       String?  @map("target_age") @db.VarChar(100)
  employmentType  String?  @map("employment_type") @db.VarChar(100)

  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  userBenefits UserBenefit[]

  @@unique([externalId, source])  // 중복 방지 복합 유니크
  @@index([deadline])
  @@index([region, category])
  @@index([source])
  @@map("benefits")
}
```

#### 1-3. 크롤러 모듈 구현

NestJS 모듈 구조:

```
apps/api/src/modules/crawler/
  crawler.module.ts          # NestJS 모듈 정의
  crawler.service.ts         # 동기화 오케스트레이션
  crawler.scheduler.ts       # @nestjs/schedule 기반 cron
  crawler.controller.ts      # 수동 트리거 API (관리자용)
  providers/
    base.provider.ts         # 공통 인터페이스 + 유틸리티
    bizinfo.provider.ts      # 기업마당 API
    youthcenter.provider.ts  # 온통청년 API
    data-go-kr.provider.ts   # 공공데이터포털 (보조금24/복지서비스)
  types/
    normalized-benefit.ts    # 정규화된 혜택 타입
```

**핵심 API 엔드포인트:**

| 소스 | 엔드포인트 | 데이터 규모 |
|------|-----------|-----------|
| 기업마당 | `GET https://www.bizinfo.go.kr/uss/rss/bizinfoApi.do?crtfcKey={key}&dataType=json` | 15,000개+ |
| 온통청년 | `GET https://www.youthcenter.go.kr/go/ythip/getPlcy?apiKeyNm={key}&rtnType=json` | 3,000개+ |
| 공공데이터포털 | `GET http://apis.data.go.kr/B554287/NationalBasisInfoService/wlfareInfoListInqire?serviceKey={key}&_type=json` | 수천 개 |

**스케줄링:**
- 사업공고 (마감일 있는 데이터): 매일 새벽 2시
- 복지서비스 목록: 주 1회 (일요일 새벽)
- API 호출 간격: 500ms (과부하 방지)
- 일일 호출 제한: 개발계정 1,000건, 운영계정 100,000건

**데이터 정규화 규칙:**
- 모든 날짜 → ISO 8601 형식
- 지역명 → 표준화 (예: "서울특별시" → "서울")
- 카테고리 → 통일 (일자리/주거/교육/금융/복지/창업)
- 중복 → externalId + source 복합키로 upsert

#### 1-4. 데이터 품질 검증

초기 수집 후 검증 항목:

- [ ] 수집된 혜택 수 500개 이상 확인
- [ ] 제목/기관/마감일 등 필수 필드 누락률 5% 미만
- [ ] 마감일 지난 혜택 자동 필터링 확인
- [ ] 지역/카테고리 분포 확인 (특정 카테고리 편중 없는지)
- [ ] 중복 데이터 없음 확인

---

### Step 2: 빌드 안정화 및 핵심 기능 완성 (2~4주) - P1

#### 2-1. 빌드 에러 수정

- [ ] `next build` 프로덕션 빌드 전체 통과 확인
- [ ] TypeScript strict 모드 에러 해결
- [ ] 미사용 import/변수 정리

#### 2-2. 소셜 로그인 추가

카카오 로그인 우선 (한국 시장 점유율 1위):

```
의존성: next-auth (또는 직접 OAuth 구현)
  - 카카오 로그인 (developers.kakao.com)
  - 네이버 로그인 (developers.naver.com)
  - 구글 로그인 (선택)
```

**구현 범위:**
- [ ] NextAuth.js (또는 Passport.js) 설정
- [ ] 카카오 OAuth 콜백 처리
- [ ] JWT 토큰에 소셜 로그인 정보 포함
- [ ] 기존 이메일 로그인과 병합 로직
- [ ] 프론트엔드 로그인 페이지에 소셜 버튼 추가

#### 2-3. 레이아웃 컴포넌트 완성

현재 컴포넌트 아키텍처 72% → 90% 목표:

- [ ] `Navigation` 컴포넌트 (반응형, 모바일 햄버거 메뉴)
- [ ] `Footer` 컴포넌트
- [ ] `AuthGuard` (로그인 필요 페이지 보호)
- [ ] 로딩/에러/빈 상태 공통 컴포넌트

---

### Step 3: 알림 시스템 구현 (3~5주) - P1

**핵심 차별점인 "마감일 D-7 알림"을 실제로 동작하게 만드는 단계.**

#### 3-1. 알림 스케줄러

```
apps/api/src/modules/notification/
  notification.scheduler.ts  # 매일 아침 8시 실행
  notification.sender.ts     # 이메일/푸시 발송
  templates/
    deadline-reminder.hbs    # 마감일 알림 이메일 템플릿
    new-benefit.hbs          # 신규 혜택 알림 템플릿
```

**동작 로직:**
1. 매일 아침 8시, 알림 활성화된 사용자 조회
2. 각 사용자의 `notificationLeadDays` 설정에 따라 마감일 임박 혜택 필터링
3. 이메일 발송 (Resend 또는 Nodemailer + SMTP)

#### 3-2. 이메일 발송

```
의존성: @nestjs-modules/mailer + nodemailer (또는 Resend API)
  - Resend: 월 3,000건 무료 (초기에 충분)
  - 또는 Gmail SMTP (개발/테스트용)
```

- [ ] 이메일 발송 모듈 구현
- [ ] 마감일 알림 템플릿 작성
- [ ] 신규 혜택 알림 템플릿 작성
- [ ] 발송 로그 기록

#### 3-3. 웹 푸시 알림 (선택)

- [ ] Service Worker 등록
- [ ] Push API 구독
- [ ] 푸시 알림 발송 (web-push 패키지)

---

### Step 4: 프론트엔드 통합 및 폴리시 (4~6주) - P2

#### 4-1. 실제 API 연동

현재 프론트엔드 서비스 레이어가 `/api/v1/` Next.js API 라우트를 호출하고, 이것이 NestJS 백엔드를 프록시하는 구조.

- [ ] 환경변수로 API URL 설정 (`NEXT_PUBLIC_API_URL`)
- [ ] 프론트엔드 ↔ 백엔드 실제 통신 테스트
- [ ] 에러 핸들링 통합 (네트워크 에러, 401, 404 등)
- [ ] 로딩 상태 UX 개선

#### 4-2. 캘린더 기능 강화

- [ ] `MonthSelector` 컴포넌트 통합
- [ ] 혜택 마감일을 캘린더에 마커 표시
- [ ] 날짜 클릭 시 해당일 혜택 목록 표시
- [ ] Google Calendar 내보내기 (ICS 파일 생성)

#### 4-3. 검색/필터 UX 개선

- [ ] 검색 디바운스 (300ms)
- [ ] 페이지네이션 UX
- [ ] 필터 조합 시 URL 쿼리 파라미터 동기화
- [ ] 빈 검색 결과 안내 메시지

---

### Step 5: 배포 및 초기 사용자 확보 (6~8주) - P2

#### 5-1. 배포

```
프론트엔드: Vercel (Next.js 최적)
백엔드: Railway 또는 Render (NestJS + PostgreSQL)
도메인: benefitcal.kr 또는 유사 도메인 확보
```

- [ ] Vercel 프로젝트 설정
- [ ] Railway/Render에 NestJS + PostgreSQL 배포
- [ ] 환경변수 설정 (API 키, DB URL, JWT 시크릿)
- [ ] CORS 설정
- [ ] SSL 인증서 확인

#### 5-2. 초기 사용자 확보 전략

| 채널 | 방법 | 목표 |
|------|------|------|
| 에브리타임 | 대학생 커뮤니티 게시글 | 200명 |
| 블라인드 | 직장인 커뮤니티 | 200명 |
| 청년 커뮤니티 | 청년허브, 청년정책 관련 카페 | 300명 |
| 자영업자 커뮤니티 | 소상공인 카페, 창업 커뮤니티 | 200명 |
| SEO | 블로그 포스트 (정부 혜택 정리 글) | 100명 |

---

## 기술 결정 사항

### 의존성 추가 목록

```bash
# 백엔드 (apps/api)
pnpm add @nestjs/schedule          # cron 스케줄러
pnpm add @nestjs-modules/mailer    # 이메일 발송
pnpm add nodemailer                # SMTP 클라이언트
pnpm add axios                     # 외부 API 호출
pnpm add p-limit                   # 동시 요청 제한
pnpm add handlebars                # 이메일 템플릿

# 프론트엔드 (apps/web)
pnpm add next-auth                 # 소셜 로그인
pnpm add ical-generator            # ICS 캘린더 파일 생성
```

### 환경변수 추가 목록

```bash
# apps/api/.env
DATA_GO_KR_SERVICE_KEY=            # 공공데이터포털 서비스키
BIZINFO_API_KEY=                   # 기업마당 API 키
YOUTHCENTER_API_KEY=               # 온통청년 API 키
SMES_API_KEY=                      # 중소벤처24 API 키

SMTP_HOST=smtp.gmail.com           # 이메일 SMTP (또는 Resend)
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

KAKAO_CLIENT_ID=                   # 카카오 로그인
KAKAO_CLIENT_SECRET=
NAVER_CLIENT_ID=                   # 네이버 로그인
NAVER_CLIENT_SECRET=
```

---

## 타임라인

```
Week 1-2:  [Step 1] API 키 신청 + 스키마 확장 + 크롤러 기본 구현
Week 2-3:  [Step 1] 크롤러 완성 + 데이터 500개 확보 + 품질 검증
Week 3-4:  [Step 2] 빌드 수정 + 소셜 로그인 + 레이아웃 컴포넌트
Week 4-5:  [Step 3] 알림 스케줄러 + 이메일 발송
Week 5-7:  [Step 4] 프론트엔드 통합 + 캘린더 강화 + 검색 UX
Week 7-8:  [Step 5] 배포 + 초기 사용자 확보 시작
```

---

## 성공 기준 (Phase 1 완료 조건)

- [ ] 실제 정부 혜택 데이터 **500개 이상** DB에 적재
- [ ] 매일 자동 데이터 동기화 동작 확인
- [ ] 카카오/네이버 소셜 로그인 동작
- [ ] 마감일 D-7 이메일 알림 실제 발송
- [ ] Vercel + Railway 배포 완료
- [ ] 얼리 어답터 회원가입 **100명 이상** (1,000명은 3개월 목표)
- [ ] `next build` 에러 0건
- [ ] Lighthouse 성능 점수 80 이상

---

## 참고 문서

- [경쟁사 분석](./경쟁사_분석.md)
- [수익화 모델 분석](./수익화_모델_분석.md)
- [API 명세서 초안](./API_명세서_초안.md)
- [DB 스키마 초안](./DB_스키마_초안.md)
