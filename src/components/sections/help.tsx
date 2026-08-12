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
    title: "Finished Production",
    body: "Fully rendered, ready-to-publish animation. Zero operational burden on your end.",
    mobileOrder: 0,
  },
  {
    icon: "/images/icons/built-around-you.png",
    tone: "cream",
    title: "100% Custom-fit",
    body: "Adapted to your visual language and format. You retain full creative control.",
    mobileOrder: 1,
  },
  {
    icon: "/images/icons/craft-that-holds.png",
    tone: "cream",
    title: "Quality Always First",
    body: "AI-powered speed backed by veteran animation talent. Quality stays consistent, even at volume.",
    mobileOrder: 3,
  },
  {
    icon: "/images/icons/scale-on-demand.png",
    tone: "dark",
    title: "Scale On Demand",
    body: "Flexible production capacity without adding headcount or fixed overhead.",
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
          {/* Same shape as --text-heading but a gentler vw. This copy needs
              1002px at the token's 46px, more than the 979px column, so it
              would break after "your". 3vw lands at 43px and leaves ~40px of
              slack — enough that the real Neue Haas cut cannot push it over. */}
          <h2 className="mt-[clamp(0.25rem,0.4vw,0.5rem)] text-center text-[clamp(2.25rem,3vw,3.75rem)] leading-[1.12] font-bold tracking-[-0.025em]">
            Full-service execution. Built around your stack.
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

      {/* The title and both gaps are LARGER on a phone than on desktop, which a
          clamp floor cannot express — a floor above the vw term wins at every
          width. So those are phone-first with sm: restoring the desktop tuning.
          The body is the exception: its clamp already bottoms out at 16px, the
          same size the Problem paragraph uses, so one value covers both. */}
      <h3 className="mt-[0.9375rem] text-[2rem] leading-[1.2] font-bold tracking-[-0.02em] sm:mt-[clamp(0.625rem,1vw,1.25rem)] sm:text-[clamp(1.4rem,2.36vw,2.95rem)]">
        {title}
      </h3>

      <p
        className={cn(
          "mt-[1.25rem] text-[clamp(1rem,1.239vw,1.55rem)] leading-[1.2] sm:mt-[clamp(0.375rem,0.7vw,0.9rem)]",
          dark ? "text-white/85" : "text-ink",
        )}
      >
        {body}
      </p>
    </article>
  );
}
