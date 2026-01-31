---
template: design
version: 1.0
feature: visual-design-guide
date: 2026-01-31
author: BenefitCal Team
project: Benefit Calendar
status: Draft
plan_ref: docs/01-plan/features/visual-design-guide.plan.md
---

# Visual Design & Interaction Guide

> **Summary**: Awwwards 스타일의 UI/UX 구현을 위한 상세 디자인 시스템 및 애니메이션 가이드
>
> **Project**: Benefit Calendar
> **Version**: 1.0.0
> **Plan Reference**: `docs/01-plan/features/visual-design-guide.plan.md`

---

## 1. Design Identity: "Fluid & Glass"

### 1.1 Core Keywords
- **Transparent (투명성)**: 정보의 층위를 배경 블러(Backdrop Blur)로 표현
- **Rounded (부드러움)**: `rounded-2xl`, `rounded-3xl` 등 넉넉한 라운딩으로 친근감 부여
- **Vibrant (생동감)**: 그라데이션과 미세한 노이즈(Noise) 텍스처를 활용한 질감

### 1.2 Color Palette (Tailwind Config)

```javascript
// tailwind.config.ts
colors: {
  background: "hsl(var(--background))", // #f8fafc (Slate-50)
  foreground: "hsl(var(--foreground))", // #0f172a (Slate-900)
  
  // Brand Colors
  primary: {
    DEFAULT: "#3b82f6", // Blue-500 (Vibrant)
    foreground: "#ffffff",
    soft: "#eff6ff",    // Blue-50
  },
  accent: {
    DEFAULT: "#8b5cf6", // Violet-500 (Gradient용)
    foreground: "#ffffff",
  },
  
  // UI Status
  card: {
    DEFAULT: "rgba(255, 255, 255, 0.7)", // Glass effect base
    foreground: "#1e293b",
  },
  muted: {
    DEFAULT: "#f1f5f9", // Slate-100
    foreground: "#64748b", // Slate-500
  },
  border: "rgba(226, 232, 240, 0.6)", // Semi-transparent border
}
```

---

## 2. Component Design Specs

### 2.1 Glass Card (핵심 컨테이너)
모든 주요 컨텐츠(혜택 카드, 위젯 등)는 이 스타일을 따릅니다.

- **Background**: `bg-white/70` (Light mode)
- **Blur**: `backdrop-blur-xl`
- **Border**: `border border-white/20`
- **Shadow**: `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`
- **Hover**: `hover:bg-white/80 transition-all duration-300`

### 2.2 Buttons
기존의 딱딱한 버튼 대신, 유동적인 느낌을 강조합니다.

- **Primary Button**:
    - Gradient Background: `bg-gradient-to-r from-blue-500 to-violet-500`
    - Shadow: `shadow-lg shadow-blue-500/30`
    - Shape: `rounded-full` (Fully rounded)
    - Hover: `hover:shadow-blue-500/50 hover:scale-105` (Spring animation)

- **Ghost/Outline Button**:
    - Border: `border border-slate-200`
    - Hover: `hover:bg-slate-50`

### 2.3 Typography Scale
가독성과 심미성의 균형.

- **Heading 1 (Hero)**: `text-4xl md:text-5xl font-bold tracking-tight text-slate-900`
- **Heading 2 (Section)**: `text-2xl font-semibold tracking-tight`
- **Body**: `text-base text-slate-600 leading-relaxed`
- **Caption**: `text-sm text-slate-500 font-medium`

---

## 3. Layout System: Bento Grid

대시보드는 **CSS Grid**를 활용한 Bento Box 스타일로 구성합니다.

```tsx
// Grid Container
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-4">
  {/* Hero Section: 2x2 or 2x1 */}
  <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 ...">...</div>
  
  {/* Stat Card: 1x1 */}
  <div className="col-span-1 ...">...</div>
  
  {/* List Section: 1x2 */}
  <div className="col-span-1 row-span-2 ...">...</div>
</div>
```

---

## 4. Animation Guidelines (Framer Motion)

### 4.1 Page Transition
페이지 이동 시 끊김 없는 경험 제공.

```javascript
// variants.ts
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
}
```

### 4.2 Staggered List (리스트 등장)
혜택 목록이 하나씩 순차적으로 나타나는 효과.

```javascript
export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
}
```

### 4.3 Micro-interactions
- **Button Click**: `whileTap={{ scale: 0.95 }}`
- **Card Hover**: `whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}`

---

## 5. Implementation Roadmap

### Phase 1: Foundation
1.  **Tailwind Config**: 색상, 폰트, 그림자 등 커스텀 테마 설정.
2.  **Global CSS**: 배경 패턴(Noise/Gradient Mesh) 및 기본 스크롤바 스타일링.
3.  **Utility Setup**: `cn` (clsx + tailwind-merge) 유틸리티 구현.

### Phase 2: Core Components (`components/ui`)
1.  **GlassCard**: 모든 카드의 베이스 컴포넌트.
2.  **Button**: 애니메이션이 적용된 버튼 컴포넌트.
3.  **Badge/Tag**: 혜택 상태 및 카테고리 표시용 칩.

### Phase 3: Layout & Pages
1.  **Main Layout**: 헤더/네비게이션에 Glass effect 적용 (`sticky top-0`).
2.  **Dashboard**: Bento Grid 적용 및 등장 애니메이션 구현.
3.  **Details**: 페이지 전환 애니메이션(`AnimatePresence`) 적용.

---

## 6. References
- **Inspiration**: Linear, Raycast, Vercel Design System
- **Resources**:
    - Icons: [Lucide React](https://lucide.dev)
    - Motion: [Framer Motion](https://www.framer.com/motion/)
    - Components: [shadcn/ui](https://ui.shadcn.com)
