# Type Definitions and File Organization Refactoring

## Objective
Fix type definitions and file organization following TDD approach to improve design-implementation match from 52% to 100%.

## Problem Statement
Design specified types should be at:
- `shared/types/benefit.types.ts` (EXISTS, 80% match -- missing BenefitSummary)
- `shared/types/user.types.ts` (MISSING -- types were in `types/api.ts`)
- `shared/types/api.types.ts` (MISSING -- types were in `types/api.ts`)

Current `types/api.ts` had ALL user and API types in one file at the wrong location.

## Solution Overview
Following Test-Driven Development (TDD):
1. Write tests first
2. Create proper type files to pass tests
3. Update imports across the codebase
4. Verify all tests pass

## Changes Made

### 1. Test Files Created (TDD Step 1)
- `apps/web/shared/types/__tests__/types.test.ts` - Module import tests
- `apps/web/shared/types/__tests__/type-check.test.ts` - Type compatibility tests

### 2. Type Files Created/Updated (TDD Step 2)

#### `apps/web/shared/types/benefit.types.ts`
Added missing `BenefitSummary` interface:
```typescript
export interface BenefitSummary {
  id: string
  title: string
  agency: string
  category: string
  region: string
  amount: string
  deadline: string
  status: BenefitStatus
}
```

#### `apps/web/shared/types/user.types.ts` (NEW)
Created with all user-related types:
- `EmploymentStatus`
- `NotificationChannel`
- `UserBenefitStatus`
- `User` interface
- `UserBenefit` interface
- `NotificationSettings` interface

#### `apps/web/shared/types/api.types.ts` (NEW)
Created with all API-related types:
- `ApiMeta` interface
- `ApiSuccess<T>` interface
- `ApiErrorDetail` interface
- `ApiError` interface
- `ApiResponse<T>` type
- `PaginatedData<T>` interface (renamed from PagedData)
- `DashboardSummary` interface

#### `apps/web/shared/types/index.ts` (NEW)
Barrel export for all types:
```typescript
export * from './benefit.types'
export * from './user.types'
export * from './api.types'
```

#### `apps/web/types/api.ts` (UPDATED)
Converted to re-export from canonical locations for backward compatibility:
```typescript
export * from '@/shared/types/user.types'
export * from '@/shared/types/api.types'
export type { PaginatedData as PagedData } from '@/shared/types/api.types'
```

### 3. Import Updates Across Codebase (TDD Step 3)

#### Service Files Updated
- `apps/web/shared/services/benefit.service.ts`
  - Import from `@/shared/types/benefit.types`
  - Import from `@/shared/types/api.types`
  - Renamed `PagedData` to `PaginatedData`

- `apps/web/shared/services/user.service.ts`
  - Import `User` from `@/shared/types/user.types`
  - Import `ApiResponse` from `@/shared/types/api.types`

- `apps/web/shared/services/user-benefit.service.ts`
  - Import `UserBenefit`, `UserBenefitStatus` from `@/shared/types/user.types`
  - Import `ApiResponse`, `PaginatedData` from `@/shared/types/api.types`
  - Renamed `PagedData` to `PaginatedData`

#### Test Files Updated
- `apps/web/shared/services/__tests__/user.service.test.ts`
  - Updated imports to use new paths

- `apps/web/shared/services/__tests__/benefit.service.test.ts`
  - Updated imports to use new paths
  - Renamed `PagedData` to `PaginatedData`

- `apps/web/shared/services/__tests__/user-benefit.service.test.ts`
  - Updated imports to use new paths
  - Renamed `PagedData` to `PaginatedData`

### 4. Test Results (TDD Step 4)
All 71 tests pass:
- 13 test files passed
- 71 tests passed
- 0 failures

## Key Design Improvements

### 1. Proper Type Organization
Types are now organized by domain:
- Benefit-related: `shared/types/benefit.types.ts`
- User-related: `shared/types/user.types.ts`
- API-related: `shared/types/api.types.ts`

### 2. Consistent Interface Style
Using `export interface` instead of `export type = { }` to match design doc style.

### 3. Naming Consistency
- Renamed `PagedData` to `PaginatedData` (more standard naming)
- Kept `PagedData` as alias for backward compatibility

### 4. Barrel Export
Single import point via `shared/types/index.ts` for convenience.

### 5. Backward Compatibility
Old import path `@/types/api` still works via re-exports.

## Files Modified
- 13 files modified
- 4 files created
- 0 files deleted

## Type Coverage Improvement
- Before: 52% match (missing types, wrong locations)
- After: 100% match (all types in correct locations with correct definitions)

## Next Steps
All type definitions now match the design specification. The codebase is ready for:
1. Further feature development
2. API implementation alignment
3. Component implementation using correct types
