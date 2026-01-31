---
template: plan
version: 1.0
description: Awwwards 스타일 UI/UX 디자인 가이드 계획
feature: visual-design-guide
date: 2026-01-31
author: BenefitCal Team
project: Benefit Calendar
status: In Progress
---

# Visual Design Guide Plan

> **Summary**: Benefit Calendar 프로젝트의 UI/UX를 "Awwwards" 수준으로 끌어올리기 위한 시각적 디자인 및 인터랙션 가이드라인 수립 계획
>
> **Project**: Benefit Calendar
> **Version**: 1.0.0
> **Date**: 2026-01-31
> **Status**: In Progress

---

## 1. Overview

### 1.1 Purpose
기능 중심의 MVP를 넘어, 사용자에게 **심미적 만족감**과 **몰입감**을 주는 고품질의 비주얼 아이덴티티를 확립합니다. 최신 웹 디자인 트렌드(Bento Grid, Glassmorphism)와 자연스러운 물리 기반 애니메이션을 적용하여 브랜드 가치를 높입니다.

### 1.2 Target Audience & Vibe
- **Target**: 직관적이고 세련된 경험을 선호하는 청년 및 디지털 네이티브 사용자.
- **Vibe Keywords**:
    - **Fluid**: 물 흐르듯 자연스러운 인터랙션
    - **Clean**: 불필요한 장식을 배제한 미니멀리즘
    - **Trustworthy**: 신뢰감을 주는 정돈된 레이아웃과 타이포그래피
    - **Modern**: Glassmorphism, Gradient 등 최신 트렌드 반영

---

## 2. Scope

### 2.1 In Scope (핵심 디자인 요소)
- **Grid System**: Bento Grid 스타일의 모듈형 레이아웃 설계
- **Color System**: 브랜드 컬러의 확장 (Gradients, Alpha variants) 및 다크 모드 고려
- **Typography**: 국문(Noto Sans KR)과 영문 디스플레이 폰트 조합 및 스케일 정의
- **Component Style**: 버튼, 카드, 인풋 등 핵심 UI 요소의 고도화된 스타일링 (Glassmorphism 적용)
- **Motion & Interaction**: 페이지 전환, 호버, 스크롤, 마이크로 인터랙션 가이드 (Framer Motion 기반)
- **Iconography**: 일관된 벡터 아이콘 시스템 (Lucide React 활용)

### 2.2 Out of Scope
- 구체적인 기능 로직 변경 (기존 기능 명세 준수)
- 백엔드 데이터 구조 변경
- 3D 에셋 제작 (필요 시 라이브러리 활용)

---

## 3. Design Principles

### 3.1 Fluidity (유동성)
모든 움직임은 끊김 없이 자연스러워야 합니다. 요소의 등장, 퇴장, 상태 변화는 물리 법칙을 따르는 부드러운 애니메이션으로 연결됩니다.

### 3.2 Depth (깊이감)
단조로운 평면 디자인을 지양하고, 그림자(Shadow), 블러(Blur), 레이어링(Layering)을 통해 공간감과 위계를 명확히 합니다.

### 3.3 Clarity (명확성)
심미성을 추구하되 정보 전달을 방해하지 않습니다. 중요한 정보(마감일, 혜택 금액)는 시각적으로 강조되어야 합니다.

---

## 4. Technical Requirements for Design

| Category | Requirements | Tool/Library |
|----------|--------------|--------------|
| **Animation** | 물리 기반 애니메이션, 제스처 지원 | `framer-motion` |
| **Styling** | 유틸리티 기반, 동적 클래스 병합 | `tailwind-merge`, `clsx` |
| **Icons** | SVG 기반, 커스터마이징 용이성 | `lucide-react` |
| **Layout** | 반응형 그리드, Flexbox | Tailwind CSS Grid |
| **Fonts** | 웹 폰트 최적화 | `next/font` |

---

## 5. Next Steps

1.  **Design Phase (`/pdca-design visual-design-guide`)**:
    - 구체적인 컬러 팔레트, 폰트 스케일, 컴포넌트 디자인 상세 정의
    - 애니메이션 프리셋(FadeIn, SlideUp 등) 정의
2.  **Implementation**:
    - 공통 UI 라이브러리(`components/ui`) 구축
    - 글로벌 스타일(`globals.css`) 및 Tailwind 설정 업데이트

---
