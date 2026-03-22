"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  authRequired?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "홈" },
  { href: "/benefits", label: "혜택 찾기" },
  { href: "/calendar", label: "캘린더" },
  { href: "/my-benefits", label: "내 혜택", authRequired: true }
];

// Temporary auth state — replace with real auth context when available.
// Reads from localStorage key "bc_token" as a simple JWT presence check.
function useAuthState() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? (localStorage.getItem("bc_token") ?? "")
        : "";
    setIsLoggedIn(token.length > 0);
  }, []);

  const logout = () => {
    localStorage.removeItem("bc_token");
    setIsLoggedIn(false);
  };

  return { isLoggedIn, logout };
}

export default function Navigation() {
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuthState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Darken nav background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.authRequired || isLoggedIn
  );

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full border-b transition-colors duration-300",
        scrolled
          ? "border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm"
          : "border-slate-200/40 bg-white/60 backdrop-blur-xl"
      ].join(" ")}
      role="banner"
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex flex-col leading-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:rounded-sm"
          aria-label="BenefitCal 홈으로 이동"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            BenefitCal
          </span>
          <span className="text-base font-semibold text-midnight">혜택 캘린더</span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="주요 메뉴"
        >
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary",
                isActive(item.href)
                  ? "bg-midnight text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-midnight"
              ].join(" ")}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth area */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full bg-midnight px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-primary"
                aria-haspopup="true"
                aria-expanded={profileOpen}
                aria-label="프로필 메뉴 열기"
              >
                <span>내 계정</span>
                <svg
                  className={`h-3 w-3 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 rounded-2xl border border-slate-100 bg-white py-1 shadow-card"
                  role="menu"
                  aria-label="프로필 드롭다운"
                >
                  <Link
                    href="/settings"
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-midnight"
                    role="menuitem"
                  >
                    설정
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full px-4 py-2.5 text-left text-sm text-danger hover:bg-red-50"
                    role="menuitem"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-primary"
            >
              로그인
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 md:hidden focus-visible:outline-2 focus-visible:outline-primary"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          <span className="sr-only">{mobileOpen ? "메뉴 닫기" : "메뉴 열기"}</span>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu — CSS slide transition */}
      <div
        id="mobile-nav"
        role="navigation"
        aria-label="모바일 메뉴"
        className={[
          "overflow-hidden border-t border-slate-100 bg-white/90 backdrop-blur-xl transition-all duration-300 ease-in-out md:hidden",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        ].join(" ")}
      >
        <nav className="flex flex-col px-4 pb-4 pt-2">
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-midnight text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-midnight"
              ].join(" ")}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-3 border-t border-slate-100 pt-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/settings"
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  설정
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-danger hover:bg-red-50"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white"
              >
                로그인
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
