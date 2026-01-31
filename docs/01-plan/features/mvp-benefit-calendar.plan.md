---
template: plan
version: 1.0
description: 혜택 캘린더 MVP 계획 문서
feature: mvp-benefit-calendar
date: 2026-01-31
author: BenefitCal Team
project: Benefit Calendar
status: In Progress
---

# 혜택 캘린더 MVP 계획 문서

> **Summary**: 청년 및 자영업자 대상 정부/지자체 혜택 발견 및 마감 관리 서비스 MVP 개발
>
> **Project**: Benefit Calendar (혜택 캘린더)
> **Version**: 0.1.0
> **Author**: BenefitCal Team
> **Date**: 2026-01-31
> **Status**: In Progress

---

## 1. Overview

### 1.1 Purpose

신규 사용자가 **3분 이내**에 본인에게 맞는 정부/지자체 혜택을 발견하고, 검색/필터/캘린더를 통해 **혜택 탐색**과 **마감 관리**를 효율적으로 수행할 수 있는 서비스를 제공합니다.

**핵심 가치:**
- 개인화된 혜택 추천 (나이, 지역, 직업 상태 기반)
- 마감일 관리 및 알림
- 신청 준비 흐름 지원 (북마크 → 준비중 → 신청완료 → 수령완료)

### 1.2 Background

**문제:**
- 정부/지자체 혜택 정보가 분산되어 있어 발견이 어려움
- 마감일 관리 부재로 신청 기회 놓침
- 본인에게 맞는 혜택인지 판단하기 어려움

**해결:**
- 통합된 혜택 정보 제공
- 캘린더 기반 마감일 시각화
- 프로필 기반 자동 필터링 및 추천

### 1.3 Related Documents

- 제품 요구사항: `docs/혜택캘린더_PRD_v1.0.docx`
- 기술 요구사항: `docs/혜택캘린더_TRD_v1.0.docx`
- 사용자 여정: `docs/혜택캘린더_UserJourney_v1.0.docx`
- 정보 구조: `docs/혜택캘린더_IA_v1.0.docx`
- API 명세: `docs/02-design/features/mvp-benefit-calendar.design.md` (예정)
- 작업 체크리스트: `docs/프론트_백엔드_작업_체크리스트.md`

---

## 2. Scope

### 2.1 In Scope (MVP 범위)

#### 핵심 사용자 여정
- [x] **온보딩/프로필 설정**: 나이, 지역, 직업 상태 입력 → 추천 혜택 제공
- [x] **혜택 발견/탐색**: 검색, 카테고리/지역 필터, 정렬
- [x] **혜택 상세 확인 및 신청 준비**: 상세 정보, 제출 서류, 외부 신청 링크
- [x] **알림/재방문**: 마감일 임박 알림 설정 (이메일/앱 알림 중 1개)

#### 필수 화면
- [x] **홈/대시보드**: 개인화 추천, 마감 임박, 신규 혜택, 통계 위젯
- [x] **혜택 탐색**: 검색 바, 필터, 정렬, 결과 수
- [x] **혜택 상세**: 지원 기관, 금액/신청 기간, 자격 요건, 제출 서류, 신청 링크
- [x] **캘린더**: 월별 뷰, 마감 임박 강조, 날짜 클릭 시 해당 혜택 리스트
- [x] **내 혜택**: 북마크/준비중/신청완료/수령완료 탭, 상태 변경
- [x] **설정**: 프로필 편집, 알림 설정

#### 핵심 데이터 모델
- [x] **User**: id, 이메일, 나이, 지역, 직업 상태(자영업 여부), 알림 수신 설정
- [x] **Benefit**: id, 제목, 기관, 카테고리, 지역, 지원 금액, 신청 기간, 마감일, 신청 링크
- [x] **UserBenefit**: user_id, benefit_id, 상태(북마크/준비중/신청완료/수령완료), 생성일

### 2.2 Out of Scope (MVP 제외)

