import { cn } from "@/lib/utils";
import type { ModalityId } from "@/content/siteContent";

/**
 * One scene per stage of the paper's method figure (a-d). Only the stage being
 * explained is drawn, so each one can be large and legible instead of the whole
 * pipeline competing for the same space.
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
const IDLE = "#c9d3d8";

type SceneProps = { modality: ModalityId; playing: boolean };

const MODALITIES: { id: ModalityId; label: string; encoder: string; tokens: number }[] = [
  { id: "text", label: "Text", encoder: "Text Encoder", tokens: 5 },
  { id: "box", label: "Bounding Box", encoder: "Box Encoder", tokens: 9 },
  { id: "point", label: "Point", encoder: "Point Encoder", tokens: 4 },
  { id: "mask", label: "Mask", encoder: "Mask Encoder", tokens: 6 },
];

function Chips({
  x,
  y,
  count,
  fill,
  size = 17,
  gap = 6,
  flow = false,
  delay = 0,
}: {
  x: number;
  y: number;
  count: number;
  fill: string;
  size?: number;
  gap?: number;
  flow?: boolean;
  delay?: number;
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
          className={flow ? "ms-chip" : undefined}
          style={{ animationDelay: `${delay + i * 0.09}s` }}
        />
      ))}
    </g>
  );
}

function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  dashed,
  tone = LINE,
  fill = "#ffffff",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  sub?: string;
  dashed?: boolean;
  tone?: string;
  fill?: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={fill}
        stroke={tone}
        strokeWidth={1.6}
        strokeDasharray={dashed ? "6 5" : undefined}
      />
      {label ? (
        <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 5)} textAnchor="middle" className="ms-label">
          {label}
        </text>
      ) : null}
      {sub ? (
        <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" className="ms-sub">
          {sub}
        </text>
      ) : null}
    </g>
  );
}

/** The trapezoid the paper uses for every encoder. */
function Encoder({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  const inset = h * 0.22;
  return (
    <g>
      <path
        d={`M${x},${y} L${x + w},${y + inset} L${x + w},${y + h - inset} L${x},${y + h} Z`}
        fill="#ffffff"
        stroke={LINE}
        strokeWidth={1.6}
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
      <path d={d} fill="none" stroke={tone} strokeWidth={1.6} markerEnd="url(#ms-arrow)" />
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

function Caption({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" className="ms-cap">
      {text}
    </text>
  );
}

/* ------------------------------ a. Input Encoding ----------------------- */
function SceneInput({ modality, playing }: SceneProps) {
  const active = MODALITIES.find((m) => m.id === modality) ?? MODALITIES[1];
  const others = MODALITIES.filter((m) => m.id !== modality);

  return (
    <g>
      <Caption x={150} y={34} text="the designation, given once at t = 1" />

      {/* The chosen prompt, shown with the real annotated first frame. */}
      <rect x={40} y={48} width={224} height={132} rx={12} fill="#fff8f0" stroke={TOK.prompt} strokeWidth={1.8} />
      <text x={56} y={70} className="ms-tag" fill="#b4762c">
        {active.label.toUpperCase()}
      </text>
      <clipPath id="ms-thumb">
        <rect x={56} y={80} width={192} height={88} rx={8} />
      </clipPath>
      <image
        href={`${import.meta.env.BASE_URL}assets/prompts/${modality}.jpg`}
        x={56}
        y={80}
        width={192}
        height={88}
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#ms-thumb)"
      />

      {/* The interfaces not chosen stay visible but quiet. */}
      {others.map((m, i) => (
        <g key={m.id} opacity={0.45}>
          <rect x={40} y={196 + i * 34} width={224} height={26} rx={8} fill="#ffffff" stroke={IDLE} strokeWidth={1.3} />
          <text x={56} y={213 + i * 34} className="ms-sub" fill="#8c9aa2">
            {m.label}
          </text>
        </g>
      ))}

      <Arrow d="M264,114 H316" tone={TOK.prompt} flow={playing} />
      <Encoder x={318} y={80} w={116} h={68} label={active.encoder} />
      <Arrow d="M434,114 H486" tone={TOK.prompt} flow={playing} />

      <Chips x={492} y={104} count={active.tokens} fill={TOK.prompt} flow={playing} />
      <Caption x={492 + (active.tokens * 23) / 2} y={90} text="Prompt Tokens" />

      {/* The stream that keeps arriving. */}
      <clipPath id="ms-obs">
        <rect x={40} y={262} width={132} height={62} rx={8} />
      </clipPath>
      <image
        href={`${import.meta.env.BASE_URL}assets/prompts/text.jpg`}
        x={40}
        y={262}
        width={132}
        height={62}
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#ms-obs)"
      />
      <rect x={40} y={262} width={132} height={62} rx={8} fill="none" stroke={LINE} strokeWidth={1.4} />
      <Caption x={106} y={340} text="Visual Observation, 3 views" />

      <Arrow d="M172,293 H208" tone={LINE} flow={playing} />
      <Encoder x={210} y={262} w={104} h={62} label="Vision Encoder" />
      <Arrow d="M314,293 H350" tone={LINE} flow={playing} />
      <Box x={352} y={262} w={126} h={62} label="Memory" sub="16 frames" />
      <Arrow d="M478,293 H510" tone={LINE} flow={playing} />
      <Chips x={516} y={284} count={7} fill={TOK.visual} flow={playing} delay={0.3} />
      <Caption x={596} y={340} text="Visual Tokens" />
    </g>
  );
}

/* ------------------------ b. Vision-Prompt Alignment -------------------- */
function SceneAlign({ playing }: SceneProps) {
  return (
    <g>
      <Chips x={92} y={54} count={5} fill={TOK.prompt} flow={playing} />
      <Caption x={149} y={44} text="Prompt Tokens" />
      <Chips x={360} y={54} count={5} fill={TOK.query} flow={playing} delay={0.2} />
      <Caption x={417} y={44} text="Learnable Queries" />

      <Arrow d="M149,78 V104" flow={playing} />
      <Arrow d="M417,78 V104" flow={playing} />

      <Box x={64} y={106} w={440} h={66} dashed />
      <text x={284} y={128} textAnchor="middle" className="ms-label">
        1) Self-Attention on Prompt + Query Tokens
      </text>
      <path
        d="M120,158 q40,-22 80,0 M200,158 q40,-22 80,0 M280,158 q40,-22 80,0 M360,158 q40,-22 80,0"
        fill="none"
        stroke={LINE}
        strokeWidth={1.2}
        strokeDasharray="3 3"
        className={playing ? "ms-flow" : undefined}
      />

      <Arrow d="M284,172 V198" flow={playing} />

      {/* Hybrid attention: visual tokens above, prompt/query below, read-write-read. */}
      <Box x={64} y={200} w={440} h={116} dashed tone={TOK.prompt} />
      <text x={284} y={222} textAnchor="middle" className="ms-label">
        2) Hybrid Attention Fusion
      </text>
      <Chips x={104} y={236} count={9} fill={TOK.visual} flow={playing} />
      <Chips x={104} y={286} count={5} fill={TOK.prompt} flow={playing} delay={0.15} />
      <Chips x={244} y={286} count={4} fill={TOK.query} flow={playing} delay={0.25} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <g key={i} className={playing ? "ms-rw" : undefined} style={{ animationDelay: `${i * 0.08}s` }}>
          <path
            d={`M${112 + i * 23},${258} V${282}`}
            stroke={LINE}
            strokeWidth={1.1}
            markerEnd="url(#ms-arrow-sm)"
          />
          <path
            d={`M${118 + i * 23},${282} V${258}`}
            stroke={TOK.prompt}
            strokeWidth={1.1}
            markerEnd="url(#ms-arrow-sm-warm)"
          />
        </g>
      ))}

      <Chips x={560} y={236} count={6} fill={TOK.query} flow={playing} delay={0.4} />
      <Caption x={628} y={226} text="3) Sparse prompt-conditioned representations" />
      <Arrow d="M504,258 H554" tone={TOK.query} flow={playing} />
    </g>
  );
}

