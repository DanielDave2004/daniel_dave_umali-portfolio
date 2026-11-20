import type { Metadata } from "next";
import { RocketGame } from "@/components/rocket-game";
import { InnerShell } from "@/components/inner-shell";
import { gameSettings } from "@/data/game";

export const metadata: Metadata = {
  title: `${gameSettings.gameTitle} | Developer Portfolio`,
  description: gameSettings.description,
};

export default function GamePage() {
  return (
    <InnerShell title={gameSettings.heading} description={gameSettings.description} eyebrow="PIXEL ARCADE">
      <section className="panel rocket-game-panel">
        <RocketGame />
      </section>
    </InnerShell>
  );
}
