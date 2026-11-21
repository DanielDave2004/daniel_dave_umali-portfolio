"use client";

import { useCallback, useEffect, useState, type MouseEvent } from "react";

type Theme = "light" | "dark";

/** Shared theme state for the Overview and all inner pages. */
export function usePortfolioTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    let saved: string | null = null;
    try { saved = window.localStorage.getItem("portfolio-theme"); } catch { /* Storage may be disabled. */ }
    const initial: Theme = saved === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = initial;
    setTheme(initial);
  }, []);

  const toggleTheme = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === "dark" ? "light" : "dark";

    const applyTheme = () => {
      root.dataset.theme = next;
      try { window.localStorage.setItem("portfolio-theme", next); } catch { /* Keep the theme active without storage. */ }
      setTheme(next);
    };

    // Mobile avoids full-page snapshots, which can temporarily reveal
    // the off-canvas sidebar in some browsers.
    const smallScreen = window.matchMedia("(max-width: 760px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (smallScreen || reducedMotion || !document.startViewTransition) {
      applyTheme();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(applyTheme);
    void transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 500, easing: "ease-out", pseudoElement: "::view-transition-new(root)" },
      );
    }).catch(() => {});
  }, []);

  return { theme, toggleTheme };
}
