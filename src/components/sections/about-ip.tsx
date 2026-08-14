import Image from "next/image";

import { Reveal } from "@/components/ui/reveal";
import { VideoCard } from "@/components/ui/video-card";

/**
 * Figma measurements (1440 frame): a 16:9 card at 90% of the viewport — wider
 * than the 68% content column, so it sits outside Container — with the mark,
 * headline and closing line stacked over the footage.
 *
 * The phone frame turns the card portrait and sets the copy much larger: 30px
 * and 26px, which are the sizes that reproduce its breaks after "10" and after
 * "shouldn't" inside the 303px copy area. Below 25px the lines run on and the
 * shape is lost. Only the clamp floors move, so desktop is untouched.
 */
export function AboutIp() {
  return (
    <section className="pt-section">
      <Reveal className="mx-auto w-[90%]">
        <VideoCard
          src="/video/about-ip.mp4"
          poster="/video/about-ip-poster.jpg"
          tallOnPhones
        >
          <Image
            src="/images/giant-mark-red.png"
            alt=""
            width={301}
            height={360}
            className="h-[clamp(3.375rem,6.18vw,7.75rem)] w-auto"
          />

          <h2 className="mt-[clamp(1.375rem,2.9vw,3.6rem)] text-[clamp(1.875rem,3.4vw,4.25rem)] leading-[1.15] font-bold tracking-[-0.02em] text-white">
            Hollywood takes 10 years to build an IP.
            <br />
            We take 10 weeks.
          </h2>

          <p className="mt-[clamp(1.875rem,4.4vw,5.5rem)] text-[clamp(1.625rem,2.78vw,3.5rem)] leading-[1.2] text-white">
            Great stories shouldn&apos;t wait to exist.
          </p>
        </VideoCard>
      </Reveal>
    </section>
  );
}