/* --------------------- c. Waypoint Prediction Head ---------------------- */
function SceneHead({ playing }: SceneProps) {
  return (
    <g>
      <Box x={60} y={56} w={230} h={64} dashed tone={TOK.query} />
      <Chips x={78} y={80} count={8} fill={TOK.query} flow={playing} />
      <Caption x={175} y={46} text="Sparse Representations" />

      <Box x={318} y={56} w={128} h={64} />
      <rect x={366} y={76} width={26} height={26} rx={5} fill="#b7dcc4" />
      <Caption x={382} y={46} text="Visibility Query" />

      <Arrow d="M175,120 V152" tone={TOK.query} flow={playing} />
      <Arrow d="M382,120 V152" flow={playing} />

      <Box x={60} y={154} w={386} h={44} label="Transformer Decoder" />

      <Arrow d="M175,198 V228" flow={playing} />
      <Arrow d="M382,198 V228" flow={playing} />

      <Box x={60} y={230} w={230} h={42} label="Waypoint Decoder" />
      <Box x={318} y={230} w={128} h={42} label="MLP" />

      <Arrow d="M175,272 V296" flow={playing} />
      <Arrow d="M382,272 V296" flow={playing} />

      {/* Trajectory */}
      <Box x={492} y={56} w={330} h={150} />
      <Caption x={657} y={226} text="Predicted trajectory" />
      <path
        d="M520,170 C560,120 600,150 640,120 C680,92 720,110 760,88 L796,80"
        fill="none"
        stroke={LINE}
        strokeWidth={2}
        className={playing ? "ms-flow-solid" : undefined}
      />
      {[
        [520, 170],
        [578, 138],
        [640, 120],
        [700, 100],
        [760, 88],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={5}
          fill={LINE}
          className={playing ? "ms-pulse" : undefined}
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
      <circle cx={520} cy={170} r={9} fill="none" stroke={TOK.prompt} strokeWidth={2.4} />
      <text x={520} y={192} textAnchor="middle" className="ms-sub">
        robot
      </text>
      <text x={796} y={70} textAnchor="middle" className="ms-sub">
        target
      </text>

      {/* Visibility */}
      <Box x={492} y={230} w={330} h={70} />
      <Caption x={657} y={320} text="Per-view visibility" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={540 + i * 100} y={246} width={54} height={38} rx={5} fill="#eef4f6" />
          <rect
            x={540 + i * 100}
            y={246 + (i === 1 ? 20 : 6)}
            width={54}
            height={i === 1 ? 18 : 32}
            rx={5}
            fill="#8cc6a8"
            className={playing ? "ms-bar" : undefined}
            style={{ animationDelay: `${i * 0.14}s` }}
          />
          <text x={567 + i * 100} y={296} textAnchor="middle" className="ms-sub">
            {["L", "F", "R"][i]}
          </text>
        </g>
      ))}
    </g>
  );
}

