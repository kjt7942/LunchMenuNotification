import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "하네스_식단표 | 스마트 식단 관리 시스템",
  description: "하네스 엔지니어링 시스템 기반의 스마트 식단 관리 솔루션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen">
        <header className="fixed top-0 w-full z-50 glass-morphism py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-emerald-500 bg-clip-text text-transparent">
            HARNESS DIET
          </h1>
          <nav>
            <ul className="flex gap-6 text-sm font-medium">
              <li>오늘의 식단</li>
              <li>주간 리포트</li>
              <li>설정</li>
            </ul>
          </nav>
        </header>
        <main className="pt-24 px-6 max-w-4xl mx-auto">
          {children}
        </main>
        <footer className="py-10 text-center text-sm text-gray-500">
          © 2026 Harness Engineering. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
