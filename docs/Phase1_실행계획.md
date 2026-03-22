# Phase 1 실행계획: MVP 완성 및 데이터 파이프라인 구축

> 작성일: 2026-03-22 (v2 - 리스크 보완)
> 목표 기간: 0~3개월 (10주)
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
| **빌드 안정성** | 일부 페이지 프로덕션 빌드 실패 가능성 | **P0 - 최우선** |
| **혜택 데이터** | 하드코딩 10개 (seed.ts) | **P0 - 최우선** |
| 소셜 로그인 | 이메일/비번만 있음 | P1 |
| 알림 발송 | DB 스키마만 존재, 실제 발송 없음 | P1 |
| 컴포넌트 아키텍처 | 72% (Navigation, Footer 미구현) | P2 |
| 외부 캘린더 동기화 | 자체 캘린더 뷰만 존재 | P2 |
| 에러 모니터링 | 없음 | P2 |

---

## 실행 단계

### Step 0: 빌드 안정화 + API 키 동시 신청 (Day 1~3) - P0

**빌드가 깨진 상태에서는 아무것도 검증할 수 없다. Step 0이 먼저.**

#### 0-1. 빌드 에러 수정 (Day 1)

- [ ] `next build` 프로덕션 빌드 전체 통과 확인
- [ ] TypeScript strict 모드 에러 해결
- [ ] 미사용 import/변수 정리
- [ ] `turbo build` 모노레포 전체 빌드 통과

#### 0-2. API 키 신청 (Day 1~2, 빌드 수정과 병행)

승인 대기 시간이 있으므로 첫날에 전부 신청. 빌드 수정과 병행 가능.

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

> **중요:** 공공데이터포털 개발계정은 일 1,000건 호출 제한이므로,
> 초기 전량 수집을 위해 **운영계정 상향 신청도 함께 진행** (활용사례 등록 후 일 100,000건)

#### 0-3. 프론트-백엔드 연동 기반 확인 (Day 2~3)

데이터가 들어오면 바로 프론트에서 볼 수 있어야 하므로 연동 기반을 미리 확인.

- [ ] 환경변수로 API URL 설정 (`NEXT_PUBLIC_API_URL`)
- [ ] 프론트엔드 ↔ 백엔드 통신 테스트 (현재 seed 데이터 10개로)
- [ ] 에러 핸들링 기본 동작 확인 (401, 404, 네트워크 에러)

---

### Step 1: 데이터 파이프라인 구축 (Week 1~3) - P0

**가장 급선무.** 실제 혜택 데이터 없이는 아무것도 의미 없음.

#### 1-1. Prisma 스키마 확장

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

#### 1-2. 크롤러 모듈 구현

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

**초기 전량 수집 전략 (API 호출 제한 대응):**

| 계정 등급 | 일일 한도 | 기업마당 15,000개 수집 소요 |
|----------|----------|--------------------------|
| 개발계정 | 1,000건/일 | **15일** (비현실적) |
| 운영계정 | 100,000건/일 | **1일** |

- 운영계정 상향이 안 되면: 기업마당 직접 API(bizinfo.go.kr)는 별도 호출 제한이므로 data.go.kr과 분리하여 병행 수집
- **Plan B:** 기업마당 API가 가장 빠르게 승인되므로, 기업마당 먼저 수집 시작 → 나머지 소스 승인 대기 중 순차 추가

**스케줄링 (운영 안정화 후):**
- 사업공고 (마감일 있는 데이터): 매일 새벽 2시
- 복지서비스 목록: 주 1회 (일요일 새벽)
- API 호출 간격: 500ms (과부하 방지)

**데이터 정규화 규칙:**

주요 엣지 케이스 대응 포함:

| 항목 | 규칙 | 엣지 케이스 |
|------|------|-----------|
| 날짜 | ISO 8601 | `2026.03.22`, `2026-03-22`, `20260322`, `~03.31` 등 혼재 |
| 지역 | 표준화 | "서울특별시" → "서울", "경기도 수원시" → "경기" |
| 카테고리 | 6종 통일 | 소스별 분류 체계 다름 → 매핑 테이블 필요 |
| 중복 | upsert | externalId + source 복합키 |
| 금액 | 문자열 유지 | "월 최대 20만원", "연 300만원", "실비" 등 파싱 불가 |

**카테고리 매핑 테이블:**

