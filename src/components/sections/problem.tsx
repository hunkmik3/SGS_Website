import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";

/**
 * Figma measurements (1440 frame): heading 44px centred, then a two-column row
 * of 443px copy + 516px chart with a 25px gutter — expressed as fr/percent so
 * the split tracks the fluid content column.
 */
export function Problem() {
  // Top padding only — each section owns the gap above it.
  return (
    <section className="pt-section">
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
            <SectionLabel className="text-brand">
              The problem
            </SectionLabel>

            <h3 className="mt-[clamp(1rem,2vw,2.5rem)] text-subhead font-bold">
              Talent isn&apos;t the bottleneck.
              <br />
              Scale is.
            </h3>

            <p className="mt-[clamp(0.375rem,0.55vw,0.7rem)] text-body text-ink">
              Studios, brand teams and IP owners all face the same ceiling:
              output remains capped by headcount while demand keeps climbing.
              Although technology solutions exist, they evolve too quickly for
              internal teams to adopt or master.
            </p>

            {/* Sits on one line from the lg breakpoint up. At the shared body
                size it overran the 442px column by just 2px, so this is the same
                clamp with a 4% gentler vw — both terms scale with the viewport,
                so the fit holds at every width above the floor.
                The floor is still 16px, matching the paragraph above; a phone's
                351px column would need 14.65px, small enough to look wrong next
                to it. So it wraps there, and the non-breaking space keeps
                "with you." together rather than leaving "you." alone. */}
            <p className="mt-[clamp(0.75rem,1vw,1.25rem)] text-[clamp(1rem,1.236vw,1.55rem)] leading-[1.2] text-ink">
              We bring the tech, fix the pipeline and run it with&nbsp;you.
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
