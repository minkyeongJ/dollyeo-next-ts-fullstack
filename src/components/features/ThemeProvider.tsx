"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useThemeStore } from "@/store/uiStore";

// SSR에서 useLayoutEffect 경고 방지
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // 마운트 후 hydration 완료 표시
  useEffect(() => {
    setMounted(true);
  }, []);

  // 테마 적용 (레이아웃 이펙트로 빠르게 적용)
  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark: boolean) => {
      root.classList.remove("light", "dark");
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.add("light");
      }
    };

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      applyTheme(theme === "dark");
    }
  }, [theme]);

  // 초기 로딩 시 flash 방지를 위한 스크립트 (hydration 전 실행)
  useEffect(() => {
    // 로컬 스토리지에서 테마 읽어서 즉시 적용 (Zustand hydration 전)
    try {
      const stored = localStorage.getItem("dollyeo-theme");
      if (stored) {
        const { state } = JSON.parse(stored);
        const storedTheme = state?.theme;
        const root = document.documentElement;
        
        if (storedTheme === "dark") {
          root.classList.add("dark");
        } else if (storedTheme === "light") {
          root.classList.add("light");
        } else if (storedTheme === "system") {
          const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          if (isDark) {
            root.classList.add("dark");
          }
        }
      }
    } catch {
      // 에러 무시
    }
  }, []);

  return <>{children}</>;
}

