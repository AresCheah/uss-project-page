import { siteContent, type ModalityId } from "@/content/siteContent";
import { cn } from "@/lib/utils";

/**
 * The paper's own method figure, animated: the four parts surface in the order
 * the walkthrough explains them, a light sweeps across each one as it arrives,
 * and a pulse travels the pipeline so the direction of the data is visible.
 *
 * Coordinates are in the figure's own pixel space, so an SVG viewBox keeps the
 * overlay locked to the image at any rendered size.
 */

const FIG_W = 3356;
const FIG_H = 1826;

type Region = { x: number; y: number; w: number; h: number };

/** SVG wants width/height, not the w/h the region table is written in. */
const box = (r: Region) => ({ x: r.x, y: r.y, width: r.w, height: r.h });

const ORDER = ["input", "align", "head", "world"] as const;
type Stage = (typeof ORDER)[number];

const REGIONS: Record<Stage, Region> = {
  input: { x: 10, y: 27, w: 987, h: 1781 },
  align: { x: 1010, y: 27, w: 1061, h: 1781 },
  head: { x: 2104, y: 27, w: 1238, h: 941 },
  world: { x: 2104, y: 977, w: 1238, h: 831 },
};

/** The four prompt rows inside part (a). */
const MODALITY_ROWS: Record<ModalityId, Region> = {
  text: { x: 34, y: 146, w: 920, h: 274 },
  box: { x: 34, y: 475, w: 920, h: 283 },
  point: { x: 34, y: 795, w: 920, h: 274 },
  mask: { x: 34, y: 1105, w: 920, h: 301 },
};

/** Centre-to-centre route through the pipeline, for the travelling pulse. */
const FLOW_PATH =
  "M503,917 H1400 C1620,917 1700,760 1900,600 C2050,480 2300,497 2723,497 V1392";

export default function MethodFigure({
  stage,
  modality,
  playing = true,
  className,
}: {
  stage: string;
  modality: ModalityId;
  playing?: boolean;
  className?: string;
}) {
  const current = (ORDER.includes(stage as Stage) ? stage : "input") as Stage;
  const reached = ORDER.indexOf(current);
  const region = REGIONS[current];
  const row = MODALITY_ROWS[modality];

  return (
    <figure
      data-stage={current}
      data-modality={modality}
      className={cn("relative overflow-hidden rounded-[14px] bg-white", className)}
    >
      <svg viewBox={`0 0 ${FIG_W} ${FIG_H}`} className="block w-full" role="img" aria-label={siteContent.method.alt}>
        <defs>
          <linearGradient id="mf-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0" />
            <stop offset="45%" stopColor="var(--cyan)" stopOpacity="0.26" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
          </linearGradient>
          {ORDER.map((id) => (
            <clipPath key={id} id={`mf-clip-${id}`}>
              <rect {...box(REGIONS[id])} rx={26} />
            </clipPath>
          ))}
        </defs>

        <image href={siteContent.method.image} x={0} y={0} width={FIG_W} height={FIG_H} />

        {/* Parts the walkthrough has not reached yet stay washed out, so the
            figure builds up in the order it is explained. */}
        {ORDER.map((id, index) => (
          <rect
            key={id}
            {...box(REGIONS[id])}
            rx={26}
            fill="#ffffff"
            className="mf-veil"
            style={{ opacity: index <= reached ? 0 : 0.88 }}
          />
        ))}

        {/* A light sweeps across the part as it arrives. */}
        <g clipPath={`url(#mf-clip-${current})`}>
          <rect
            key={`${current}-${playing}`}
            x={region.x - region.w}
            y={region.y}
            width={region.w}
            height={region.h}
            fill="url(#mf-sweep)"
            className={playing ? "mf-sweep" : undefined}
            style={{ ["--mf-travel" as string]: `${region.w * 2}px` }}
          />
        </g>

        <rect
          {...box(region)}
          rx={26}
          fill="none"
          stroke="var(--cyan)"
          strokeWidth={6}
          className="mf-ring"
        />

        {/* Which prompt row part (a) is talking about. */}
        <rect
          {...box(row)}
          rx={18}
          fill="none"
          stroke="#e08a2e"
          strokeWidth={6}
          className="mf-row"
          style={{ opacity: current === "input" ? 1 : 0 }}
        />

        {/* The pulse that makes the direction of the data visible. */}
        <path d={FLOW_PATH} fill="none" stroke="var(--cyan)" strokeWidth={3} strokeDasharray="10 22" opacity={0.3} />
        {playing ? (
          <>
            <circle r={26} fill="var(--cyan)" opacity={0.18}>
              <animateMotion dur="24s" repeatCount="indefinite" path={FLOW_PATH} />
            </circle>
            <circle r={11} fill="var(--cyan)">
              <animateMotion dur="24s" repeatCount="indefinite" path={FLOW_PATH} />
            </circle>
          </>
        ) : null}
      </svg>
    </figure>
  );
}
