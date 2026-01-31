"use client";

type CalendarDay = {
  day: number;
  status: "urgent" | "upcoming" | "normal";
  count: number;
};

type CalendarGridProps = {
  days: CalendarDay[];
  firstWeekday: number;
  selectedDay?: number | null;
  onSelectDay?: (day: number) => void;
};

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarGrid({
  days,
  firstWeekday,
  selectedDay,
  onSelectDay
}: CalendarGridProps) {
  const offsetDays = Array.from({ length: firstWeekday });

  return (
    <div>
      <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400">
        {dayLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-2">
        {offsetDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-10" aria-hidden="true" />
        ))}
        {days.map((item) => (
          <button
            key={item.day}
            type="button"
            onClick={() => onSelectDay?.(item.day)}
            className={`flex h-10 items-center justify-center rounded-xl text-xs font-semibold transition ${
              item.status === "urgent"
                ? "bg-red-100 text-danger"
                : item.status === "upcoming"
                ? "bg-amber-100 text-warning"
                : "bg-slate-100 text-slate-600"
            } ${selectedDay === item.day ? "ring-2 ring-midnight ring-offset-2" : ""}`}
          >
            <span>{item.day}</span>
            {item.count > 0 && (
              <span className="ml-1 rounded-full bg-white px-1 text-[10px] text-slate-500">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
