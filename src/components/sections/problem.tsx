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
            <SectionLabel className="text-brand">The problem</SectionLabel>

            <h3 className="mt-[clamp(1rem,2vw,2.5rem)] text-subhead font-bold">
              Talent isn&apos;t the bottleneck.
              <br />
              Scale is.
            </h3>

            {/* One paragraph, not two: the frame runs the closing sentence on from
                "on the shelf." straight into the same block.
                The phone breaks are hard, which is not the usual choice here. No
                font size reproduces them by wrapping: at the 351px column, line
                three needs more than 18.77px and line six no more than 18.64px,
                so the window is empty. That is the substitute face — the frame is
                set in Neue Haas and this renders Geist, whose advances differ just
                enough to move the breaks. Every one of these lines still fits at
                the body size, so they only pin what wrapping cannot reach, and
                they will want rechecking when the real cut lands.
                text-pretty is left on for the widths that do wrap. */}
            <p className="mt-[clamp(0.375rem,0.55vw,0.7rem)] text-body text-pretty text-ink">
              Studios, brand teams, and IP owners all
              <br className="sm:hidden" /> hit the same ceiling: output capped
              by
              <br className="sm:hidden" /> headcount while demand keeps
              <br className="sm:hidden" /> climbing. The tech that breaks that
              <br className="sm:hidden" /> ceiling moves faster than most teams
              <br className="sm:hidden" /> can adopt, so it sits on the shelf.
              We close
              <br className="sm:hidden" /> the gap, and run it with you.
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
