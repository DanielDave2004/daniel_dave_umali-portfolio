"use client";

import { useEffect, useRef } from "react";

/** Mouse-only enhancement. Touch devices and reduced-motion users retain the normal cursor. */
export function CircleCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const root = document.documentElement;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let x = -100;
    let y = -100;
    let ringX = -100;
    let ringY = -100;
    let raf = 0;

    root.classList.add("has-circle-cursor");

    const render = () => {
      ringX += (x - ringX) * 0.22;
      ringY += (y - ringY) * 0.22;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      raf = window.requestAnimationFrame(render);
    };
    const move = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      ring.classList.add("cursor-visible");
      dot.classList.add("cursor-visible");
      const target = event.target;
      const interactive = target instanceof Element && Boolean(target.closest('a, button, [role="button"], label, select'));
      const typing = target instanceof Element && Boolean(target.closest('input, textarea, [contenteditable="true"]'));
      ring.classList.toggle("cursor-active", interactive);
      dot.classList.toggle("cursor-typing", typing);
      ring.classList.toggle("cursor-typing", typing);
    };
    const leave = () => {
      ring.classList.remove("cursor-visible");
      dot.classList.remove("cursor-visible");
    };
    const down = () => ring.classList.add("cursor-pressed");
    const up = () => ring.classList.remove("cursor-pressed");

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    window.addEventListener("blur", leave);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    raf = window.requestAnimationFrame(render);
    return () => {
      root.classList.remove("has-circle-cursor");
      window.cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      window.removeEventListener("blur", leave);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return <div className="circle-cursor-layer" aria-hidden="true"><div ref={ringRef} className="circle-cursor-ring"/><div ref={dotRef} className="circle-cursor-dot"/></div>;
}
