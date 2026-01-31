"use client";

import { useState } from "react";
import SectionHeader from "@/components/SectionHeader";

const channels = [
  { key: "EMAIL", label: "이메일" },
  { key: "SMS", label: "문자" },
  { key: "PUSH", label: "푸시" }
];

const schedules = [
  { key: "7", label: "마감 7일 전" },
  { key: "3", label: "마감 3일 전" },
  { key: "1", label: "마감 1일 전" }
];

export default function NotificationSettingsPage() {
  const [enabled, setEnabled] = useState(true);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["EMAIL", "PUSH"]);
  const [selectedSchedule, setSelectedSchedule] = useState("3");

  return (
    <main className="min-h-screen bg-surface pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              BenefitCal MVP
            </p>
            <h1 className="text-2xl font-semibold text-midnight">알림 설정</h1>
          </div>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
            저장
          </button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-5xl px-6 pt-10">
        <div className="card p-8">
          <SectionHeader title="알림 기본 설정" description="혜택 마감 및 신규 혜택 알림을 관리하세요." />
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
            <div>
              <p className="text-sm font-semibold text-midnight">알림 활성화</p>
              <p className="mt-1 text-xs text-slate-500">끄면 모든 알림이 중지됩니다.</p>
            </div>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                enabled ? "bg-midnight text-white" : "border border-slate-200 text-slate-500"
              }`}
              onClick={() => setEnabled((prev) => !prev)}
            >
              {enabled ? "ON" : "OFF"}
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-100 p-4">
            <p className="text-sm font-semibold text-midnight">알림 채널</p>
            <p className="mt-1 text-xs text-slate-500">받고 싶은 채널을 선택하세요.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {channels.map((channel) => {
                const isActive = selectedChannels.includes(channel.key);
                return (
                  <button
                    key={channel.key}
                    type="button"
                    onClick={() =>
                      setSelectedChannels((prev) =>
                        prev.includes(channel.key)
                          ? prev.filter((item) => item !== channel.key)
                          : [...prev, channel.key]
                      )
                    }
                    className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                      isActive
                        ? "border-midnight bg-white text-midnight"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    {channel.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-100 p-4">
            <p className="text-sm font-semibold text-midnight">알림 시점</p>
            <p className="mt-1 text-xs text-slate-500">마감 전 알림을 언제 받을지 선택하세요.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {schedules.map((schedule) => (
                <button
                  key={schedule.key}
                  type="button"
                  onClick={() => setSelectedSchedule(schedule.key)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                    selectedSchedule === schedule.key
                      ? "border-midnight bg-white text-midnight"
                      : "border-slate-200 text-slate-500"
                  }`}
                >
                  {schedule.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500">
            <p>현재 설정</p>
            <p className="mt-2">
              알림 상태: {enabled ? "활성화" : "비활성화"} · 채널: {selectedChannels.join(", ")}
              · 시점: 마감 {selectedSchedule}일 전
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
