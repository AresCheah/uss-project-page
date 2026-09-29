import { cn } from "@/lib/utils";
import type { ModalityId } from "@/content/siteContent";

/**
 * The whole method figure on one canvas, in the paper's four labelled parts.
 * The walkthrough moves a spotlight from part to part: the active part is drawn
 * in full colour and animated, the rest stay visible but recede, so the reader
 * never loses the shape of the pipeline.
 *
 * Token colours follow the paper's legend: orange prompt tokens, light-blue
 * learnable queries, dark visual tokens, amber action-conditioned state.
 */

const TOK = {
  prompt: "#eeb173",
  query: "#9fd3ec",
  visual: "#2f6b85",
  action: "#d08b2f",
};

const LINE = "#2f6b85";
const IDLE = "#b9c4ca";

const ENCODER_LABEL: Record<ModalityId, string> = {
  text: "Text Encoder",
  point: "Point Encoder",
  box: "Box Encoder",
  mask: "Mask Encoder",
};

const MODALITY_LABEL: Record<ModalityId, string> = {
  text: "Text",
  point: "Point",
  box: "Bounding Box",
  mask: "Mask",
};

const PROMPT_TOKENS: Record<ModalityId, number> = { text: 5, point: 4, box: 9, mask: 6 };

type Common = { active: boolean; playing: boolean };

function Chips({
  x,
  y,
  count,
  fill,
  size = 16,
  gap = 5,
  animate = false,
}: {
  x: number;
  y: number;
  count: number;
  fill: string;
  size?: number;
  gap?: number;
  animate?: boolean;
}) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <rect
          key={i}
          x={x + i * (size + gap)}
          y={y}
          width={size}
          height={size}
          rx={4}
          fill={fill}
          className={animate ? "ms-chip" : undefined}
          style={{ animationDelay: `${i * 0.09}s` }}
        />
      ))}
    </g>
  );
}

const chipsWidth = (count: number, size = 16, gap = 5) => count * size + (count - 1) * gap;

function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  dashed,
  tone = LINE,
  labelTop = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  sub?: string;
  dashed?: boolean;
  tone?: string;
  labelTop?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={9}
        fill="#ffffff"
        stroke={tone}
        strokeWidth={1.5}
        strokeDasharray={dashed ? "6 5" : undefined}
      />
      {label ? (
        <text
          x={x + w / 2}
          y={labelTop ? y + 22 : y + (sub ? h / 2 - 2 : h / 2 + 4)}
          textAnchor="middle"
          className="ms-label"
        >
          {label}
        </text>
      ) : null}
      {sub ? (
        <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" className="ms-sub">
          {sub}
        </text>
      ) : null}
    </g>
  );
}

function Encoder({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  const inset = h * 0.2;
  return (
    <g>
      <path
        d={`M${x},${y} L${x + w},${y + inset} L${x + w},${y + h - inset} L${x},${y + h} Z`}
        fill="#ffffff"
        stroke={LINE}
        strokeWidth={1.5}
      />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" className="ms-sub">
        {label}
      </text>
    </g>
  );
}

function Arrow({ d, tone = LINE, flow = false }: { d: string; tone?: string; flow?: boolean }) {
  return (
    <g>
      <path d={d} fill="none" stroke={tone} strokeWidth={1.5} markerEnd="url(#ms-arrow)" />
      {flow ? (
        <path
          d={d}
          fill="none"
          stroke={tone}
          strokeWidth={2.2}
          strokeDasharray="3 10"
          strokeLinecap="round"
          className="ms-flow"
        />
      ) : null}
    </g>
  );
}

function Cap({
  x,
  y,
  text,
  anchor = "middle",
}: {
  x: number;
  y: number;
  text: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="ms-cap">
      {text}
    </text>
  );
}

function PartTitle({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} className="ms-part">
      {text}
    </text>
  );
}

