"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * The leadership card: one person at a time, clicked to reach the next.
 *
 * Figma measurements (1440 frame): a 979×532 card on the content column, the
 * name 85px / 75 Bold / 96% over the role at 32px / 45 Light / 96%, both filled
 * #F5F1E8. The two name lines' boxes touch — 3316 + 82 = 3398 — so they carry no
 * gap between them at all.
 *
 * The phone frame is a tall 312×540 card — 0.58, well off the 1.84 of the wide
 * one — and its copy is much larger in proportion. Measured against the card's
 * width: the red lines run 7%, the name 14%, the role 5.4% and the credits 3.5%,
 * which on a 351px card come to 24, 48, 19 and 12px. Every one of those is
 * bigger than the wide layout's value at phone sizes, so they are written phone
 * first with sm: restoring the desktop tuning — a clamp floor cannot express it,
 * since a floor above the vw term wins at every width.
 *
 * The portraits are as large as the card allows, which is not the same size for
 * each: the two tall crops fit within it, while Khoa's near-square one has to
 * run past both edges to carry the same weight. It stops at 76% of the card's
 * height because that is where his hair meets the underside of the red copy —
 * any larger and the text sits on his face.
 *
 * Nothing in the frame says the card advances, so the counter in its top corner
 * is ours: a pointer cursor is invisible on a touch screen, and a card that
 * silently holds two more people is a card nobody clicks. It borrows the pill
 * the video card already uses, and shows the position so the count is legible
 * too — an arrow alone says "more", not "three".
 */

/**
 * Figma prints the same four red lines on every leadership card, so it is almost
 * certainly standing copy rather than anything about a particular person. One
 * constant until real per-person copy arrives.
 */
const lead = [
  "Two animation",
  "companies shipped.",
  "Building the third with",
  "lessons of both.",
];

const team = [
  {
    name: "KHOA",
    role: "Founder & CEO",
    photo: {
      src: "/images/about/khoa.png",
      width: 1000,
      height: 1020,
      fit: "h-full",
      // Sized by height and allowed past the card's edges. At 0.98 this cutout
      // is nearly square, so carrying the same presence as the other two means
      // going wider than the card. Sat 30% right of centred, so the whole
      // overflow falls off the right-hand edge and the pointing hand survives.
      phone:
        "max-sm:left-[15.5%] max-sm:h-[76%] max-sm:w-auto max-sm:max-w-none",
    },
    alt: "Khoa, founder and CEO of Sleepy Giant Studio.",
    credits: [
      "Founded Otsu Animation.",
      "Previously Production & Operations at Netflix.",
    ],
  },
  {
    name: "TYSON",
    role: "Creative Director",
    photo: {
      src: "/images/about/tyson.png",
      width: 400,
      height: 652,
      fit: "h-[88%]",
      phone: "max-sm:left-[20%] max-sm:h-[79%] max-sm:w-auto max-sm:max-w-none",
    },
    alt: "Tyson, creative director at Sleepy Giant Studio.",
    credits: [
      "Co-founder of SpartaFX.",
      "15 years in commercial live action and 3D animation.",
      "Leads SGS AI pipeline architecture and creative direction standards.",
    ],
  },
  {
    name: "RAYMOND",
    role: "COO",
    photo: {
      src: "/images/about/raymond.png",
      width: 563,
      height: 834,
      fit: "h-[88%]",
      phone: "max-sm:left-[20%] max-sm:h-[79%] max-sm:w-auto max-sm:max-w-none",
    },
    alt: "Raymond, chief operating officer at Sleepy Giant Studio.",
    credits: [
      "Co-founder of Otsu Animation.",
      "Cross-border structure (Singapore, Vietnam, Hong Kong), revenue model, P&L oversight.",
    ],
  },
];

