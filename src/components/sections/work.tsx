import { Container } from "@/components/ui/container";
import { VideoCard } from "@/components/ui/video-card";

/**
 * The reel that replaced the four-card strip.
 *
 * Same VideoCard as the About page uses, so the two behave alike: a silent 16:9
 * loop that opens the footage with sound on click. No overlay copy here, so the
 * card skips its scrim — there is nothing to hold contrast for.
 *
 * On the content column rather than wider, like the strip it replaces, so it
 * still lines up with the logo and every section below it.
 *
 * Deliberately unanimated, as the strip was: no scroll reveal. This is the first
 * thing under the hero and reads better arriving already in place.
 */
export function Work() {
  // No bottom padding — the next section owns the gap below.
  return (
    <section id="work" className="pt-[clamp(1rem,2.6vw,2.5rem)]">
      <Container>
        <VideoCard
          src="/video/work-reel.mp4"
          poster="/video/work-reel-poster.jpg"
        />
      </Container>
    </section>
  );
}
