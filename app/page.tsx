import BenefitCard from "@/components/BenefitCard";
import CalendarGrid from "@/components/CalendarGrid";
import SectionHeader from "@/components/SectionHeader";
import StatCard from "@/components/StatCard";

const stats = [
  {
    label: "매칭된 혜택",
    value: "12개",
    detail: "프로필 기반 추천"
  },
  {
    label: "마감 임박",
    value: "3개",
    detail: "D-7 이내"
  },
  {
    label: "신청 완료",
    value: "2개",
    detail: "진행 상태 추적"
  }
];

const recommendedBenefits = [
  {
    title: "청년 월세 지원",
    agency: "서울특별시",
    amount: "월 20만원",
    deadline: "D-5",
    tag: "마감 임박",
    highlight: "urgent"
  },
  {
    title: "청년 취업성공 패키지",
    agency: "고용노동부",
    amount: "최대 300만원",
    deadline: "D-18",
    tag: "신규",
    highlight: "upcoming"
  },
  {
    title: "디지털 역량 교육",
    agency: "서울산업진흥원",
    amount: "전액 지원",
    deadline: "D-30",
    tag: "추천",
    highlight: "upcoming"
  }
];

const exploreBenefits = [
  {
    title: "소상공인 긴급 대출",
    agency: "중소벤처기업부",
    amount: "최대 5천만원",
    deadline: "D-12"
  },
  {
    title: "청년 창업 보육",
    agency: "창업진흥원",
    amount: "최대 1억원",
    deadline: "D-28"
  },
  {
    title: "주거 안정 패키지",
    agency: "국토교통부",
    amount: "임대료 30%",
    deadline: "상시"
  }
];

const calendarYear = 2025;
const calendarMonth = 1;
const daysInMonth = new Date(calendarYear, calendarMonth, 0).getDate();

const calendarDays = Array.from({ length: daysInMonth }, (_, index) => {
  const day = index + 1;
  return {
    day,
    status: day === 8 || day === 15 ? "urgent" : day === 21 ? "upcoming" : "normal",
    count: day % 6 === 0 ? 3 : day % 4 === 0 ? 2 : day % 5 === 0 ? 1 : 0
  };
});

const myBenefits = [
  {
    title: "청년수당",
    status: "준비중",
    deadline: "D-7",
    action: "서류 업로드"
  },
  {
    title: "디지털 역량 교육",
    status: "신청완료",
    deadline: "결과 대기",
    action: "상태 변경"
  }
];

const filterChips = ["청년", "소상공인", "주거", "교육", "서울", "신청 중"];

export default function Home() {
  return (
    <main className="min-h-screen bg-surface pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              BenefitCal MVP
            </p>
            <h1 className="text-2xl font-semibold text-midnight">혜택 캘린더</h1>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <span className="text-midnight">홈</span>
            <span>혜택 탐색</span>
            <span>캘린더</span>
            <span>내 혜택</span>
            <span>설정</span>
          </nav>
          <div className="flex items-center gap-3">
            <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
              알림 2
            </button>
            <button className="rounded-full bg-midnight px-4 py-2 text-xs font-semibold text-white">
              지수님
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-6 pt-10">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <div className="card p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">안녕하세요, 지수님</p>
                  <h2 className="mt-2 text-3xl font-semibold text-midnight">
                    오늘 받을 수 있는 혜택을 확인해보세요
                  </h2>
                  <p className="mt-3 text-sm text-slate-500">
                    프로필을 기반으로 맞춤 혜택을 추천하고 있어요. 마감일까지 남은
                    시간이 짧은 혜택부터 확인하세요.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button className="btn-primary">혜택 탐색하기</button>
                  <button className="btn-secondary">캘린더 보기</button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            <div className="card p-6">
              <SectionHeader
                title="내게 맞는 혜택"
                description="매칭 점수가 높은 혜택을 우선적으로 보여드립니다."
                action={
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
                    전체 보기
                  </button>
                }
              />
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {recommendedBenefits.map((benefit) => (
                  <BenefitCard
                    key={benefit.title}
                    {...benefit}
                    actionLabel="상세 보기"
                  />
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <SectionHeader title="프로필 요약" description="나이 · 지역 · 직업 상태" />
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>나이</span>
                  <span className="font-semibold text-slate-800">25세</span>
                </div>
                <div className="flex justify-between">
                  <span>지역</span>
                  <span className="font-semibold text-slate-800">서울</span>
                </div>
                <div className="flex justify-between">
                  <span>상태</span>
                  <span className="font-semibold text-slate-800">취업 준비중</span>
                </div>
              </div>
              <button className="btn-secondary mt-5 w-full">프로필 수정</button>
            </div>

            <div className="card p-6">
              <SectionHeader title="마감 임박 혜택" description="D-7 이내 혜택을 우선 표시" />
              <div className="mt-4 space-y-3">
                {recommendedBenefits.slice(0, 2).map((benefit) => (
                  <div key={benefit.title} className="rounded-xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-midnight">{benefit.title}</p>
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-danger">
                        {benefit.deadline}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{benefit.agency}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl px-6">
        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <div className="card p-6">
            <SectionHeader
              title="혜택 탐색"
              description="카테고리, 지역, 상태로 필터링"
              action={<button className="btn-primary px-4 py-2 text-xs">필터 열기</button>}
            />
            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  className="h-10 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-slate-300"
                  placeholder="혜택명, 기관명으로 검색"
                />
                <button className="rounded-full bg-midnight px-4 py-2 text-xs font-semibold text-white">
                  검색
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {filterChips.map((chip) => (
                  <button key={chip} className="pill border border-transparent hover:border-slate-200">
                    {chip}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {exploreBenefits.map((benefit) => (
                <article key={benefit.title} className="rounded-2xl border border-slate-100 p-4">
                  <h4 className="text-base font-semibold text-midnight">{benefit.title}</h4>
                  <p className="mt-1 text-xs text-slate-500">{benefit.agency}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>{benefit.amount}</span>
                    <span className="font-semibold text-slate-700">{benefit.deadline}</span>
                  </div>
                  <button className="btn-secondary mt-4 w-full px-4 py-2 text-xs">
                    북마크
                  </button>
                </article>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <SectionHeader
              title="캘린더"
              description="마감일을 한눈에 관리하세요"
              action={
                <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
                  {calendarYear}년 {calendarMonth}월
                </button>
              }
            />
            <CalendarGrid days={calendarDays} />
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> 신청 시작일
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400" /> 마감일
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-400" /> 마감 임박
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl px-6">
        <div className="card p-6">
          <SectionHeader
            title="내 혜택"
            description="북마크부터 신청 완료까지 상태를 관리하세요."
            action={
              <div className="flex gap-2 text-xs font-semibold text-slate-500">
                <button className="rounded-full bg-slate-900 px-4 py-2 text-white">북마크</button>
                <button className="rounded-full border border-slate-200 px-4 py-2">준비중</button>
                <button className="rounded-full border border-slate-200 px-4 py-2">신청완료</button>
                <button className="rounded-full border border-slate-200 px-4 py-2">수령완료</button>
              </div>
            }
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {myBenefits.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-midnight">{benefit.title}</h4>
                  <span className="pill">{benefit.status}</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">마감 {benefit.deadline}</p>
                <button className="mt-4 w-full rounded-full bg-midnight px-4 py-2 text-xs font-semibold text-white">
                  {benefit.action}
                </button>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">
              아직 북마크한 혜택이 없습니다.
              <button className="btn-secondary mt-3 px-4 py-2 text-xs">탐색으로 이동</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
