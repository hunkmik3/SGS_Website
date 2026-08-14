import type { Metadata } from "next";
import { Geist, Geist_Mono, Libre_Franklin, Noto_Sans } from "next/font/google";
import "./globals.css";

/**
 * Display face — Figma specifies Neue Haas Grotesk Display Pro, which is a
 * licensed Monotype family and is not distributable via Google Fonts.
 * Geist is the closest freely available neo-grotesk and is used as a stand-in.
 *
 * To swap in the real face: drop the .woff2 files into `src/fonts/` and replace
 * this block with
 *
 *   import localFont from "next/font/local";
 *   const display = localFont({
 *     variable: "--font-display",
 *     src: [
 *       { path: "../fonts/NeueHaasDisplayRoman.woff2",  weight: "400", style: "normal" },
 *       { path: "../fonts/NeueHaasDisplayMedium.woff2", weight: "500", style: "normal" },
 *       { path: "../fonts/NeueHaasDisplayBold.woff2",   weight: "700", style: "normal" },
 *     ],
 *     display: "swap",
 *   });
 *
 * Nothing else in the codebase needs to change — everything reads --font-display.
 */
const display = Geist({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

/** Geist Mono — used for the eyebrow labels and media captions. */
const code = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Libre Franklin ExtraLight — Figma specifies it for the testimonial quote
 * glyph alone (200 weight, 160px). It is a real Google font, so unlike the
 * display face this one matches the design exactly.
 */
const quote = Libre_Franklin({
  variable: "--font-quote-face",
  subsets: ["latin"],
  weight: "200",
  display: "swap",
});

/**
 * Noto Sans Light — Figma specifies it for the label above nearly every section
 * heading (20px / 105% / 0% tracking / #000). Another real Google font, so this
 * one matches the design exactly rather than standing in for it.
 */
const label = Noto_Sans({
  variable: "--font-label-face",
  subsets: ["latin"],
  weight: "300",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sleepy Giant Studio — Ship 10x more without 10x the team.",
  description:
    "An AI-native production pipeline engineered for higher output, consistent quality and leaner production overhead.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${code.variable} ${quote.variable} ${label.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
