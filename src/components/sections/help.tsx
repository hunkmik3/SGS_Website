import Image from "next/image";
import type { CSSProperties } from "react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Figma measurements (1440 frame): 482×224 cards, 14.5px column gutter, 27px
 * card padding, 49px icon tile with a 27px glyph. Dark cards carry a red icon
 * tile, cream cards a black one.
 *
 * Glyphs are the Figma exports, trimmed by scripts/prepare-icons.mjs. Their
 * aspect ratios differ by design (square film, tall sliders, wide arrow), so
 * they are contained in a square box rather than stretched to it.
 *
 * `mobileOrder` swaps the last two cards on phones. Stacked in source order the
 * tones would run dark, cream, cream, dark; Figma alternates them instead.
 */
const items = [
  {
    icon: "/images/icons/finished-production.png",
    tone: "dark",
    title: "Finished production",
    body: "We deliver shipped animation to your spec, not a toolkit you have to run.",
    mobileOrder: 0,
  },
  {
    icon: "/images/icons/built-around-you.png",
    tone: "cream",
    title: "Built around you",
    body: "Shaped to your look, format and pace. No house style forced on you.",
    mobileOrder: 1,
  },
  {
    icon: "/images/icons/craft-that-holds.png",
    tone: "cream",
    title: "Craft that holds",
    body: "Veteran artists on every frame. Speed never costs you the quality fans notice.",
    mobileOrder: 3,
  },
  {
    icon: "/images/icons/scale-on-demand.png",
    tone: "dark",
    title: "Scale on demand",
    body: "Flex volume up or down without hiring and keep the output consistent.",
    mobileOrder: 2,
  },
] as const;

export function Help() {
  return (
    <section id="what-we-do" className="pt-[clamp(3rem,5.9vw,7.4rem)]">
      <Container>
        <Reveal>
          <p className="text-center font-mono text-[clamp(0.9375rem,1.41vw,1.76rem)] text-ink">
            How we help
          </p>
          <h2 className="mt-[clamp(0.25rem,0.4vw,0.5rem)] text-center text-heading font-bold">
            Tailored, end to end.
          </h2>
        </Reveal>

        {/* Percentage row-gap resolves against an indefinite block size, so the
            column gutter is a percentage and the row gutter is viewport-based. */}
        <ul className="mt-[clamp(1.75rem,3vw,3.75rem)] grid gap-x-[1.48%] gap-y-5 sm:grid-cols-2 sm:gap-y-[clamp(0.75rem,1vw,1.25rem)]">
          {items.map((item, i) => (
            <li
              key={item.title}
              style={{ "--mobile-order": item.mobileOrder } as CSSProperties}
              className="order-(--mobile-order) h-full sm:order-0"
            >
              <Reveal className="h-full" delay={i * 0.06}>
                <HelpCard {...item} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function HelpCard({ icon, tone, title, body }: (typeof items)[number]) {
  const dark = tone === "dark";

  return (
    <article
      className={cn(
        "h-full rounded-[clamp(0.5rem,0.9vw,1.1rem)] p-[clamp(1.25rem,1.875vw,2.35rem)]",
        "transition-transform duration-300 ease-out hover:-translate-y-1.5",
        dark ? "bg-ink text-white" : "bg-cream text-ink",
      )}
    >
      <span
        className={cn(
          "flex size-[clamp(2.25rem,3.4vw,4.25rem)] items-center justify-center rounded-[clamp(0.4rem,0.75vw,0.95rem)]",
          dark ? "bg-brand" : "bg-ink",
        )}
      >
        <Image
          src={icon}
          alt=""
          width={160}
          height={160}
          className="size-[clamp(1.1rem,1.85vw,2.3rem)] object-contain"
        />
      </span>

      {/* Phone values are the base; the sm: variants restore the desktop tuning.
          These cannot be clamp floors — Figma wants the title, body and both
          gaps LARGER on a phone than on desktop, and a floor above the vw term
          would win at every width. */}
      <h3 className="mt-[0.9375rem] text-[2rem] leading-[1.2] font-bold tracking-[-0.02em] sm:mt-[clamp(0.625rem,1vw,1.25rem)] sm:text-[clamp(1.4rem,2.36vw,2.95rem)]">
        {title}
      </h3>

      <p
        className={cn(
          "mt-[1.25rem] text-[1.1875rem] leading-[1.2] sm:mt-[clamp(0.375rem,0.7vw,0.9rem)] sm:text-[clamp(1rem,1.239vw,1.55rem)]",
          dark ? "text-white/85" : "text-ink",
        )}
      >
        {body}
      </p>
    </article>
  );
}
