import { InnerShell } from "@/components/inner-shell";
import { ProjectDirectory } from "@/components/project-directory";
export const metadata = { title: "Projects | Developer Portfolio" };
export default function ProjectsPage() { return <InnerShell title="Projects" eyebrow="SELECTED WORK" description="Browse my development, academic, and personal projects. Open any project to view its own page, background, technologies, and contributions."><ProjectDirectory/></InnerShell>; }
