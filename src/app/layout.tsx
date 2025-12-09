import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dollyeo - 룰렛 애플리케이션",
  description: "질문과 참여자를 관리하고 룰렛으로 선택하는 애플리케이션",
};

// 초기 테마 설정 스크립트 (flash 방지)
const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('dollyeo-theme');
      var theme = 'system';
      if (stored) {
        var parsed = JSON.parse(stored);
        theme = parsed.state?.theme || 'system';
      }
      var isDark = theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.add(isDark ? 'dark' : 'light');
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
