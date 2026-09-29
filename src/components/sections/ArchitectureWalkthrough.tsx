import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { siteContent, type ModalityId } from "@/content/siteContent";
import MethodScenes from "@/components/ui/MethodScenes";
import { cn } from "@/lib/utils";

export default function ArchitectureWalkthrough() {
  const steps = siteContent.architectureSteps;
  const modalities = siteContent.promptModalities;

  const [activeStep, setActiveStep] = useState(steps[0]?.id ?? "input");
  const [modality, setModality] = useState<ModalityId>("box");
  const stepRefs = useRef(new Map<string, HTMLButtonElement>());

  const activeModality = useMemo(
    () => modalities.find((item) => item.id === modality) ?? modalities[0],
    [modalities, modality],
  );

  const registerStep = useCallback((id: string, node: HTMLButtonElement | null) => {
    if (node) stepRefs.current.set(id, node);
    else stepRefs.current.delete(id);
  }, []);

  // Clicking a step scrolls it into the same band the observer watches, so the
  // card the reader picked is the one that stays selected.
  const selectStep = useCallback((id: string) => {
    setActiveStep(id);

    const node = stepRefs.current.get(id);
    if (!node || typeof window === "undefined") return;

    const top = window.scrollY + node.getBoundingClientRect().top - window.innerHeight * 0.7;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  // Scroll drives the walkthrough. An IntersectionObserver is the obvious tool
  // here but it only reports entries whose intersection *changed*, so a fast
  // scroll can leave the highlight on a card that has already left the band.
  // Measuring against a reference line every frame is deterministic instead.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let frame: number | null = null;

    const update = () => {
      frame = null;

      // The sticky figure covers the top of the viewport, so the line that
      // selects the active step sits low, where the cards are readable.
      const line = window.innerHeight * 0.72;
      let current = steps[0]?.id;

      steps.forEach((step) => {
        const node = stepRefs.current.get(step.id);
        if (node && node.getBoundingClientRect().top <= line) current = step.id;
      });

      if (current) setActiveStep(current);
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [steps]);

  return (
    <div className="panel">
      <div className="z-20 rounded-t-[18px] lg:sticky lg:top-[68px] border-b border-slate-200 bg-white/95 px-4 pb-4 pt-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
              Interactive architecture
            </p>
            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              Pick how the target is designated, then scroll to walk the data through the four parts of the method figure.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Prompt modality"
            className="flex flex-wrap gap-1 rounded-full border border-slate-200 bg-slate-50 p-1"
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

        {/* One stage at a time, so each can be drawn large enough to read. */}
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <MethodScenes
            stage={activeStep}
            modality={modality}
            className="mx-auto min-w-[620px] max-h-[40vh]"
          />
        </div>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs leading-6 text-slate-500">
          <span className="font-medium text-slate-700">{activeModality.label} prompt</span>
          <span>{activeModality.given}</span>
          <span className="text-brand-cyan">{activeModality.route}</span>
        </div>
      </div>

      <ol className="space-y-5 px-4 py-7 sm:px-6 lg:px-8">
        {steps.map((step, index) => {
          const live = step.id === activeStep;

          return (
            <li key={step.id}>
              <button
                type="button"
                data-step-id={step.id}
                ref={(node) => registerStep(step.id, node)}
                onClick={() => selectStep(step.id)}
                aria-current={live}
                className={cn(
                  "flex w-full gap-5 rounded-[16px] border p-5 text-left transition duration-500 sm:p-6",
                  live
                    ? "border-[color:var(--cyan)] bg-[#f6f9fc] shadow-panel"
                    : "border-slate-200 bg-white hover:border-slate-300",
                )}
              >
                <span
                  className={cn(
                    "mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold transition sm:flex",
                    live
                      ? "border-[color:var(--cyan)] bg-white text-brand-cyan"
                      : "border-slate-200 bg-slate-50 text-slate-400",
                  )}
                >
                  {index + 1}
                </span>

                <span className="min-w-0">
                  <span
                    className={cn(
                      "text-[11px] uppercase tracking-[0.28em] transition",
                      live ? "text-brand-cyan" : "text-slate-400",
                    )}
                  >
                    {step.kicker}
                  </span>
                  <span className="mt-2 block font-display text-[1.45rem] leading-tight text-slate-900">
                    {step.title}
                  </span>
                  <span
                    className={cn(
                      "mt-3 block text-sm leading-7 transition",
                      live ? "text-slate-600" : "text-slate-400",
                    )}
                  >
                    {step.body}
                  </span>
                  <span
                    className={cn(
                      "mt-4 block text-sm leading-7 text-slate-500 transition",
                      live ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {step.id === "input" ? activeModality.strength : null}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