- 실시간 매칭 고도화 (점수 모델, 다중 추천 알고리즘)
- 외부 기관 신청 상태 자동 동기화
- 고급 알림 채널 (SMS/카카오톡) 및 다국어 지원
- 정부/기관 데이터 완전 자동 수집 파이프라인 (초기: 수동/샘플 데이터)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 사용자 프로필 입력 및 저장 (나이, 지역, 직업 상태) | High | Planned |
| FR-02 | 프로필 기반 혜택 자동 필터링 및 추천 | High | Planned |
| FR-03 | 검색어 기반 혜택 검색 (제목, 기관명) | High | Planned |
| FR-04 | 카테고리/지역/신청 가능 상태 필터링 | High | Planned |
| FR-05 | 마감일/최신순 정렬 | Medium | Planned |
| FR-06 | 혜택 상세 정보 조회 | High | Planned |
| FR-07 | 북마크 추가/해제 | High | Planned |
| FR-08 | 혜택 상태 변경 (북마크→준비중→신청완료→수령완료) | High | Planned |
| FR-09 | 월별 캘린더 뷰 및 마감 임박 강조 | High | Planned |
| FR-10 | 날짜 클릭 시 해당 혜택 리스트 표시 | Medium | Planned |
| FR-11 | 마감일 임박 알림 (이메일/앱 알림 1채널) | Medium | Planned |
| FR-12 | 대시보드 통계 위젯 (매칭 수/마감 임박/신청 완료) | Medium | Planned |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 목록 조회 95p 500ms 이내 | Lighthouse, Web Vitals |
| Accessibility | 기본 키보드 네비게이션 지원 | Manual testing |
| Compatibility | Chrome, Safari, Firefox 최신 2개 버전 | Browser testing |
| Data | 초기 샘플 데이터 50개 이상 | Data script verification |

---

## 4. Success Criteria

### 4.1 MVP 성공 지표

- [ ] 가입 완료율 40%+
- [ ] 프로필 완성률 80%+
- [ ] 첫 매칭까지 평균 3분 이내
- [ ] 검색 사용률 60%+
- [ ] 사용자당 북마크 3개+
- [ ] 캘린더 조회율 40%+
- [ ] 알림 오픈율 40%+
- [ ] 재방문율 60%+

### 4.2 Definition of Done

- [ ] 핵심 사용자 여정 4가지가 오류 없이 동작
- [ ] 각 화면별 빈 상태/에러 상태 처리
- [ ] 기본 성능: 목록 조회 95p 500ms 이내
- [ ] 주요 이벤트 로깅 및 지표 수집 가능
- [ ] 배포 후 1주 내 피드백 수집 계획 수립

### 4.3 Quality Criteria

- [ ] 프론트엔드 빌드 성공
- [ ] 백엔드 API 테스트 성공
- [ ] 코드 리뷰 완료
- [ ] 기본 문서 작성 완료

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 데이터 부족 | High | Medium | 초기에는 수동 샘플 데이터로 시작, M3 이후 수집 파이프라인 점진 확장 |
| 알림 채널 제약 | Medium | Low | 이메일 1채널 우선 제공, SMS/카카오톡은 후속 확장 |
| 정책/요건 변경 | Medium | Medium | 필터/자격 요건을 JSON 형태로 유연하게 관리 |
| 성능 저하 (목록 조회) | High | Low | 페이징, 인덱싱, 캐싱 전략 사전 적용 |

---

## 6. Milestones (8주 계획)

### M0 (주 1) - 준비/정의 ✅
- [x] 요구사항 확정, MVP 범위 동의
- [x] UX 흐름/와이어프레임 작성
- [x] API 스펙 초안 (리소스/엔드포인트 정의)
- [x] 샘플 혜택 데이터 스키마 확정

### M1 (주 2~3) - 기반 구축
- [ ] Frontend 기본 레이아웃/라우팅 구성
- [ ] Backend 기본 프로젝트 세팅 및 사용자/혜택 API 골격
- [ ] 인증(JWT) 및 프로필 저장 기능
- [ ] 샘플 데이터 적재 스크립트

### M2 (주 4~5) - 탐색/상세/캘린더
- [ ] 혜택 탐색(검색/필터/정렬) UI + API
- [ ] 혜택 상세 페이지 및 신청 링크 연결
- [ ] 캘린더 월별 뷰 및 마감 임박 강조

### M3 (주 6~7) - 내 혜택/알림
- [ ] 북마크 및 상태 변경 기능
- [ ] 마감 알림 스케줄링 (일 1회 배치, 이메일/앱 알림 1채널)
- [ ] 대시보드 통계 위젯 노출

