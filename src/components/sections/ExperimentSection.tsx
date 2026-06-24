import { siteContent } from "@/content/siteContent";
import DemoGallery from "@/components/sections/DemoGallery";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionIntro from "@/components/ui/SectionIntro";
import ResultTable from "@/components/ui/ResultTable";

export default function ExperimentSection() {
  return (
    <AnimatedSection id="experiments" className="px-6 py-12 lg:px-8 lg:py-16" delayMs={100}>
      <div className="section-shell">
        <SectionIntro
          index="04"
          eyebrow="Experiments"
          title="Experiments"
          description="Experimental results on real-robot trials and EVT-Bench."
        />

        <div className="mx-auto max-w-5xl panel p-7">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
            Experiment summary
          </p>
          <div className="mt-6 space-y-4">
            {siteContent.experimentNarrative.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-8 text-slate-600">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-5xl space-y-6">
          <div className="space-y-3">
            <h3 className="font-display text-[2rem] text-ivory">Real-World Experiments</h3>
            <p className="text-sm leading-7 text-slate-600">
              Full real-robot tracking results across four indoor scenes and four prompt types.
            </p>
            <ResultTable data={siteContent.realWorldTable} />
            <DemoGallery embedded />
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-[2rem] text-ivory">Simulation Benchmark</h3>
            <p className="text-sm leading-7 text-slate-600">
              Full simulation comparison on EVT-Bench with task-wise SR, TR, CR, and inference speed.
            </p>
            <ResultTable data={siteContent.benchmarkTable} compact />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
