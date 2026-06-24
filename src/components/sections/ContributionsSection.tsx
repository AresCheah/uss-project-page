import { siteContent } from "@/content/siteContent";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionIntro from "@/components/ui/SectionIntro";

export default function ContributionsSection() {
  return (
    <AnimatedSection id="contributions" className="px-6 py-12 lg:px-8 lg:py-16" delayMs={60}>
      <div className="section-shell">
        <SectionIntro
          index="02"
          eyebrow="Key contributions"
          title="Contributions"
          description="A sharper interface for embodied visual tracking."
        />

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
          {siteContent.contributions.map((item, index) => (
            <article
              key={item.title}
              className="panel group p-7 transition hover:border-slate-300 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl text-ivory/30">0{index + 1}</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-500">
                  USS
                </span>
              </div>
              <h3 className="mt-6 font-display text-[2rem] leading-tight text-ivory">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
