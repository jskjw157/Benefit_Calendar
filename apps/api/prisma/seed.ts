import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 테스트 사용자
  const user = await prisma.user.create({
    data: {
      email: 'test@benefitcal.com',
      passwordHash: await hash('password123', 10),
      age: 28,
      region: '서울',
      employmentStatus: 'JOB_SEEKER',
      isSelfEmployed: false,
    },
  })

  // sample_data.json 기반 혜택 데이터
  const benefits = [
    {
      title: '청년 월세 지원',
      agency: '서울특별시',
      category: '주거',
      region: '서울',
      amount: '월 20만원',
      applyStartDate: new Date('2026-01-10'),
      applyEndDate: new Date('2026-02-10'),
      deadline: new Date('2026-02-10'),
      applicationLink: 'https://example.com/apply/001',
      requirements: ['만 19~34세', '무주택'],
      documents: ['주민등록등본', '임대차계약서'],
    },
    {
      title: '취업 준비생 교통비 지원',
      agency: '고용노동부',
      category: '교통',
      region: '전국',
      amount: '월 5만원',
      applyStartDate: new Date('2026-02-01'),
      applyEndDate: new Date('2026-03-01'),
      deadline: new Date('2026-03-01'),
      applicationLink: 'https://example.com/apply/002',
      requirements: ['만 18~29세', '구직 등록'],
      documents: ['구직등록확인서'],
    },
    {
      title: '청년 문화생활 바우처',
      agency: '문화체육관광부',
      category: '문화',
      region: '전국',
      amount: '연 10만원',
      applyStartDate: new Date('2026-01-20'),
      applyEndDate: new Date('2026-02-20'),
      deadline: new Date('2026-02-20'),
      applicationLink: 'https://example.com/apply/003',
      requirements: ['만 19~34세'],
      documents: ['신분증 사본'],
    },
    {
      title: '청년 창업 공간 지원',
      agency: '중소벤처기업부',
      category: '창업',
      region: '서울',
      amount: '입주 공간 제공',
      applyStartDate: new Date('2026-03-01'),
      applyEndDate: new Date('2026-03-31'),
      deadline: new Date('2026-03-31'),
      applicationLink: 'https://example.com/apply/004',
      requirements: ['만 19~39세', '창업 3년 이내'],
      documents: ['사업자등록증', '사업계획서'],
    },
    {
      title: '지역 청년 식비 지원',
      agency: '부산광역시',
      category: '생활',
      region: '부산',
      amount: '월 3만원',
      applyStartDate: new Date('2026-01-05'),
      applyEndDate: new Date('2026-01-25'),
      deadline: new Date('2026-01-25'),
      applicationLink: 'https://example.com/apply/005',
      requirements: ['만 19~34세', '부산 거주'],
      documents: ['주민등록등본'],
    },
    {
      title: '청년 자기계발 지원금',
      agency: '경기도',
      category: '교육',
      region: '경기',
      amount: '연 30만원',
      applyStartDate: new Date('2026-02-10'),
      applyEndDate: new Date('2026-03-10'),
      deadline: new Date('2026-03-10'),
      applicationLink: 'https://example.com/apply/006',
      requirements: ['만 18~34세', '경기 거주'],
      documents: ['주민등록등본', '재직증명서'],
    },
    {
      title: '청년 공공임대 특별공급',
      agency: '국토교통부',
      category: '주거',
      region: '전국',
      amount: '임대료 할인',
      applyStartDate: new Date('2026-04-01'),
      applyEndDate: new Date('2026-04-30'),
      deadline: new Date('2026-04-30'),
      applicationLink: 'https://example.com/apply/007',
      requirements: ['만 19~39세', '무주택'],
      documents: ['주민등록등본', '소득증빙'],
    },
    {
      title: '청년 의료비 지원',
      agency: '보건복지부',
      category: '의료',
      region: '전국',
      amount: '연 15만원',
      applyStartDate: new Date('2026-01-15'),
      applyEndDate: new Date('2026-02-15'),
      deadline: new Date('2026-02-15'),
      applicationLink: 'https://example.com/apply/008',
      requirements: ['만 19~34세', '저소득층'],
      documents: ['소득증명서'],
    },
    {
      title: '청년 주거 이사비 지원',
      agency: '인천광역시',
      category: '주거',
      region: '인천',
      amount: '최대 40만원',
      applyStartDate: new Date('2026-02-05'),
      applyEndDate: new Date('2026-02-28'),
      deadline: new Date('2026-02-28'),
      applicationLink: 'https://example.com/apply/009',
      requirements: ['만 19~34세', '인천 거주'],
      documents: ['임대차계약서', '주민등록등본'],
    },
    {
      title: '청년 디지털 역량 강화',
      agency: '과학기술정보통신부',
      category: '교육',
      region: '전국',
      amount: '교육비 80% 지원',
      applyStartDate: new Date('2026-03-05'),
      applyEndDate: new Date('2026-04-05'),
      deadline: new Date('2026-04-05'),
      applicationLink: 'https://example.com/apply/010',
      requirements: ['만 18~34세'],
      documents: ['신분증 사본'],
    },
  ]

  for (const benefit of benefits) {
    await prisma.benefit.create({ data: benefit })
  }

  console.log(`Seed completed: 1 user, ${benefits.length} benefits`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
