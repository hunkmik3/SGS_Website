import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

/**
 * Figma measurements (1440 frame): heading 44px centred, then a two-column row
 * of 443px copy + 516px chart with a 25px gutter — expressed as fr/percent so
 * the split tracks the fluid content column.
 */
export function Problem() {
  // Top padding only — each section owns the gap above it.
  return (
    // #about lands here: this is the studio's positioning — the thesis behind
    // the work — which is what a visitor clicking "About" is looking for.
    <section id="about" className="pt-section">
      <Container>
        <Reveal>
          <h2 className="text-center text-heading font-bold">
            Great creative work doesn&apos;t scale.
            <br />
            <span className="text-brand">We fix that.</span>
          </h2>
        </Reveal>

        <div className="mt-[clamp(2rem,3.8vw,4.75rem)] grid items-start gap-10 lg:grid-cols-[45.1fr_52.5fr] lg:gap-[2.4%]">
          {/* Stacked on a phone the copy is centred, matching the heading above
              it; once it sits beside the chart it goes back to flush left. */}
          <Reveal className="text-center lg:text-left">
            <p className="font-mono text-[clamp(0.9375rem,1.41vw,1.76rem)] text-brand">
              The problem
            </p>

            <h3 className="mt-[clamp(1rem,2vw,2.5rem)] text-subhead font-bold">
              Talent is not the bottleneck.
              <br />
              Scale is.
            </h3>

            <p className="mt-[clamp(0.375rem,0.55vw,0.7rem)] text-body text-ink">
              Studios, brand teams, and IP owners all hit the same ceiling:
              output capped by headcount while demand keeps climbing. The tech
              that breaks that ceiling moves faster than most teams can adopt, so
              it sits on the shelf. We close the gap, and run it with you.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <Image
              src="/images/problem-ceiling-chart.png"
              alt="Bar chart: output stays flat against a dashed ceiling line while demand keeps rising."
              width={1600}
              height={997}
              sizes="(max-width: 1024px) 90vw, 36vw"
              className="w-full rounded-[clamp(0.5rem,0.9vw,1.1rem)]"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
