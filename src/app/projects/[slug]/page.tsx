import { ProjectImageGallery } from "@/components/project-image-gallery";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2, CalendarDays, Code2, UserRound } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { InnerShell, PageSection } from "@/components/inner-shell";
export function generateStaticParams() { return portfolio.projects.map(p => ({slug:p.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) { const {slug}=await params;const p=portfolio.projects.find(x=>x.slug===slug);return {title:p ? `${p.title} | Projects` : "Project not found"}; }
export default async function ProjectDetail({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const p=portfolio.projects.find(x=>x.slug===slug); if (!p) notFound();
 return <InnerShell title={p.title} eyebrow="PROJECT CASE STUDY" description={p.description}>
  <div className={`project-detail-banner panel project-detail-banner--${p.type}`}><div className="eyebrow">{p.number} / {p.category}</div><strong>{p.title}</strong><span>PROJECT OVERVIEW</span></div>
  <PageSection title="Project screenshots" label="IMAGE GALLERY"><ProjectImageGallery title={p.title} images={p.gallery} isExample={p.imagesAreExamples}/></PageSection>
  <PageSection title="Project overview" label="THE WORK"><p className="inner-body-text">{p.description}</p><div className="case-facts"><div><CalendarDays size={17}/><span>Timeline</span><strong>{p.duration}</strong></div><div><UserRound size={17}/><span>My role</span><strong>{p.role}</strong></div><div><CheckCircle2 size={17}/><span>Status</span><strong>{p.status}</strong></div></div></PageSection>
  <PageSection title="Key contributions" label="HIGHLIGHTS"><ul className="clean-points">{p.highlights.map(h=><li key={h}><CheckCircle2 size={17}/>{h}</li>)}</ul></PageSection>
  <PageSection title="Technologies & methods" label="TOOLS"><div className="tag-list tag-list--skills">{p.stack.map(t=><span key={t}>{t}</span>)}</div><p className="small-note">Update this case study with your actual screenshots, repository, live demo, challenges, and results.</p></PageSection>
  {(p.challenges.length > 0 || p.results.length > 0) && <PageSection title="Challenges & outcomes" label="REFLECTION">{p.challenges.map(t=><p key={t} className="inner-body-text">Challenge: {t}</p>)}{p.results.map(t=><p key={t} className="inner-body-text">Outcome: {t}</p>)}</PageSection>}
  {(p.githubUrl || p.liveUrl || p.documentationUrl) && <div className="portfolio-modal-actions project-resource-links">{p.githubUrl&&<a href={p.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>}{p.liveUrl&&<a href={p.liveUrl} target="_blank" rel="noopener noreferrer">Live demo</a>}{p.documentationUrl&&<a href={p.documentationUrl} target="_blank" rel="noopener noreferrer">Documentation</a>}</div>}
  <div className="back-strip"><Link href="/projects"><ArrowLeft size={16}/> All projects</Link><Link href="/contact">Discuss this project <ArrowUpRight size={16}/></Link></div>
 </InnerShell>;
}
