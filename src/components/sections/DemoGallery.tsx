import { PlayCircle } from "lucide-react";
import { siteContent } from "@/content/siteContent";
import SectionIntro from "@/components/ui/SectionIntro";

type DemoGalleryProps = {
  embedded?: boolean;
};

export default function DemoGallery({ embedded = false }: DemoGalleryProps) {
  const similarPeopleDemos = siteContent.demos.slice(0, 3);
  const scenarioDemos = siteContent.demos.slice(3, 7);

  const renderDemoCard = (
    demo: (typeof siteContent.demos)[number],
    size: "regular" | "compact" = "regular",
  ) => (
    <article key={demo.title}>
      <div className="panel group overflow-hidden">
        <div className="bg-slate-50 p-3">
          <div
            className={`relative w-full overflow-hidden rounded-[20px] border border-slate-200 bg-black ${
              size === "compact" ? "aspect-[16/10]" : "aspect-[16/10]"
            }`}
          >
          {demo.videoSrc ? (
            <video
              className="h-full w-full object-cover"
              controls
              poster={demo.poster}
              preload="metadata"
            >
              <source src={demo.videoSrc} />
            </video>
          ) : (
            <>
              <img
                src={demo.poster}
                alt={demo.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.25))]" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-4 py-2 backdrop-blur-sm">
                <PlayCircle className="h-5 w-5 text-slate-500" />
                <span className="text-xs uppercase tracking-[0.2em] text-slate-700">
                  Coming soon
                </span>
              </div>
            </>
          )}
          </div>
        </div>
        <div className={`space-y-3 ${size === "compact" ? "p-5" : "p-6"}`}>
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-500">
            {demo.tag}
          </span>
          <div>
            <h3
              className={`font-display leading-tight text-ivory ${
                size === "compact" ? "text-[1.5rem]" : "text-[1.9rem]"
              }`}
            >
              {demo.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{demo.description}</p>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <section id={embedded ? undefined : "demos"} className={embedded ? "" : "px-6 py-14 lg:px-8 lg:py-20"}>
      <div className={embedded ? "space-y-6" : "section-shell"}>
        {embedded ? null : (
          <SectionIntro
            index="05"
            eyebrow="Demo gallery"
            title="Seven real-robot slots ready for your final videos"
            description="The layout already separates failure cases, similar-people successes, and deployment scenarios. Once the final demos arrive, each card can switch from poster mode to playable video without changing the page structure."
          />
        )}

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {similarPeopleDemos.map((demo) => renderDemoCard(demo, "regular"))}
          </div>

          <div className="mx-auto grid max-w-5xl gap-y-6 md:grid-cols-2 md:gap-x-10">
            {scenarioDemos.map((demo) => renderDemoCard(demo, "compact"))}
          </div>
        </div>
      </div>
    </section>
  );
}
