export const site = {
  name: "Sleepy Giant Studio",
  tagline: "AI-native creative studio",
  email: "khoa@sleepygiant.studio",
  location: "Singapore",
  /** Hard-coded rather than derived from the clock: a build-time year would
   *  freeze at deploy anyway, and Figma specifies this one. */
  year: 2026,
  /** Listed in the order the sections appear, so the page never scrolls back. */
  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "What we do", href: "#what-we-do" },
  ],
  cta: { label: "Contact Us", href: "#contact" },
} as const;
