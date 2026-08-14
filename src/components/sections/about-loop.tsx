"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

/**
 * Figma measurements (1440 frame): the label is a 457×21 sans line — not the
 * mono eyebrow the homepage uses — and the flow steps run at 32px with the
 * highlighted one ringed in a 173×67 ellipse, and the two rings are 101px
 * apart centre to centre — the gap holds nothing but the arrow, since both
 * captions fall outside it.
 *
 * The steps render at 30px rather than 32px. Row two measures 1014px at 32px
 * and the shared content column is 979px, so Figma's size is the one thing here
 * that cannot be reproduced without either wrapping the row or breaking the
 * column every other section aligns to. 30px fits with room to spare and keeps
 * both rows on one line, which is what the design is actually communicating.
 *
 * The connector is drawn from measured positions rather than a fixed box. Both
 * ellipses sit inside flowing text, so their coordinates move with the font and
 * the viewport — hard-coded offsets would point at nothing the moment the real
 * Neue Haas cut lands.
 */
const flows = [
  {
    before: ["Idea", "Production", "Distribution", "Audience"],
    after: [] as string[],
    note: "Comes last",
    noteAbove: true,
  },
  {
    before: ["Idea", "Prototype", "Audience"],
    after: ["Iteration", "Scale"],
    note: "Comes early",
    noteAbove: false,
  },
];

/**
 * Where the two ends of the stroke sit inside the artwork, as fractions of its
 * own box — read off the alpha channel of curved-arrow.png: the tail cap is in
 * the top-left corner, the arrowhead tip at (511, 448) of 512×513.
 *
 * They exist so the arrow can be placed by rotating and scaling it uniformly
 * instead of being stretched into a bounding box. Fitting a square drawing into
 * the wide, shallow gap between the two rings squashed it 2:1 and visibly
 * changed the weight of the stroke.
 */
const TAIL = { x: 0.02, y: 0.02 };
const HEAD = { x: 0.998, y: 0.873 };
const ART_ANGLE = Math.atan2(HEAD.y - TAIL.y, HEAD.x - TAIL.x);
const ART_SPAN = Math.hypot(HEAD.x - TAIL.x, HEAD.y - TAIL.y);

/** Drawn a little shorter than the gap it bridges, per the design. */
const ARROW_SCALE = 0.88;

type Placement = { left: number; top: number; size: number; rotation: number };

