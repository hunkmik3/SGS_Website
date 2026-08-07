"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

type CountUpProps = {
  to: number;
  /** Seconds. */
  duration?: number;
};

/**
 * Counts to `to` the first time it scrolls into view.
 *
 * The span is locked to the final value's character width and set in tabular
 * figures, so the digits do not shuffle the "x" beside them while counting.
 */
export function CountUp({ to, duration = 1.4 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    // Reduced motion needs no effect at all — the value is derived below.
    if (!inView || reduced) return;

    let frame = 0;
    const started = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - started) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, to, duration]);

  return (
    <span
      ref={ref}
      className="inline-block text-right tabular-nums"
      style={{ width: `${String(to).length}ch` }}
    >
      {reduced ? to : value}
    </span>
  );
}
