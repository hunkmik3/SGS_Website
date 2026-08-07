import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";

/**
 * Figma measurements (1440 frame): the bar runs near full-bleed — roughly
 * 1390×222 with a ~25px gutter — rather than sitting on the 68% content column,
 * and its three columns are inset ~10.5% from the bar's own edges.
 *
 * Every size below is a clamp whose lower bound is the phone value and whose vw
 * term is the desktop one, so the two layouts are tuned independently. Only the
 * row gutter is a plain value: desktop puts the three stats on one row, where a
 * vertical gap has nothing to act on.
 */
const stats = [
  { lead: "10", accent: "x", label: "Faster than a traditional pipeline", count: 10 },
  { lead: "Tailored", accent: "", label: "Every solution built to fit" },
  { lead: "Hands-", accent: "on", label: "We adopt it with your team" },
];

export function Stats() {
  return (
    <section className="pt-[clamp(3rem,5.7vw,7.1rem)]">
      <Reveal className="mx-auto w-[96%]">
        <div className="grid gap-y-[5.5rem] rounded-[clamp(0.75rem,1.6vw,2rem)] bg-ink px-[10.5%] py-[clamp(2.375rem,4.7vw,5.9rem)] text-center sm:grid-cols-3 sm:gap-y-0">
          {stats.map(({ lead, accent, label, count }) => (
            <div key={lead}>
              <p className="text-[clamp(3.5rem,4.44vw,5.55rem)] leading-none font-bold tracking-[-0.03em] text-cream">
                {count ? <CountUp to={count} /> : lead}
                {accent && <span className="text-brand">{accent}</span>}
              </p>
              {/* These two want a larger value on phones than on desktop, which
                  a clamp cannot express — its floor would win everywhere. */}
              <p className="mt-3 font-mono text-[0.75rem] tracking-[0.08em] text-cream uppercase sm:mt-[clamp(0.375rem,0.55vw,0.7rem)] sm:text-[clamp(0.625rem,0.83vw,1.05rem)]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
