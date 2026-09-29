import { cn } from "@/lib/utils";
import type { ModalityId } from "@/content/siteContent";

type DiagramProps = {
  activeStep: string;
  modality: ModalityId;
  className?: string;
};

type Family = "prompt" | "vision" | "memory" | "fusion" | "out" | "aux";

type NodeSpec = {
  id: string;
  family: Family;
  x: number;
  y: number;
  w: number;
  h: number;
  kicker?: string;
  title: string[];
  dashed?: boolean;
};

type EdgeSpec = {
  id: string;
  d: string;
  family: Family;
  dashed?: boolean;
  label?: { text: string; x: number; y: number; anchor?: "start" | "middle" | "end" };
};

const COLOR: Record<Family, { line: string; soft: string }> = {
  prompt: { line: "var(--dg-prompt)", soft: "var(--dg-prompt-soft)" },
  vision: { line: "var(--dg-vision)", soft: "var(--dg-vision-soft)" },
  memory: { line: "var(--dg-memory)", soft: "var(--dg-memory-soft)" },
  fusion: { line: "var(--dg-fusion)", soft: "var(--dg-fusion-soft)" },
  out: { line: "var(--dg-out)", soft: "var(--dg-out-soft)" },
  aux: { line: "var(--dg-aux)", soft: "var(--dg-aux-soft)" },
};

const NODES: NodeSpec[] = [
  { id: "promptCard", family: "prompt", x: 20, y: 62, w: 232, h: 176, title: [] },
  { id: "rgbCard", family: "vision", x: 20, y: 258, w: 232, h: 118, title: [] },
  { id: "promptEnc", family: "prompt", x: 284, y: 92, w: 146, h: 96, kicker: "modality-specific", title: ["Prompt encoder"] },
  { id: "visEnc", family: "vision", x: 284, y: 268, w: 146, h: 88, kicker: "last 2 blocks tuned", title: ["PE-Spatial"] },
  { id: "fusion", family: "fusion", x: 462, y: 62, w: 192, h: 188, kicker: "hybrid attention", title: ["Vision-prompt fusion"] },
  { id: "memory", family: "memory", x: 462, y: 278, w: 192, h: 78, kicker: "16 frames", title: ["Temporal memory"] },
  { id: "crossView", family: "fusion", x: 686, y: 140, w: 152, h: 102, kicker: "3D positional enc.", title: ["Cross-view", "aggregation"] },
  { id: "head", family: "out", x: 870, y: 118, w: 150, h: 146, kicker: "sparse queries", title: ["Waypoint", "decoder"] },
  { id: "wm", family: "aux", x: 686, y: 16, w: 334, h: 72, kicker: "training only - discarded at inference", title: ["Action-conditioned world model"], dashed: true },
];

const EDGES: EdgeSpec[] = [
  { id: "e1", d: "M252,140 H284", family: "prompt" },
  { id: "e2", d: "M252,312 H284", family: "vision" },
  { id: "e3", d: "M430,140 H462", family: "prompt", label: { text: "prompt tokens", x: 446, y: 160 } },
  { id: "eMask", d: "M430,164 H446 V312 H462", family: "prompt", dashed: true, label: { text: "dense anchor", x: 452, y: 232, anchor: "start" } },
  { id: "e4", d: "M430,312 H462", family: "vision" },
  { id: "e6", d: "M558,278 V250", family: "memory", label: { text: "memory-attended tokens", x: 570, y: 268, anchor: "start" } },
  { id: "e7", d: "M654,190 H686", family: "fusion" },
  { id: "e8", d: "M838,190 H870", family: "fusion" },
  { id: "e9", d: "M945,118 V88", family: "aux", dashed: true },
  { id: "e10", d: "M686,52 H670 V104 H654", family: "aux", dashed: true, label: { text: "EMA target", x: 664, y: 132, anchor: "end" } },
];

const STEP_NODES: Record<string, string[]> = {
  prompt: ["promptCard", "promptEnc"],
  vision: ["rgbCard", "visEnc", "memory"],
  fusion: ["fusion", "promptEnc", "memory"],
  waypoints: ["crossView", "head"],
  world: ["wm", "head"],
};

const STEP_EDGES: Record<string, string[]> = {
  prompt: ["e1", "route"],
  vision: ["e2", "e4", "e6"],
  fusion: ["route", "e6"],
  waypoints: ["e7", "e8"],
  world: ["e9", "e10"],
};

const PROMPT_META: Record<ModalityId, { encoder: string; tokens: number | "dense"; caption: string }> = {
  text: { encoder: "PE-Core text encoder", tokens: 5, caption: '"the man wearing a black shirt"' },
  point: { encoder: "RoIAlign, pseudo box", tokens: 4, caption: "one click on the target" },
  box: { encoder: "RoIAlign over the box", tokens: 9, caption: "a box around the target" },
  mask: { encoder: "mask encoder", tokens: "dense", caption: "a first-frame segmentation" },
};

