type CalendarDay = {
  day: number;
  status: "urgent" | "upcoming" | "normal";
  count: number;
};

type CalendarGridProps = {
  days: CalendarDay[];
  firstWeekday: number;
};

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarGrid({ days, firstWeekday }: CalendarGridProps) {
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
          <div
            key={item.day}
            className={`flex h-10 items-center justify-center rounded-xl text-xs font-semibold ${
              item.status === "urgent"
                ? "bg-red-100 text-danger"
                : item.status === "upcoming"
                ? "bg-amber-100 text-warning"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <span>{item.day}</span>
            {item.count > 0 && (
              <span className="ml-1 rounded-full bg-white px-1 text-[10px] text-slate-500">
                {item.count}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
