# ADR-001: 백엔드 기술 스택 선정

> Architecture Decision Record (ADR)

| 항목 | 내용 |
|------|------|
| 상태 | **승인됨** |
| 일자 | 2026-01-31 |
| 결정자 | 프로젝트 오너 |
| 관련 문서 | TRD v1.0, MVP 실행계획 |

---

## 1. 배경

혜택 캘린더 프로젝트는 현재 Next.js 프론트엔드 프로토타입만 존재하며, 백엔드가 전혀 없는 상태다.
TRD v1.0에서는 **Kotlin + Spring Boot (MSA)** 구조를 설계했으나, MVP 단계에서 이를 그대로 적용하기에는 과도한 복잡도가 발생한다.

모노레포 구조로 프론트엔드와 백엔드를 통합 관리하면서, MVP를 빠르게 구현할 수 있는 기술 스택이 필요했다.

## 2. 후보 기술

### 2.1 NestJS (TypeScript)

- Node.js 기반, TypeScript 네이티브
- Spring Boot와 유사한 아키텍처 (Module, DI, Controller, Service)
- 프론트엔드와 동일한 언어/타입 시스템

### 2.2 Spring Boot (Kotlin)

- TRD 원안. JVM 기반 엔터프라이즈 프레임워크
- 성숙한 생태계 (Spring Security, Spring Data, Spring Cloud)
- 멀티스레드 + 코루틴으로 높은 동시성 처리

### 2.3 Next.js API Routes

- 별도 백엔드 없이 프론트엔드 프로젝트 내에서 API 구현
- 가장 간단하지만 확장성 제한

## 3. 결정

**NestJS (TypeScript)** 를 MVP 백엔드 기술 스택으로 선정한다.

## 4. 선정 이유

### 4.1 모노레포 적합성

| 비교 항목 | NestJS | Spring Boot |
|-----------|--------|-------------|
| 타입 공유 | `packages/shared`로 프론트/백 타입 직접 공유 | 불가. OpenAPI codegen 등 별도 과정 필요 |
| 빌드 시스템 | Turborepo 단일 관리 | Gradle + npm 이중 관리 |
| 언어 통일 | TypeScript 단일 | Kotlin + TypeScript 이중 |

모노레포의 핵심 이점인 **코드/타입 공유**를 Spring Boot에서는 활용할 수 없다.

### 4.2 MVP 개발 속도

- 프론트엔드와 동일한 TypeScript로 컨텍스트 스위칭 없음
- Prisma ORM으로 빠른 DB 연동
- 프론트엔드 개발자가 백엔드도 작업 가능

### 4.3 아키텍처 호환성

NestJS는 Spring Boot와 거의 1:1 대응되는 구조를 가진다:

| Spring Boot | NestJS |
|-------------|--------|
| `@Controller` | `@Controller` |
| `@Service` | `@Injectable` |
| `@Module` (Spring Context) | `@Module` |
| Spring Security Guard | `@UseGuards` |
| Interceptor | `Interceptor` |
| DTO Validation | `class-validator` + `class-transformer` |

TRD에서 설계한 Clean Architecture 패턴을 NestJS에서도 동일하게 구현할 수 있다.

### 4.4 점진적 MSA 전환 가능

NestJS 모듈러 모놀리스에서 시작하여, 트래픽 증가 시 다음과 같이 전환한다:

```
[Phase 1 - MVP]
NestJS 모놀리스 (모듈 단위로 도메인 분리)
├── UserModule
├── BenefitModule
├── MatchingModule
└── NotificationModule

[Phase 2 - 성장기]
CPU 집약적 서비스만 분리
├── NestJS: User, Benefit, Notification (I/O 위주)
└── Kotlin/Spring Boot: Matching Service (CPU 집약)

[Phase 3 - 확장기]
필요에 따라 추가 분리
├── NestJS 서비스들
├── Kotlin 서비스들
└── Kafka 이벤트 기반 통신
```

## 5. 트레이드오프

### 수용하는 단점

- **CPU 집약 작업 한계**: Node.js 단일 스레드 특성상 매칭 알고리즘 성능이 JVM보다 낮을 수 있음 → Worker Thread 또는 Phase 2에서 Kotlin 분리로 해결
- **엔터프라이즈 생태계**: Spring Security, Spring Cloud 대비 생태계가 작음 → MVP 규모에서는 문제 없음

### 얻는 이점

- 모노레포에서 프론트/백 타입 공유
- 단일 언어로 개발 속도 향상
- 낮은 초기 인프라 비용 (Node.js 단일 런타임)

## 6. 기술 스택 요약

| 영역 | 기술 | 비고 |
|------|------|------|
| **Runtime** | Node.js 24 LTS (Krypton) | Active LTS, 2028-04까지 지원 |
| **Framework** | NestJS 10+ | |
| **Language** | TypeScript 5.x | 프론트와 동일 |
| **ORM** | Prisma | Type-safe DB 접근 |
| **Database** | PostgreSQL 16 | TRD 동일 |
| **Cache** | Redis | TRD 동일 |
| **Auth** | Passport.js + JWT | |
| **Validation** | class-validator | |
| **API Docs** | Swagger (OpenAPI) | @nestjs/swagger |
| **Testing** | Jest | 프론트와 동일 |
| **Monorepo** | Turborepo | apps/web, apps/api, packages/shared |

## 7. 관련 결정

- 모노레포 도구: Turborepo (별도 ADR 불필요, 업계 표준)
- DB는 TRD 원안 유지 (PostgreSQL)
- 캐시는 TRD 원안 유지 (Redis)
- 메시지 큐(Kafka)는 MSA 전환 시점에 도입
