import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AboutHero } from "@/components/sections/about-hero";
import { AboutIp } from "@/components/sections/about-ip";
import { AboutLeadership } from "@/components/sections/about-leadership";
import { AboutLoop } from "@/components/sections/about-loop";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "About — Sleepy Giant Studio",
  description:
    "Sleepy Giant Studio was built to make more ambitious bets possible: proving AI can raise output without lowering the creative bar.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <AboutHero />
        <AboutIp />
        <AboutLoop />
        <AboutLeadership />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
