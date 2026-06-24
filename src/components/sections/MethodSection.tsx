import { siteContent } from "@/content/siteContent";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionIntro from "@/components/ui/SectionIntro";

export default function MethodSection() {
  return (
    <AnimatedSection id="method" className="px-6 py-12 lg:px-8 lg:py-16" delayMs={80}>
      <div className="section-shell">
        <SectionIntro
          index="03"
          eyebrow="Method"
          title="Method"
          description="One architecture that turns heterogeneous prompts into egocentric waypoints."
        />

        <div className="mx-auto max-w-5xl space-y-6">
          <figure className="panel-muted overflow-hidden p-5">
            <img
              src={siteContent.method.image}
              alt="USS method diagram"
              className="h-auto w-full rounded-[20px] border border-slate-200 object-contain"
              loading="lazy"
            />
            <figcaption className="px-3 pb-1 pt-5 text-sm leading-7 text-slate-500">
              The method is organized into four parts: input encoding, vision-prompt alignment, waypoint prediction head, and an action-conditioned world model used during training.
            </figcaption>
          </figure>

          <div className="grid gap-5 md:grid-cols-2">
            {siteContent.method.modules.map((module, index) => (
              <article key={module.title} className="panel p-6">
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                    {String.fromCharCode(97 + index)}
                  </span>
                  <span>Method Block</span>
                </div>
                <h3 className="mt-4 font-display text-[1.7rem] leading-tight text-ivory">
                  {module.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{module.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