/* --------------------------------- a ----------------------------------- */
function PartInput({ active, playing, modality }: Common & { modality: ModalityId }) {
  const flow = active && playing;
  const tokens = PROMPT_TOKENS[modality];

  return (
    <g>
      <PartTitle x={30} y={36} text="a. Input Encoding" />

      <rect x={30} y={54} width={266} height={24} rx={7} fill="#fdf4e9" stroke={TOK.prompt} strokeWidth={1.3} />
      <text x={163} y={71} textAnchor="middle" className="ms-tag" fill="#b4762c">
        {MODALITY_LABEL[modality].toUpperCase()}
      </text>

      <clipPath id="ms-thumb-a">
        <rect x={30} y={86} width={266} height={118} rx={9} />
      </clipPath>
      <image
        href={`${import.meta.env.BASE_URL}assets/prompts/${modality}.jpg`}
        x={30}
        y={86}
        width={266}
        height={118}
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#ms-thumb-a)"
      />
      <rect x={30} y={86} width={266} height={118} rx={9} fill="none" stroke={TOK.prompt} strokeWidth={1.4} />

      <Arrow d="M163,204 V232" tone={TOK.prompt} flow={flow} />
      <Encoder x={98} y={234} w={130} h={44} label={ENCODER_LABEL[modality]} />
      <Arrow d="M163,278 V308" tone={TOK.prompt} flow={flow} />

      <Cap x={163} y={324} text="Prompt Tokens" />
      <Chips x={163 - chipsWidth(tokens) / 2} y={330} count={tokens} fill={TOK.prompt} animate={flow} />

      <line x1={30} y1={378} x2={296} y2={378} stroke="#e6e5e0" strokeWidth={1} />

      <clipPath id="ms-thumb-obs">
        <rect x={30} y={394} width={132} height={84} rx={9} />
      </clipPath>
      <image
        href={`${import.meta.env.BASE_URL}assets/prompts/text.jpg`}
        x={30}
        y={394}
        width={132}
        height={84}
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#ms-thumb-obs)"
      />
      <rect x={30} y={394} width={132} height={84} rx={9} fill="none" stroke={LINE} strokeWidth={1.3} />
      <Cap x={96} y={494} text="Observation, 3 views" />

      <Arrow d="M162,436 H186" flow={flow} />
      <Encoder x={188} y={414} w={108} h={44} label="Vision Encoder" />
      <Arrow d="M242,458 V508" flow={flow} />
      <Box x={30} y={510} w={266} h={40} label="Memory" sub="16 frames" />
      <Arrow d="M163,550 V580" flow={flow} />

      <Cap x={163} y={596} text="Visual Tokens" />
      <Chips x={163 - chipsWidth(7) / 2} y={602} count={7} fill={TOK.visual} animate={flow} />
    </g>
  );
}

/* --------------------------------- b ----------------------------------- */
function PartAlign({ active, playing }: Common) {
  const flow = active && playing;

  return (
    <g>
      <PartTitle x={350} y={36} text="b. Vision-Prompt Alignment" />

      <Cap x={412} y={72} text="Prompt Tokens" />
      <Chips x={362} y={80} count={5} fill={TOK.prompt} animate={flow} />
      <Cap x={566} y={72} text="Learnable Queries" />
      <Chips x={524} y={80} count={4} fill={TOK.query} animate={flow} />

      <Arrow d="M412,104 V134" tone={TOK.prompt} flow={flow} />
      <Arrow d="M566,104 V134" tone={TOK.query} flow={flow} />

      <Box x={350} y={136} w={266} h={44} label="Self-Attention" />
      <Arrow d="M483,180 V212" flow={flow} />

      <Box x={350} y={214} w={266} h={158} label="Hybrid Attention Fusion" tone={TOK.prompt} dashed labelTop />
      <Chips x={396} y={266} count={8} fill={TOK.visual} size={14} gap={4} animate={flow} />
      <Chips x={396} y={336} count={5} fill={TOK.prompt} size={14} gap={4} animate={flow} />
      <Chips x={492} y={336} count={3} fill={TOK.query} size={14} gap={4} animate={flow} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <g key={i} className={flow ? "ms-rw" : undefined} style={{ animationDelay: `${i * 0.09}s` }}>
          <path d={`M${400 + i * 18},284 V330`} stroke={LINE} strokeWidth={1} markerEnd="url(#ms-arrow-sm)" />
          <path
            d={`M${406 + i * 18},330 V284`}
            stroke={TOK.prompt}
            strokeWidth={1}
            markerEnd="url(#ms-arrow-sm-warm)"
          />
        </g>
      ))}

      <Arrow d="M483,372 V404" tone={TOK.query} flow={flow} />
      <Cap x={483} y={420} text="Sparse Representations" />
      <Chips x={483 - chipsWidth(6) / 2} y={426} count={6} fill={TOK.query} animate={flow} />
    </g>
  );
}

