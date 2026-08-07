import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

/**
 * The phone layout uses hard line breaks. Figma's wrap cannot be reproduced by
 * narrowing the column: the paragraph would need a 299–336px measure to break
 * after "scale" and a 202–262px one to break after "could," — no single width
 * satisfies both. Each break is hidden from sm up, where the copy flows.
 *
 * Vertical rhythm is tighter on a phone than on desktop, so the margins are
 * mobile-first with sm: restoring the desktop values.
 */
export function Hero() {
  return (
    <section className="pt-[clamp(3rem,7.6vw,6.875rem)] pb-[clamp(3rem,6vw,5.5rem)]">
      {/* Every Reveal is w-full so the flex column never forces its children
          wider than the viewport on small screens. */}
      <Container className="flex flex-col items-center text-center">
        <Reveal className="w-full">
          <Eyebrow className="text-[clamp(0.6875rem,1.11vw,1.39rem)] tracking-[0.16em] text-ink">
            AI-native creative studio
          </Eyebrow>
        </Reveal>

        <Reveal className="w-full" delay={0.06}>
          <h1 className="mt-3 text-display font-bold sm:mt-6">
            <span className="text-brand">Ship 10x more</span>
            <br />
            without 10x
            <br className="sm:hidden" />{" "}
            the team.
          </h1>
        </Reveal>

        <Reveal className="w-full" delay={0.12}>
          {/* 26em of its own font size reproduces the Figma line break and
              keeps doing so as the fluid lead size changes. */}
          <p className="mx-auto mt-3 max-w-[26em] text-lead text-ink sm:mt-9">
            We deliver finished animation at a scale
            <br className="sm:hidden" />{" "}
            your headcount never could,
            <br className="sm:hidden" />{" "}
            powered by an AI-native pipeline.
          </p>
        </Reveal>

        <Reveal className="w-full" delay={0.18}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 sm:mt-12">
            <Button href="#contact" className="font-semibold">
              Contact Us
              <ArrowRight
                size={14}
                strokeWidth={2.25}
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Button>
            <Button href="#work" variant="outline" className="font-semibold">
              See the work
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
