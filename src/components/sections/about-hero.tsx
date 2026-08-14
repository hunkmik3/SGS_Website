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
 */
const rows = [
  {
    src: "/images/about/human-craft.jpg",
    alt: "A producer at a multi-screen desk in the studio.",
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
          <h1 className="text-center text-[clamp(2.25rem,3.47vw,4.35rem)] leading-[1.12] font-bold tracking-[-0.025em]">
            When the cost of producing a story
            {/* Desktop keeps Figma's break here; a phone has no room for it. */}
            <br className="max-sm:hidden" />{" "}
            gets closer to the cost of testing one…
            <br />
            <span className="text-brand">Entertainment changes</span>.
          </h1>

          <p className="mx-auto mt-[clamp(1rem,1.9vw,2.4rem)] max-w-[34em] text-center text-lead text-ink">
            Sleepy Giant Studio was built to make more of those bets possible.
            <br className="max-sm:hidden" />{" "}
            We&apos;re here to prove AI can make more ambitious entertainment
            possible
            <br className="max-sm:hidden" />{" "}
            without lowering the creative bar.
          </p>
        </Reveal>

        <div className="relative mt-[clamp(2.5rem,4.6vw,5.75rem)]">
          {/* Sits behind the images. Hidden on phones, where the stack goes full
              width and would cover it completely. */}
          <div
            aria-hidden
            className="absolute top-[14.2%] bottom-[14.2%] left-0 hidden w-[49.8%] bg-brand sm:block"
          />

          <div className="relative flex flex-col gap-[clamp(1.5rem,4.5%,4rem)]">
            {rows.map((row, i) => (
              <Reveal key={row.src} delay={i * 0.08}>
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
      sizes="(max-width: 640px) 90vw, 43vw"
      // The inset belongs on the image, not as padding on the row: padding
      // would shrink the content box and make this 62.9% resolve to 580px
      // instead of matching the 616px of the other two.
      // Dev Mode: 16px radius on the stills. The red panel stays square.
      className={cn(
        "w-full rounded-[clamp(0.625rem,1.11vw,1.4rem)] sm:w-[62.9%]",
        !imageOnRight && "sm:ml-[5.8%]",
      )}
    />
  );

  const caption = (
    <p
      className={cn(
        "text-[clamp(1rem,1.74vw,2.2rem)] leading-[1.3] font-bold",
        // The white label is the one lying on the red panel.
        onPanel ? "text-cream" : "text-brand",
        imageOnRight ? "sm:text-right" : "sm:text-left",
      )}
    >
      {label[0]}
      <br />
      {label[1]}
    </p>
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-[2.45%]",
        imageOnRight && "sm:justify-end",
      )}
    >
      {imageOnRight ? (
        <>
          {caption}
          {media}
        </>
      ) : (
        <>
          {media}
          {caption}
        </>
      )}
    </div>
  );
}
