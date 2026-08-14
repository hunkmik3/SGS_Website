import { cn } from "@/lib/utils";

/**
 * The small label above nearly every section heading.
 *
 * Figma Dev Mode on "LEADERSHIP TEAM": Noto Sans Light, 20px, 105% line height,
 * 0% letter spacing, fill #000000 — the node measures 171×14. Not the mono face:
 * that belongs to the hero's own eyebrow and to media captions.
 *
 * One component rather than the class string it replaces, which had been copied
 * into seven sections and had already drifted between them.
 */
export function SectionLabel({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-label text-[clamp(0.9375rem,1.389vw,1.76rem)] leading-[1.05] font-light text-black",
        className,
      )}
      {...props}
    />
  );
}