```
일자리: 취업, 채용, 일자리, 고용, 인턴
주거:   주거, 임대, 전세, 월세, 주택
교육:   교육, 훈련, 자격증, 학비, 장학
금융:   금융, 대출, 보증, 이자, 신용
복지:   복지, 의료, 건강, 돌봄, 상담
창업:   창업, 사업, 스타트업, 소상공인, 자영업
```

#### 1-3. 크롤러 에러 핸들링 및 모니터링

크롤러가 조용히 실패하는 것을 방지:

- [ ] 각 프로바이더별 재시도 로직 (3회, exponential backoff)
- [ ] 동기화 결과 로그 기록 (upserted, skipped, failed 건수)
- [ ] 동기화 실패 시 Slack/Discord 웹훅 알림 (또는 이메일)
- [ ] 최근 동기화 상태 확인 API (`GET /admin/crawler/status`)
- [ ] 수동 동기화 트리거 API (`POST /admin/crawler/sync`)

#### 1-4. 데이터 품질 검증

초기 수집 후 검증 항목:

- [ ] 수집된 혜택 수 500개 이상 확인
- [ ] 제목/기관/마감일 등 필수 필드 누락률 5% 미만
- [ ] 마감일 지난 혜택 자동 필터링 확인
- [ ] 지역/카테고리 분포 확인 (특정 카테고리 편중 없는지)
- [ ] 중복 데이터 없음 확인
- [ ] 프론트엔드에서 실제 데이터 표시 확인 (빌드 후 수동 검증)

#### 1-5. 크롤러 테스트

- [ ] 각 프로바이더별 유닛 테스트 (API 응답 mock)
- [ ] 정규화 로직 테스트 (날짜 파싱, 지역 매핑, 카테고리 매핑)
- [ ] CrawlerService 통합 테스트 (DB upsert 동작)
- [ ] 스케줄러 동작 테스트

---

### Step 2: 인증 및 핵심 UI 완성 (Week 3~5) - P1

#### 2-1. 소셜 로그인 추가

**아키텍처 결정: NestJS Passport OAuth 방식 (NextAuth 아님)**

현재 NestJS에 JWT 인증이 이미 구현되어 있으므로, **NestJS Passport에 OAuth 전략을 추가**하는 것이 기존 아키텍처와 일관성을 유지한다. NextAuth를 쓰면 인증 경로가 이원화되어 복잡해짐.

```
인증 흐름:
1. 프론트: 카카오 로그인 버튼 클릭
2. 프론트: /api/v1/auth/kakao로 리다이렉트
3. NestJS: Passport 카카오 전략으로 OAuth 처리
4. NestJS: 카카오 프로필로 User 조회/생성
5. NestJS: JWT 토큰 발급 (기존 방식과 동일)
6. 프론트: JWT 토큰으로 인증 상태 관리
```

**구현 범위:**
- [ ] `passport-kakao`, `passport-naver` 전략 추가
- [ ] User 모델에 `provider`, `providerId` 필드 추가
- [ ] 소셜 로그인 사용자 자동 생성 로직
- [ ] 기존 이메일 로그인과 계정 병합 (같은 이메일이면 연결)
- [ ] 프론트엔드 로그인 페이지에 소셜 버튼 추가
- [ ] 토큰 저장 (httpOnly cookie 또는 localStorage)

**의존성:**
```bash
# apps/api
pnpm add @nestjs/passport passport passport-kakao passport-naver
```

#### 2-2. 레이아웃 컴포넌트 완성

컴포넌트 아키텍처 72% → 90% 목표:

- [ ] `Navigation` 컴포넌트 (반응형, 모바일 햄버거 메뉴)
- [ ] `Footer` 컴포넌트
- [ ] `AuthGuard` (로그인 필요 페이지 보호)
- [ ] 로딩/에러/빈 상태 공통 컴포넌트

---

### Step 3: 알림 시스템 구현 (Week 5~6) - P1

**핵심 차별점인 "마감일 D-7 알림"을 실제로 동작하게 만드는 단계.**

#### 3-1. 알림 스케줄러

```
apps/api/src/modules/notification/
  notification.scheduler.ts  # 매일 아침 8시 실행
  notification.sender.ts     # 이메일 발송
  templates/
    deadline-reminder.hbs    # 마감일 알림 이메일 템플릿
    new-benefit.hbs          # 신규 혜택 알림 템플릿
```

