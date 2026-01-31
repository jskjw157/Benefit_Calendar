-- BenefitCal MVP 샘플 데이터 (로컬 개발용)

INSERT INTO users (
  id,
  email,
  age,
  region,
  employment_status,
  is_self_employed,
  notification_channel,
  created_at,
  updated_at
) VALUES
  ('u_001', 'jisu@example.com', 25, '서울', 'JOB_SEEKER', FALSE, 'EMAIL', NOW(), NOW()),
  ('u_002', 'minsu@example.com', 38, '부산', 'SELF_EMPLOYED', TRUE, 'SMS', NOW(), NOW());

INSERT INTO benefits (
  id,
  title,
  agency,
  category,
  region,
  amount,
  apply_start_date,
  apply_end_date,
  deadline,
  application_link,
  requirements,
  documents,
  created_at,
  updated_at
) VALUES
  (
    'b_001',
    '청년 월세 지원',
    '서울특별시',
    '주거',
    '서울',
    '월 20만원',
    '2025-01-10',
    '2025-02-10',
    '2025-02-10',
    'https://example.com/apply',
    '["만 19~34세","무주택"]',
    '["주민등록등본","임대차계약서"]',
    NOW(),
    NOW()
  ),
  (
    'b_002',
    '소상공인 긴급 대출',
    '중소벤처기업부',
    '금융',
    '전국',
    '최대 5천만원',
    '2025-01-05',
    '2025-03-31',
    '2025-03-31',
    'https://example.com/loan',
    '["사업자등록 1년 이상","매출 감소 증빙"]',
    '["사업자등록증","매출증빙서류"]',
    NOW(),
    NOW()
  );

INSERT INTO user_benefits (
  user_id,
  benefit_id,
  status,
  created_at,
  updated_at
) VALUES
  ('u_001', 'b_001', 'BOOKMARKED', NOW(), NOW()),
  ('u_002', 'b_002', 'PREPARING', NOW(), NOW());
