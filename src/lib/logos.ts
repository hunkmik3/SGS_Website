export type ClientLogo = {
  name: string;
  src: string;
  /**
   * Height relative to the row's base size. Figma sets each logo optically
   * rather than to a common height — the stacked Rainshine lockup reads small
   * at the width the wordmarks need, the Ninety Eight lockup is two lines tall.
   */
  scale: number;
  /**
   * Overrides `scale` below the lg breakpoint. Only set where the phone layout
   * needs a different balance: with two logos to a row instead of four, the
   * top pair carries the row on its own and has to read larger.
   */
  mobileScale?: number;
  /**
   * Position in the phone layout. Figma reshuffles the wall on mobile so it
   * settles into 2 + 2 + 3 rows instead of wrapping in desktop order, which
   * would leave a lone BytePlus on a fourth row.
   */
  mobileOrder: number;
};

/** Desktop order: the row wraps 4 + 3 exactly as in Figma. */
export const clientLogos: ClientLogo[] = [
  {
    name: "Ninety Eight",
    src: "/images/logos/ninety-eight.png",
    scale: 1.31,
    mobileScale: 1.66,
    mobileOrder: 0,
  },
  { name: "Avis", src: "/images/logos/avis.png", scale: 0.84, mobileOrder: 6 },
  { name: "GlobalComix", src: "/images/logos/globalcomix.png", scale: 1.0, mobileOrder: 5 },
  { name: "INKR", src: "/images/logos/inkr.png", scale: 0.93, mobileOrder: 4 },
  {
    name: "Graphic India",
    src: "/images/logos/graphic-india.png",
    scale: 1.55,
    mobileScale: 1.7,
    mobileOrder: 2,
  },
  {
    name: "Rainshine Entertainment",
    src: "/images/logos/rainshine.png",
    scale: 1.6,
    mobileScale: 1.9,
    mobileOrder: 1,
  },
  { name: "BytePlus", src: "/images/logos/byteplus.png", scale: 0.89, mobileOrder: 3 },
];