**동작 로직:**
1. 매일 아침 8시, 알림 활성화된 사용자 조회
2. 각 사용자의 `notificationLeadDays` 설정에 따라 마감일 임박 혜택 필터링
3. 이메일 발송 (Resend API - 월 3,000건 무료)

#### 3-2. 이메일 발송

**의존성:** Resend API 선택 (Nodemailer + SMTP보다 설정 간단, 무료 티어 충분)

```bash
pnpm add resend
```

- [ ] 이메일 발송 모듈 구현
- [ ] 마감일 알림 템플릿 작성
- [ ] 신규 혜택 알림 템플릿 작성
- [ ] 발송 로그 기록 (발송 성공/실패, 대상 사용자, 대상 혜택)
- [ ] 발송 실패 시 재시도 (최대 3회)

#### 3-3. 알림 시스템 테스트

- [ ] 스케줄러 동작 테스트
- [ ] 이메일 발송 테스트 (Resend 테스트 모드)
- [ ] 마감일 필터링 로직 테스트

---

### Step 4: 프론트엔드 폴리시 + SEO (Week 6~8) - P2

#### 4-1. 캘린더 기능 강화

- [ ] `MonthSelector` 컴포넌트 통합
- [ ] 혜택 마감일을 캘린더에 마커 표시
- [ ] 날짜 클릭 시 해당일 혜택 목록 표시
- [ ] Google Calendar 내보내기 (ICS 파일 생성)

#### 4-2. 검색/필터 UX 개선

- [ ] 검색 디바운스 (300ms)
- [ ] 페이지네이션 UX
- [ ] 필터 조합 시 URL 쿼리 파라미터 동기화
- [ ] 빈 검색 결과 안내 메시지

#### 4-3. SEO 기술 준비

배포 후 사용자 확보에 SEO가 포함되어 있으므로, 기술적 SEO 기반을 미리 마련:

- [ ] 메타 태그 (title, description) 페이지별 설정
- [ ] OG 태그 (Open Graph) - SNS 공유 시 미리보기
- [ ] `sitemap.xml` 자동 생성 (next-sitemap)
- [ ] `robots.txt` 설정
- [ ] 시맨틱 HTML (heading 계층, aria-label 등)

---

### Step 5: 배포 및 초기 사용자 확보 (Week 8~10) - P2

#### 5-1. 배포

```
프론트엔드: Vercel (Next.js 최적)
백엔드: Railway (NestJS + PostgreSQL)
도메인: benefitcal.kr 또는 유사 도메인 확보
```

- [ ] Vercel 프로젝트 설정
- [ ] Railway에 NestJS + PostgreSQL 배포
- [ ] 환경변수 설정 (API 키, DB URL, JWT 시크릿)
- [ ] CORS 설정
- [ ] SSL 인증서 확인

**예상 인프라 비용:**

| 서비스 | 플랜 | 월 비용 |
|--------|------|--------|
| Vercel | Hobby (무료) | $0 |
| Railway | Starter ($5 credit) | ~$5~15 |
| PostgreSQL (Railway) | 포함 | 위에 포함 |
| Resend | 무료 (3,000건/월) | $0 |
| 도메인 (.kr) | 연간 | ~2만원/년 |
| **합계** | | **월 $5~15 (약 7,000~20,000원)** |

#### 5-2. 에러 모니터링

프로덕션에서 장님이 되지 않기 위한 최소한의 모니터링:

- [ ] Sentry 연동 (프론트엔드 + 백엔드, 무료 티어 5,000 이벤트/월)
- [ ] 크롤러 동기화 상태 대시보드 (간단한 관리자 페이지)
- [ ] Vercel Analytics 활성화 (무료)

#### 5-3. 초기 사용자 확보 전략

| 채널 | 방법 | 목표 |
|------|------|------|
| 에브리타임 | 대학생 커뮤니티 게시글 | 200명 |
| 블라인드 | 직장인 커뮤니티 | 200명 |
| 청년 커뮤니티 | 청년허브, 청년정책 관련 카페 | 300명 |
| 자영업자 커뮤니티 | 소상공인 카페, 창업 커뮤니티 | 200명 |
| SEO | 블로그 포스트 (정부 혜택 정리 글) | 100명 |

#### 5-4. 사용자 피드백 수집

- [ ] 서비스 내 피드백 폼 (간단한 텍스트 입력)
- [ ] Google Forms 연동 (상세 설문)
- [ ] 얼리 어답터 카카오톡 오픈채팅방 운영
- [ ] 피드백 기반 Phase 2 우선순위 조정

