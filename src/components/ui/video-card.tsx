"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Volume2, X } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type VideoCardProps = {
  src: string;
  poster: string;
  /**
   * Phones get a portrait card instead of 16:9. Opt-in rather than automatic:
   * the reel on the home page has no phone design yet, and cropping a landscape
   * frame to portrait throws away two thirds of it.
   */
  tallOnPhones?: boolean;
  /**
   * Overlay copy, shown on the card behind the play affordance. Optional: with
   * none there is nothing to hold contrast for, so the scrim and its fade are
   * skipped rather than dimming the footage for no reason.
   */
  children?: React.ReactNode;
};

/**
 * A silent looping card that opens the same footage in a dialog on click.
 *
 * Two <video> elements share one src: the card keeps looping muted, and the
 * dialog gets its own player with sound and controls. They hit the same URL, so
 * the second one comes out of cache — and closing the dialog leaves the card
 * exactly as it was, still mid-loop.
 *
 * The dialog is what earns the audio: browsers block autoplay unless a video is
 * muted, and unmuting needs a user gesture. Opening it counts as one, so the
 * dialog's player is started by hand rather than through the autoplay attribute.
 *
 * The overlay copy reads for a beat and then fades off, handing the frame over to
 * the footage. It is timed off the loop actually starting rather than off mount,
 * so the words are never gone before the video they sit on has begun — and since
 * the loop now waits for the card to be on screen, that beat starts when someone
 * is actually looking at it.
 */
export function VideoCard({
  src,
  poster,
  tallOnPhones = false,
  children,
}: VideoCardProps) {
  const frame = useRef<HTMLDivElement>(null);
  const loop = useRef<HTMLVideoElement>(null);
  const dialogVideo = useRef<HTMLVideoElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const [faded, setFaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  const COPY_HOLD_MS = 2500;
  const COPY_FADE_S = 1.2;

  // Two different questions, so two observers. This one decides when to fetch:
  // the file is heavy, so the src is held back until the card is nearly in view
  // and a visitor who never scrolls this far downloads only the poster.
  const near = useInView(frame, { once: true, margin: "400px" });
  // And this one decides when to play — on arrival rather than 400px early, and
  // it stops again on the way out instead of running off-screen.
  const onScreen = useInView(frame, { amount: 0.35 });

  useEffect(() => {
    const el = loop.current;
    if (!el || !near) return;
    // src arrives after the autoplay attribute was evaluated, so start by hand.
    if (open || reduced || !onScreen) el.pause();
    else void el.play().catch(() => {});
  }, [near, onScreen, open, reduced]);

  // Left visible for anyone who asked for less motion: fading copy out is the
  // one thing here that removes content rather than just moving it.
  useEffect(() => {
    if (!playing || reduced) return;
    const timer = setTimeout(() => setFaded(true), COPY_HOLD_MS);
    return () => clearTimeout(timer);
  }, [playing, reduced]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButton.current?.focus();
    void dialogVideo.current?.play().catch(() => {});

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  const dialog = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sleepy Giant Studio showreel"
      className="fixed inset-0 z-70 flex items-center justify-center bg-panel/95 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <button
        ref={closeButton}
        type="button"
        onClick={close}
        aria-label="Close video"
        className="absolute top-4 right-4 p-2 text-cream transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
      >
        <X aria-hidden className="size-7" />
      </button>

      {/* Clicks inside the player must not reach the backdrop, or using the
          controls would close the dialog. */}
      <video
        ref={dialogVideo}
        src={src}
        poster={poster}
        controls
        playsInline
        onClick={(event) => event.stopPropagation()}
        className="max-h-full w-full max-w-[min(90rem,90vw)] rounded-[clamp(0.5rem,0.8vw,1rem)]"
      />
    </div>
  );

  return (
    <>
      <div
        ref={frame}
        className={cn(
          "relative aspect-video overflow-hidden rounded-[clamp(0.625rem,1.11vw,1.4rem)] bg-panel",
          tallOnPhones && "max-sm:aspect-[29/50]",
        )}
      >
        <video
          ref={loop}
          src={near ? src : undefined}
          poster={poster}
          muted
          loop
          playsInline
          onPlaying={() => setPlaying(true)}
          className="absolute inset-0 size-full object-cover"
        />

        {/* Scrim and copy fade together: the scrim only exists to hold contrast
            under the words, and once they are gone it would just be a grey veil
            over the footage. */}
        {children ? (
          <motion.div
            aria-hidden
            animate={{ opacity: faded ? 0 : 1 }}
            transition={{ duration: COPY_FADE_S, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0"
          >
            {/* The footage brightens in places, so the copy needs a floor of
              contrast that does not depend on which frame is showing. */}
            <div className="absolute inset-0 bg-panel/35" />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              {children}
            </div>
          </motion.div>
        ) : null}

        {/* A real button, so the interaction is reachable by keyboard. The copy
            above it is inert, letting clicks through. */}
        <button
          ref={trigger}
          type="button"
          onClick={() => setOpen(true)}
          className="absolute inset-0 flex cursor-pointer items-end justify-end p-[clamp(0.75rem,1.4vw,1.75rem)] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cream"
        >
          <span className="sr-only">Play with sound</span>
          <span
            aria-hidden
            className="flex items-center gap-2 rounded-full bg-panel/60 px-[0.9em] py-[0.45em] font-mono text-[clamp(0.625rem,0.83vw,1.05rem)] text-cream uppercase backdrop-blur-sm transition-colors max-sm:hidden hover:bg-panel/80"
          >
            <Volume2 className="size-[1.2em]" />
            Play with sound
          </span>
        </button>
      </div>

      {/* Portalled to <body>: an ancestor with a filter or transform would make
          itself the containing block and trap inset-0 inside the card. */}
      {open && createPortal(dialog, document.body)}
    </>
  );
}
