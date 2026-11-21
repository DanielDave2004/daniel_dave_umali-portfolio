import { Layers3 } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { TechItem } from "@/components/tech-logo";
import { InnerShell, PageSection } from "@/components/inner-shell";
export const metadata = { title: "Tech Stack | Daniel Dave M. Umali" };
export default function SkillsPage() {
  return <InnerShell title="Tech stack" eyebrow="TOOLS & TECHNOLOGIES" description="Programming languages, development tools, frameworks, and technologies from my technical skills profile.">
    <PageSection title="Skills & technologies" label="MY TOOLKIT">
      <div className="inner-skills">{portfolio.skills.map(group =>
        <div className="inner-skill-card" key={group.category}>
          <div className="skill-group-title"><Layers3 size={18}/><h3>{group.category}</h3></div>
          <div className="tech-grid">{group.items.map(item => <TechItem key={item} name={item}/>)}</div>
        </div>)}</div>
    </PageSection>
  </InnerShell>;
}
