import type { MethodStep, ModalityId } from "@/content/siteContent";

/**
 * The token flow that the method figure plays for each step. Every phase moves
 * one or more "packets" (a small train of tokens with a caption riding above
 * it) along a path drawn in the figure's own coordinates (viewBox 1000 × 570),
 * and is listed in the ledger under the figure. Counts follow the paper:
 * 512 × 512 input with 16 px patches (1024 patch tokens per view), 9 box /
 * 4 point prompt tokens, K_q = 10 queries per view, N = 3 views in simulation,
 * M = 10 waypoints and a 16-frame memory.
 */

export type StageId = MethodStep["id"];
export type TokenKind = "p" | "q" | "v" | "s" | "g" | "w" | "m";

export type Cargo =
  | { kind: TokenKind; count: number; show?: number }
  | { frame: true }
  | { none: true };

export interface Packet {
  /** Motion path; the packet's centre follows it. A lone "Mx,y" holds it still. */
  path: string;
  cargo: Cargo;
  chip?: string;
  /** Where the caption sits relative to the tokens. */
  chipAt?: "above" | "below" | "left" | "right";
  /** Start delay as a fraction of the phase's travel time. */
  delay?: number;
}

export interface Effect {
  kind: "waypoints" | "arrows-down" | "arrows-up" | "arcs" | "dense-keys";
}

export interface Phase {
  id: string;
  /** Short name for the ledger chip. */
  short: string;
  /** "from → to", shown on the ledger's detail line. */
  route: string;
  /** What exactly moves, with counts and shapes. */
  detail: string;
  packets: Packet[];
  /** Figure nodes that flash when the packets arrive. */
  hit?: NodeId[];
  effects?: Effect[];
  /** Duration in ms; the packets travel for 75 % of it. */
  dur?: number;
}

