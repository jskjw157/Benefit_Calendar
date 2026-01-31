type BenefitCardProps = {
  title: string;
  agency: string;
  amount: string;
  deadline: string;
  tag?: string;
  actionLabel: string;
  highlight?: "urgent" | "upcoming";
};

export default function BenefitCard({
  title,
  agency,
  amount,
  deadline,
  tag,
  actionLabel,
  highlight
}: BenefitCardProps) {
  const highlightClass =
    highlight === "urgent"
      ? "bg-red-100 text-danger"
      : highlight === "upcoming"
      ? "bg-amber-100 text-warning"
      : "bg-slate-100 text-slate-600";

  return (
    <article className="rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center justify-between">
        {tag ? <span className="pill">{tag}</span> : <span />}
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${highlightClass}`}>
          {deadline}
        </span>
      </div>
      <h4 className="mt-4 text-lg font-semibold text-midnight">{title}</h4>
      <p className="mt-1 text-xs text-slate-500">{agency}</p>
      <p className="mt-3 text-sm font-semibold text-slate-700">{amount}</p>
      <button className="mt-4 w-full rounded-full bg-midnight px-4 py-2 text-xs font-semibold text-white">
        {actionLabel}
      </button>
    </article>
  );
}
