import { GithubContributions } from "@/components/github-contributions";
import { InnerShell, PageSection } from "@/components/inner-shell";

export const metadata = { title: "Activity | Developer Portfolio" };

export default function ActivityPage() {
  return (
    <InnerShell
      title="Activity"
      eyebrow="BUILD LOG & GITHUB"
      description="My public GitHub contributions over the past year."
    >
      <PageSection title="GitHub contributions" label="PUBLIC GITHUB ACTIVITY">
        <GithubContributions />
      </PageSection>
    </InnerShell>
  );
}
