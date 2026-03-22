type ErrorStateProps = {
  /** Heading text. Defaults to a generic error message. */
  title?: string;
  /** Optional detailed description shown below the title. */
  description?: string;
  /** Called when the user clicks the retry button. Omit to hide the button. */
  onRetry?: () => void;
  /** Label for the retry button. Defaults to "다시 시도". */
  retryLabel?: string;
  className?: string;
};

/**
 * Full-area error state with an icon, message, and optional retry action.
 * Designed to replace card/section content when a fetch or operation fails.
 */
export default function ErrorState({
  title = "오류가 발생했습니다",
  description = "잠시 후 다시 시도해 주세요.",
  onRetry,
  retryLabel = "다시 시도",
  className = ""
}: ErrorStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center",
        className
      ].join(" ")}
      role="alert"
      aria-live="assertive"
    >
      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-6 w-6 text-danger"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      <h3 className="text-base font-semibold text-midnight">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500">{description}</p>

      {onRetry !== undefined && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
