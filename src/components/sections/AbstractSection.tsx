import { siteContent } from "@/content/siteContent";
import AnimatedSection from "@/components/ui/AnimatedSection";

const highlightedPhrases = [
  "Embodied Visual Tracking (EVT)",
  "unified spatial-semantic prompting",
  "text, point, bounding box, and mask prompts",
  "hybrid attention",
  "latent world model",
  "explicit spatial target cues yield higher success rates than text-only prompts",
  "more precise and flexible target indication interface for embodied visual tracking",
];

function renderHighlightedCore(text: string) {
  const escaped = highlightedPhrases
    .slice()
    .sort((a, b) => b.length - a.length)
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const regex = new RegExp(`(${escaped.join("|")})`, "g");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (highlightedPhrases.includes(part)) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-slate-900">
          {part}
        </strong>
      );
    }

    return part;
  });
}

function renderHighlightedText(text: string, highlightFirstUSS = false) {
  if (highlightFirstUSS) {
    const firstUSSIndex = text.indexOf("USS");

    if (firstUSSIndex !== -1) {
      const before = text.slice(0, firstUSSIndex);
      const after = text.slice(firstUSSIndex + 3);

      return [
        ...renderHighlightedCore(before),
        <strong key="first-uss" className="font-semibold text-slate-900">
          USS
        </strong>,
        ...renderHighlightedCore(after),
      ];
    }
  }

  return renderHighlightedCore(text);
}

export default function AbstractSection() {
  return (
    <AnimatedSection id="abstract" className="px-6 pb-12 pt-4 lg:px-8 lg:pb-16 lg:pt-6" delayMs={20}>
      <div className="section-shell">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="border-b border-slate-200 pb-5 text-center">
            <h2 className="font-display text-[1.75rem] font-semibold leading-[1.18] text-slate-900 sm:text-[2.15rem]">
              Abstract
            </h2>
          </div>

          <div className="panel p-7 lg:p-8">
            <div className="space-y-4 text-left">
              {siteContent.abstract.map((paragraph, index) => (
                <p key={paragraph} className="text-[1rem] leading-8 text-slate-600">
                  {renderHighlightedText(paragraph, index === 0)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
