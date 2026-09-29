import { useCallback, useEffect, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import { siteContent, type ModalityId } from "@/content/siteContent";
import MethodScenes from "@/components/ui/MethodScenes";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const STAGE_MS = 6000;

export default function ArchitectureWalkthrough() {
  const steps = siteContent.architectureSteps;
  const modalities = siteContent.promptModalities;

  const [index, setIndex] = useState(0);
  const [modality, setModality] = useState<ModalityId>("box");
  const [autoplay, setAutoplay] = useState(true);
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2, once: false, initial: true });

  const step = steps[index];
  const activeModality = useMemo(
    () => modalities.find((item) => item.id === modality) ?? modalities[0],
    [modalities, modality],
  );

  const running = autoplay && inView;

  // The figure walks itself through the four stages; the reader can take over
  // at any point by picking a stage, which stops the timer.
  useEffect(() => {
    if (!running) return undefined;

    const timer = window.setTimeout(() => {
      setIndex((value) => (value + 1) % steps.length);
    }, STAGE_MS);

    return () => window.clearTimeout(timer);
  }, [running, index, steps.length]);

  const pickStage = useCallback((next: number) => {
    setIndex(next);
    setAutoplay(false);
  }, []);

  return (
    <div ref={ref} className="panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ecebe6] px-5 py-4 sm:px-7">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
            Interactive architecture
          </p>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            The figure walks itself through the method. Pick a prompt, or jump to a stage.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Prompt modality"
          className="flex flex-wrap gap-1 rounded-full border border-[#ecebe6] bg-[#fbfbf9] p-1"
        >
          {modalities.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === modality}
              onClick={() => setModality(item.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-[12px] font-medium tracking-[0.08em] transition",
                item.id === modality
                  ? "bg-slate-900 text-white shadow-panel"
                  : "text-slate-500 hover:bg-white hover:text-slate-900",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="-mx-1 overflow-x-auto px-5 pt-5 sm:mx-0 sm:px-7">
        <MethodScenes
          stage={step.id}
          modality={modality}
          playing={running}
          className="mx-auto min-w-[820px]"
        />
      </div>

      {/* Stage rail: where you are, where you can go, and how long is left. */}
      <div className="flex flex-wrap items-center gap-2 px-5 pt-4 sm:px-7">
        <button
          type="button"
          onClick={() => setAutoplay((value) => !value)}
          aria-label={autoplay ? "Pause the walkthrough" : "Play the walkthrough"}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ecebe6] bg-white text-slate-500 transition hover:text-slate-900"
        >
          {autoplay ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>

        <ol className="flex min-w-0 flex-1 flex-wrap gap-2">
          {steps.map((item, itemIndex) => {
            const live = itemIndex === index;

            return (
              <li key={item.id} className="min-w-[132px] flex-1">
                <button
                  type="button"
                  onClick={() => pickStage(itemIndex)}
                  aria-current={live}
                  className={cn(
                    "w-full rounded-[12px] border px-3 py-2 text-left transition",
                    live
                      ? "border-[color:var(--cyan)] bg-[color:var(--dg-fusion-soft)]"
                      : "border-[#ecebe6] bg-white hover:border-slate-300",
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-[0.2em]",
                      live ? "text-brand-cyan" : "text-slate-400",
                    )}
                  >
                    {item.kicker}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block truncate text-[13px] font-medium",
                      live ? "text-slate-900" : "text-slate-500",
                    )}
                  >
                    {item.title}
                  </span>
                  <span className="mt-1.5 block h-[3px] overflow-hidden rounded-full bg-[#eceae5]">
                    <span
                      key={`${item.id}-${index}-${running}`}
                      className={cn(
                        "block h-full rounded-full bg-[color:var(--cyan)]",
                        live && running ? "ms-progress" : "",
                      )}
                      style={{ width: live && !running ? "100%" : undefined }}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="px-5 pb-6 pt-4 sm:px-7">
        <p key={step.id} className="ms-scene max-w-3xl text-sm leading-7 text-slate-600">
          {step.body}
        </p>
        <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs leading-6 text-slate-500">
          <span className="font-medium text-slate-700">{activeModality.label} prompt</span>
          <span>{activeModality.given}</span>
          <span className="text-brand-cyan">{activeModality.route}</span>
        </p>
      </div>
    </div>
  );
}
