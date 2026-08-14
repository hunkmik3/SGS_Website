import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Contact } from "@/components/sections/contact";
import { Help } from "@/components/sections/help";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Trusted } from "@/components/sections/trusted";
import { Work } from "@/components/sections/work";

export const metadata: Metadata = {
  title: "Dark mode review — Sleepy Giant Studio",
  description: "A dark treatment of the home page, for review.",
  // Not a page for the public: it is the same content twice over, and a review
  // draft is not what should turn up in a search result.
  robots: { index: false, follow: false },
};

/**
 * The home page in dark, for review.
 *
 * Same section components as `/`, so the two cannot drift: this route adds no
 * copy and no layout of its own. The theme comes entirely from `data-theme`,
 * which re-points the surface and foreground tokens inside this subtree — see
 * the dark block in globals.css. Nothing here can affect `/` or `/about`.
 *
 * The stats bar and the testimonials are left out per the brief. They are the
 * two sections that were already black on white, so they have nothing to gain
 * from the treatment.
 */
export default function DarkModeReviewPage() {
  return (
    // min-h-screen because the tokens only reach this subtree — <body> keeps the
    // light background, which would otherwise show through on a short page.
    <div
      data-theme="dark"
      className="flex min-h-screen flex-1 flex-col bg-paper text-ink"
    >
      <Header onDark />
      <main className="flex-1">
        <Hero />
        <Work />
        <Problem />
        <Help />
        <Trusted />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
