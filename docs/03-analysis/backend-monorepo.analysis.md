---
template: analysis
version: 2.0
feature: backend-monorepo
date: 2026-01-31
author: gap-detector
project: Benefit Calendar
status: Final
---

# backend-monorepo Gap Analysis Report

> **Design Match Rate: 79% → 95% (Iteration 1 완료)**

## 1. Overall Scores (After Iteration 1)

| Category | Before | After | Status |
|----------|:------:|:-----:|:------:|
| Root Config | 100% | 100% | PASS |
| packages/shared-types | 92% | 100% | PASS |
| packages/shared-utils | 100% | 100% | PASS |
| apps/api Structure | 78% | 90% | PASS |
| apps/api Endpoints | 100% | 100% | PASS |
| apps/web Migration | 64% | 95% | PASS |
| packages/eslint-config | 0% | 100% | PASS |
| Docker Compose | 100% | 100% | PASS |
| Seed Data | 0% | 100% | PASS |
| **Overall** | **79%** | **95%** | **PASS** |

## 2. Iteration 1 Fixes Applied

| # | Item | Fix | Result |
|---|------|-----|--------|
| 1 | Web tsconfig.json | `extends` + `@shared-types/*`, `@shared-utils/*` path alias 추가 | PASS |
| 2 | shared-types enums | `type` union → `enum` 키워드로 설계 대로 변경 | PASS |
| 3 | ResponseInterceptor | `import type { ApiSuccess }` from shared-types 추가 | PASS |
| 4 | HttpExceptionFilter | `import type { ApiError }` from shared-types 추가 | PASS |
| 5 | Config 모듈 | app.config.ts, database.config.ts, jwt.config.ts 생성 | PASS |
| 6 | prisma/seed.ts | sample_data.json 기반 10개 혜택 + 테스트 유저 생성 | PASS |
| 7 | packages/eslint-config | base.js, next.js, nest.js + package.json 생성 | PASS |

## 3. Remaining Low-Priority Gaps

| # | Item | Reason | Priority |
|---|------|--------|----------|
| 1 | Repository layer (*.repository.ts) | Service에서 Prisma 직접 호출 (MVP에 충분) | Low |
| 2 | validation.pipe.ts | main.ts에서 글로벌 처리 중 | Low |
| 3 | test/app.e2e-spec.ts | MVP 단계에서 불필요 | Low |
| 4 | prisma/migrations/ | DB 실행 후 자동 생성 (코드 갭 아님) | Low |
| 5 | next.config/postcss .js vs .mjs | 기능 동일, 포맷 차이만 | Low |

## 4. Score Summary

```
+---------------------------------------------+
|  Overall Design Match Rate: 95%             |
+---------------------------------------------+
|  Iteration: 1/5                              |
|  Status: PASS (>= 90% threshold)            |
|  Critical gaps: 0                            |
|  Low-priority gaps: 5                        |
+---------------------------------------------+
```

**결론**: 95% 달성으로 PDCA Check 통과. `/pdca report` 진행 가능.

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-31 | 초기 갭 분석 (79%) | gap-detector |
| 2.0 | 2026-01-31 | Iteration 1 후 재분석 (95%) | gap-detector |
