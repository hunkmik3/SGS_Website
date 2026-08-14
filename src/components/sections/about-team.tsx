"use client";

import { useState } from "react";
import Image from "next/image";
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
 * Phones get a 3:4 card instead. At 351px wide the Figma ratio leaves only 191px
 * of height and the corner blocks would collide. There is no phone design for
 * this section yet, so this only buys the content room to breathe.
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
    photo: { src: "/images/about/khoa.png", width: 1000, height: 1020, fit: "h-full" },
    alt: "Khoa, founder and CEO of Sleepy Giant Studio.",
    credits: [
      "Founded Otsu Animation.",
      "Previously Production & Operations at Netflix.",
    ],
  },
  {
    name: "TYSON",
    role: "Creative Director",
    photo: { src: "/images/about/tyson.png", width: 400, height: 652, fit: "h-[88%]" },
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
    photo: { src: "/images/about/raymond.png", width: 563, height: 834, fit: "h-[88%]" },
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
      aria-label={`Showing ${person.name}. Click for the next member of the leadership team.`}
      aria-live="polite"
      className="relative mt-[clamp(1.5rem,2.6vw,3.25rem)] aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-[clamp(0.875rem,1.667vw,2.1rem)] bg-ink text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cream sm:aspect-[979/532]"
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
            "absolute bottom-0 left-[31.3%] w-[50%] object-contain object-bottom",
            person.photo.fit,
          )}
        />

        <span className="absolute top-[8.8%] left-[4.5%] block text-[clamp(0.8125rem,1.84vw,2.3rem)] leading-[1.15] font-medium text-brand">
          {lead.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </span>

        <span className="absolute bottom-[23%] left-[4.5%] block">
          <span className="block text-[clamp(2rem,5.903vw,7.4rem)] leading-[0.96] font-bold text-cream">
            {person.name}
          </span>
          <span className="block text-[clamp(0.75rem,2.222vw,2.8rem)] leading-[0.96] font-light text-cream">
            {person.role}
          </span>
        </span>

        {/* Capped rather than broken by hand: the roster's credits run to very
            different lengths, and a width that reproduces Figma's break in
            Khoa's Netflix line also wraps the longer ones sensibly. */}
        <span className="absolute right-[3.7%] bottom-[12%] block max-w-[32%] text-[clamp(0.625rem,1.39vw,1.75rem)] leading-[1.25] text-white">
          {person.credits.map((credit, i) => (
            <span key={credit} className={i === 0 ? "block" : "mt-[1.1em] block"}>
              {credit}
            </span>
          ))}
        </span>
      </motion.span>
    </button>
  );
}
