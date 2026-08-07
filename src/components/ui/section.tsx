import { cn } from "@/lib/utils";

/** Vertical rhythm wrapper. Every page section should sit inside one. */
export function Section({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return <section className={cn("py-section", className)} {...props} />;
}
