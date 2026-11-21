"use client";

import { useState, type ReactNode } from "react";
import { usePortfolioTheme } from "@/components/use-portfolio-theme";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ArrowUpRight, Award, BriefcaseBusiness, Layers3, FileText, Github, GraduationCap, Home, Linkedin, Mail, MapPin, Menu, Moon, Gamepad2, Sun, Trophy, UserRound, X } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { BrandLogo } from "@/components/brand-logo";

const navigation = [
  { href: "/", title: "Overview", icon: Home },
  { href: "/about", title: "About", icon: UserRound },
  { href: "/projects", title: "Projects", icon: BriefcaseBusiness },
  { href: "/achievements", title: "Achievements", icon: Award },
  { href: "/skills", title: "Tech stack", icon: Layers3 },
  { href: "/education", title: "Education", icon: GraduationCap },
  { href: "/activity", title: "Activity", icon: Activity },
  { href: "/contact", title: "Contact", icon: Mail },
  { href: "/game", title: "Game", icon: Gamepad2 },
];

export function InnerShell({ children, title, description, eyebrow = "PORTFOLIO" }: {children: ReactNode; title: string; description: string; eyebrow?: string}) {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = usePortfolioTheme();
  return <div className="site-shell">
    <header className="topbar"><div className="topbar-inner inner-topbar">
      <button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={20}/></button>
      <Link className="brand" href="/"><span className="brand-mark" style={{width:46,height:36,padding:0,border:0,background:"transparent",color:"var(--text)",borderRadius:0,flexShrink:0}}><BrandLogo style={{width:"100%",height:"100%",display:"block"}} /></span><span className="brand-name">{portfolio.name}<small>DEVELOPER SPACE</small></span></Link>
      <nav className="inner-quick-links" aria-label="Quick links"><Link href="/projects">Projects</Link><Link href="/achievements">Achievements</Link></nav>
      <button className="icon-button inner-theme" onClick={toggleTheme} aria-label="Toggle dark mode">{theme === "light" ? <Moon size={19}/> : <Sun size={19}/>}</button>
    </div></header>
    {menuOpen && <button className="drawer-shade inner-shade" aria-label="Close navigation" onClick={() => setMenuOpen(false)}/>}
    <div className="layout">
      <aside className={`left-sidebar ${menuOpen ? "left-sidebar--open" : ""}`}>
        <div className="mobile-drawer-head"><strong>Navigation</strong><button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={19}/></button></div>
        <Link href="/" className="side-intro"><div><strong>{portfolio.name}</strong><span>Developer profile</span></div></Link>
        <span className="side-label">MENU</span>
        <nav className="side-nav" aria-label="Main navigation">{navigation.map(({href,title,icon: Icon}) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={href === "/" ? (path === href ? "selected" : "") : (path === href || path.startsWith(`${href}/`) ? "selected" : "")}><Icon size={18}/><span>{title}</span></Link>)}</nav>
        <div className="side-divider"/><span className="side-label">CONNECT</span>
        <nav className="side-nav side-nav--secondary"><a href={portfolio.github} target="_blank" rel="noreferrer"><Github size={18}/>GitHub<ArrowUpRight className="side-ext" size={14}/></a><a href={portfolio.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18}/>LinkedIn<ArrowUpRight className="side-ext" size={14}/></a></nav>
        <div className="side-footer">{portfolio.availability}<p>© {new Date().getFullYear()} {portfolio.name}</p></div>
      </aside>
      <main className="main-column inner-main"><div className="inner-page-heading panel"><div className="inner-heading-cover"><span>{eyebrow} / {title.toUpperCase()}</span><span>DEVELOPER SPACE</span></div><div className="inner-heading-body"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p><div className="inner-breadcrumb"><Link href="/">Home</Link><span>/</span><strong>{title}</strong></div></div></div>{children}
      <footer className="main-footer"><span>© {new Date().getFullYear()} {portfolio.name}</span><span>Next.js · TypeScript · CSS</span></footer></main>
      <aside className="right-sidebar"><div className="right-panel panel"><div className="right-heading"><h2>Profile details</h2><span>ABOUT</span></div><div className="detail-row"><MapPin size={17}/><span>Based in <strong>{portfolio.location}</strong></span></div><div className="detail-row"><GraduationCap size={17}/><span>{portfolio.education.degree}</span></div><div className="detail-row"><FileText size={17}/><span>{portfolio.availability}</span></div><Link className="full-width-action" href="/about">Read my profile <ArrowUpRight size={15}/></Link></div><div className="right-panel panel"><div className="right-heading"><h2>Browse sections</h2><span>EXPLORE</span></div><div className="inner-side-pages">{navigation.slice(2).map(({href,title,icon: Icon}) => <Link href={href} key={href}><Icon size={16}/>{title}<ArrowUpRight size={13}/></Link>)}</div></div><div className="sidebar-note">Content is editable in <code>src/data/portfolio.ts</code>.</div></aside>
    </div>
  </div>;
}

export function PageSection({ title, label, children }: {title: string; label?: string; children: ReactNode}) {
  return <section className="panel inner-section"><div className="inner-section-title"><div>{label && <span className="eyebrow">{label}</span>}<h2>{title}</h2></div></div>{children}</section>;
}

export function ExampleLabel({ example }: {example: boolean}) {return example ? <span className="example-pill">EXAMPLE · REPLACE ME</span> : null;}
