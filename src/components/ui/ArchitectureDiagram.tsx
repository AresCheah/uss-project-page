import { cn } from "@/lib/utils";
import type { ModalityId } from "@/content/siteContent";

type DiagramProps = {
  activeStep: string;
  modality: ModalityId;
  className?: string;
};

type NodeSpec = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kicker: string;
  title: string[];
  dashed?: boolean;
};

type EdgeSpec = {
  id: string;
  d: string;
  dashed?: boolean;
  label?: { text: string; x: number; y: number; anchor?: "start" | "middle" | "end" };
};

// Five columns, two input rows merging into fusion, with the training-only
// world model floating above the inference path.
const NODES: NodeSpec[] = [
  { id: "prompt", x: 16, y: 120, w: 168, h: 96, kicker: "t = 1, once", title: ["Target prompt"] },
  { id: "promptEnc", x: 224, y: 120, w: 168, h: 96, kicker: "modality-specific", title: ["Prompt encoder"] },
  { id: "fusion", x: 432, y: 108, w: 184, h: 150, kicker: "hybrid attention", title: ["Vision-prompt fusion"] },
  { id: "crossView", x: 656, y: 140, w: 164, h: 86, kicker: "3D positional enc.", title: ["Cross-view", "aggregation"] },
  { id: "head", x: 860, y: 118, w: 164, h: 130, kicker: "sparse queries", title: ["Waypoint decoder"] },
  { id: "rgb", x: 16, y: 272, w: 168, h: 68, kicker: "every step", title: ["RGB stream, N views"] },
  { id: "visEnc", x: 224, y: 272, w: 168, h: 68, kicker: "last 2 blocks tuned", title: ["PE-Spatial encoder"] },
  { id: "memory", x: 432, y: 286, w: 184, h: 54, kicker: "16 frames", title: ["Temporal memory"] },
  { id: "wm", x: 640, y: 16, w: 384, h: 64, kicker: "training only - discarded at inference", title: ["Action-conditioned world model"], dashed: true },
];

const EDGES: EdgeSpec[] = [
  { id: "e1", d: "M184,168 H224" },
  { id: "e2", d: "M184,306 H224" },
  { id: "e3", d: "M392,168 H432", label: { text: "prompt tokens", x: 412, y: 157 } },
  { id: "eMask", d: "M392,190 H412 V313 H432", dashed: true, label: { text: "dense anchor", x: 418, y: 262, anchor: "start" } },
  { id: "e4", d: "M392,306 H432" },
  { id: "e6", d: "M524,286 V258", label: { text: "memory-attended tokens", x: 534, y: 276, anchor: "start" } },
  { id: "e7", d: "M616,183 H656" },
  { id: "e8", d: "M820,183 H860" },
  { id: "e9", d: "M942,118 V80", dashed: true },
  { id: "e10", d: "M640,48 H624 V92 H524 V108", dashed: true, label: { text: "EMA target", x: 560, y: 86, anchor: "end" } },
];

