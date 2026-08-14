import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { initials, testimonials, type Testimonial } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

/**
 * Figma measurements (1440 frame): 484×279 cards with a 19px gutter — two of
 * them span the 68% content column exactly. The rows run full-bleed and are
 * clipped by the viewport, so cards are cut off at both edges.
 *
 * The dark treatment is the hover state, not a per-card variant.
 */
export function Testimonials() {
  // Bottom row starts from the opposite end so the two rows never line up.
  const bottomRow = [...testimonials.slice(3), ...testimonials.slice(0, 3)];

  return (
    <section className="pt-[clamp(3.5rem,7.1vw,8.9rem)]">
      <Container>
        <Reveal>
          <SectionLabel className="text-center">
            Testimonials
          </SectionLabel>
          <h2 className="mt-[clamp(0.25rem,0.4vw,0.5rem)] text-center text-heading font-bold">
            Don&apos;t take our word for it.
          </h2>
        </Reveal>
      </Container>

      <div className="mt-[clamp(1.75rem,3.5vw,4.4rem)] space-y-[clamp(0.75rem,1.3vw,1.65rem)]">
        <MarqueeRow items={testimonials} direction="right" />
        <MarqueeRow items={bottomRow} direction="left" />
      </div>
    </section>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: Testimonial[];
  direction: "left" | "right";
}) {
  return (
    <div className="group/row overflow-hidden">
      <div
        className={cn(
          "flex w-max",
          direction === "left"
            ? "animate-[marquee-left_60s_linear_infinite]"
            : "animate-[marquee-right_60s_linear_infinite]",
          "group-hover/row:[animation-play-state:paused]",
        )}
      >
        {/* Two identical copies — the keyframes shift by exactly one copy. */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex" aria-hidden={copy === 1}>
            {items.map((item, i) => (
              <QuoteCard key={`${copy}-${i}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuoteCard({ item }: { item: Testimonial }) {
  const { quote, name, role, logo } = item;

  return (
    <figure
      className={cn(
        "group/card mr-[clamp(0.625rem,1.32vw,1.65rem)] flex w-[clamp(17.5rem,33.26vw,41.6rem)] shrink-0 flex-col",
        // Horizontal padding is fixed at Figma's 32px because it sets the
        // measured line-break width; vertical padding is free to differ.
        // Dev Mode: 479×273, radius 24px, 1px #D7D7D7 border.
        "rounded-[clamp(0.875rem,1.667vw,2.1rem)] px-[clamp(1.25rem,2.2vw,2.75rem)] pt-[clamp(0.875rem,1.6vw,2rem)] pb-[clamp(1.25rem,2.15vw,2.7rem)]",
        "border border-line bg-paper text-ink transition-colors duration-300",
        "hover:border-ink hover:bg-panel hover:text-white",
      )}
    >
      {/* Figma: Libre Franklin ExtraLight, 160px. A quote glyph's ink sits high
          in its em box, so the line box would otherwise reserve ~60px of empty
          space beneath it. The margins are in em so they track the glyph size
          through the clamp instead of drifting at its bounds. */}
      <span
        aria-hidden
        className="mt-[0.177em] mb-[-0.375em] block font-quote text-[clamp(3.5rem,11.11vw,13.9rem)] leading-[0.34] font-extralight text-brand"
      >
        &ldquo;
      </span>

      {/* mb guarantees a floor under the rule; the caption's mt-auto only
          absorbs slack, which the tallest card in a row has none of. */}
      <blockquote className="mt-[clamp(0.375rem,0.97vw,1.2rem)] mb-[clamp(1rem,2.64vw,3.3rem)] text-[clamp(0.9375rem,1.193vw,1.5rem)] leading-[1.28]">
        {quote}
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-[clamp(0.5rem,0.83vw,1.05rem)] border-t border-line pt-[clamp(0.75rem,1.5vw,1.9rem)] transition-colors duration-300 group-hover/card:border-white/20">
        <span className="flex size-[clamp(2.25rem,3.2vw,4rem)] shrink-0 items-center justify-center rounded-full bg-brand">
          {logo ? (
            <Image
              src={logo}
              alt=""
              width={120}
              height={120}
              className="size-[62%] object-contain"
            />
          ) : (
            <span className="font-mono text-[clamp(0.5625rem,0.76vw,0.95rem)] font-semibold text-white">
              {initials(name)}
            </span>
          )}
        </span>

        <span className="min-w-0">
          <span className="block text-[clamp(1rem,1.5vw,1.88rem)] font-bold">
            {name}
          </span>
          <span className="block truncate font-mono text-[clamp(0.6875rem,0.97vw,1.2rem)] text-muted transition-colors duration-300 group-hover/card:text-white/60">
            {role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
