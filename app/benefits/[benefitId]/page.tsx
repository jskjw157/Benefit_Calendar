import BenefitCard from "@/components/BenefitCard";
import SectionHeader from "@/components/SectionHeader";

const benefit = {
  id: "b_001",
  title: "청년 월세 지원",
  agency: "서울특별시",
  category: "주거",
  region: "서울",
  amount: "월 20만원",
  status: "OPEN",
  deadline: "2025-02-10",
  applyPeriod: "2025-01-10 ~ 2025-02-10",
  applicationLink: "https://example.com/apply",
  summary:
    "서울 거주 청년을 대상으로 월세 부담을 줄이기 위한 지원금입니다. 조건에 맞는 청년이라면 누구나 신청할 수 있습니다.",
  contact: "서울특별시 청년정책과 (02-000-0000)"
};

const eligibility = ["만 19~34세 청년", "서울 거주", "무주택", "소득 기준 충족"];
const documents = ["주민등록등본", "임대차계약서", "소득증빙서류"];
const timeline = [
  { label: "신청 시작", date: "2025-01-10", detail: "온라인 신청 오픈" },
  { label: "신청 마감", date: "2025-02-10", detail: "서류 제출 완료 필요" },
  { label: "심사 기간", date: "2025-02-11 ~ 2025-02-28", detail: "대상자 검토" },
  { label: "지원금 지급", date: "2025-03-10", detail: "계좌로 지급" }
];

const relatedBenefits = [
  {
    title: "청년 주거 이사비 지원",
    agency: "인천광역시",
    amount: "최대 40만원",
    deadline: "D-14",
    tag: "추천",
    highlight: "upcoming" as const
  },
  {
    title: "청년 공공임대 특별공급",
    agency: "국토교통부",
    amount: "임대료 할인",
    deadline: "D-21",
    tag: "모집중",
    highlight: "upcoming" as const
  },
  {
    title: "주거 안정 패키지",
    agency: "국토교통부",
    amount: "임대료 30%",
    deadline: "상시",
    tag: "상시",
    highlight: "urgent" as const
  }
];

const statusStyle =
  benefit.status === "OPEN"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-slate-100 text-slate-500";

export default function BenefitDetailPage() {
  return (
    <main className="min-h-screen bg-surface pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              BenefitCal MVP
            </p>
            <h1 className="text-2xl font-semibold text-midnight">혜택 상세</h1>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <span>홈</span>
            <span className="text-midnight">혜택 탐색</span>
            <span>캘린더</span>
            <span>내 혜택</span>
            <span>설정</span>
          </nav>
          <button className="rounded-full bg-midnight px-4 py-2 text-xs font-semibold text-white">
            북마크
          </button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-6 pt-10">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span>혜택 탐색</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700">{benefit.title}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}>
            {benefit.status === "OPEN" ? "신청 가능" : "마감"}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <div className="card p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{benefit.agency}</p>
                  <h2 className="mt-2 text-3xl font-semibold text-midnight">{benefit.title}</h2>
                  <p className="mt-3 text-sm text-slate-600">{benefit.summary}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <p className="text-xs font-semibold text-slate-500">마감일</p>
                  <p className="mt-1 text-lg font-semibold text-midnight">{benefit.deadline}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 p-4 text-sm">
                  <p className="text-xs text-slate-500">지원 금액</p>
                  <p className="mt-2 text-lg font-semibold text-midnight">{benefit.amount}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 p-4 text-sm">
                  <p className="text-xs text-slate-500">신청 기간</p>
                  <p className="mt-2 text-sm font-semibold text-midnight">{benefit.applyPeriod}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 p-4 text-sm">
                  <p className="text-xs text-slate-500">카테고리</p>
                  <p className="mt-2 text-sm font-semibold text-midnight">
                    {benefit.category} · {benefit.region}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="btn-primary">신청 바로가기</button>
                <button className="btn-secondary">신청 알림 받기</button>
              </div>
            </div>

            <div className="card p-6">
              <SectionHeader title="자격 요건" description="해당 조건을 충족해야 신청할 수 있어요." />
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {eligibility.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <SectionHeader title="제출 서류" description="사전에 준비해야 할 서류 목록입니다." />
              <div className="mt-4 flex flex-wrap gap-2">
                {documents.map((item) => (
                  <span key={item} className="pill">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <SectionHeader title="진행 일정" description="신청부터 지급까지의 주요 일정입니다." />
              <div className="mt-4 space-y-4">
                {timeline.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-midnight">{item.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <SectionHeader title="신청 요약" description="신청 전 꼭 확인하세요." />
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>담당 기관</span>
                  <span className="font-semibold text-slate-800">{benefit.agency}</span>
                </div>
                <div className="flex justify-between">
                  <span>지역</span>
                  <span className="font-semibold text-slate-800">{benefit.region}</span>
                </div>
                <div className="flex justify-between">
                  <span>신청 링크</span>
                  <a
                    className="font-semibold text-blue-600"
                    href={benefit.applicationLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    바로가기
                  </a>
                </div>
              </div>
              <button className="btn-secondary mt-5 w-full">담당자에게 문의</button>
              <p className="mt-3 text-xs text-slate-500">{benefit.contact}</p>
            </div>

            <div className="card p-6">
              <SectionHeader title="추천 혜택" description="함께 보면 좋은 혜택이에요." />
              <div className="mt-4 grid gap-4">
                {relatedBenefits.map((item) => (
                  <BenefitCard key={item.title} {...item} actionLabel="상세 보기" />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