### M4 (주 8) - 품질/릴리스
- [ ] QA/버그 픽스, 성능 점검
- [ ] 기본 모니터링 지표 설정
- [ ] MVP 릴리스 및 사용자 피드백 수집

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure | Static sites, portfolios, landing pages | ☐ |
| **Dynamic** | Feature-based modules, services layer | Web apps with backend, SaaS MVPs | ☑ |
| **Enterprise** | Strict layer separation, DI, microservices | High-traffic systems, complex architectures | ☐ |

**선택 근거:** MVP는 프론트엔드(Next.js) + 백엔드 API 연동이 필요하며, 사용자 인증/프로필/혜택 데이터 관리 등 서비스 레이어가 필요함.

### 7.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js / React / Vue | Next.js 14 | SSR/SSG 지원, App Router, 빠른 개발 |
| State Management | Context / Zustand / Redux / Jotai | Context API | MVP 단순성, 별도 라이브러리 불필요 |
| API Client | fetch / axios / react-query | fetch (native) | 추가 의존성 불필요, 충분한 기능 |
| Form Handling | react-hook-form / formik / native | react-hook-form | 타입 안전성, 성능, 유효성 검사 편의 |
| Styling | Tailwind / CSS Modules / styled-components | Tailwind CSS | 빠른 프로토타이핑, 일관성 |
| Testing | Jest / Vitest / Playwright | 미정 (추후 결정) | MVP 후 QA 전략 수립 |

### 7.3 Clean Architecture Approach

```
Selected Level: Dynamic

Folder Structure Preview:
┌─────────────────────────────────────────────────────┐
│ Dynamic:                                            │
│   app/                      # Next.js App Router   │
│   components/               # UI 컴포넌트          │
│   shared/                   # 공통 유틸/타입        │
│   docs/                     # PDCA 문서            │
└─────────────────────────────────────────────────────┘
```

---

## 8. Convention Prerequisites

### 8.1 Existing Project Conventions

- [ ] `CLAUDE.md` has coding conventions section → **없음, 생성 필요**
- [ ] `docs/01-plan/conventions.md` exists → **없음, Phase 2에서 생성 예정**
- [ ] `CONVENTIONS.md` exists at project root → **없음**
- [x] ESLint configuration (`.eslintrc.*`) → **존재** (Next.js 기본)
- [ ] Prettier configuration (`.prettierrc`) → **없음, 추가 권장**
- [x] TypeScript configuration (`tsconfig.json`) → **존재**

### 8.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| **Naming** | 기본 Next.js 규칙 | 컴포넌트, 파일, 변수 네이밍 규칙 | High |
| **Folder structure** | App Router 기본 | features/, shared/ 규칙 | High |
| **Import order** | 없음 | 절대경로 우선, 그룹핑 규칙 | Medium |
| **Environment variables** | 없음 | API URL, 인증 키 등 | High |
| **Error handling** | 없음 | API 에러, UI 에러 처리 패턴 | Medium |

### 8.3 Environment Variables Needed

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| `NEXT_PUBLIC_API_URL` | API Base URL | Client | ☑ |
| `JWT_SECRET` | JWT 서명 비밀키 | Server | ☑ |
| `DATABASE_URL` | DB 연결 문자열 (추후) | Server | ☐ |
| `NOTIFICATION_EMAIL` | 알림 발송 이메일 | Server | ☑ |

### 8.4 Pipeline Integration

| Phase | Status | Document Location | Next Action |
|-------|:------:|-------------------|-------------|
| Phase 1 (Schema) | ☐ | `docs/01-plan/schema.md` | 데이터 모델 상세 정의 필요 |
| Phase 2 (Convention) | ☐ | `docs/01-plan/conventions.md` | 코딩 규칙 문서화 필요 |
| Phase 3 (Mockup) | ☐ | TBD | 와이어프레임 → HTML 프로토타입 |
| Phase 4 (API) | ☐ | `docs/02-design/features/` | API 설계 문서 작성 중 |

---

## 9. Next Steps

1. [ ] Phase 2: Convention 문서 작성 (`/phase-2-convention`)
2. [ ] Design 문서 작성 (`/pdca design mvp-benefit-calendar`)
   - API 명세서 통합
   - 데이터베이스 스키마 상세화
   - 컴포넌트 구조 설계
3. [ ] 팀 리뷰 및 승인
4. [ ] Do 단계 진입 (`/pdca do mvp-benefit-calendar`)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-31 | PDCA 구조로 재정리, 기존 MVP_실행계획.md 통합 | BenefitCal Team |
| 0.1 | 2025-01-17 | Initial MVP 계획 작성 | BenefitCal Team |
