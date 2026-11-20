import { InnerShell, PageSection } from "@/components/inner-shell";
import { AchievementGallery } from "@/components/achievement-gallery";
export const metadata = { title: "Achievements | Daniel Dave M. Umali" };
export default function AchievementsPage() { return <InnerShell title="Achievements" eyebrow="CREDENTIALS & PARTICIPATION" description="Certificates, completed courses, and competition participation. Select an image to view it in a larger modal."><PageSection title="Credentials & participation" label="ACHIEVEMENTS"><AchievementGallery/></PageSection></InnerShell> }
