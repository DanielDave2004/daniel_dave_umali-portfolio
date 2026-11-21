"use client";

import { ResumeModalButton } from "@/components/resume-modal";
import { media } from "@/data/media";
import { BrandLogo } from "@/components/brand-logo";

import { useMemo, useState } from "react";
import { usePortfolioTheme } from "@/components/use-portfolio-theme";
import {
  ArrowRight, ArrowUpRight, BriefcaseBusiness, Check,
  ChevronDown, Code2, Copy, ExternalLink, FileText, Github, GraduationCap,
  Home, Linkedin, Mail, MapPin, Menu, Moon, Search, Send, Sun, UserRound,
  X, Layers3, CalendarDays, MessageCircle, Gamepad2,
} from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { TechItem, TechLogo } from "@/components/tech-logo";
import Link from "next/link";
import { GithubContributions } from "@/components/github-contributions";

const nav = [
  { href: "/", name: "Overview", Icon: Home },
  { href: "/about", name: "About me", Icon: UserRound },
  { href: "/projects", name: "Projects", Icon: BriefcaseBusiness },
  { href: "/achievements", name: "Achievements", Icon: GraduationCap },
  { href: "/skills", name: "Tech stack", Icon: Code2 },
  { href: "/education", name: "Education", Icon: GraduationCap },
  { href: "/activity", name: "Activity", Icon: CalendarDays },
  { href: "/contact", name: "Contact", Icon: Mail },
  { href: "/game", name: "Game", Icon: Gamepad2 },
];

function monogram(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join("") || "YN";
}

