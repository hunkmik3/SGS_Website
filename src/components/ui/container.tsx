import { cn } from "@/lib/utils";

/**
 * The single content column every section shares — header, hero and all
 * sections below it line up on the same edges, as they do in Figma.
 *
 * Figma insets content ~16% per side on the 1440 frame, i.e. a 68% column.
 * Narrower viewports widen the column progressively, since a 16% gutter eats
 * far too much of a phone screen.
 */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-[90%] sm:w-[80%] lg:w-[68%]", className)}
      {...props}
    />
  );
}
