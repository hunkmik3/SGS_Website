"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * `onDark` swaps in the light logo artwork. Everything else in the header is
 * already token-driven, so it follows a dark theme on its own — but the mark is
 * a raster asset with a fixed colour, and the dark one disappears on black.
 */
export function Header({ onDark = false }: { onDark?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); // Handle a reload that restores a scrolled position.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-paper/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300",
        // At the very top the header should read as part of the page; once it
        // starts overlapping content it needs to separate from it.
        scrolled
          ? "border-line shadow-[0_1px_16px_rgba(0,0,0,0.06)]"
          : "border-transparent shadow-none",
      )}
    >
      {/* Plain Container — the logo must sit on the same left edge as every
          section below it, exactly as in Figma. */}
      <Container className="flex h-[68px] items-center justify-between gap-3 sm:h-[110px]">
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="shrink-0 transition-opacity hover:opacity-80"
        >
          <Image
            src={
              onDark
                ? "/images/logo-sleepy-giant-light.png"
                : "/images/logo-sleepy-giant.png"
            }
            alt={site.name}
            width={488}
            height={220}
            priority
            className="h-8 w-auto sm:h-[55px]"
          />
        </Link>

        {/* Phones get the hamburger instead: the logo, three links and the CTA
            need ~305px, more than the content column has at 320px. */}
        <MobileNav />

        <nav className="hidden items-center gap-5 sm:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[14px] whitespace-nowrap text-ink transition-colors hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
          <Button
            href={site.cta.href}
            size="sm"
            className="px-4 text-[13px] font-semibold"
          >
            {site.cta.label}
          </Button>
        </nav>
      </Container>
    </header>
  );
}
