"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { portfolio } from "@/data/portfolio";

export function ProjectDirectory() {
  const [term, setTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Development", "Academic"];
  const items = useMemo(() => portfolio.projects.filter(p => {
    const category = filter === "All" || (filter === "Development" ? p.category.includes("WEB") : !p.category.includes("WEB"));
    return category && `${p.title} ${p.description} ${p.stack.join(" ")}`.toLowerCase().includes(term.toLowerCase());
  }), [term, filter]);
  return <><div className="directory-toolbar"><div className="directory-search"><Search size={17}/><input aria-label="Search projects" placeholder="Search projects or technologies" value={term} onChange={e=>setTerm(e.target.value)}/></div><div className="directory-filters">{categories.map(c=><button key={c} className={filter === c ? "active" : ""} onClick={()=>setFilter(c)}>{c}</button>)}</div></div><div className="directory-list">{items.map((project) => <Link href={`/projects/${project.slug}`} key={project.slug} className="directory-project panel"><div className={`directory-project-preview directory-project-preview--${project.type}`} style={{backgroundImage:`linear-gradient(120deg,rgba(18,18,18,.55),rgba(18,18,18,.2)),url(${project.coverImage})`,backgroundSize:"cover",backgroundPosition:"center"}}><span>{project.number} / PROJECT</span><strong>{project.title}</strong></div><div className="directory-project-content"><div className="directory-meta"><span>{project.category}</span><span>{project.status}</span></div><h2>{project.title}</h2><p>{project.description}</p><div className="tag-list">{project.stack.map(tag=><span key={tag}>{tag}</span>)}</div><span className="directory-view">View project details <ArrowUpRight size={16}/></span></div></Link>)}{items.length === 0 && <div className="panel empty-state">No projects found. Try another keyword or category.</div>}</div></>;
}
