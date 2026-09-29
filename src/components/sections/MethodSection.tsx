import { siteContent } from "@/content/siteContent";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionIntro from "@/components/ui/SectionIntro";
import ArchitectureWalkthrough from "@/components/sections/ArchitectureWalkthrough";

export default function MethodSection() {
  return (
    <AnimatedSection id="method" className="px-6 py-12 lg:px-8 lg:py-16" delayMs={80}>
      <div className="section-shell">
        <SectionIntro
          index="03"
          eyebrow="Method"
          title="Method"
          description="One architecture, instantiated once per prompt modality, that maps any target specification to egocentric waypoints."
        />

        <ArchitectureWalkthrough />

        <div className="mx-auto max-w-5xl space-y-6">
          <figure className="panel-muted overflow-hidden p-5">
            <img
              src={siteContent.method.image}
              alt="USS method diagram"
              className="h-auto w-full rounded-[20px] border border-slate-200 object-contain"
              loading="lazy"
            />
            <figcaption className="px-3 pb-1 pt-5 text-sm leading-7 text-slate-500">
              The common USS architecture, which maps RGB observations and a target prompt to egocentric waypoints: prompt encoding, vision-prompt fusion with temporal memory and cross-view aggregation, a waypoint prediction head, and an action-conditioned world model used only during training.
            </figcaption>
          </figure>

        </div>
      </div>
    </AnimatedSection>
  );
}
