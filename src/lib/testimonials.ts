export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** White-on-transparent mark that sits inside the red avatar disc. */
  logo?: string;
};

const GLOBAL_COMIX = "/images/avatars/global-comix.png";
const NIGHTY_EIGHT = "/images/avatars/nighty-eight.png";

/**
 * Figma shows two written testimonials and repeats them to fill the marquee.
 * The remaining entries are placeholders — swap in real quotes when they land.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "They understood our format instantly and built something tailored to it. The output speaks for itself.",
    name: "Henrik Rydberg",
    role: "CEO, Global Comix",
    logo: GLOBAL_COMIX,
  },
  {
    quote:
      "They rebuilt our pipeline in weeks and trained our team to run it. We're shipping at a pace we didn't think was possible.",
    name: "Thanh Le",
    role: "Founder, Nighty-Eight",
    logo: NIGHTY_EIGHT,
  },
  {
    quote:
      "They understood our format instantly and built something tailored to it. The output speaks for itself.",
    name: "Place Holder",
    role: "CEO, Global Comix",
    logo: GLOBAL_COMIX,
  },
  {
    quote:
      "They understood our format instantly and built something tailored to it. The output speaks for itself.",
    name: "Place Holder",
    role: "CEO, Global Comix",
    logo: GLOBAL_COMIX,
  },
  {
    quote:
      "They rebuilt our pipeline in weeks and trained our team to run it. We're shipping at a pace we didn't think was possible.",
    name: "Place Holder",
    role: "Founder, Nighty-Eight",
    logo: NIGHTY_EIGHT,
  },
  {
    quote:
      "They understood our format instantly and built something tailored to it. The output speaks for itself.",
    name: "Place Holder",
    role: "CEO, Global Comix",
    logo: GLOBAL_COMIX,
  },
];

/** Fallback mark for entries that have no logo yet. */
export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}