export function AboutLoop() {
  const frame = useRef<HTMLDivElement>(null);
  const from = useRef<HTMLSpanElement>(null);
  const to = useRef<HTMLSpanElement>(null);
  const [arrow, setArrow] = useState<Placement | null>(null);

  const measure = useCallback(() => {
    const box = frame.current?.getBoundingClientRect();
    const start = from.current?.getBoundingClientRect();
    const end = to.current?.getBoundingClientRect();
    if (!box || !start || !end) return;

    // Tail tucked under the first ring's left flank, head landing on the second
    // ring's right shoulder — the sweep the design draws.
    //
    // Barely inset horizontally. Pulling both ends a full 15% of the ring's
    // width inwards added a third again to the horizontal run and flattened the
    // sweep into a long shallow curve; the design's is steep.
    const tailX = start.left + start.width * 0.08 - box.left;
    const tailY = start.bottom - start.height * 0.15 - box.top;
    const headX = end.right - end.width * 0.05 - box.left;
    const headY = end.top + end.height * 0.18 - box.top;

    // Drawn a shade shorter than the run between those two points — and pulled
    // back from the tail end, not from both. The head has to sit on the second
    // ring the way the design draws it; the slack belongs at the other end,
    // where the first ring covers it.
    const h = [headX, headY];
    const t = [
      headX + (tailX - headX) * ARROW_SCALE,
      headY + (tailY - headY) * ARROW_SCALE,
    ];

    // Turn the artwork so its own tail→head chord lies along the one we want,
    // and scale it so the two chords are the same length. Rotation preserves
    // which side of the chord the curve bows towards; a mirror would not.
    const rotation = Math.atan2(h[1] - t[1], h[0] - t[0]) - ART_ANGLE;
    const size = Math.hypot(h[0] - t[0], h[1] - t[1]) / ART_SPAN;

    // rotate() spins around the centre, so the tail anchor is carried with it.
    // Walk it back through the same rotation to find where the centre must go
    // for the tail to land on target.
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const ox = (TAIL.x - 0.5) * size;
    const oy = (TAIL.y - 0.5) * size;
    const cx = t[0] - (ox * cos - oy * sin);
    const cy = t[1] - (ox * sin + oy * cos);

    setArrow({ left: cx - size / 2, top: cy - size / 2, size, rotation });
  }, []);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (frame.current) observer.observe(frame.current);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <section className="pt-section">
      <Container>
        <Reveal>
          <SectionLabel className="text-center uppercase">
            The new loop of entertainment R&amp;D engine
          </SectionLabel>

          <div
            ref={frame}
            className="relative mt-[clamp(1.75rem,3.1vw,3.9rem)] flex flex-col gap-[clamp(2.5rem,4.93vw,6.2rem)]"
          >
            {arrow && (
              <Image
                src="/images/about/curved-arrow.png"
                alt=""
                aria-hidden
                width={512}
                height={513}
                // Flat brand-red artwork: the optimiser's WebP pass has already
                // eaten a thin mark on this site once, and there is nothing to
                // gain on a 15KB file.
                unoptimized
                style={{
                  left: arrow.left,
                  top: arrow.top,
                  width: arrow.size,
                  height: arrow.size,
                  transform: `rotate(${arrow.rotation}rad)`,
                }}
                // Hidden on phones: both flow lines wrap there, which puts the
                // rings on their second lines and leaves the connector no route
                // between them that does not cut straight through the text.
                className="pointer-events-none absolute max-sm:hidden"
              />
            )}

            {flows.map((flow, i) => (
              <Flow key={flow.note} {...flow} ringRef={i === 0 ? from : to} />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Flow({
  before,
  after,
  note,
  noteAbove,
  ringRef,
}: (typeof flows)[number] & { ringRef: React.Ref<HTMLSpanElement> }) {
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-[0.35em] gap-y-2 text-[clamp(1.125rem,2.06vw,2.6rem)] leading-[1.05] text-ink">
      {before.map((step) => (
        <span key={step} className="flex items-center gap-x-[0.35em]">
          {step}
          <span aria-hidden>→</span>
        </span>
      ))}

      {/* Below sm this stacks the word and its caption; from sm it goes back to
          normal flow so the caption can be positioned against it. */}
      <span className="relative inline-flex flex-col items-center sm:block">
        {/* The ring hangs off this span, not the one above, so that it measures
            the word alone — on phones the caption is a sibling in flow, and an
            inset drawn against that would loop around both.
            The margin is the ring's room to grow sideways into: with the row's
            own 0.35em gap it clears the ring's 15px overhang by a hair, leaving
            the outer curve just off the neighbouring arrows, as the design does. */}
        <span className="relative mx-[0.2em] font-bold text-brand">
          Feedback
          {/* Figma "Ellipse 10": 173×67, stroke #FF3B1F weight 1 inside. Note
              that 173 is much rounder than the word's own 171×43 box — the ring
              stands well clear of the text, it does not hug it.
              Out of flow on purpose. Geist's bold cut is wider than Neue Haas's,
              so a ring of that size drawn with padding would push the row past
              the content column; as an overlay it can be any size at all and the
              line width never moves.
              The insets are what is left over each side of the word once it is
              measured: at 30px the inline box comes out 143 wide by 38.4 tall —
              tall because an inline box is ascent plus descent, not the 31px
              line box — so 15px and 14.3px get it to 173×67. */}
          <span
            ref={ringRef}
            aria-hidden
            className="absolute inset-x-[-0.5em] inset-y-[-0.477em] rounded-[50%] border border-brand"
          />
        </span>

        {/* Figma Dev Mode on "Comes early": 20px / 105% / 0% tracking in the
            25 XThin cut, filled pure #000 — so weight 100 and black, not the
            near-black ink token. 0.66em of the 30px step size lands on 20px.
            It sits all but centred on the ring, nudged a touch right.
            On phones both flow lines wrap, which can leave the ring on a second
            line with the caption landing on the first — so below sm it stays in
            flow underneath instead. */}
        <span
          className={cn(
            "block text-center text-[0.66em] leading-[1.05] font-thin whitespace-nowrap text-black",
            // In flow on phones, so it has to be pushed clear of the ring's
            // lower arc, which hangs below the word it is drawn around.
            "max-sm:mt-[1em]",
            "sm:absolute sm:left-1/2 sm:translate-x-[calc(-50%+0.2em)] sm:text-left",
            noteAbove
              ? "sm:bottom-[calc(100%+1.15em)]"
              : "sm:top-[calc(100%+1.15em)]",
          )}
        >
          {note}
        </span>
      </span>

      {after.map((step) => (
        <span key={step} className="flex items-center gap-x-[0.35em]">
          <span aria-hidden>→</span>
          {step}
        </span>
      ))}
    </p>
  );
}
