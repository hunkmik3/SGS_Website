import { cn } from "@/lib/utils";

/** Small uppercase mono label that sits above most section headings. */
export function Eyebrow({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("font-mono text-eyebrow uppercase text-muted", className)}
      {...props}
    />
  );
}
