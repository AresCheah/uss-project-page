import { Copy } from "lucide-react";
import { siteContent } from "@/content/siteContent";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionIntro from "@/components/ui/SectionIntro";

export default function BibtexSection() {
  const copyBibtex = async () => {
    await navigator.clipboard.writeText(siteContent.bibtex);
  };

  return (
    <AnimatedSection id="bibtex" className="px-6 py-12 lg:px-8 lg:py-16" delayMs={120}>
      <div className="section-shell">
        <SectionIntro
          index="06"
          eyebrow="Citation"
          title="BibTeX"
          description=""
        />

        <div className="mx-auto max-w-5xl panel p-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={copyBibtex}
              className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Copy className="h-4 w-4 text-slate-500" />
              Copy BibTeX
            </button>
          </div>

          <pre className="mt-4 overflow-x-auto rounded-[24px] bg-[#091018] p-6 font-mono text-sm leading-7 text-slate-200">
            <code>{siteContent.bibtex}</code>
          </pre>
        </div>
      </div>
    </AnimatedSection>
  );
}
