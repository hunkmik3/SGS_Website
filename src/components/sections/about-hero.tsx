import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Figma measurements, as fractions of the 979px content column so the whole
 * collage scales with it: images 62.9% wide at 16:9, a 2.45% gutter between an
 * image and its label, rows 4.5% apart. The red panel is 49.8% wide, flush
 * left, and inset 14.2% from the top and bottom of the stack.
 *
 * Rows alternate which side the image sits on. The middle one starts 5.8% in
 * rather than flush left, so it overlaps the panel instead of covering it.
 *
 * Phones get their own arrangement, from the phone frame: the panel becomes a
 * narrow band down the left — 5% to 38% of the column — and every image sits at
 * 10%, running to the column's right edge. So the band shows as a full-width
 * strip in the gaps between images and is covered behind them, which is the
 * effect the design draws. Captions all move below their image, right-aligned
 * and brand red; the cream-on-panel label is a desktop-only arrangement.
 */
const rows = [
  {
    src: "/images/about/human-craft.jpg",
    alt: "A Sleepy Giant Studio founder giving a keynote on how AI is rebuilding the entertainment industry.",
    label: ["Human craft", "x Machine speed"],
    side: "right",
    onPanel: true,
  },
  {
    src: "/images/about/ip-ownership.jpg",
    alt: "An artist drawing an anime character on a pen display.",
    label: ["IP ownership", "mindset"],
    side: "left",
    onPanel: false,
  },
  {
    src: "/images/about/speed-without-compromise.jpg",
    alt: "Two artists working side by side in the studio.",
    label: ["Speed without", "compromise"],
    side: "right",
    onPanel: false,
  },
] as const;

export function AboutHero() {
  return (
    <section className="pt-section">
      <Container>
        <Reveal>
          {/* 19px on phones, not the 36px a display heading would normally get.
              The phone frame sets this: it breaks after "story" and after
              "one…", and the longest of those three lines only fits the 351px
              column up to 19.7px. Anything larger and Figma's three lines
              become six. Desktop is untouched — 3.47vw is 50px at 1440, well
              inside the clamp. */}
          <h1 className="text-center text-[clamp(1.1875rem,3.47vw,4.35rem)] leading-[1.12] font-bold tracking-[-0.025em]">
            When the cost of producing a story
            <br />
            gets closer to the cost of testing one…
            <br />
            <span className="text-brand">Entertainment changes</span>.
          </h1>

          {/* The breaks now hold on phones too. The frame wraps these three
              sentences into five lines, which is what they come to once each one
              starts on its own; letting them run together gave four and lost
              the design's shape. Type size is the shared lead token, untouched:
              the home page hero rides on it. */}
          <p className="mx-auto mt-[clamp(1rem,1.9vw,2.4rem)] max-w-[34em] text-center text-lead text-ink">
            Sleepy Giant Studio was built to make more of those bets possible.
            <br />
            We&apos;re here to prove AI can make more ambitious entertainment
            possible
            <br />
            without lowering the creative bar.
          </p>
        </Reveal>

        <div className="relative mt-[clamp(2.5rem,4.6vw,5.75rem)]">
          {/* Sits behind the images in both layouts. On phones it runs the full
              height of the stack and shows through the gaps; on desktop it is
              inset top and bottom and half the column wide. */}
          <div
            aria-hidden
            className="absolute -top-[1%] bottom-0 left-[5%] w-[33%] bg-brand sm:top-[14.2%] sm:bottom-[14.2%] sm:left-0 sm:w-[49.8%]"
          />

          <div className="relative flex flex-col gap-[clamp(1.25rem,4.5%,4rem)]">
            {rows.map((row, i) => (
              // The phone frame runs the last two rows the other way round, so
              // they swap by flex order rather than in the data — the desktop
              // sequence reads off the same array and has to stay as approved.
              // Row one keeps the default order of 0, which leaves it first.
              <Reveal
                key={row.src}
                delay={i * 0.08}
                className={cn(
                  i === 1 && "max-sm:order-2",
                  i === 2 && "max-sm:order-1",
                )}
              >
                <CollageRow {...row} priority={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function CollageRow({
  src,
  alt,
  label,
  side,
  onPanel,
  priority,
}: (typeof rows)[number] & { priority: boolean }) {
  const imageOnRight = side === "right";

  const media = (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={900}
      priority={priority}
      sizes="(max-width: 640px) 81vw, 43vw"
      // The inset belongs on the image, not as padding on the row: padding
      // would shrink the content box and make this 62.9% resolve to 580px
      // instead of matching the 616px of the other two.
      // Dev Mode: 16px radius on the stills. The red panel stays square.
      className={cn(
        "ml-[10%] w-[90%] rounded-[clamp(0.625rem,1.11vw,1.4rem)] sm:w-[62.9%]",
        // One sm:ml per row, so the phone inset is always overridden rather
        // than left to win by specificity.
        imageOnRight ? "sm:ml-0" : "sm:ml-[5.8%]",
      )}
    />
  );

  const caption = (
    <p
      className={cn(
        "text-right text-[clamp(1rem,1.74vw,2.2rem)] leading-[1.3] font-bold text-brand",
        // Cream is a desktop-only arrangement: that label lies on the red panel
        // there, whereas on a phone every caption sits on the page below its
        // image and has to be red.
        onPanel && "sm:text-cream",
        imageOnRight ? "sm:text-right" : "sm:text-left",
      )}
    >
      {label[0]}
      <br />
      {label[1]}
    </p>
  );

  return (
    // Image always first in the DOM, so a phone stacks image then caption. On
    // desktop row-reverse swaps them back and packs the pair against the right
    // edge in one go — no justify-end needed, since reversing the main axis
    // makes its start the right-hand side.
    <div
      className={cn(
        "flex flex-col gap-4 sm:items-end sm:gap-[2.45%]",
        imageOnRight ? "sm:flex-row-reverse" : "sm:flex-row",
      )}
    >
      {media}
      {caption}
    </div>
  );
}
