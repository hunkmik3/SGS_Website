import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { site } from "@/lib/site";

/**
 * Figma measurements (1440 frame): a 393px black band, centred closing
 * statement at ~67px with near-solid leading, then a baseline row carrying the
 * logo and the copyright on the shared content column.
 */
export function Footer() {
  return (
    <footer className="bg-ink pt-[clamp(2rem,3.05vw,3.8rem)] pb-[clamp(0.75rem,1vw,1.25rem)] text-cream">
      <Container>
        <Reveal>
          {/* Cream, not the component's #000: the band is black. */}
          <SectionLabel className="text-center text-cream">
            Let&apos;s talk about your bottleneck
          </SectionLabel>

          <h2 className="mt-[clamp(0.5rem,0.9vw,1.1rem)] text-center text-[clamp(1.875rem,4.4vw,5.5rem)] leading-[1.05] font-bold tracking-[-0.03em]">
            Scale the work.
            <br />
            Keep the <span className="text-brand">craft</span>.
          </h2>

          {/* The design pairs this with the line above the heading — same face,
              same size, bracketing it — so it takes the same component. */}
          <SectionLabel className="mt-[clamp(1rem,2.4vw,3rem)] text-center text-cream">
            Contact email:{" "}
            <a
              href={`mailto:${site.email}`}
              className="underline underline-offset-4 transition-colors hover:text-brand"
            >
              {site.email}
            </a>
          </SectionLabel>
        </Reveal>

        <div className="mt-[clamp(2.5rem,5.3vw,6.6rem)] flex flex-wrap items-center justify-between gap-4">
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
