import Image from "next/image";

import { Container } from "@/components/ui/container";
import { workItems, type WorkItem } from "@/lib/work";
import { cn } from "@/lib/utils";

/**
 * Figma measurements (1440 frame): cards 235×350 (aspect 186/277), 12.6px gap,
 * every second card pushed 35px down. Expressed as percentages of the strip so
 * the whole row scales with the 80% content column.
 *
 * Deliberately unanimated: no scroll reveal, no hover lift, no image zoom. The
 * strip is the first thing under the hero and reads better sitting still.
 */
export function Work() {
  // No bottom padding — the next section owns the gap below the strip.
  return (
    <section id="work" className="pt-[clamp(1rem,2.6vw,2.5rem)]">
      <Container>
        {/* Four across only from 1280px up: at 1024px the cards would be 174px
            wide and the longest caption would no longer fit its plate. */}
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-[1.3%]">
          {workItems.map((item, i) => (
            <li
              key={item.title}
              // Odd cards sit lower — 15.05% of the card's own width.
              className={cn(i % 2 === 1 && "xl:pt-[15.05%]")}
            >
              <WorkCard item={item} priority={i < 2} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function WorkCard({ item, priority }: { item: WorkItem; priority: boolean }) {
  return (
    <figure className="relative aspect-[186/277] overflow-hidden rounded-[14px] bg-panel">
      {item.image ? (
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 20vw"
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(145deg,#3a3a3a_0%,#1c1c1c_55%,#2e2e2e_100%)]"
        />
      )}

      {/* 6.4% of the card width matches Figma's 15px inset at any card size.
          The label sits on its own tinted plate, sized in em so its padding and
          radius track the caption size.

          On a phone the cards go full width one to a row, and Figma centres the
          plate and sets it much larger — 21px against 14px on desktop. That is
          bigger than the desktop value, so it has to be the base with a sm:
          override rather than a clamp floor. */}
      <figcaption className="absolute right-[6.4%] bottom-[6.4%] left-[6.4%] text-center sm:text-left">
        <span className="inline-block rounded-[0.3em] bg-black/60 px-[0.5em] py-[0.2em] font-mono text-[1.3125rem] text-white sm:text-[clamp(0.75rem,0.97vw,1.2rem)]">
          {item.title}
        </span>
      </figcaption>
    </figure>
  );
}
