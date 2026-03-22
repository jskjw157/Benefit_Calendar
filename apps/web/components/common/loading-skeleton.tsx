type CardSkeletonProps = {
  /** Number of cards to render. Defaults to 3. */
  count?: number;
  /** Layout variant. "card" = tall card, "list" = wide row. Defaults to "card". */
  variant?: "card" | "list";
  className?: string;
};

/**
 * Reusable loading skeleton for benefit cards and list items.
 * Uses Tailwind `animate-pulse` for the shimmer effect.
 */
export function CardSkeleton({
  count = 3,
  variant = "card",
  className = ""
}: CardSkeletonProps) {
  return (
    <div
      className={[
        variant === "card"
          ? "grid gap-4 sm:grid-cols-2 md:grid-cols-3"
          : "flex flex-col gap-3",
        className
      ].join(" ")}
      aria-busy="true"
      aria-label="데이터를 불러오는 중입니다"
      role="status"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} variant={variant} />
      ))}
    </div>
  );
}

function SkeletonItem({ variant }: { variant: "card" | "list" }) {
  if (variant === "list") {
    return (
      <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-3/5 rounded-full bg-slate-200" />
            <div className="h-3 w-2/5 rounded-full bg-slate-100" />
          </div>
          <div className="h-6 w-14 rounded-full bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-12 rounded-full bg-slate-200" />
        <div className="h-5 w-10 rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-4/5 rounded-full bg-slate-200" />
        <div className="h-3 w-3/5 rounded-full bg-slate-100" />
      </div>
      <div className="mt-3 h-3.5 w-1/3 rounded-full bg-slate-200" />
      <div className="mt-5 h-8 w-full rounded-full bg-slate-200" />
    </div>
  );
}

type StatSkeletonProps = {
  count?: number;
  className?: string;
};

/** Skeleton for stat / summary cards in 3-column layout. */
export function StatSkeleton({ count = 3, className = "" }: StatSkeletonProps) {
  return (
    <div
      className={["grid gap-4 sm:grid-cols-3", className].join(" ")}
      aria-busy="true"
      aria-label="통계 데이터를 불러오는 중입니다"
      role="status"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-slate-100 bg-white p-5">
          <div className="h-3 w-2/5 rounded-full bg-slate-200" />
          <div className="mt-3 h-7 w-1/3 rounded-full bg-slate-300" />
          <div className="mt-2 h-3 w-3/5 rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
