import { siteContent } from "@/content/siteContent";
import CountUp from "@/components/ui/CountUp";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const FAMILY_STYLE: Record<string, string> = {
  uss: "bg-[color:var(--cyan)]",
  modular: "bg-slate-400",
  mllm: "bg-slate-300",
};

export default function SpeedBars() {
  const entries = siteContent.speedComparison;
  const max = Math.max(...entries.map((entry) => entry.fps));
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div ref={ref} className="panel p-6 lg:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-[1.5rem] leading-tight text-slate-900">
          Throughput under the language-prompt protocol
        </h3>
        <p className="text-xs leading-6 text-slate-500">
          Frames per second, higher is better
        </p>
      </div>

      <ul className="mt-6 space-y-4">
        {entries.map((entry, index) => (
          <li key={entry.label}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span
                className={cn(
                  "truncate",
                  entry.family === "uss" ? "font-semibold text-slate-900" : "text-slate-600",
                )}
              >
                {entry.label}
              </span>
              <span className="shrink-0 tabular-nums text-slate-500">
                <CountUp
                  value={entry.fps}
                  decimals={1}
                  suffix=" FPS"
                  durationMs={900 + index * 90}
                  className={entry.family === "uss" ? "font-semibold text-slate-900" : undefined}
                />
              </span>
            </div>

            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn("h-full rounded-full transition-[width]", FAMILY_STYLE[entry.family])}
                style={{
                  width: inView ? `${(entry.fps / max) * 100}%` : "0%",
                  transitionDuration: "1100ms",
                  transitionDelay: `${index * 80}ms`,
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
            </div>

            <p className="mt-1.5 text-[11px] leading-5 text-slate-400">{entry.note}</p>
          </li>
        ))}
      </ul>

      <p className="mt-6 border-t border-slate-200 pt-4 text-xs leading-6 text-slate-500">
        Baseline throughput is taken as reported rather than re-benchmarked, so these gaps reflect
        deployment cost rather than controlled latency measurements. At 10 FPS a forward pass occupies
        an entire 100 ms control period; at 57 FPS, about a sixth of it.
      </p>
    </div>
  );
}
