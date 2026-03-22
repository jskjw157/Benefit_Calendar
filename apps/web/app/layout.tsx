import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { ClientProviders } from "@/components/layout/client-providers";
import { cn } from "@/shared/lib/utils";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "Benefit Calendar",
  description: "청년 및 자영업자를 위한 맞춤형 혜택 캘린더",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body
        className={cn(
          "min-h-screen bg-slate-50 font-sans antialiased selection:bg-blue-100 selection:text-blue-900",
          notoSansKr.variable
        )}
      >
        {/* Background Noise/Gradient Effect */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />
        <div className="fixed inset-0 -z-10 h-full w-full bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-white opacity-40 pointer-events-none" />

        <ClientProviders>
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
