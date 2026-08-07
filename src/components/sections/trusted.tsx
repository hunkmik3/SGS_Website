import Image from "next/image";
import { Fragment, type CSSProperties } from "react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { clientLogos } from "@/lib/logos";

/**
 * Figma lays the seven marks out 4 + 3 on desktop and 2 + 2 + 3 on mobile, in a
 * different order each time. Both come out of one list:
 *
 *  - DOM order is the desktop order, and `lg:order-0` puts every item back to
 *    it once there is room.
 *  - Below that, each item takes its Figma phone position from a CSS variable.
 *  - A full-width, zero-height item sits after the fourth logo to force the
 *    desktop row break. It is display:none on mobile, where the wrap should
 *    fall on its own.
 *
 * One list, so the two layouts cannot drift apart.
 */
export function Trusted() {
  const desktopBreakAfter = 4;

  return (
    <section className="pt-section">
      <Container>
        <Reveal>
          <p className="text-center font-mono text-[clamp(0.9375rem,1.41vw,1.76rem)] text-ink">
            Trusted by
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          {/* Phones justify each row to the column edges, as in Figma. Desktop
              stays centred: its second row is deliberately narrower there, and
              space-between would stretch three logos across the full column. */}
          <ul className="mt-[clamp(1.25rem,3.13vw,3.9rem)] flex flex-wrap items-center justify-between gap-x-[clamp(1.5rem,4.97vw,6.2rem)] gap-y-[clamp(1.5rem,3.26vw,4.1rem)] lg:justify-center [--logo-h:clamp(1.7rem,3.5vw,4.35rem)]">
            {clientLogos.map(({ name, src, scale, mobileScale, mobileOrder }, i) => (
              <Fragment key={name}>
                <li
                  style={
                    {
                      "--mobile-order": mobileOrder,
                      "--scale": scale,
                      "--scale-mobile": mobileScale ?? scale,
                    } as CSSProperties
                  }
                  className="order-(--mobile-order) lg:order-0"
                >
                  {/* unoptimized: Next's WebP re-encode drops the black wordmark
                      out of the FanFan lockup — the PNG variant keeps 92k dark
                      pixels, the WebP one only 4k. These are small flat PNGs, so
                      serving the originals costs little and renders faithfully. */}
                  {/* Height comes from the shared base times the per-logo
                      factor, so the breakpoint swap is a variable change rather
                      than a second set of size classes. */}
                  <Image
                    src={src}
                    alt={name}
                    width={1211}
                    height={200}
                    unoptimized
                    className="h-[calc(var(--logo-h)*var(--scale-mobile))] w-auto lg:h-[calc(var(--logo-h)*var(--scale))]"
                  />
                </li>

                {i === desktopBreakAfter - 1 && (
                  <li aria-hidden className="hidden basis-full lg:block lg:order-0" />
                )}
              </Fragment>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
