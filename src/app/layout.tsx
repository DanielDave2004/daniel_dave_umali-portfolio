import type { Metadata } from "next";
import { portfolio } from "@/data/portfolio";
import "./globals.css";
import "./sidebar-theme.css";
import { CircleCursor } from "@/components/circle-cursor";

export const metadata: Metadata = {
  title: `${portfolio.name} | Daniel Dave M. Umali | Developer Portfolio`,
  description: portfolio.intro,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}<CircleCursor /></body>
    </html>
  );
}