// Which parts light up on each step of the walkthrough.
const STEP_NODES: Record<string, string[]> = {
  prompt: ["prompt", "promptEnc"],
  vision: ["rgb", "visEnc", "memory"],
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

const MODALITY_CAPTION: Record<ModalityId, string> = {
  text: "PE-Core text encoder",
  point: "RoIAlign on a pseudo box",
  box: "RoIAlign on the box",
  mask: "mask encoder",
};

export default function ArchitectureDiagram({ activeStep, modality, className }: DiagramProps) {
  // A mask never becomes a prompt token: it is stored as a dense first-frame
  // anchor in memory instead, so the two routes are mutually exclusive.
  const maskRoute = modality === "mask";
  const routeEdge = maskRoute ? "eMask" : "e3";

  const activeNodes = new Set(STEP_NODES[activeStep] ?? []);
  const activeEdgeIds = new Set(
    (STEP_EDGES[activeStep] ?? []).map((id) => (id === "route" ? routeEdge : id)),
  );

  return (
    <svg
      viewBox="0 0 1040 380"
      className={cn("h-auto w-full select-none", className)}
      role="img"
      aria-label={`USS architecture diagram, highlighting the ${activeStep} stage for the ${modality} prompt`}
    >
      <defs>
        <marker id="uss-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 z" className="fill-slate-400" />
        </marker>
        <marker id="uss-arrow-live" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 z" fill="var(--cyan)" />
        </marker>
      </defs>

      {EDGES.map((edge) => {
        if (edge.id === "eMask" && !maskRoute) return null;
        if (edge.id === "e3" && maskRoute) return null;

        const live = activeEdgeIds.has(edge.id);

        return (
          <g key={edge.id} className={cn("uss-edge", live && "is-live")}>
            <path
              d={edge.d}
              fill="none"
              strokeWidth={live ? 2 : 1.25}
              stroke={live ? "var(--cyan)" : "#cbd5e1"}
              strokeDasharray={edge.dashed ? "5 5" : undefined}
              markerEnd={`url(#${live ? "uss-arrow-live" : "uss-arrow"})`}
            />
            {live ? (
              <path
                d={edge.d}
                fill="none"
                strokeWidth={2}
                stroke="var(--cyan)"
                strokeDasharray="5 11"
                className="uss-flow"
              />
            ) : null}
            {edge.label ? (
              <text
                x={edge.label.x}
                y={edge.label.y}
                textAnchor={edge.label.anchor ?? "middle"}
                className={cn(
                  "uss-edge-label",
                  live ? "fill-[color:var(--cyan)]" : "fill-slate-400",
                )}
              >
                {edge.label.text}
              </text>
            ) : null}
          </g>
        );
      })}

      {NODES.map((node) => {
        const live = activeNodes.has(node.id);

        return (
          <g key={node.id} className={cn("uss-node", live && "is-live")}>
            {live ? (
              <rect
                x={node.x - 5}
                y={node.y - 5}
                width={node.w + 10}
                height={node.h + 10}
                rx={18}
                fill="none"
                stroke="var(--cyan)"
                strokeWidth={1}
                opacity={0.35}
                className="uss-halo"
              />
            ) : null}
            <rect
              x={node.x}
              y={node.y}
              width={node.w}
              height={node.h}
              rx={14}
              fill={live ? "#f2f7fb" : "#ffffff"}
              stroke={live ? "var(--cyan)" : "#e2e8f0"}
              strokeWidth={live ? 1.6 : 1}
              strokeDasharray={node.dashed ? "6 5" : undefined}
            />
            <text
              x={node.x + node.w / 2}
              y={node.y + 22}
              textAnchor="middle"
              className={cn("uss-kicker", live ? "fill-[color:var(--cyan)]" : "fill-slate-400")}
            >
              {node.kicker}
            </text>
            {node.title.map((line, index) => (
              <text
                key={line}
                x={node.x + node.w / 2}
                y={node.y + 46 + index * 19}
                textAnchor="middle"
                className="uss-title fill-slate-800"
              >
                {line}
              </text>
            ))}

            {/* Per-node detail that changes with the selected prompt. */}
            {node.id === "prompt" ? (
              <text
                x={node.x + node.w / 2}
                y={node.y + node.h - 18}
                textAnchor="middle"
                className="uss-detail fill-slate-500"
              >
                {modality}
              </text>
            ) : null}
            {node.id === "promptEnc" ? (
              <text
                x={node.x + node.w / 2}
                y={node.y + node.h - 18}
                textAnchor="middle"
                className="uss-detail fill-slate-500"
              >
                {MODALITY_CAPTION[modality]}
              </text>
            ) : null}

            {/* read -> write -> read, the fusion encoder's attention pattern. */}
            {node.id === "fusion" ? (
              <g className={cn("uss-rwr", live && "is-live")}>
                {["read", "write", "read"].map((label, index) => (
                  <g key={`${label}-${index}`} style={{ animationDelay: `${index * 0.42}s` }} className="uss-rwr-step">
                    <rect
                      x={node.x + 22}
                      y={node.y + 78 + index * 24}
                      width={node.w - 44}
                      height={20}
                      rx={10}
                      fill={live ? "#ffffff" : "#f8fafc"}
                      stroke={live ? "var(--cyan)" : "#e2e8f0"}
                      strokeWidth={1}
                    />
                    <text
                      x={node.x + node.w / 2}
                      y={node.y + 92 + index * 24}
                      textAnchor="middle"
                      className="uss-detail fill-slate-600"
                    >
                      {index === 1 ? "write to visual tokens" : "read from visual tokens"}
                    </text>
                  </g>
                ))}
              </g>
            ) : null}

            {/* Predicted waypoints leaving the decoder. */}
            {node.id === "head" ? (
              <g>
                <polyline
                  points="876,228 902,220 928,213 954,205 980,199 1004,195"
                  fill="none"
                  stroke={live ? "var(--cyan)" : "#cbd5e1"}
                  strokeWidth={1.6}
                  strokeDasharray="4 6"
                  className={live ? "uss-flow" : undefined}
                />
                {[
                  [876, 228],
                  [902, 220],
                  [928, 213],
                  [954, 205],
                  [980, 199],
                ].map(([cx, cy], index) => (
                  <circle
                    key={`${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    r={3}
                    fill={live ? "var(--cyan)" : "#cbd5e1"}
                    className={live ? "uss-pulse" : undefined}
                    style={{ animationDelay: `${index * 0.12}s` }}
                  />
                ))}
                <text x={node.x + node.w / 2} y={node.y + node.h - 6} textAnchor="middle" className="uss-detail fill-slate-500">
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
