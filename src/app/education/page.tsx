import { CalendarDays, GraduationCap } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { InnerShell, PageSection } from "@/components/inner-shell";
export const metadata = { title: "Education | Developer Portfolio" };
export default function EducationPage() {return <InnerShell title="Education" eyebrow="ACADEMIC BACKGROUND" description="My academic journey and the subjects that support my work in software development."><PageSection title="Academic background" label="EDUCATION"><div className="education-card"><div className="education-icon"><GraduationCap size={25}/></div><div><h3>{portfolio.education.degree}</h3><strong>{portfolio.education.school}</strong><p>{portfolio.education.description}</p><span className="education-date"><CalendarDays size={15}/>{portfolio.education.period}</span></div></div></PageSection></InnerShell>}
