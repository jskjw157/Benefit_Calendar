import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/benefits", label: "혜택 찾기" },
  { href: "/calendar", label: "캘린더" },
  { href: "/my-benefits", label: "내 혜택" }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-slate-200/60 bg-slate-950/80 backdrop-blur-xl"
      role="contentinfo"
      aria-label="사이트 푸터"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
        {/* Brand + description */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white/80">BenefitCal</span>
          <span className="hidden text-slate-500 sm:inline">—</span>
          <span className="hidden text-xs text-slate-400 sm:inline">
            정부·기관 혜택을 한 눈에 확인하고 마감일을 관리하세요.
          </span>
        </div>

        {/* Links */}
        <nav
          className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400"
          aria-label="푸터 링크"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-primary focus-visible:rounded-sm"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/feedback"
            className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-primary focus-visible:rounded-sm"
          >
            피드백
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-slate-500">
          &copy; {currentYear} BenefitCal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
