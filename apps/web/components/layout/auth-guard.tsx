"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthGuardProps = {
  children: React.ReactNode;
};

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

function getAuthToken(): string {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("bc_token") ??
    // Fallback: check document.cookie for bc_token
    (document.cookie
      .split("; ")
      .find((row) => row.startsWith("bc_token="))
      ?.split("=")[1] ?? "")
  );
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const token = getAuthToken();
    if (token.length === 0) {
      setStatus("unauthenticated");
      router.replace("/login");
    } else {
      setStatus("authenticated");
    }
  }, [router]);

  if (status === "loading") {
    return (
      <div
        className="min-h-screen bg-surface"
        role="status"
        aria-label="인증 확인 중"
        aria-live="polite"
      >
        <AuthLoadingSkeleton />
      </div>
    );
  }

  if (status === "unauthenticated") {
    // Render nothing while redirect is in flight
    return null;
  }

  return <>{children}</>;
}

function AuthLoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse px-4 py-10 sm:px-6">
      {/* Header skeleton */}
      <div className="mb-8 h-20 rounded-2xl bg-slate-200/70" />

      {/* Content skeletons */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-200/70" />
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-slate-200/70" />
        ))}
      </div>
    </div>
  );
}