/** A row of little rounded chips standing in for a token sequence. */
function TokenChips({
  x,
  y,
  count,
  color,
  size = 9,
  gap = 4,
  perRow = 9,
  dim = false,
}: {
  x: number;
  y: number;
  count: number;
  color: string;
  size?: number;
  gap?: number;
  perRow?: number;
  dim?: boolean;
}) {
  return (
    <g opacity={dim ? 0.45 : 1}>
      {Array.from({ length: count }, (_, index) => (
        <rect
          key={index}
          x={x + (index % perRow) * (size + gap)}
          y={y + Math.floor(index / perRow) * (size + gap)}
          width={size}
          height={size}
          rx={2.5}
          fill={color}
          className="uss-chip"
          style={{ animationDelay: `${index * 0.06}s` }}
        />
      ))}
    </g>
  );
}

export default function ArchitectureDiagram({ activeStep, modality, className }: DiagramProps) {
  const maskRoute = modality === "mask";
  const routeEdge = maskRoute ? "eMask" : "e3";
  const meta = PROMPT_META[modality];

  const activeNodes = new Set(STEP_NODES[activeStep] ?? []);
  const activeEdges = new Set(
    (STEP_EDGES[activeStep] ?? []).map((id) => (id === "route" ? routeEdge : id)),
  );

  return (
    <svg
      viewBox="0 0 1040 400"
      className={cn("h-auto w-full select-none", className)}
      role="img"
      aria-label={`USS architecture, highlighting the ${activeStep} stage for the ${modality} prompt`}
    >
      <defs>
        <clipPath id="uss-thumb-clip">
          <rect x={34} y={96} width={204} height={126} rx={12} />
        </clipPath>
        {(Object.keys(COLOR) as Family[]).map((family) => (
          <marker
            key={family}
            id={`uss-head-${family}`}
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <path d="M0,0 L7,3.5 L0,7 z" fill={COLOR[family].line} />
          </marker>
        ))}
        <marker id="uss-head-idle" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="#cfd4cf" />
        </marker>
      </defs>

      <rect x={0} y={0} width={1040} height={400} rx={20} fill="var(--dg-canvas)" />

      {EDGES.map((edge) => {
        if (edge.id === "eMask" && !maskRoute) return null;
        if (edge.id === "e3" && maskRoute) return null;

        const live = activeEdges.has(edge.id);
        const color = COLOR[edge.family].line;

        return (
          <g key={edge.id}>
            <path
              d={edge.d}
              fill="none"
              strokeWidth={live ? 2.2 : 1.4}
              stroke={live ? color : "#d9ddd8"}
              strokeDasharray={edge.dashed ? "5 5" : undefined}
              strokeLinecap="round"
              markerEnd={`url(#${live ? `uss-head-${edge.family}` : "uss-head-idle"})`}
              className="uss-edge-path"
            />
            {live ? (
              <path
                d={edge.d}
                fill="none"
                strokeWidth={2.4}
                stroke={color}
                strokeDasharray="4 12"
                strokeLinecap="round"
                className="uss-flow"
              />
            ) : null}
            {edge.label ? (
              <text
                x={edge.label.x}
                y={edge.label.y}
                textAnchor={edge.label.anchor ?? "middle"}
                className="uss-edge-label"
                fill={live ? color : "#a8aea7"}
              >
                {edge.label.text}
              </text>
            ) : null}
          </g>
        );
      })}

      {NODES.map((node) => {
        const live = activeNodes.has(node.id);
        const { line, soft } = COLOR[node.family];

        return (
          <g key={node.id} className={cn("uss-node", live && "is-live")}>
            {live ? (
              <rect
                x={node.x - 6}
                y={node.y - 6}
                width={node.w + 12}
                height={node.h + 12}
                rx={20}
                fill="none"
                stroke={line}
                strokeWidth={1}
                opacity={0.3}
                className="uss-halo"
              />
            ) : null}

            <rect
              x={node.x}
              y={node.y}
              width={node.w}
              height={node.h}
              rx={16}
              fill={live ? soft : "#ffffff"}
              stroke={live ? line : "#e6e5e0"}
              strokeWidth={live ? 2 : 1.2}
              strokeDasharray={node.dashed ? "7 5" : undefined}
            />

            {node.kicker ? (
              <text
                x={node.x + node.w / 2}
                y={node.y + 21}
                textAnchor="middle"
                className="uss-kicker"
                fill={live ? line : "#a8aea7"}
              >
                {node.kicker}
              </text>
            ) : null}

            {node.title.map((lineText, index) => (
              <text
                key={lineText}
                x={node.x + node.w / 2}
                y={node.y + 45 + index * 19}
                textAnchor="middle"
                className="uss-title"
                fill="#24282c"
              >
                {lineText}
              </text>
            ))}

            {/* The prompt card shows the real first frame with the real
                annotation, so switching modality switches the picture. */}
            {node.id === "promptCard" ? (
              <g>
                <text x={node.x + 16} y={node.y + 24} className="uss-kicker" fill={live ? line : "#a8aea7"}>
                  t = 1 - given once
                </text>
                <image
                  href={`${import.meta.env.BASE_URL}assets/prompts/${modality}.jpg`}
                  x={34}
                  y={96}
                  width={204}
                  height={126}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#uss-thumb-clip)"
                />
                <rect
                  x={34}
                  y={96}
                  width={204}
                  height={126}
                  rx={12}
                  fill="none"
                  stroke={live ? line : "#e6e5e0"}
                  strokeWidth={1.5}
                />
                <text x={node.x + node.w / 2} y={node.y + 172} textAnchor="middle" className="uss-detail" fill="#6b7280">
                  {meta.caption}
                </text>
              </g>
            ) : null}

            {/* Three egocentric views, drawn as film-strip chips. */}
            {node.id === "rgbCard" ? (
              <g>
                <text x={node.x + 16} y={node.y + 24} className="uss-kicker" fill={live ? line : "#a8aea7"}>
                  every step
                </text>
                {["L", "F", "R"].map((view, index) => (
                  <g
                    key={view}
                    className={live ? "uss-view" : undefined}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <rect
                      x={node.x + 18 + index * 68}
                      y={node.y + 38}
                      width={60}
                      height={44}
                      rx={8}
                      fill={live ? "#ffffff" : "#fbfbf9"}
                      stroke={live ? line : "#e6e5e0"}
                      strokeWidth={1.2}
                    />
                    <text
                      x={node.x + 48 + index * 68}
                      y={node.y + 65}
                      textAnchor="middle"
                      className="uss-kicker"
                      fill={live ? line : "#b9bdb8"}
                    >
                      {view}
                    </text>
                  </g>
                ))}
                <text x={node.x + node.w / 2} y={node.y + 100} textAnchor="middle" className="uss-detail" fill="#6b7280">
                  RGB stream, 3 views
                </text>
              </g>
            ) : null}

            {/* Token counts are the ones the paper reports. */}
            {node.id === "promptEnc" ? (
              <g>
                <text x={node.x + node.w / 2} y={node.y + 64} textAnchor="middle" className="uss-detail" fill="#6b7280">
                  {meta.encoder}
                </text>
                {meta.tokens === "dense" ? (
                  <TokenChips x={node.x + 30} y={node.y + 72} count={12} perRow={6} size={7} gap={3} color={line} dim={!live} />
                ) : (
                  <TokenChips
                    x={node.x + node.w / 2 - (meta.tokens * 13 - 4) / 2}
                    y={node.y + 74}
                    count={meta.tokens}
                    color={line}
                    dim={!live}
                  />
                )}
              </g>
            ) : null}

            {node.id === "fusion" ? (
              <g className={cn("uss-rwr", live && "is-live")}>
                {["read from visual tokens", "write to visual tokens", "read from visual tokens"].map(
                  (label, index) => (
                    <g key={index} style={{ animationDelay: `${index * 0.42}s` }} className="uss-rwr-step">
                      <rect
                        x={node.x + 20}
                        y={node.y + 78 + index * 32}
                        width={node.w - 40}
                        height={24}
                        rx={12}
                        fill="#ffffff"
                        stroke={live ? line : "#e6e5e0"}
                        strokeWidth={1.2}
                      />
                      <text
                        x={node.x + node.w / 2}
                        y={node.y + 94 + index * 32}
                        textAnchor="middle"
                        className="uss-detail"
                        fill="#4b5563"
                      >
                        {label}
                      </text>
                    </g>
                  ),
                )}
              </g>
            ) : null}

            {node.id === "crossView" ? (
              <TokenChips x={node.x + 30} y={node.y + 70} count={9} perRow={9} size={8} gap={3.5} color={line} dim={!live} />
            ) : null}

            {node.id === "head" ? (
              <g>
                <polyline
                  points="888,236 912,228 936,221 960,213 984,206 1004,201"
                  fill="none"
                  stroke={live ? line : "#d9ddd8"}
                  strokeWidth={1.8}
                  strokeDasharray="3 6"
                  strokeLinecap="round"
                  className={live ? "uss-flow" : undefined}
                />
                {[
                  [888, 236],
                  [912, 228],
                  [936, 221],
                  [960, 213],
                  [984, 206],
                ].map(([cx, cy], index) => (
                  <circle
                    key={`${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    r={3.4}
                    fill={live ? line : "#d9ddd8"}
                    className={live ? "uss-pulse" : undefined}
                    style={{ animationDelay: `${index * 0.12}s` }}
                  />
                ))}
                <text x={node.x + node.w / 2} y={node.y + 136} textAnchor="middle" className="uss-detail" fill="#6b7280">
                  egocentric waypoints
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
