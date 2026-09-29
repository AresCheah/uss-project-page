import { siteContent } from "@/content/siteContent";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CountUp from "@/components/ui/CountUp";

export default function HighlightStats() {
  return (
    <AnimatedSection className="px-6 pb-2 pt-4 lg:px-8" delayMs={20}>
      <div className="section-shell">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {siteContent.highlightStats.map((stat, index) => (
            <div key={stat.label} className="panel p-5">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="font-display text-[2.1rem] font-semibold leading-none text-slate-900">
                  <CountUp
                    value={stat.value}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                    durationMs={950 + index * 110}
                  />
                </span>
                <span className="mt-3 block text-sm leading-6 text-slate-500">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </AnimatedSection>
  );
}
