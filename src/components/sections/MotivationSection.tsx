import { siteContent } from "@/content/siteContent";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionIntro from "@/components/ui/SectionIntro";

export default function MotivationSection() {
  return (
    <AnimatedSection id="motivation" className="px-6 py-12 lg:px-8 lg:py-16" delayMs={40}>
      <div className="section-shell">
        <SectionIntro
          index="01"
          eyebrow={siteContent.motivation.eyebrow}
          title="Motivation"
          description="Different scenarios favor different target specifications."
        />

        <div className="mx-auto max-w-5xl space-y-6">
          <figure className="panel-muted overflow-hidden p-4">
            <img
              src={siteContent.motivation.image}
              alt="USS motivation figure"
              className="h-auto w-full rounded-[20px] border border-slate-200 object-contain"
              loading="lazy"
            />
            <figcaption className="px-3 pb-1 pt-5 text-sm leading-7 text-slate-500">
              (a) Different scenarios favor different specifications: a description can be ambiguous, unavailable, or too slow, while a spatial prompt requires the target to be already visible. (b) Prior EVT policies take no prompt or a language prompt; USS encodes a spatial prompt and conditions the policy on it directly.
            </figcaption>
          </figure>

          <div className="panel p-7">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                {siteContent.motivation.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-8 text-slate-600 sm:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="space-y-4 border-t border-slate-200 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                {siteContent.motivation.bullets.map((item, index) => (
                  <div key={item} className="flex gap-4">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-500">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-7 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
