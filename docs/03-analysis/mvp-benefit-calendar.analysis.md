---
template: analysis
version: 1.0
feature: mvp-benefit-calendar
date: 2026-01-31
author: BenefitCal Team
project: Benefit Calendar
status: In Progress
design_ref: docs/02-design/features/mvp-benefit-calendar.design.md
match_rate: 60
---

# Gap Analysis: MVP Benefit Calendar

> **Summary**: 프론트엔드 핵심 화면(홈, 탐색, 상세)은 "Awwwards 스타일"로 고도화되었으나, **백엔드 API 및 일부 기능 페이지(캘린더, 내 혜택, 로그인)**가 아직 미구현 상태임.
>
> **Design Match Rate**: 60%
> **Analysis Date**: 2026-01-31

---

## 1. Implementation Status Overview

| Component | Status | Implementation Details |
|-----------|--------|------------------------|
| **Dashboard** | ✅ Matched | Bento Grid 레이아웃 및 애니메이션 적용 완료 (`app/page.tsx`) |
| **Benefits List** | ✅ Matched | 검색/필터 UI 및 리스트 등장 애니메이션 완료 (`app/benefits/page.tsx`) |
| **Benefit Detail** | ✅ Matched | 상세 정보 및 플로팅 액션 카드 UI 완료 (`app/benefits/[id]/page.tsx`) |
| **Header/Nav** | ✅ Matched | Glassmorphism 헤더 및 모바일 메뉴 완료 |
| **Calendar Page** | ❌ Unimplemented | `app/calendar/page.tsx` 미생성 |
| **My Benefits** | ❌ Unimplemented | `app/my-benefits/page.tsx` 미생성 |
| **Auth/Profile** | ❌ Unimplemented | 로그인 및 프로필 설정 페이지 미생성 |
| **API Integration** | ❌ Unimplemented | 현재 Mock Data 사용 중 (`api/v1/...` 라우트 부재) |

---

## 2. Key Gaps & Issues

### 2.1 Backend API Missing (Critical)
- **Design**: Next.js API Routes (`/api/v1/...`) 및 Service Layer 구조 설계됨.
- **Implementation**: 현재 모든 데이터가 컴포넌트 내부의 `MOCK_DATA` 상수로 하드코딩되어 있음.
- **Action**: `apps/web/app/api/` 디렉토리 생성 및 핸들러 구현 필요.

### 2.2 Functional Pages Missing
- **Calendar**: 월별 캘린더 뷰와 마감 임박 강조 기능이 아직 구현되지 않음.
- **My Benefits**: 북마크한 혜택을 모아보는 기능 부재.
- **Login**: 사용자 인증 흐름이 시작되지 않음.

### 2.3 State Management
- **Design**: `Context` 또는 `Zustand` 활용 계획.
- **Implementation**: 현재 각 페이지별 로컬 `useState`만 사용 중. 전역 상태(예: 로그인 세션, 알림 설정) 관리 필요.

---

## 3. Code Quality Review

### 3.1 Visual & UX (Excellent)
- `framer-motion`을 활용한 애니메이션이 적절하게 적용됨.
- `Glassmorphism` 스타일이 일관되게 유지되고 있음.
- 반응형 디자인(Mobile Menu, Grid)이 잘 구현됨.

### 3.2 Structure
- 컴포넌트 분리(`components/dashboard`, `components/benefits`)가 도메인별로 잘 되어 있음.
- `shared/types`에 타입 정의가 되어 있어 유지보수성 확보됨.

---

## 4. Recommendations (Next Steps)

1.  **Priority 1: API Routes 구현**
    - Mock Data를 API 핸들러로 이동시키고, 프론트엔드에서 `fetch`로 데이터를 받아오도록 변경.
2.  **Priority 2: 캘린더 페이지 구현**
    - `react-calendar` 등 라이브러리 활용 또는 커스텀 캘린더 그리드 구현.
3.  **Priority 3: 내 혜택 페이지 구현**
    - 북마크 상태 관리와 연동하여 저장된 혜택 리스트 표시.

---

## 5. Conclusion

프론트엔드의 **시각적 완성도는 매우 높으나(Awwwards Level 달성)**, 실제 데이터가 흐르는 **기능적 완성도(Backend Integration)**를 높여야 하는 단계입니다. API 구현으로 넘어가는 것을 강력히 권장합니다.
