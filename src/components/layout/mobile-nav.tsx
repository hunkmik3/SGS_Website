"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";

/**
 * Below sm the header carries only the logo and this trigger; the links live in
 * a full-screen panel instead. Above sm the whole component is hidden and the
 * inline nav takes over.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    // Stop the page behind the panel from scrolling with it.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButton.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    // Send focus back where it came from, or it lands on <body>.
    trigger.current?.focus();
  };

  const panel = (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-60 flex flex-col bg-ink text-cream sm:hidden"
    >
      <Container className="flex h-[68px] shrink-0 items-center justify-between">
        <Image
          src="/images/logo-sleepy-giant-light.png"
          alt={site.name}
          width={488}
          height={220}
          className="h-8 w-auto"
        />
        <button
          ref={closeButton}
          type="button"
          onClick={close}
          aria-label="Close menu"
          className="-mr-1 p-1"
        >
          <X aria-hidden className="size-7" />
        </button>
      </Container>

      <Container className="flex flex-1 flex-col justify-center pb-24 text-center">
        <nav>
          <ul>
            {site.nav.map((item) => (
              <li key={item.href} className="border-b border-white/15">
                <Link
                  href={item.href}
                  onClick={close}
                  className="block py-5 text-[2rem] leading-tight font-bold tracking-[-0.02em] transition-colors hover:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Button
          href={site.cta.href}
          onClick={close}
          className="mt-10 h-11 self-center px-6 text-[15px] font-semibold"
        >
          {site.cta.label}
        </Button>
      </Container>
    </div>
  );

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="-mr-1 p-1 text-ink sm:hidden"
      >
        <Menu aria-hidden className="size-7" />
      </button>

      {/*
       * Portalled to <body> on purpose. The header sets backdrop-blur, and a
       * backdrop-filter makes an element a containing block for fixed-position
       * descendants — inset-0 would otherwise resolve against the 68px header
       * strip, leaving the panel a thin bar across the top.
       */}
      {open && createPortal(panel, document.body)}
    </>
  );
}