/* --------------------------------- c ----------------------------------- */
function PartHead({ active, playing }: Common) {
  const flow = active && playing;

  return (
    <g>
      <PartTitle x={672} y={36} text="c. Waypoint Prediction Head" />

      <Cap x={772} y={72} text="Sparse representations" />
      <Cap x={996} y={72} text="Visibility query" />
      <rect x={988} y={78} width={16} height={16} rx={4} fill="#a9d4b8" />

      <Arrow d="M772,80 V106" tone={TOK.query} flow={flow} />
      <Arrow d="M996,98 V106" flow={flow} />

      <Box x={672} y={108} w={436} h={40} label="Transformer Decoder" />
      <Arrow d="M772,148 V176" flow={flow} />
      <Arrow d="M996,148 V176" flow={flow} />

      <Box x={672} y={178} w={200} h={40} label="Waypoint Decoder" />
      <Box x={896} y={178} w={212} h={40} label="MLP" />
      <Arrow d="M772,218 V246" flow={flow} />
      <Arrow d="M996,218 V246" flow={flow} />

      <Box x={672} y={248} w={200} h={104} />
      <Box x={896} y={248} w={212} h={104} />

      <path
        d="M700,330 C728,306 756,316 786,300 C816,284 836,292 856,284"
        fill="none"
        stroke={LINE}
        strokeWidth={1.8}
        className={flow ? "ms-flow-solid" : undefined}
      />
      {[
        [700, 330],
        [742, 313],
        [786, 300],
        [826, 289],
        [856, 284],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={4}
          fill={LINE}
          className={flow ? "ms-pulse" : undefined}
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
      <circle cx={700} cy={330} r={7.5} fill="none" stroke={TOK.prompt} strokeWidth={2} />
      <Cap x={772} y={272} text="Trajectory" />

      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={926 + i * 62} y={272} width={38} height={58} rx={5} fill="#eef4f6" />
          <rect
            x={926 + i * 62}
            y={i === 1 ? 306 : 282}
            width={38}
            height={i === 1 ? 24 : 48}
            rx={5}
            fill="#8cc6a8"
            className={flow ? "ms-bar" : undefined}
            style={{ animationDelay: `${i * 0.14}s` }}
          />
          <text x={945 + i * 62} y={344} textAnchor="middle" className="ms-sub">
            {["L", "F", "R"][i]}
          </text>
        </g>
      ))}
      <Cap x={1002} y={272} text="Per-view visibility" />
    </g>
  );
}

