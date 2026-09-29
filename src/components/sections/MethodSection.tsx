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

      </div>
    </AnimatedSection>
  );
}
