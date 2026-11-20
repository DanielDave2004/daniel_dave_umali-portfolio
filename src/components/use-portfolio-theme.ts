"use client";

import { useCallback, useEffect, useState, type MouseEvent } from "react";

type Theme = "light" | "dark";

let pageAnimationTimer: ReturnType<typeof setTimeout> | undefined;

function animatePageSections() {
  const root = document.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.clearTimeout(pageAnimationTimer);
  root.removeAttribute("data-page-theme-animation");
  // Restart keyframe animations even when the visitor changes theme repeatedly.
  void root.offsetWidth;
  root.setAttribute("data-page-theme-animation", "true");
  pageAnimationTimer = window.setTimeout(() => {
    root.removeAttribute("data-page-theme-animation");
  }, 650);
}

/** Shared behavior across the Overview and all inner pages. */
export function usePortfolioTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme");
    const initial: Theme = saved === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = initial;
    setTheme(initial);
  }, []);

  const toggleTheme = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === "dark" ? "light" : "dark";
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const applyTheme = () => {
      root.dataset.theme = next;
      window.localStorage.setItem("portfolio-theme", next);
      setTheme(next);
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !document.startViewTransition) {
      applyTheme();
      if (!reduceMotion) animatePageSections();
      return;
    }

    // A circular reveal starts at the theme button and expands across the page.
    const transition = document.startViewTransition(applyTheme);
    void transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 560,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    }).catch(() => { /* A browser may cancel a transition during navigation. */ });
    // Let the circular reveal complete, then animate the actual page sections.
    void transition.finished.then(animatePageSections).catch(() => {});
  }, []);

  return { theme, toggleTheme };
}
