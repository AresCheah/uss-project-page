import { useEffect, useRef, useState } from "react";
import { siteContent } from "@/content/siteContent";
import { cn } from "@/lib/utils";

/**
 * A looping, muted reel under the title. It only starts once it is on screen,
 * and it is decorative: the same clips are available with controls in the demo
 * gallery further down.
 */
export default function HeroReel() {
  const reel = siteContent.heroReel;
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const current = reel[index];

  const play = () => {
    const node = videoRef.current;
    if (!node) return;
    const started = node.play();
    if (started && typeof started.catch === "function") started.catch(() => {});
  };

  // Pause only while the tab is hidden. Gating on viewport visibility is
  // tempting but turns a decorative reel into a moving part that can get stuck
  // paused on a blank frame; a hidden tab is unambiguous.
  useEffect(() => {
    const onVisibility = () => {
      const node = videoRef.current;
      if (!node) return;
      if (document.hidden) node.pause();
      else play();
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div className="mx-auto mt-10 max-w-5xl px-6 lg:px-8">
      <div className="panel overflow-hidden p-2 sm:p-3">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[18px] bg-[#0e1113]">
          <video
            ref={videoRef}
            key={current.videoSrc}
            className="h-full w-full object-cover"
            poster={current.poster}
            src={current.videoSrc}
            autoPlay
            muted
            playsInline
            preload="metadata"
            aria-label={current.title}
            onCanPlay={play}
            onEnded={() => setIndex((value) => (value + 1) % reel.length)}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(8,12,14,0.72))]" />

          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3">
            <div className="rounded-full bg-black/45 px-4 py-2 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">{current.tag}</p>
              <p className="mt-0.5 text-sm font-medium text-white">{current.title}</p>
            </div>

            <div className="pointer-events-auto flex gap-1.5 rounded-full bg-black/45 px-3 py-2 backdrop-blur-md">
              {reel.map((item, itemIndex) => (
                <button
                  key={item.videoSrc}
                  type="button"
                  aria-label={item.title}
                  aria-current={itemIndex === index}
                  onClick={() => setIndex(itemIndex)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    itemIndex === index ? "w-7 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs leading-6 text-slate-500">
        Zero-shot on a Unitree G1, with policies trained only in simulation. Full clips below.
      </p>
    </div>
  );
}
