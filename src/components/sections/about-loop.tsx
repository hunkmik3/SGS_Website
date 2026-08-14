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

/**
 * Rotating the artwork cannot change which side of the chord its curve bows
 * towards — a rotation preserves that. The two layouts want opposite bows, so
 * the phone one is flipped vertically as well, and its anchors move with it.
 */
const flip = (p: { x: number; y: number }) => ({ x: p.x, y: 1 - p.y });
const ends = (mirror: boolean) =>
  mirror ? { tail: flip(TAIL), head: flip(HEAD) } : { tail: TAIL, head: HEAD };

/** Drawn a little shorter than the gap it bridges, per the design. */
const ARROW_SCALE = 0.88;
/** The phone frame draws it a tenth smaller again against a shorter chord. */
const PHONE_ARROW_SCALE = ARROW_SCALE * 0.9;

type Placement = {
  left: number;
  top: number;
  size: number;
  rotation: number;
  mirror: boolean;
};

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

    // The two layouts run the flows differently, so the connector's ends do too.
    // Read the breakpoint rather than infer it from the rings' positions, which
    // would be guessing at the layout from its symptoms.
    const wide = window.matchMedia("(min-width: 40rem)").matches;

    // Wide: rows stacked, so the tail tucks under the first ring's left flank
    // and the head lands on the second ring's right shoulder. Barely inset
    // horizontally — pulling both ends a full 15% of the ring's width inwards
    // added a third again to the horizontal run and flattened the sweep into a
    // long shallow curve, where the design's is steep.
    //
    // Phones: columns side by side, so it runs across instead — out of the left
    // ring's right flank and into the right ring's left one.
    // Phones shift both ends left of the rings, so the arc clears the "Comes
    // early" caption sitting above the right one and the head arrives on that
    // ring's edge rather than inside it.
    const nudge = wide ? 0 : start.width * 0.12;
    const tailX = wide
      ? start.left + start.width * 0.08 - box.left
      : start.right - start.width * 0.1 - nudge - box.left;
    const tailY = wide
      ? start.bottom - start.height * 0.15 - box.top
      : start.top + start.height * 0.5 - box.top;
    const headX = wide
      ? end.right - end.width * 0.05 - box.left
      : end.left + end.width * 0.1 - nudge - box.left;
    const headY = wide
      ? end.top + end.height * 0.18 - box.top
      : end.top + end.height * 0.5 - box.top;

    // Drawn a shade shorter than the run between those two points — and pulled
    // back from the tail end, not from both. The head has to sit on the second
    // ring the way the design draws it; the slack belongs at the other end,
    // where the first ring covers it.
    const scale = wide ? ARROW_SCALE : PHONE_ARROW_SCALE;
    const h = [headX, headY];
    const t = [
      headX + (tailX - headX) * scale,
      headY + (tailY - headY) * scale,
    ];

    // Turn the artwork so its own tail→head chord lies along the one we want,
    // and scale it so the two chords are the same length.
    const mirror = !wide;
    const { tail, head } = ends(mirror);
    const artAngle = Math.atan2(head.y - tail.y, head.x - tail.x);
    const artSpan = Math.hypot(head.x - tail.x, head.y - tail.y);

    const rotation = Math.atan2(h[1] - t[1], h[0] - t[0]) - artAngle;
    const size = Math.hypot(h[0] - t[0], h[1] - t[1]) / artSpan;

    // rotate() spins around the centre, so the tail anchor is carried with it.
    // Walk it back through the same rotation to find where the centre must go
    // for the tail to land on target.
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const ox = (tail.x - 0.5) * size;
    const oy = (tail.y - 0.5) * size;
    const cx = t[0] - (ox * cos - oy * sin);
    const cy = t[1] - (ox * sin + oy * cos);

    setArrow({
      left: cx - size / 2,
      top: cy - size / 2,
      size,
      rotation,
      mirror,
    });
  }, []);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (frame.current) observer.observe(frame.current);
    // The frame can cross the breakpoint without changing size, and the anchors
    // flip on that alone.
    const mq = window.matchMedia("(min-width: 40rem)");
    mq.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      mq.removeEventListener("change", measure);
    };
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
            className="relative mt-[clamp(1.75rem,3.1vw,3.9rem)] flex justify-center gap-[clamp(0.5rem,4.93vw,6.2rem)] max-sm:items-start sm:flex-col"
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
                  transform: `rotate(${arrow.rotation}rad)${
                    arrow.mirror ? " scaleY(-1)" : ""
                  }`,
                }}
                className="pointer-events-none absolute"
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
    // A column on phones, a line from sm. The steps keep their grouping either
    // way — each carries the arrow that follows it — so only the axis changes.
    // flex-1 on phones: each column takes half the width and centres in it, which
    // is what sets the two rings ~175px apart, as the frame draws them. Sized to
    // their content instead, they ended up 14px apart with no room for the
    // connector between them.
    <p className="flex flex-1 flex-col items-center gap-[0.35em] text-[clamp(1.125rem,2.06vw,2.6rem)] leading-[1.05] text-ink sm:flex-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-[0.35em] sm:gap-y-2">
      {before.map((step) => (
        <span
          key={step}
          className="flex flex-col items-center gap-[0.35em] sm:flex-row"
        >
          {step}
          {/* One glyph, turned a quarter on phones, rather than a second
              character to keep in step with this one. */}
          <span aria-hidden className="max-sm:rotate-90">
            →
          </span>
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
            25 XThin cut, filled pure #000 — so weight 100. The fill takes the
            ink token rather than that literal: pure black is invisible on a dark
            page, and in the light theme ink is #0d0d0d, which nobody can tell
            apart from #000. 0.66em of the 30px step size lands on 20px.
            It sits all but centred on the ring, nudged a touch right.
            On phones both flow lines wrap, which can leave the ring on a second
            line with the caption landing on the first — so below sm it stays in
            flow underneath instead. */}
        <span
          className={cn(
            "block text-center text-[0.66em] leading-[1.05] font-thin whitespace-nowrap text-ink",
            // In flow on phones, so it has to be pushed clear of the ring's
            // arc, which hangs past the word it is drawn around.
            "max-sm:mt-[1em]",
            noteAbove && "max-sm:translate-x-[10%]",
            // The phone frame puts the captions on the opposite sides to the
            // wide layout: "Comes last" under its ring, "Comes early" over its
            // own. Order rather than position, so nothing can overlap the
            // neighbouring column.
            !noteAbove &&
              "max-sm:order-first max-sm:mt-0 max-sm:mb-[1em] max-sm:-translate-x-[60%]",
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
        <span
          key={step}
          className="flex flex-col items-center gap-[0.35em] sm:flex-row"
        >
          <span aria-hidden className="max-sm:rotate-90">
            →
          </span>
          {step}
        </span>
      ))}
    </p>
  );
}
