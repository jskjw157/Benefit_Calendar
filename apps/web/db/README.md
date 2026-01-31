# DB 마이그레이션 구조

> 목적: MVP 스키마 마이그레이션을 파일 단위로 관리합니다.

## 디렉터리 구조
```
db/
  migrations/
    001_init.sql
  seeds/
    sample_data.sql
```

## 가이드
- `migrations/001_init.sql`은 MVP 초기 스키마를 정의합니다.
- `seeds/sample_data.sql`은 로컬 개발용 샘플 데이터를 적재합니다.
- 실제 환경에 맞는 마이그레이션 도구(Prisma, TypeORM, Flyway 등)로 이식 가능합니다.
