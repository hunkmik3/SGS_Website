"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type RevealProps = {
  /** Stagger offset in seconds, for sibling elements that animate in sequence. */
  delay?: number;
  /** Distance travelled, in px. Larger reads as heavier — use for big blocks. */
  distance?: number;
} & React.ComponentProps<"div">;

/**
 * Fade + rise on first scroll into view.
 *
 * The CSS in globals.css already neutralises keyframe animations under
 * prefers-reduced-motion, but Motion drives transforms from JS, so that rule
 * cannot reach it. useReducedMotion is what actually opts this out — otherwise
 * the whole page still slides for someone who asked it not to.
 */
export function Reveal({
  delay = 0,
  distance = 16,
  className,
  ...props
}: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      // Reduced motion starts at the destination rather than dropping the
      // animation. Removing whileInView instead would strand the element at
      // opacity 0: useReducedMotion reports null on the server, so the first
      // render already hides it and nothing would ever bring it back.
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: reduced ? 0 : 0.55,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
      {...(props as React.ComponentProps<typeof motion.div>)}
    />
  );
}