export function LeadershipCard() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  const person = team[index];

  return (
    <button
      type="button"
      onClick={() => setIndex((n) => (n + 1) % team.length)}
      aria-label={`Showing ${person.name}, ${index + 1} of ${team.length}. Click for the next member of the leadership team.`}
      aria-live="polite"
      className="group relative mt-[clamp(1.5rem,2.6vw,3.25rem)] aspect-[312/540] w-full cursor-pointer overflow-hidden rounded-[clamp(0.875rem,1.667vw,2.1rem)] bg-panel text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cream sm:aspect-[979/532]"
    >
      {/* Keyed on the name, so every click mounts a fresh block that fades up
          while the outgoing one leaves immediately. */}
      <motion.span
        key={person.name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
        className="absolute inset-0 block"
      >
        {/* Half the card wide, starting 31% in and pinned to the bottom edge, so
            object-bottom keeps whoever is showing standing on the card's floor.
            The three cutouts have different aspects — 0.98, 0.61, 0.68 — and
            object-contain inside one box is what lets them share a position:
            each is centred in it at whatever size fits.
            The height is per person because the crops are framed differently.
            Khoa's is nearly square, so the box's width bounds him and he already
            has the headroom Figma draws above the hair; the two tall crops are
            bounded by height instead and filled the card edge to edge, which
            read as oversized. 88% gives them the same headroom. */}
        <Image
          src={person.photo.src}
          alt={person.alt}
          width={person.photo.width}
          height={person.photo.height}
          sizes="(max-width: 640px) 50vw, 34vw"
          className={cn(
            "absolute bottom-0 left-0 w-full object-contain object-bottom sm:left-[31.3%] sm:w-[50%]",
            person.photo.fit,
            // Last, so a per-person phone override wins over both.
            person.photo.phone,
          )}
        />

        <span className="absolute top-[4%] left-[6%] block text-[1.5rem] leading-[1.15] font-medium text-brand sm:top-[8.8%] sm:left-[4.5%] sm:text-[clamp(0.8125rem,1.84vw,2.3rem)]">
          {lead.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </span>

        <span className="absolute bottom-[27%] left-[6%] block sm:bottom-[23%] sm:left-[4.5%]">
          <span className="block text-[3rem] leading-[0.96] font-bold text-cream sm:text-[clamp(2rem,5.903vw,7.4rem)]">
            {person.name}
          </span>
          <span className="block text-[1.1875rem] leading-[0.96] font-light text-cream sm:text-[clamp(0.75rem,2.222vw,2.8rem)]">
            {person.role}
          </span>
        </span>

        {/* Wrapped to a measured width rather than broken by hand. On phones the
            frame's five breaks — across Raymond's three lines and Tyson's two
            pairs — are all reproduced by one column, and only just: at 12px they
            hold between 207 and 212px, so 59.5% of the 351px card sits in the
            middle of that window. Wider by 13px and "and" joins the line above.
            From sm it goes back to shrink-to-fit under a 32% cap, which is what
            reproduces Figma's break in Khoa's Netflix line.
            text-pretty keeps "Netflix." off a line of its own; the other two
            already end on more than one word, so it leaves their breaks alone. */}
        <span className="absolute right-[5%] bottom-[3%] left-[35.5%] block text-[0.75rem] leading-[1.25] text-pretty text-white sm:right-[3.7%] sm:bottom-[12%] sm:left-auto sm:max-w-[32%] sm:text-[clamp(0.625rem,1.39vw,1.75rem)]">
          {person.credits.map((credit, i) => (
            <span
              key={credit}
              className={i === 0 ? "block" : "mt-[1.1em] block"}
            >
              {credit}
            </span>
          ))}
        </span>
      </motion.span>

      <span
        aria-hidden
        className="absolute top-[5.5%] right-[3.7%] flex items-center gap-[0.5em] rounded-full bg-cream/15 px-[0.9em] py-[0.45em] font-mono text-[clamp(0.625rem,0.97vw,1.2rem)] text-cream backdrop-blur-sm transition-colors group-hover:bg-cream/30"
      >
        {index + 1}/{team.length}
        <ChevronRight className="size-[1.2em]" />
      </span>
    </button>
  );
}
