import Link from "next/link";

type EmptyStateAction =
  | { type: "link"; href: string; label: string }
  | { type: "button"; onClick: () => void; label: string };

type EmptyStateProps = {
  /** Main heading. Required. */
  title: string;
  /** Supporting text below the heading. */
  description?: string;
  /** Optional CTA — either an internal link or a callback button. */
  action?: EmptyStateAction;
  /** Optional SVG illustration slot. Defaults to a built-in box icon. */
  illustration?: React.ReactNode;
  className?: string;
};

/**
 * Generic empty-state component for lists, tabs, and search results with
 * no data. Accepts an optional action to guide users toward next steps.
 */
export default function EmptyState({
  title,
  description,
  action,
  illustration,
  className = ""
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center",
        className
      ].join(" ")}
      role="region"
      aria-label={title}
    >
      {/* Illustration slot */}
      <div className="mb-4" aria-hidden="true">
        {illustration ?? <DefaultIllustration />}
      </div>

      <h3 className="text-base font-semibold text-midnight">{title}</h3>

      {description !== undefined && description !== "" && (
        <p className="mt-1.5 max-w-xs text-sm text-slate-500">{description}</p>
      )}

      {action !== undefined && (
        <div className="mt-5">
          {action.type === "link" ? (
            <Link
              href={action.href}
              className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-primary"
            >
              {action.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function DefaultIllustration() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
      <svg
        className="h-7 w-7 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    </div>
  );
}
