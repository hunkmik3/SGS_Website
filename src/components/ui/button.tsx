import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "invert";
type Size = "sm" | "md";

// `group` so an icon inside can react to the button's own hover.
const base =
  "group inline-flex items-center justify-center gap-1.5 rounded-full font-medium whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  outline: "border border-ink text-ink hover:bg-ink hover:text-white",
  invert: "bg-white text-ink hover:bg-white/85",
};

const sizes: Record<Size, string> = {
  sm: "h-[34px] px-4 text-[13px]",
  md: "h-9 px-4 text-[13px]",
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
} & (
  | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href">)
  | ({ href?: undefined } & React.ComponentProps<"button">)
);

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    return <Link className={classes} {...props} />;
  }

  return <button className={classes} {...props} />;
}
