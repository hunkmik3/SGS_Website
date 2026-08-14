export const site = {
  name: "Sleepy Giant Studio",
  tagline: "AI-native creative studio",
  /** Shown in the footer. The form posts to CONTACT_TO_EMAIL, set in Vercel. */
  email: "contact@sleepygiant.studio",
  location: "Singapore",
  /** Hard-coded rather than derived from the clock: a build-time year would
   *  freeze at deploy anyway, and Figma specifies this one. */
  year: 2026,
  /**
   * The two section links are root-relative so they still work from /about,
   * where those sections do not exist — a bare hash there points at nothing.
   *
   * The CTA stays a bare hash on purpose: both pages carry their own #contact
   * form, so this reaches whichever one the visitor is already looking at.
   * Rooting it would send anyone on /about back to the home page to fill in the
   * same form.
   */
  nav: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/about" },
    { label: "What we do", href: "/#what-we-do" },
  ],
  cta: { label: "Contact Us", href: "#contact" },
} as const;