function Avatar({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  return <span className={`avatar avatar--${size}`} aria-label={`Illustrative avatar for ${portfolio.name}`}><img className="portfolio-avatar-img" src={media.avatar} alt="" /></span>;
}

function Heading({ kicker, title, id, right }: { kicker: string; title: string; id?: string; right?: React.ReactNode }) {
  return <div className="section-heading" id={id}><div><span className="eyebrow">{kicker}</span><h2>{title}</h2></div>{right}</div>;
}

function ProjectArt({ type, number }: { type: string; number: string }) {
  return <div className={`project-art project-art--${type}`} aria-hidden="true">
    <div className="art-top"><span className="art-dots"><i /><i /><i /></span><span>PROJECT / {number}</span></div>
    {type === "thesis" ? <div className="art-thesis"><FileText size={35} strokeWidth={1.4}/><span>RESEARCH<br/>AND SYSTEMS</span><div className="art-lines"><i/><i/><i/></div></div> : type === "portfolio" ? <div className="art-portfolio"><span className="art-mini-label">DEVELOPER PORTFOLIO</span><strong>Crafted<br/>for the web<span>.</span></strong><span className="art-mini-button">Explore work <ArrowUpRight size={12}/></span></div> : <div className="art-future"><Layers3 size={52} strokeWidth={1}/><strong>WHAT&apos;S NEXT?</strong><span>Always building, always learning.</span></div>}
  </div>;
}

export default function OverviewPage() {
  const { theme, toggleTheme } = usePortfolioTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("All work");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const year = new Date().getFullYear();

  const filteredProjects = useMemo(() => portfolio.projects.filter((p) => {
    const matchCategory = projectFilter === "All work" || (projectFilter === "Development" ? p.category.includes("WEB") : p.category.includes("CAPSTONE") || p.category.includes("ACADEMIC"));
    const text = `${p.title} ${p.description} ${p.stack.join(" ")}`.toLowerCase();
    return matchCategory && text.includes(query.toLowerCase());
  }), [projectFilter, query]);

  async function copyEmail() {
    try { await navigator.clipboard.writeText(portfolio.email); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    catch { window.location.href = `mailto:${portfolio.email}`; }
  }

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
    setSearchOpen(false);
  }

  return <div className="site-shell" id="top">
    <header className="topbar">
      <div className="topbar-inner">
        <button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={21}/></button>
        <button className="brand" onClick={() => jump("top")} aria-label="Go to top"><span className="brand-mark brand-mark--logo"><BrandLogo className="brand-logo-svg" /></span><span className="brand-name">{portfolio.name}<small>DEVELOPER SPACE</small></span></button>
        <div className="header-search"><Search size={17}/><input aria-label="Search projects" placeholder="Search projects and skills..." value={query} onChange={e => {setQuery(e.target.value);setSearchOpen(Boolean(e.target.value));}} onFocus={() => setSearchOpen(Boolean(query))}/><kbd>/</kbd>{searchOpen && <div className="search-results"><span className="eyebrow">SEARCH RESULTS</span>{filteredProjects.length ? filteredProjects.map(p => <button key={p.number} onClick={() => jump("projects")}><BriefcaseBusiness size={15}/>{p.title}<ArrowRight size={14}/></button>) : <p>No matching projects. Try a different keyword.</p>}</div>}</div>
        <nav className="header-links" aria-label="Quick links"><Link href="/projects">Work</Link><Link href="/achievements">Achievements</Link></nav>
        <div className="header-actions"><button className="icon-button theme-button" title="Toggle theme" aria-label="Toggle theme" onClick={toggleTheme}>{theme === "light" ? <Moon size={19}/> : <Sun size={19}/>}</button></div>
      </div>
    </header>
    {mobileOpen && <div className="drawer-shade" onClick={() => setMobileOpen(false)}/>}
    <div className="layout">
      <aside className={`left-sidebar ${mobileOpen ? "left-sidebar--open" : ""}`}>
        <div className="mobile-drawer-head"><strong>Navigation</strong><button className="icon-button" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={20}/></button></div>
        <div className="side-intro"><Avatar/><div><strong>{portfolio.name}</strong><span>Developer profile</span></div></div>
        <span className="side-label">MENU</span>
        <nav className="side-nav" aria-label="Main navigation">{nav.map(({href,name,Icon}) => <Link key={href} href={href} className={href === "/" ? "selected" : ""}><Icon size={19} strokeWidth={1.9}/><span>{name}</span>{href === "/" && <span className="active-indicator"/>}</Link>)}</nav>
        <div className="side-divider"/>
        <span className="side-label">CONNECT</span>
        <div className="side-nav side-nav--secondary"><a href={portfolio.github} target="_blank" rel="noreferrer"><Github size={19}/>GitHub<ArrowUpRight className="side-ext" size={14}/></a><a href={portfolio.linkedin} target="_blank" rel="noreferrer"><Linkedin size={19}/>LinkedIn<ArrowUpRight className="side-ext" size={14}/></a></div>
        <div className="side-footer"><span className="online-pulse"/>Open to opportunities<p>© {year} {portfolio.name}</p></div>
      </aside>
      <main className="main-column" id="overview">
        <div className="profile-card panel">
          <div className="cover-art" style={{backgroundImage:`linear-gradient(90deg,rgba(10,10,10,.25),rgba(10,10,10,.08)),url(${media.cover})`,backgroundSize:"cover",backgroundPosition:"center"}}><span className="cover-kicker">DESIGN / DEVELOPMENT / IDEAS</span><div className="cover-graphic"><span className="cover-circle cover-circle-one"/><span className="cover-circle cover-circle-two"/><span className="cover-circle cover-circle-three"/></div><span className="cover-right">PORTFOLIO<br/>{year}</span></div>
          <div className="profile-content"><div className="profile-row"><Avatar size="large"/><div className="profile-buttons"><a className="button button-primary" href={`mailto:${portfolio.email}`}><Mail size={16}/> Get in touch</a><ResumeModalButton/></div></div>
          <div className="profile-info"><div className="name-line"><h1>{portfolio.name}</h1></div><p className="profile-role">{portfolio.role}</p><p className="profile-intro">{portfolio.intro}</p><div className="meta-line"><span><MapPin size={15}/>{portfolio.location}</span><span><span className="status-dot"/>{portfolio.availability}</span></div></div></div>
          <div className="profile-tabs" aria-label="Portfolio pages"><Link href="/activity">Posts & activity</Link><Link href="/projects">Projects</Link><Link href="/achievements">Achievements</Link></div>
        </div>

        <section className="feed-intro panel"><div className="feed-avatar"><Avatar size="small"/></div><div><strong>Hi, welcome to my corner of the internet.</strong><p>A little about what I do, what I&apos;m learning, and what I&apos;m building.</p></div><button className="simple-arrow" onClick={() => jump("about")} aria-label="Read about me"><ArrowRight size={20}/></button></section>


        <section className="content-panel panel" id="about"><Heading kicker="01 / PROFILE" title="A little about me"/><div className="about-copy"><p>{portfolio.summary}</p><p>I am seeking on-the-job training where I can contribute to real IT work while continuing to build my skills.</p></div><div className="three-stats"><div><strong>BSCS</strong><span>Academic background</span></div><div><strong>Full-stack</strong><span>Area of interest</span></div><div><strong>Always</strong><span>Learning & improving</span></div></div></section>

        <section className="content-panel panel" id="projects"><Heading kicker="02 / SELECTED WORK" title="Projects & work" right={<span className="section-count">{filteredProjects.length.toString().padStart(2,"0")} PROJECTS</span>}/><div className="filter-row"><div className="filter-buttons">{["All work", "Development", "Academic"].map(filter => <button key={filter} className={projectFilter === filter ? "chosen" : ""} onClick={() => setProjectFilter(filter)}>{filter}</button>)}</div><span className="project-context">A record of things I&apos;ve worked on</span></div><div className="projects-list">{filteredProjects.map((p) => <article className="project-item" key={p.number}><ProjectArt type={p.type} number={p.number}/><div className="project-details"><div className="project-topline"><span>{p.category}</span><span>{p.number} / 0{portfolio.projects.length}</span></div><h3><Link href={`/projects/${p.slug}`}>{p.title}</Link></h3><p>{p.description}</p><div className="tag-list">{p.stack.map(tag => <span key={tag}>{tag}</span>)}</div><Link href={`/projects/${p.slug}`} className="project-link">View case study<ArrowUpRight size={16}/></Link></div></article>)}{filteredProjects.length === 0 && <div className="empty-projects">No projects match this search. <button onClick={() => {setQuery("");setProjectFilter("All work");}}>Clear filters</button></div>}</div></section>

        <section className="content-panel panel" id="skills"><Heading kicker="03 / WHAT I USE" title="Tools & technologies"/><p className="section-description">Technologies and tools I use or am currently developing my skills in.</p><div className="skill-groups">{portfolio.skills.map(group => <div className="skill-group" key={group.category}><div className="skill-group-title"><Code2 size={17}/><h3>{group.category}</h3></div><div className="tech-grid">{group.items.map(item => <TechItem key={item} name={item}/>)}</div></div>)}</div></section>

        <section className="content-panel panel" id="github-activity"><Heading kicker="04 / GITHUB" title="GitHub contributions"/><GithubContributions compact /></section>

        <section className="content-panel panel" id="education"><Heading kicker="05 / BACKGROUND" title="Education"/><div className="education-card"><div className="education-icon"><GraduationCap size={23}/></div><div><span className="eyebrow">ACADEMIC BACKGROUND</span><h3>{portfolio.education.degree}</h3><strong>{portfolio.education.school}</strong><p>{portfolio.education.description}</p><span className="education-date"><CalendarDays size={14}/>{portfolio.education.period}</span></div></div></section>

        <section className="contact-panel panel" id="contact"><span className="eyebrow">05 / GET IN TOUCH</span><h2>Have something in mind?<br/><span>Let&apos;s connect.</span></h2><p>Whether it&apos;s a project, an internship opportunity, or simply a conversation about technology, feel free to reach out.</p><div className="contact-actions"><a className="button button-primary" href={`mailto:${portfolio.email}`}><Send size={16}/> Send an email <ArrowUpRight size={15}/></a><button className="button button-outline" onClick={copyEmail}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "Email copied" : "Copy email"}</button></div><a className="plain-email" href={`mailto:${portfolio.email}`}>{portfolio.email}</a></section>
        <footer className="main-footer"><span>© {year} {portfolio.name}. Built with care.</span><span>Next.js · TypeScript · CSS</span></footer>
      </main>
      <aside className="right-sidebar">
        <div className="right-panel panel"><div className="right-heading"><h2>Profile details</h2><span>ABOUT</span></div><div className="detail-row"><MapPin size={18}/><span>Based in <strong>{portfolio.location}</strong></span></div><div className="detail-row"><GraduationCap size={18}/><span>Studying <strong>Computer Science</strong></span></div><div className="detail-row"><BriefcaseBusiness size={18}/><span><strong>Open to new opportunities</strong></span></div><button className="full-width-action" onClick={() => jump("about")}>More about me <ArrowRight size={16}/></button></div>
        <div className="right-panel panel"><div className="right-heading"><h2>Currently exploring</h2><span>STACK</span></div><div className="quick-stack"><span className="stack-mark"><TechLogo name="TypeScript"/></span><div><strong>TypeScript</strong><small>Type-safe development</small></div></div><div className="quick-stack"><span className="stack-mark"><TechLogo name="Next.js"/></span><div><strong>Next.js</strong><small>React framework</small></div></div><div className="quick-stack"><span className="stack-mark"><TechLogo name="MySQL"/></span><div><strong>Database design</strong><small>Data & backend fundamentals</small></div></div><button className="text-action" onClick={() => jump("skills")}>Explore my stack <ArrowUpRight size={15}/></button></div>
        <div className="right-panel panel connect-panel"><div className="right-heading"><h2>Find me online</h2><span>LINKS</span></div><a href={portfolio.github} target="_blank" rel="noreferrer"><Github size={19}/>GitHub<ExternalLink size={15}/></a><a href={portfolio.linkedin} target="_blank" rel="noreferrer"><Linkedin size={19}/>LinkedIn<ExternalLink size={15}/></a><a href={`mailto:${portfolio.email}`}><Mail size={19}/>Email<ExternalLink size={15}/></a></div>
        <div className="sidebar-note"><span className="status-dot"/>Available for internships and collaborations.<p>A minimal space to share my work and progress.</p></div>
      </aside>
    </div>
  </div>;
}