/* --------------------------------- d ----------------------------------- */
function PartWorld({ active, playing }: Common) {
  const flow = active && playing;

  return (
    <g>
      <PartTitle x={672} y={412} text="d. Action-Conditioned World Model" />

      <Cap x={714} y={446} text="Current state" anchor="middle" />
      <Chips x={714 - chipsWidth(4, 14, 4) / 2} y={452} count={4} fill={TOK.query} size={14} gap={4} animate={flow} />
      <Box x={672} y={492} w={116} h={36} label="Waypoints" />

      <Arrow d="M754,468 H798 V488 H816" tone={TOK.query} flow={flow} />
      <Arrow d="M788,510 H798 V500 H816" flow={flow} />

      <Box x={820} y={462} w={112} h={64} label="Action Fusion" sub="MLP" />
      <Arrow d="M932,494 H958" tone={TOK.action} flow={flow} />

      <Chips x={964} y={486} count={4} fill={TOK.action} size={14} gap={4} animate={flow} />
      <Cap x={999} y={478} text="Action-conditioned state" />

      <Arrow d="M999,502 V528" tone={TOK.action} flow={flow} />
      <Box x={912} y={530} w={176} h={36} label="Latent World Model" />
      <Arrow d="M999,566 V590" tone={TOK.action} flow={flow} />
      <Chips x={964} y={594} count={4} fill={TOK.action} size={14} gap={4} animate={flow} />
      <Cap x={999} y={626} text="Predicted next state" />

      <Box x={672} y={556} w={210} h={72} dashed tone={IDLE} />
      <text x={777} y={578} textAnchor="middle" className="ms-sub">
        EMA encoder, stop-grad
      </text>
      <Chips x={777 - chipsWidth(4, 14, 4) / 2} y={592} count={4} fill={TOK.visual} size={14} gap={4} animate={flow} />

      <Arrow d="M777,628 V650" tone={IDLE} />
      <Arrow d="M999,634 V650" tone={TOK.action} flow={flow} />
      <Box x={672} y={652} w={436} h={34} label="Latent Alignment Loss" />
    </g>
  );
}

type PartId = "input" | "align" | "head" | "world";

export default function MethodScenes({
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
  const on = (id: PartId) => stage === id;

  return (
    <svg
      viewBox="0 0 1120 700"
      className={cn("h-auto w-full select-none", className)}
      role="img"
      aria-label={`USS method figure, highlighting part ${stage}, with a ${modality} prompt`}
    >
      <defs>
        <marker id="ms-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 z" fill={LINE} />
        </marker>
        <marker id="ms-arrow-sm" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 z" fill={LINE} />
        </marker>
        <marker id="ms-arrow-sm-warm" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 z" fill={TOK.prompt} />
        </marker>
      </defs>

      <rect x={0} y={0} width={1120} height={700} rx={16} fill="#fbfbf9" />

      {/* Spotlight behind whichever part is being explained. */}
      {[
        { id: "input", x: 14, y: 16, w: 300, h: 660 },
        { id: "align", x: 334, y: 16, w: 300, h: 450 },
        { id: "head", x: 654, y: 16, w: 470, h: 356 },
        { id: "world", x: 654, y: 392, w: 470, h: 306 },
      ].map((slot) => (
        <rect
          key={slot.id}
          x={slot.x}
          y={slot.y}
          width={slot.w}
          height={slot.h}
          rx={16}
          fill="#ffffff"
          stroke="var(--cyan)"
          strokeWidth={1.4}
          className="ms-slot"
          opacity={stage === slot.id ? 1 : 0}
        />
      ))}

      {/* Connections between the four parts. */}
      <Arrow d="M262,338 H356 V76" tone={TOK.prompt} flow={playing && (on("input") || on("align"))} />
      <Arrow d="M232,610 H336 V262 H392" tone={TOK.visual} flow={playing && (on("input") || on("align"))} />
      <Arrow d="M540,434 H636 V80 H768" tone={TOK.query} flow={playing && (on("align") || on("head"))} />
      <Arrow d="M772,352 V470 H730 V488" tone={LINE} flow={playing && (on("head") || on("world"))} />

      <g className={cn("ms-part-g", on("input") ? "is-on" : "is-off")}>
        <PartInput active={on("input")} playing={playing} modality={modality} />
      </g>
      <g className={cn("ms-part-g", on("align") ? "is-on" : "is-off")}>
        <PartAlign active={on("align")} playing={playing} />
      </g>
      <g className={cn("ms-part-g", on("head") ? "is-on" : "is-off")}>
        <PartHead active={on("head")} playing={playing} />
      </g>
      <g className={cn("ms-part-g", on("world") ? "is-on" : "is-off")}>
        <PartWorld active={on("world")} playing={playing} />
      </g>
    </svg>
  );
}
