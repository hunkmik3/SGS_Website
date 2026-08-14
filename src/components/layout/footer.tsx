import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { site } from "@/lib/site";

/**
 * Figma: a black band with the closing statement flush left — not centred — and
 * the giant mark set large behind it, running off the bottom edge.
 *
 * The mark is placed against the band rather than the content column, because
 * that is what the frames measure it against: on desktop it sits from 56% to 87%
 * of the band's width, so it starts inside the column and finishes outside it.
 * Phones move it in under the copy, centred at 55% of the band.
 *
 * Its height comes from its own aspect, so both frames leave it taller than the
 * band and the band clips it — that cropped silhouette is the design, not an
 * accident, which is why the footer owns the overflow rule.
 *
 * Both crops show about the same share of the drawing — near 79% of its height,
 * cutting it where the body starts to flare so the legs stay out. The phone one
 * is 66% of the band's width rather than 55% for that reason: the band gives it a
 * fixed 242px to be seen in, so the only way to show less of the mark is to draw
 * more of it.
 *
 * Desktop gets there the other way round. The mark is already the 31% the frame
 * measures, so what was short was the band: 389px against the frame's 433, which
 * cropped the drawing at 71%. The missing height is top padding — 79px in the
 * frame, against the 44px this had — and the phone floor of 2rem is untouched, so
 * that band stays where it was.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-panel pt-[clamp(2rem,5.49vw,6.85rem)] pb-[clamp(0.75rem,1vw,1.25rem)] text-cream">
      <Image
        src="/images/giant-mark-red.png"
        alt=""
        aria-hidden
        width={301}
        height={360}
        sizes="(max-width: 640px) 66vw, 31vw"
        className="pointer-events-none absolute top-[44%] left-[22%] h-auto w-[66%] sm:top-[3%] sm:left-[56%] sm:w-[31%]"
      />

      {/* Positioned, so the copy stacks above the mark on DOM order alone — the
          mark is positioned too, and would otherwise paint over static content. */}
      <Container className="relative">
        <Reveal>
          {/* Cream, not the component's #000: the band is black. */}
          <SectionLabel className="text-cream">
            Let&apos;s talk about your bottleneck
          </SectionLabel>

          <h2 className="mt-[clamp(0.5rem,0.9vw,1.1rem)] text-[clamp(1.875rem,4.4vw,5.5rem)] leading-[1.05] font-bold tracking-[-0.03em]">
            Scale the work.
            <br />
            Keep the <span className="text-brand">craft</span>.
          </h2>

          {/* The design pairs this with the line above the heading — same face,
              same size, bracketing it — so it takes the same component. */}
          <SectionLabel className="mt-[clamp(1rem,2.4vw,3rem)] text-cream">
            Contact email:{" "}
            <a
              href={`mailto:${site.email}`}
              className="underline underline-offset-4 transition-colors hover:text-brand"
            >
              {site.email}
            </a>
          </SectionLabel>
        </Reveal>

        {/* The gap is what gives the mark its room on a phone. The frame runs
            226px of it there — 63vw — against 76px on desktop, where the mark is
            beside the copy rather than under it. */}
        <div className="mt-[63vw] flex flex-wrap items-center justify-between gap-4 sm:mt-[clamp(2.5rem,5.3vw,6.6rem)]">
          <Image
            src="/images/logo-sleepy-giant-light.png"
            alt={site.name}
            width={488}
            height={220}
            className="h-[clamp(1.5rem,2.2vw,2.75rem)] w-auto"
          />
          <p className="font-mono text-[clamp(0.625rem,0.78vw,1rem)]">
            © {site.year} {site.name}. {site.location}
          </p>
        </div>
      </Container>
    </footer>
  );
}
