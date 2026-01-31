type StatCardProps = {
  label: string;
  value: string;
  detail: string;
};

export default function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-midnight">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
