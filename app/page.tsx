"use client";

import { useMemo, useState } from "react";
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
const firstWeekday = new Date(calendarYear, calendarMonth - 1, 1).getDay();

const calendarDays = Array.from({ length: daysInMonth }, (_, index) => {
  const day = index + 1;
  return {
    day,
    status: day === 8 || day === 15 ? "urgent" : day === 21 ? "upcoming" : "normal",
    count: day % 6 === 0 ? 3 : day % 4 === 0 ? 2 : day % 5 === 0 ? 1 : 0
  };
});

const initialMyBenefits = [
  {
    id: "ub_001",
    title: "청년수당",
    statusKey: "PREPARING",
    statusLabel: "준비중",
    deadline: "D-7",
    action: "서류 업로드"
  },
  {
    id: "ub_002",
    title: "디지털 역량 교육",
    statusKey: "APPLIED",
    statusLabel: "신청완료",
    deadline: "결과 대기",
    action: "상태 변경"
  }
];

const filterChips = [
  { label: "청년", active: true },
  { label: "소상공인", active: false },
  { label: "주거", active: true },
  { label: "교육", active: false },
  { label: "서울", active: true },
  { label: "신청 중", active: false }
];

const benefitTabs = [
  { key: "BOOKMARKED", label: "북마크" },
  { key: "PREPARING", label: "준비중" },
  { key: "APPLIED", label: "신청완료" },
  { key: "RECEIVED", label: "수령완료" }
];
const exploreCount = 128;
const weeklyHighlights = [
  {
    title: "청년 월세 지원 마감",
    date: "1월 10일",
    tag: "D-5"
  },
  {
    title: "자기계발 지원금 오픈",
    date: "1월 12일",
    tag: "신규"
  },
  {
    title: "주거 안정 패키지 상담",
    date: "1월 14일",
    tag: "예약"
  }
];

export default function Home() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    filterChips.filter((chip) => chip.active).map((chip) => chip.label)
  );
  const [savedFilters, setSavedFilters] = useState<string[][]>([["청년", "주거", "서울"]]);
  const [activeBenefitTab, setActiveBenefitTab] = useState(benefitTabs[0].key);
  const [myBenefits, setMyBenefits] = useState(initialMyBenefits);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const calendarEvents = useMemo(
    () => ({
      8: [
        { title: "청년 월세 지원 마감", deadline: "D-5" },
        { title: "주거 안정 패키지 상담", deadline: "예약" }
      ],
      15: [
        { title: "자기계발 지원금 오픈", deadline: "신규" },
        { title: "디지털 역량 교육", deadline: "D-18" }
      ],
      21: [{ title: "청년 창업 보육", deadline: "D-28" }]
    }),
    []
  );

  const selectedDayEvents = selectedDay ? calendarEvents[selectedDay] ?? [] : [];
  const hasSelectedDay = selectedDay !== null;

  const filteredBenefits = myBenefits.filter((benefit) => benefit.statusKey === activeBenefitTab);

  const emptyMessages: Record<string, string> = {
    BOOKMARKED: "아직 북마크한 혜택이 없습니다.",
    PREPARING: "준비중인 혜택이 없습니다.",
    APPLIED: "신청 완료한 혜택이 없습니다.",
    RECEIVED: "수령 완료한 혜택이 없습니다."
  };

  const statusOptions = benefitTabs.map((tab) => ({
    value: tab.key,
    label: tab.label
  }));

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
                  <BenefitCard key={benefit.title} {...benefit} actionLabel="상세 보기" />
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

            <div className="card p-6">
              <SectionHeader
                title="이번 주 일정"
                description="다가오는 마감과 신규 오픈을 모아서 보여드려요."
                action={
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
                    전체 일정
                  </button>
                }
              />
              <div className="mt-5 space-y-3">
                {weeklyHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-midnight">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.date}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                      {item.tag}
                    </span>
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
              action={
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-600">
                    총 {exploreCount}건
                  </span>
                  <select
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"
                    defaultValue="deadline"
                  >
                    <option value="deadline">마감 임박순</option>
                    <option value="recent">최신 등록순</option>
                    <option value="popular">관심 많은순</option>
                  </select>
                  <button className="btn-primary px-4 py-2 text-xs">필터 열기</button>
                </div>
              }
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
                {filterChips.map((chip) => {
                  const isActive = selectedFilters.includes(chip.label);
                  return (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() =>
                        setSelectedFilters((prev) =>
                          prev.includes(chip.label)
                            ? prev.filter((item) => item !== chip.label)
                            : [...prev, chip.label]
                        )
                      }
                      className={`pill border ${
                        isActive
                          ? "border-midnight bg-white text-midnight"
                          : "border-transparent text-slate-500 hover:border-slate-200"
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="pill border border-transparent text-slate-500 hover:border-slate-200"
                >
                  + 필터 추가
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>선택된 필터 {selectedFilters.length}개</span>
                <button
                  type="button"
                  className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-600"
                  onClick={() => setSelectedFilters([])}
                >
                  초기화
                </button>
                <button
                  type="button"
                  className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-600"
                  onClick={() =>
                    setSavedFilters((prev) =>
                      selectedFilters.length ? [...prev, [...selectedFilters]] : prev
                    )
                  }
                >
                  저장
                </button>
              </div>
              {savedFilters.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {savedFilters.map((group, index) => (
                    <button
                      key={`saved-${index}`}
                      type="button"
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                      onClick={() => setSelectedFilters(group)}
                    >
                      저장 필터 {index + 1} · {group.join(", ")}
                    </button>
                  ))}
                </div>
              )}
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
                  <button className="btn-secondary mt-4 w-full px-4 py-2 text-xs">북마크</button>
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
            <CalendarGrid
              days={calendarDays}
              firstWeekday={firstWeekday}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
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
                {benefitTabs.map((tab) => (
                  <button
                    key={tab.label}
                    type="button"
                    className={
                      tab.key === activeBenefitTab
                        ? "rounded-full bg-slate-900 px-4 py-2 text-white"
                        : "rounded-full border border-slate-200 px-4 py-2"
                    }
                    onClick={() => setActiveBenefitTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            }
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filteredBenefits.length > 0 ? (
              filteredBenefits.map((benefit) => (
                <div key={benefit.id} className="rounded-2xl border border-slate-100 p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold text-midnight">{benefit.title}</h4>
                    <span className="pill">{benefit.statusLabel}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">마감 {benefit.deadline}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <select
                      value={benefit.statusKey}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setMyBenefits((prev) =>
                          prev.map((item) =>
                            item.id === benefit.id
                              ? {
                                  ...item,
                                  statusKey: nextValue,
                                  statusLabel:
                                    benefitTabs.find((tab) => tab.key === nextValue)?.label ??
                                    item.statusLabel
                                }
                              : item
                          )
                        );
                      }}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button className="rounded-full bg-midnight px-4 py-2 text-xs font-semibold text-white">
                      {benefit.action}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                {emptyMessages[activeBenefitTab]}
                <button className="btn-secondary mt-3 px-4 py-2 text-xs">탐색으로 이동</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {hasSelectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-midnight">
                  {calendarYear}년 {calendarMonth}월 {selectedDay}일 일정
                </h3>
                <p className="mt-1 text-xs text-slate-500">선택한 날짜의 혜택 일정입니다.</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                onClick={() => setSelectedDay(null)}
              >
                닫기
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((event) => (
                  <div
                    key={event.title}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <span className="text-sm font-semibold text-midnight">{event.title}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                      {event.deadline}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">등록된 일정이 없습니다.</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelectedDay(null)}
              className="btn-primary mt-5 w-full py-2 text-xs"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