---

## 기술 결정 사항

### 의존성 추가 목록

```bash
# 백엔드 (apps/api)
pnpm add @nestjs/schedule          # cron 스케줄러
pnpm add @nestjs/passport passport # 인증 프레임워크
pnpm add passport-kakao            # 카카오 로그인
pnpm add passport-naver            # 네이버 로그인
pnpm add resend                    # 이메일 발송
pnpm add axios                     # 외부 API 호출
pnpm add p-limit                   # 동시 요청 제한
pnpm add @sentry/nestjs            # 에러 모니터링

# 프론트엔드 (apps/web)
pnpm add ical-generator            # ICS 캘린더 파일 생성
pnpm add next-sitemap              # SEO sitemap 생성
pnpm add @sentry/nextjs            # 에러 모니터링
```

### 환경변수 추가 목록

```bash
# apps/api/.env
DATA_GO_KR_SERVICE_KEY=            # 공공데이터포털 서비스키
BIZINFO_API_KEY=                   # 기업마당 API 키
YOUTHCENTER_API_KEY=               # 온통청년 API 키
SMES_API_KEY=                      # 중소벤처24 API 키

RESEND_API_KEY=                    # 이메일 발송 (Resend)

KAKAO_CLIENT_ID=                   # 카카오 로그인
KAKAO_CLIENT_SECRET=
NAVER_CLIENT_ID=                   # 네이버 로그인
NAVER_CLIENT_SECRET=

SENTRY_DSN=                        # 에러 모니터링

# apps/web/.env.local
NEXT_PUBLIC_API_URL=               # NestJS 백엔드 URL
NEXT_PUBLIC_SENTRY_DSN=            # 프론트엔드 에러 모니터링
```

---

## 타임라인

```
Day 1-3:   [Step 0] 빌드 안정화 + API 키 신청 + 프론트-백엔드 연동 확인
Week 1-2:  [Step 1] 스키마 확장 + 크롤러 기본 구현 (기업마당 먼저)
Week 2-3:  [Step 1] 크롤러 완성 + 데이터 500개 확보 + 품질 검증 + 테스트
Week 3-4:  [Step 2] 소셜 로그인 (카카오/네이버) + 레이아웃 컴포넌트
Week 5-6:  [Step 3] 알림 스케줄러 + 이메일 발송
Week 6-8:  [Step 4] 캘린더 강화 + 검색 UX + SEO 기반
Week 8-10: [Step 5] 배포 + 모니터링 + 초기 사용자 확보 시작
```

---

## 리스크 및 대응

| 리스크 | 확률 | 영향 | 대응 |
|--------|------|------|------|
| 온통청년 API 승인 지연 (2주+) | 중 | 중 | 기업마당 + 공공데이터포털 먼저 진행, 온통청년은 후순위 |
| 데이터 정규화 엣지 케이스 폭발 | 높음 | 중 | 파싱 실패 건은 skip 후 로그 기록, 점진적 개선 |
| 공공데이터포털 운영계정 상향 거절 | 낮음 | 높음 | 기업마당 직접 API 활용 (별도 호출 제한), 분할 수집 |
| 카카오 OAuth 심사 지연 | 낮음 | 중 | 이메일 로그인만으로 먼저 배포, 소셜 로그인은 후속 |
| Railway 무료 크레딧 소진 | 중 | 낮음 | $5 Starter 플랜, 월 $15 이내 유지 |

---

## 성공 기준 (Phase 1 완료 조건)

- [ ] `turbo build` 에러 0건
- [ ] 실제 정부 혜택 데이터 **500개 이상** DB에 적재
- [ ] 매일 자동 데이터 동기화 동작 확인
- [ ] 카카오/네이버 소셜 로그인 동작
- [ ] 마감일 D-7 이메일 알림 실제 발송
- [ ] Vercel + Railway 배포 완료
- [ ] Sentry 에러 모니터링 동작
- [ ] 크롤러 테스트 커버리지 80% 이상
- [ ] 얼리 어답터 회원가입 **100명 이상** (1,000명은 3개월 목표)
- [ ] Lighthouse 성능 점수 80 이상

---

## 참고 문서

- [경쟁사 분석](./경쟁사_분석.md)
- [수익화 모델 분석](./수익화_모델_분석.md)
- [API 명세서 초안](./API_명세서_초안.md)
- [DB 스키마 초안](./DB_스키마_초안.md)
