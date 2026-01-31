-- BenefitCal MVP 초기 스키마
-- 대상: PostgreSQL

CREATE TYPE employment_status AS ENUM ('JOB_SEEKER', 'EMPLOYED', 'STUDENT', 'SELF_EMPLOYED');
CREATE TYPE notification_channel AS ENUM ('EMAIL', 'SMS', 'PUSH');
CREATE TYPE user_benefit_status AS ENUM ('BOOKMARKED', 'PREPARING', 'APPLIED', 'RECEIVED');

CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  age INT NOT NULL,
  region VARCHAR NOT NULL,
  employment_status employment_status NOT NULL,
  is_self_employed BOOLEAN NOT NULL,
  notification_channel notification_channel NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE benefits (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  agency VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  region VARCHAR NOT NULL,
  amount VARCHAR NOT NULL,
  apply_start_date DATE NOT NULL,
  apply_end_date DATE NOT NULL,
  deadline DATE NOT NULL,
  application_link VARCHAR NOT NULL,
  requirements JSON NOT NULL,
  documents JSON NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_benefits (
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  benefit_id VARCHAR NOT NULL REFERENCES benefits(id) ON DELETE CASCADE,
  status user_benefit_status NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, benefit_id)
);

CREATE INDEX benefits_deadline_idx ON benefits (deadline);
CREATE INDEX benefits_region_category_idx ON benefits (region, category);
CREATE INDEX user_benefits_user_status_idx ON user_benefits (user_id, status);
