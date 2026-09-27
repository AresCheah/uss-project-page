import { siteContent } from "@/content/siteContent";
import AnimatedSection from "@/components/ui/AnimatedSection";

const highlightedPhrases = [
  "Embodied Visual Tracking (EVT)",
  "unified spatial-semantic prompting",
  "text, a point, a box, and a mask serve as complementary target specifications",
  "hybrid-attention fusion, temporal memory, cross-view aggregation, latent prediction, and waypoint decoding",
  "320 zero-shot real-robot trials",
  "different scenarios favor different target specifications",
  "highest success rate among non-MLLM methods at 57 FPS",
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