/** Bounding boxes of the figure's nodes, used for the arrival flash. */
export const NODES = {
  "enc-text": [206, 63, 60, 56],
  "enc-box": [206, 149, 60, 56],
  "enc-point": [206, 235, 60, 56],
  "enc-mask": [206, 321, 60, 56],
  "prompt-tokens": [310, 42, 142, 70],
  queries: [466, 42, 142, 70],
  "self-attn": [310, 128, 298, 84],
  "fusion-v": [314, 256, 290, 32],
  "fusion-u": [314, 318, 290, 32],
  sparse: [310, 418, 298, 82],
  "vision-enc": [116, 426, 60, 122],
  memory: [198, 420, 94, 134],
  "head-sparse": [660, 42, 198, 70],
  "vis-query": [870, 42, 124, 70],
  decoder: [660, 128, 334, 26],
  "wp-dec": [660, 168, 198, 26],
  mlp: [870, 168, 124, 26],
  traj: [660, 208, 198, 78],
  vis: [870, 208, 124, 78],
  "cur-state": [662, 350, 92, 32],
  "traj-in": [662, 410, 92, 32],
  afm: [768, 352, 68, 90],
  "g-state": [848, 350, 146, 32],
  lwm: [848, 394, 146, 24],
  "next-state": [848, 449, 146, 30],
  ema: [724, 518, 42, 30],
  target: [778, 521, 60, 24],
  loss: [858, 512, 136, 36],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export type NodeId = keyof typeof NODES;

/** Prompt-token count per modality (the mask never becomes prompt tokens). */
export const PROMPT_TOKENS: Record<ModalityId, number> = { text: 4, box: 9, point: 4, mask: 0 };

/** Row centre (y) of each prompt row in part (a), and where V₁ enters its encoder. */
const ROW_MID: Record<ModalityId, number> = { text: 91, box: 177, point: 263, mask: 349 };
const ROW_FEED: Record<ModalityId, number> = { text: 0, box: 190, point: 276, mask: 362 };

/** Where the prompt tokens land in the "Prompt Tokens" card. */
const PROMPT_IN = "H298 V88 H381";

function promptPhases(modality: ModalityId): Phase[] {
  const mid = ROW_MID[modality];
  const v1: Phase = {
    id: "v1",
    short: "V₁ in",
    route: "First frame → encoder",
    detail: "The prompt is read off the first frame's patch tokens V₁: 32 × 32 = 1024 tokens from PE-Spatial.",
    packets: [
      { path: `M184,470 H190 V${ROW_FEED[modality]} H210`, cargo: { kind: "v", count: 1024, show: 6 }, chip: "V₁ · 1024 patch tokens", chipAt: "right" },
    ],
    hit: [`enc-${modality}` as NodeId],
  };

  switch (modality) {
    case "text":
      return [
        {
          id: "words",
          short: "9 words",
          route: "Instruction → Text Encoder",
          detail: "“follow the man wearing black shirt and shorts” enters the frozen PE-Core text encoder as 9 word tokens s₁:₉.",
          packets: [{ path: `M134,${mid} H214`, cargo: { kind: "w", count: 9 }, chip: "s₁:₉ · 9 words" }],
          hit: ["enc-text"],
        },
        {
          id: "text-out",
          short: "4 prompt tokens",
          route: "Text Encoder → Prompt Tokens",
          detail: "Only the [CLS] embedding and the noun tokens (man, shirt, shorts) are kept: Y_text = [h_cls ; h_noun], 4 tokens, projected to 256-d.",
          packets: [{ path: `M266,${mid} ${PROMPT_IN}`, cargo: { kind: "p", count: 4 }, chip: "[CLS] + 3 nouns → 4 tokens" }],
          hit: ["prompt-tokens"],
        },
      ];
    case "box":
      return [
        v1,
        {
          id: "roi",
          short: "RoIAlign 7×7",
          route: "Box → Box Encoder",
          detail: "The drawn box R_box selects a region of V₁; RoIAlign samples it on a 7 × 7 grid.",
          packets: [{ path: `M132,${mid} H214`, cargo: { kind: "m", count: 1 }, chip: "R_box · 7×7 RoIAlign" }],
          hit: ["enc-box"],
        },
        {
          id: "box-out",
          short: "9 prompt tokens",
          route: "Box Encoder → Prompt Tokens",
          detail: "A pooling head ψ plus a learnable grid embedding turns the 7 × 7 samples into 9 tokens; an MLP projects them to 256-d. Computed once, reused every step.",
          packets: [{ path: `M266,${mid} ${PROMPT_IN}`, cargo: { kind: "p", count: 9 }, chip: "Y_box · 9 tokens" }],
          hit: ["prompt-tokens"],
        },
      ];
    case "point":
      return [
        v1,
        {
          id: "roi",
          short: "pseudo-box 5×5",
          route: "Click → Point Encoder",
          detail: "The click becomes a 160 px pseudo-box around the pixel; RoIAlign samples V₁ inside it on a 5 × 5 grid.",
          packets: [{ path: `M132,${mid} H214`, cargo: { kind: "m", count: 1 }, chip: "click → 160 px box · 5×5" }],
          hit: ["enc-point"],
        },
        {
          id: "point-out",
          short: "4 prompt tokens",
          route: "Point Encoder → Prompt Tokens",
          detail: "ψ plus a grid embedding pools the samples into 4 tokens, projected to 256-d. Computed once, reused every step.",
          packets: [{ path: `M266,${mid} ${PROMPT_IN}`, cargo: { kind: "p", count: 4 }, chip: "Y_point · 4 tokens" }],
          hit: ["prompt-tokens"],
        },
      ];
    case "mask":
      return [
        {
          id: "m1",
          short: "mask m₁",
          route: "Mask → Mask Encoder",
          detail: "The binary mask m₁ from the first frame goes through a light mask encoder φ, giving a dense spatial prior B_mask.",
          packets: [{ path: `M132,${mid} H214`, cargo: { kind: "m", count: 1 }, chip: "binary mask m₁" }],
          hit: ["enc-mask"],
        },
        {
          id: "anchor",
          short: "memory anchor",
          route: "Mask Encoder → Memory",
          detail: "B_mask is flattened and added to V₁ (Y_mask = V₁ + Flatten(B_mask)), then stored in the memory bank as a persistent target anchor. No prompt tokens are made.",
          packets: [{ path: "M236,384 V462", cargo: { kind: "v", count: 1024, show: 6 }, chip: "V₁ + B_mask → anchor", chipAt: "right" }],
          hit: ["memory"],
        },
      ];
  }
}

function visionPhases(modality: ModalityId): Phase[] {
  return [
    {
      id: "frame",
      short: "frame Iₜ",
      route: "Camera → Vision Encoder",
      detail: "Each view's RGB frame Iₜ (512 × 512) enters PE-Spatial; all but its last two blocks are frozen.",
      packets: [{ path: "M51,456 L146,487", cargo: { frame: true }, chip: "Iₜ · 512×512, per view" }],
      hit: ["vision-enc"],
    },
    {
      id: "patches",
      short: "1024 tokens",
      route: "Vision Encoder → Memory",
      detail: "16 px patches give Vₜ: 32 × 32 = 1024 patch tokens per view, written into the view's sliding memory bank.",
      packets: [{ path: "M178,487 H246", cargo: { kind: "v", count: 1024, show: 6 }, chip: "Vₜ · 1024 tokens" }],
      hit: ["memory"],
    },
    {
      id: "memory",
      short: "16-frame memory",
      route: "Memory bank → current tokens",
      detail:
        modality === "mask"
          ? "Vₜ self-attends, then cross-attends to Kₜ: the last 16 frames × 1024 tokens with a sinusoidal time code, plus the mask anchor from t = 1."
          : "Vₜ self-attends, then cross-attends to Kₜ: the last 16 frames × 1024 tokens with a sinusoidal time code.",
      packets: [{ path: "M266,438 L240,478", cargo: { kind: "v", count: 16384, show: 5 }, chip: "Kₜ · 16 × 1024", chipAt: "right" }],
      hit: ["memory"],
    },
    {
      id: "z",
      short: "Zₜ → fusion",
      route: "Memory Attention → Fusion",
      detail: "The memory-aware tokens Zₜ = FFN(CrossAttn(SelfAttn(Vₜ), Kₜ)), still 1024 per view, become the visual stream of the fusion block.",
      packets: [{ path: "M292,470 H298 V272 H459", cargo: { kind: "v", count: 1024, show: 6 }, chip: "Zₜ · 1024 tokens" }],
      hit: ["fusion-v"],
    },
  ];
}

const U_P = 375; // centre of the prompt group in the u rows
const U_Q = 545; // centre of the query group in the u rows
const COLS = [330, 370, 450, 490, 530, 570];

function fusionPhases(modality: ModalityId): Phase[] {
  const n = PROMPT_TOKENS[modality];
  const hasPrompt = n > 0;
  const packetsIn: Packet[] = [
    { path: `M537,96 V180 H${U_Q}`, cargo: { kind: "q", count: 10 }, chip: "q · 10 queries", chipAt: "above" },
  ];
  if (hasPrompt) packetsIn.unshift({ path: `M381,96 V180 H${U_P}`, cargo: { kind: "p", count: n }, chip: `Y · ${n} tokens`, chipAt: "left" });

  // Dots cross between the visual row and the prompt/query row; the caption sits
  // in the arrow-free column of the ellipsis.
  const dots = (dir: "down" | "up", chip: string): Packet[] => [
    ...COLS.map((x, i) => ({
      path: dir === "down" ? `M${x},288 V318` : `M${x},318 V288`,
      cargo: { kind: dir === "down" ? "v" : x < 460 && hasPrompt ? "p" : "q", count: 1 } as Cargo,
      delay: i * 0.05,
    })),
    { path: "M410,303", cargo: { none: true }, chip },
  ];

  return [
    {
      id: "join",
      short: hasPrompt ? `u = [q ; Y]` : "u = q",
      route: hasPrompt ? "Prompt Tokens + Queries → Self-Attention" : "Queries → Self-Attention",
      detail: hasPrompt
        ? `10 learnable queries per view are concatenated with the ${n} prompt tokens: u = [q ; Y], ${10 + n} tokens.`
        : "Only the 10 learnable queries enter; the mask already sits in memory as an anchor.",
      packets: packetsIn,
      hit: ["self-attn"],
    },
    {
      id: "self",
      short: "self-attention",
      route: "Prompt + query tokens ↔ each other",
      detail: "u′ = SelfAttn(u): queries and prompt tokens exchange information before looking at the image.",
      packets: [{ path: "M459,220", cargo: { none: true }, chip: "u′ = SelfAttn([q ; Y])" }],
      effects: [{ kind: "arcs" }],
      hit: ["self-attn"],
    },
    {
      id: "read1",
      short: "① read",
      route: "Visual tokens → prompt/query tokens",
      detail: "uʳ = FFN(CrossAttn(u′ ← Z)): the compact tokens read evidence from the 1024 visual tokens.",
      packets: dots("down", "① read u←Z"),
      effects: [{ kind: "arrows-down" }],
      hit: ["fusion-u"],
    },
    {
      id: "write",
      short: "② write",
      route: "Prompt/query tokens → visual tokens",
      detail: "Zᶠ = CrossAttn(Z ← uʳ): they write back into the visual stream, boosting the designated person and suppressing look-alikes.",
      packets: dots("up", "② write Z←u"),
      effects: [{ kind: "arrows-up" }],
      hit: ["fusion-v"],
    },
    {
      id: "read2",
      short: "③ read",
      route: "Fused visual tokens → prompt/query tokens",
      detail: "û = CrossAttn(uʳ ← Zᶠ): one more read of the updated stream.",
      packets: dots("down", "③ read û←Zᶠ"),
      effects: [{ kind: "arrows-down" }],
      hit: ["fusion-u"],
    },
    {
      id: "keep",
      short: "keep 10 queries",
      route: "Fusion → Sparse representation",
      detail: hasPrompt
        ? `Q = û[1:10]: only the 10 query outputs per view move on. The ${n} prompt tokens and the dense tokens stay behind.`
        : "Q = û[1:10]: only the 10 query outputs per view move on; the dense tokens stay behind.",
      packets: [
        { path: `M${U_Q},336 V409 H459 V466`, cargo: { kind: "q", count: 10 }, chip: "Q = û[1:10] · 10 tokens", chipAt: "below" },
        ...(hasPrompt ? [{ path: `M${U_P},332`, cargo: { kind: "p" as const, count: n }, chip: "Y dropped", chipAt: "above" as const }] : []),
      ],
      hit: ["sparse"],
    },
  ];
}

const WP_DOTS: Array<[number, number]> = [
  [700, 240],
  [714, 235],
  [728, 237],
  [742, 244],
  [756, 251],
  [770, 256],
  [784, 254],
  [798, 247],
  [812, 239],
  [826, 236],
];
export const WAYPOINTS = WP_DOTS;

/** A smooth curve through a polyline's midpoints, ending on its last point. */
export function smoothPath(pts: Array<[number, number]>) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += ` Q${x},${y} ${(x + nx) / 2},${(y + ny) / 2}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return `${d} L${lx},${ly}`;
}

function headPhases(): Phase[] {
  return [
    {
      id: "q-in",
      short: "Q in",
      route: "Sparse representation → Head",
      detail: "Each view hands over its 10 query tokens; with N = 3 cameras in simulation that is 30 tokens (1 view, 10 tokens on the robot).",
      packets: [{ path: "M608,466 H630 V88 H759", cargo: { kind: "q", count: 10 }, chip: "Q · 10 per view × 3 views" }],
      hit: ["head-sparse"],
    },
    {
      id: "decode",
      short: "decoder",
      route: "[Q ; q_pres] → Transformer Decoder",
      detail: "A decoder shared across views takes the 10 queries plus one learnable presence query and cross-attends to the dense fused tokens Z̃ (Zᶠ with a PETR-style 3D position code) as keys.",
      packets: [
        { path: "M759,96 V141", cargo: { kind: "q", count: 10 }, chip: "Q", chipAt: "left" },
        { path: "M932,96 V141", cargo: { kind: "g", count: 1 }, chip: "q_pres · 1", chipAt: "left" },
        { path: "M600,272 H642 V141 H700", cargo: { kind: "v", count: 1024, show: 6 }, chip: "Z̃ · keys", chipAt: "below", delay: 0.1 },
      ],
      effects: [{ kind: "dense-keys" }],
      hit: ["decoder"],
    },
    {
      id: "state",
      short: "Sₜ · 30 tokens",
      route: "Decoder → Waypoint Decoder + MLP",
      detail: "The view-level states of all views are concatenated into Sₜ (3 × 10 = 30 tokens × 256-d); the presence query becomes one visibility logit v̂ per view.",
      packets: [
        { path: "M759,154 V181", cargo: { kind: "s", count: 30, show: 10 }, chip: "Sₜ · 30 tokens", chipAt: "left" },
        { path: "M932,154 V181", cargo: { kind: "g", count: 1 }, chip: "v̂ logit", chipAt: "left" },
      ],
      hit: ["wp-dec", "mlp"],
    },
    {
      id: "out",
      short: "10 waypoints",
      route: "Waypoint Decoder → Trajectory · MLP → Visibility",
      detail: "The waypoint decoder outputs M = 10 egocentric waypoints (x, y); only the first is executed. v̂ < 0.5 in every view means the target is out of sight.",
      packets: [
        { path: "M759,214", cargo: { none: true }, chip: "Ŵ · 10 waypoints (x, y)" },
        { path: "M932,214", cargo: { none: true }, chip: "v̂ → in view?" },
      ],
      effects: [{ kind: "waypoints" }],
      hit: ["traj", "vis"],
      dur: 2000,
    },
  ];
}

function worldPhases(): Phase[] {
  return [
    {
      id: "s-in",
      short: "Sₜ",
      route: "Head state → Current State",
      detail: "The sparse state Sₜ (30 tokens) is the world model's current state.",
      packets: [{ path: "M672,98 H650 V366 H708", cargo: { kind: "q", count: 30, show: 10 }, chip: "Sₜ · 30 tokens", chipAt: "left" }],
      hit: ["cur-state"],
    },
    {
      id: "a-in",
      short: "action aₜ",
      route: "Trajectory → action",
      detail: "The 10 predicted waypoints are flattened into an action aₜ = vec(Ŵ) ∈ ℝ²⁰ and repeated once per state token.",
      packets: [{ path: "M660,247 H644 V426 H708", cargo: { kind: "w", count: 10 }, chip: "aₜ = vec(Ŵ) ∈ ℝ²⁰", chipAt: "left" }],
      hit: ["traj-in"],
    },
    {
      id: "fuse",
      short: "Gₜ",
      route: "State + action → Action Fusion MLP",
      detail: "Gₜ = MLPₐ(Concat(Sₜ, Repeat(aₜ, 30))): an action-conditioned state, still 30 tokens.",
      packets: [
        { path: "M754,366 H800", cargo: { kind: "q", count: 30, show: 6 } },
        { path: "M754,426 H800", cargo: { kind: "w", count: 10, show: 6 } },
        { path: "M836,366 H921", cargo: { kind: "s", count: 30, show: 10 }, chip: "Gₜ · 30 tokens", delay: 0.45 },
      ],
      hit: ["afm", "g-state"],
    },
    {
      id: "predict",
      short: "Ŝₜ₊₁",
      route: "Latent World Model → Predicted Next State",
      detail: "The latent predictor F_φ forecasts the next sparse state Ŝₜ₊₁ = F_φ(Gₜ), 30 tokens, without decoding any pixels.",
      packets: [{ path: "M921,382 V464", cargo: { kind: "s", count: 30, show: 10 }, chip: "Ŝₜ₊₁ = F_φ(Gₜ)", chipAt: "left" }],
      hit: ["lwm", "next-state"],
    },
    {
      id: "target",
      short: "EMA target",
      route: "Next frame → EMA encoder → target",
      detail: "An EMA copy of the whole pathway (prompt, memory, fusion, decoder) encodes frame Iₜ₊₁ into the target Sᵉᵐᵃₜ₊₁, layer-normed and detached.",
      packets: [
        { path: "M692,533 H745", cargo: { frame: true }, chip: "Iₜ₊₁", chipAt: "above" },
        { path: "M766,533 H808", cargo: { kind: "v", count: 30, show: 3 }, chip: "Sᵉᵐᵃₜ₊₁ · stop-grad", chipAt: "below", delay: 0.5 },
      ],
      hit: ["ema", "target"],
    },
    {
      id: "loss",
      short: "L_wm",
      route: "Prediction vs target → Latent Alignment Loss",
      detail: "L_wm = SmoothL1(LN(Ŝₜ₊₁), sg(LN(Sᵉᵐᵃₜ₊₁))), weighted 0.2. The EMA branch and predictor are dropped at inference.",
      packets: [
        { path: "M921,480 V522", cargo: { kind: "s", count: 30, show: 10 }, chip: "LN(Ŝₜ₊₁)", chipAt: "left" },
        { path: "M838,533 H880", cargo: { kind: "v", count: 30, show: 3 }, chip: "sg(LN(Sᵉᵐᵃ))", chipAt: "below" },
      ],
      hit: ["loss"],
      dur: 1900,
    },
  ];
}

export function flowFor(step: StageId, modality: ModalityId): Phase[] {
  switch (step) {
    case "prompt":
      return promptPhases(modality);
    case "vision":
      return visionPhases(modality);
    case "fusion":
      return fusionPhases(modality);
    case "head":
      return headPhases();
    case "world":
      return worldPhases();
  }
}

export const PHASE_MS = 1700;
export const HOLD_MS = 1400;

/** Packets travel for 75 % of their phase, then the destination flashes. */
export const travelOf = (phase: Phase) => (phase.dur ?? PHASE_MS) * 0.75;
