import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BenefitCal MVP",
  description: "혜택 캘린더 MVP 대시보드"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-surface text-slate-900">
        {children}
      </body>
    </html>
  );
}
