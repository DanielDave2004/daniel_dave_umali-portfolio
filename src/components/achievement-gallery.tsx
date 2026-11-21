"use client";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Award, Trophy, CalendarDays, Image as ImageIcon, X, ExternalLink } from "lucide-react";
import { certifications, competitions } from "@/data/portfolio";

type Item = { id: string; type: "Certification" | "Competition"; title: string; source: string; date: string; description: string; image: string; imageIsSample: boolean; url: string; detail?: string };
const entries: Item[] = [
  ...certifications.map(c => ({id:c.id, type:"Certification" as const, title:c.title, source:c.issuer, date:c.date, description:c.description, image:c.image, imageIsSample:c.imageIsSample, url:c.credentialUrl, detail:c.category})),
  ...competitions.map(c => ({id:c.id, type:"Competition" as const, title:c.title, source:c.organizer, date:c.date, description:c.description, image:c.image, imageIsSample:c.imageIsSample, url:c.link, detail:c.result})),
];
export function AchievementGallery() {
 const [active,setActive] = useState<Item|null>(null);
 const [filter,setFilter] = useState("All");
 const closeRef = useRef<HTMLButtonElement>(null);
 useEffect(() => {
  if (!active) return;
  function onKey(event: KeyboardEvent) { if (event.key === "Escape") setActive(null); }
  document.addEventListener("keydown",onKey);
  const before=document.body.style.overflow;
  document.body.style.overflow="hidden";
  document.documentElement.classList.add("modal-open");
  document.body.classList.add("modal-open");
  const previousFocus = document.activeElement as HTMLElement | null;
  closeRef.current?.focus();
  return () => {
   document.removeEventListener("keydown",onKey);
   document.body.style.overflow=before;
   document.documentElement.classList.remove("modal-open");
   document.body.classList.remove("modal-open");
   previousFocus?.focus();
  };
 },[active]);
 return <><div className="achievement-filter" role="group" aria-label="Filter achievements">{["All","Certification","Competition"].map(f=><button key={f} className={filter===f?"chosen":""} onClick={()=>setFilter(f)}>{f === "All" ? "All" : `${f}s`}</button>)}</div>
 <div className="achievement-grid">{entries.filter(e => filter === "All" || e.type === filter).map(item => <article className="achievement-card" key={item.id}>
  <button className="achievement-image-trigger" onClick={()=>setActive(item)} aria-label={`View image for ${item.title}`}>
   <img src={item.image} alt={`${item.type} image for ${item.title}`} loading="lazy" />
   <span className="achievement-zoom"><ImageIcon size={15}/> View image</span>
  </button>
  <div className="achievement-card-body"><span className="eyebrow">{item.type === "Certification" ? <Award size={14}/> : <Trophy size={14}/>} {item.type}</span><h3>{item.title}</h3><p className="achievement-source">{item.source}</p><p>{item.description}</p><div className="achievement-meta"><span><CalendarDays size={14}/>{item.date}</span><span>{item.detail}</span></div>{item.url && <a href={item.url} target="_blank" rel="noopener noreferrer">Verify / learn more <ExternalLink size={14}/></a>}</div>
 </article>)}</div>
 {active && createPortal(<div className="achievement-modal-backdrop" onMouseDown={e => {if(e.target===e.currentTarget)setActive(null);}}><section className="achievement-modal" role="dialog" aria-modal="true" aria-label={active.title}>
  <div className="achievement-modal-header"><div><strong>{active.title}</strong><span>{active.type} · {active.date}</span></div><button ref={closeRef} onClick={()=>setActive(null)} className="icon-button" aria-label="Close image"><X size={22}/></button></div>
  <div className="achievement-modal-image"><img src={active.image} alt={`${active.title} credential`}/></div>
 </section></div>, document.body)}
 </>;
}
