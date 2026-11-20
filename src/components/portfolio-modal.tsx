"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export function PortfolioModal({ open, onClose, title, children, className = "" }: {open: boolean; onClose: () => void; title: string; children: ReactNode; className?: string}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = oldOverflow; previous?.focus(); };
  }, [open, onClose]);
  if (!open) return null;
  return <div role="presentation" className="portfolio-modal-shade" onMouseDown={event => {if(event.target === event.currentTarget) onClose();}}>
    <section className={`portfolio-modal-window ${className}`} role="dialog" aria-modal="true" aria-label={title}>
      <div className="portfolio-modal-toolbar"><strong>{title}</strong><button ref={closeRef} type="button" aria-label="Close modal" className="portfolio-modal-close" onClick={onClose}><X size={19}/></button></div>
      <div className="portfolio-modal-content">{children}</div>
    </section>
  </div>;
}