/* ------------------ d. Action-Conditioned World Model ------------------- */
function SceneWorld({ playing }: SceneProps) {
  return (
    <g>
      <Chips x={64} y={72} count={5} fill={TOK.query} flow={playing} />
      <Caption x={120} y={62} text="Current state" />

      <Box x={64} y={140} w={176} h={56} label="Predicted waypoints" />

      <Arrow d="M180,90 H268 V128" tone={TOK.query} flow={playing} />
      <Arrow d="M240,168 H268 V150" flow={playing} />

      <Box x={270} y={94} w={118} h={78} label="Action Fusion" sub="MLP" />
      <Arrow d="M388,133 H432" tone={TOK.action} flow={playing} />

      <Chips x={438} y={122} count={5} fill={TOK.action} flow={playing} delay={0.2} />
      <Caption x={494} y={112} text="Action-conditioned state" />

      <Arrow d="M494,150 V182" tone={TOK.action} flow={playing} />
      <Box x={404} y={184} w={180} h={44} label="Latent World Model" />
      <Arrow d="M494,228 V258" tone={TOK.action} flow={playing} />
      <Chips x={438} y={262} count={5} fill={TOK.action} flow={playing} delay={0.35} />
      <Caption x={494} y={302} text="Predicted next state" />

      {/* The target branch, which never ships. */}
      <Box x={620} y={60} w={244} h={120} dashed tone={IDLE} />
      <text x={742} y={84} textAnchor="middle" className="ms-label">
        Future State Encoding
      </text>
      <Box x={640} y={96} w={96} h={40} label="EMA" sub="encoder" />
      <Arrow d="M736,116 H764" tone={IDLE} />
      <Chips x={770} y={108} count={4} fill={TOK.visual} size={15} gap={5} flow={playing} delay={0.3} />
      <text x={742} y={166} textAnchor="middle" className="ms-sub">
        target next state, stop-grad
      </text>

      <Arrow d="M742,180 V232" tone={IDLE} />
      <Arrow d="M584,284 H700 V252" tone={TOK.action} flow={playing} />
      <Box x={640} y={234} w={204} h={50} label="Latent Alignment Loss" />
      <Caption x={742} y={306} text="training only - removed at inference" />
    </g>
  );
}

const SCENES: Record<string, (props: SceneProps) => JSX.Element> = {
  input: SceneInput,
  align: SceneAlign,
  head: SceneHead,
  world: SceneWorld,
};

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
  const Scene = SCENES[stage] ?? SceneInput;

  return (
    <svg
      viewBox="0 0 900 360"
      className={cn("h-auto w-full select-none", className)}
      role="img"
      aria-label={`USS method figure, stage ${stage}, with a ${modality} prompt`}
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

      <rect x={0} y={0} width={900} height={360} rx={16} fill="#fbfbf9" />
      <g key={stage} className="ms-scene">
        <Scene modality={modality} playing={playing} />
      </g>
    </svg>
  );
}
