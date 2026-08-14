import { LeadershipCard } from "@/components/sections/about-team";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";

export function AboutLeadership() {
  return (
    <section className="pt-section">
      <Container>
        <Reveal>
          <SectionLabel className="text-center uppercase">
            Leadership team
          </SectionLabel>

          <LeadershipCard />
        </Reveal>
      </Container>
    </section>
  );
}
