import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { siteContent, type ModalityId } from "@/content/siteContent";
import FlowLedger from "./FlowLedger";
import { PhaseLayer } from "./FlowLayer";
import { PROMPT_TOKENS, WAYPOINTS, flowFor, smoothPath, type StageId } from "./flowScript";
import { useFlowTimeline, usePrefersReducedMotion } from "./useFlowTimeline";

type Token = "p" | "q" | "v" | "s" | "g" | "…";

const ORDER: StageId[] = ["prompt", "vision", "fusion", "head", "world"];

const MODALITY_CLASS: Record<ModalityId, string> = {
  text: "m-text",
  point: "m-point",
  box: "m-box",
  mask: "m-mask",
};

/* The paper's order of the four prompt rows in part (a). */
const ROWS: Array<{ id: ModalityId; label: string[]; encoder: string; y: number }> = [
  { id: "text", label: ["Text"], encoder: "Text", y: 52 },
  { id: "box", label: ["Bounding", "Box"], encoder: "Box", y: 138 },
  { id: "point", label: ["Point"], encoder: "Point", y: 224 },
  { id: "mask", label: ["Mask"], encoder: "Mask", y: 310 },
];

const image = (id: ModalityId) => siteContent.promptModalities.find((item) => item.id === id)!.image;

/** A row of tokens; "…" draws an ellipsis in place of a token. */
function TokenRow({ items, x, y, size = 20, step = 40 }: { items: Token[]; x: number; y: number; size?: number; step?: number }) {
  return (
    <>
      {items.map((kind, i) =>
        kind === "…" ? (
          <text key={i} x={x + i * step + size / 2} y={y + size * 0.62} textAnchor="middle" className="f-dots">
            …
          </text>
        ) : (
          <rect key={i} x={x + i * step} y={y} width={size} height={size} rx={size * 0.2} className={`tk tk-${kind}`} />
        ),
      )}
    </>
  );
}

function Label({ x, y, children, className = "f-lb" }: { x: number; y: number; children: ReactNode; className?: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" className={className}>
      {children}
    </text>
  );
}

/** A small count badge sitting on a card's top-right corner, e.g. "×9". */
function Count({ x, y, children }: { x: number; y: number; children: string }) {
  const w = children.length * 6.2 + 10;
  return (
    <g className="f-count-b">
      <rect x={x - w} y={y - 7.5} width={w} height={15} rx={7.5} />
      <text x={x - w / 2} y={y + 3.4} textAnchor="middle" className="f-count">
        {children}
      </text>
    </g>
  );
}

/** A trapezoid encoder, wide on the left and narrowing to the right, as in the paper. */
function Encoder({ x, y, w, h, lines }: { x: number; y: number; w: number; h: number; lines: string[] }) {
  const inset = Math.min(h * 0.18, 14);
  return (
    <>
      <path d={`M${x},${y} L${x + w},${y + inset} L${x + w},${y + h - inset} L${x},${y + h} Z`} className="f-enc" />
      {lines.map((line, i) => (
        <Label key={line} x={x + w / 2} y={y + h / 2 + (i - (lines.length - 1) / 2) * 15 + 4.5} className="f-enc-t">
          {line}
        </Label>
      ))}
    </>
  );
}

/** The prompt tokens actually produced for the chosen prompt type: 4 for text and point, 9 for a box. */
function PromptTokens({ modality }: { modality: ModalityId }) {
  const n = PROMPT_TOKENS[modality];
  if (!n) {
    return (
      <Label x={381} y={92} className="f-mask-t">
        mask → memory
      </Label>
    );
  }
  const size = n > 6 ? 10 : 16;
  const step = n > 6 ? 12 : 24;
  const x0 = 381 - ((n - 1) * step + size) / 2;
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <rect
          key={i}
          x={x0 + i * step}
          y={88 - size / 2}
          width={size}
          height={size}
          rx={size * 0.2}
          className={`tk tk-p${modality === "text" && i === 0 ? " tk-cls" : ""}`}
        />
      ))}
    </>
  );
}

/** Prompt group (left) and query group (right) of the fusion rows, centred on 375 and 545. */
function UTokens({ y, hasPrompt }: { y: number; hasPrompt: boolean }) {
  return (
    <>
      {hasPrompt ? <TokenRow items={["p", "p", "…", "p"]} x={320} y={y} size={20} step={30} /> : null}
      <TokenRow items={["q", "q", "…", "q"]} x={490} y={y} size={20} step={30} />
    </>
  );
}

/**
 * The USS architecture redrawn after Figure 2 of the paper: (a) input
 * encoding, (b) vision-prompt alignment, (c) the waypoint head and (d) the
 * training-only world model. The whole figure stays readable; for the step
 * being read, its tokens travel along the figure's own connectors with their
 * counts, and the ledger underneath spells each hop out.
 */
export default function MethodDiagram({ active, modality }: { active: StageId | null; modality: ModalityId }) {
  const reached = active ? ORDER.indexOf(active) : -1;
  const stateOf = (id: StageId) => {
    if (!active) return "";
    const index = ORDER.indexOf(id);
    if (index === reached) return " is-on";
    return index < reached ? " is-past" : " is-idle";
  };
  const link = (kind: string, ...ids: StageId[]) => {
    if (!active) return `f-link ${kind}`;
    return ids.includes(active) ? `f-link ${kind} is-flow` : `f-link ${kind}`;
  };
  const isMask = modality === "mask";
  const hasPrompt = PROMPT_TOKENS[modality] > 0;

  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const [restarts, setRestarts] = useState(0);
  const phases = useMemo(() => (active ? flowFor(active, modality) : []), [active, modality]);
  const animated = !reduced && phases.length > 0;
  const { index, cycle } = useFlowTimeline(phases, animated && !paused, `${active}-${modality}-${restarts}`);
  const phase = animated && index < phases.length ? phases[index] : null;

  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof svg.pauseAnimations !== "function") return;
    if (paused) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [paused]);

  return (
    <>
      <svg
        ref={svgRef}
        className="dg"
        viewBox="0 0 1000 570"
        role="img"
        aria-label="The USS architecture after Figure 2 of the paper: (a) input encoding of the prompt and of the RGB stream with memory, (b) vision-prompt alignment, (c) the waypoint prediction head, and (d) the action-conditioned world model used in training."
        data-active={active ?? "all"}
        data-modality={modality}
        data-phase={phase?.id ?? (animated ? "hold" : "none")}
      >
        <defs>
          {[
            ["ah-ink", "#2F4D6B"],
            ["ah-gray", "#6B6F76"],
            ["ah-pink", "#E46F8C"],
            ["ah-blue", "#3C7DB5"],
            ["ah-mask", "#C23FC9"],
            ["ah-flow", "#4F46E5"],
            ["ah-slate", "#46698A"],
          ].map(([id, fill]) => (
            <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={fill} />
            </marker>
          ))}
          <pattern id="f-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#DDE9DD" />
            <line x1="1" y1="0" x2="1" y2="6" stroke="#5F7F5F" strokeWidth="2.4" />
          </pattern>
        </defs>

        {/* ---------------------------------------------------------------- links between parts */}
        <path d="M178,470 H190 V190" className={link("pink", "prompt")} />
        {[190, 276, 362].map((y) => (
          <path key={y} d={`M190,${y} H203`} className={link("pink", "prompt")} markerEnd="url(#ah-pink)" />
        ))}
        <path d="M286,182 H298 V84 H307" className={link("pink", "prompt", "fusion")} markerEnd="url(#ah-pink)" />
        <path d="M292,470 H298 V272 H307" className={link("pink", "vision", "fusion")} markerEnd="url(#ah-pink)" />
        <path d="M608,466 H630 V84 H669" className={link("pink", "head")} markerEnd="url(#ah-pink)" />
        <path d="M672,98 H650 V366 H659" className={link("blue", "world")} markerEnd="url(#ah-blue)" />
        <path d="M660,247 H644 V426 H659" className={link("blue", "world")} markerEnd="url(#ah-blue)" />
        {isMask ? <path d="M236,378 V416" className={link("mask-route", "prompt", "vision")} markerEnd="url(#ah-mask)" /> : null}

        <text x={146} y={27} textAnchor="middle" className="f-title">
          a. Input Encoding
        </text>

        {/* ---------------------------------------------------------------- (a) prompt rows */}
        <g className={`f-stage${stateOf("prompt")}`} data-stage="prompt">
          <rect x={6} y={42} width={280} height={362} rx={10} className="f-dash" />
          {ROWS.map((row) => {
            const selected = row.id === modality;
            return (
              <g key={row.id} className={`${MODALITY_CLASS[row.id]}${selected ? " f-row-sel" : ""}`}>
                <rect x={16} y={row.y} width={260} height={78} rx={10} className="f-row" />
                {row.label.map((line, i) => (
                  <Label key={line} x={52} y={row.y + (row.label.length === 1 ? 44 : 36 + i * 17)} className="f-row-t">
                    {line}
                  </Label>
                ))}
                {row.id === "text" ? (
                  <>
                    <rect x={90} y={row.y + 10} width={84} height={58} rx={3} className="f-quote" />
                    {["“follow the", "man wearing", "black shirt", "and shorts”"].map((line, i) => (
                      <Label key={line} x={132} y={row.y + 23 + i * 12} className="f-quote-t">
                        {line}
                      </Label>
                    ))}
                  </>
                ) : (
                  <>
                    <image href={image(row.id)} x={90} y={row.y + 10} width={84} height={58} preserveAspectRatio="xMidYMid slice" />
                    <rect x={90} y={row.y + 10} width={84} height={58} className="f-frame" />
                  </>
                )}
                <path d={`M178,${row.y + 39} H203`} className="f-arr" markerEnd="url(#ah-ink)" />
                <Encoder x={206} y={row.y + 11} w={60} h={56} lines={[row.encoder, "Encoder"]} />
              </g>
            );
          })}
        </g>

        {/* ---------------------------------------------------------------- (a) visual stream + memory */}
        <g className={`f-stage${stateOf("vision")}`} data-stage="vision">
          <rect x={6} y={420} width={90} height={134} rx={10} className="f-box" />
          <image href={image("text")} x={16} y={430} width={70} height={52} preserveAspectRatio="xMidYMid slice" />
          <rect x={16} y={430} width={70} height={52} className="f-frame" />
          <Label x={51} y={507} className="f-sm-b">
            Visual
          </Label>
          <Label x={51} y={522} className="f-sm-b">
            Observation
          </Label>
          <Label x={51} y={541} className="f-tiny">
            3 views · 512²
          </Label>
          <path d="M98,487 H113" className="f-arr" markerEnd="url(#ah-ink)" />
          <Encoder x={116} y={426} w={60} h={122} lines={["Vision", "Encoder"]} />
          <path d="M178,487 H195" className="f-arr" markerEnd="url(#ah-ink)" />
          <rect x={198} y={420} width={94} height={134} rx={10} className="f-box" />
          {[0, 1, 2, 3].map((k) => (
            <g key={k}>
              <image
                href={siteContent.heroReel[k % siteContent.heroReel.length].poster}
                x={206 + k * 8}
                y={432 + k * 6}
                width={52}
                height={38}
                preserveAspectRatio="xMidYMid slice"
              />
              <rect x={206 + k * 8} y={432 + k * 6} width={52} height={38} className={k === 3 && isMask ? "f-frame f-anchor" : "f-frame"} />
            </g>
          ))}
          <Label x={245} y={509} className="f-sm-b">
            Memory
          </Label>
          <Label x={245} y={524} className="f-sm-b">
            Attention
          </Label>
          {isMask ? (
            <Label x={245} y={542} className="f-mask-t">
              + mask anchor
            </Label>
          ) : (
            <Label x={245} y={542} className="f-tiny">
              16 frames
            </Label>
          )}
        </g>

        {/* ---------------------------------------------------------------- (b) vision-prompt alignment */}
        <g className={`f-stage${stateOf("fusion")}`} data-stage="fusion">
          <text x={459} y={27} textAnchor="middle" className="f-title">
            b. Vision-Prompt Alignment
          </text>

          <rect x={310} y={42} width={142} height={70} rx={8} className="f-card f-card-warm" />
          <Label x={381} y={63}>Prompt Tokens</Label>
          {hasPrompt ? (
            <Count x={448} y={42}>{`×${PROMPT_TOKENS[modality]}`}</Count>
          ) : null}
          <rect x={322} y={74} width={118} height={28} rx={8} className="f-dash-warm" />
          <PromptTokens modality={modality} />

          <rect x={466} y={42} width={142} height={70} rx={8} className="f-card f-card-cool" />
          <Label x={537} y={63}>Learnable Queries</Label>
          <Count x={604} y={42}>×10</Count>
          <rect x={478} y={74} width={118} height={28} rx={8} className="f-dash-cool" />
          <TokenRow items={["q", "q", "…", "q"]} x={490} y={79} size={18} step={28} />

          <path d="M381,112 V125" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />
          <path d="M537,112 V125" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />

          <rect x={310} y={128} width={298} height={84} rx={8} className="f-sub" />
          <Label x={459} y={147} className="f-sub-t">
            1) Self-Attention on Prompt+Query Tokens
          </Label>
          {[
            [330, 420],
            [360, 500],
            [420, 530],
            [500, 590],
          ].map(([a, b]) => (
            <path
              key={`${a}-${b}`}
              d={`M${a},168 Q${(a + b) / 2},${168 - Math.min(24, (b - a) * 0.25)} ${b},168`}
              className="f-attn"
              markerEnd="url(#ah-gray)"
            />
          ))}
          <UTokens y={170} hasPrompt={hasPrompt} />
          {hasPrompt ? (
            <Label x={375} y={204} className="f-tiny">
              Y · {PROMPT_TOKENS[modality]}
            </Label>
          ) : (
            <Label x={375} y={186} className="f-mask-t">
              (prompt in memory)
            </Label>
          )}
          <Label x={545} y={204} className="f-tiny">
            q · 10
          </Label>

          <path d="M459,212 V225" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />

          <rect x={310} y={228} width={298} height={174} rx={8} className="f-sub f-sub-warm" />
          <Label x={459} y={247} className="f-sub-t">
            2) Hybrid Attention Fusion
          </Label>
          <TokenRow items={["v", "v", "…", "v", "v", "v", "v"]} x={320} y={262} />
          <Count x={604} y={228}>Z · 1024</Count>
          {[0, 1, 3, 4, 5, 6].map((i) => (
            <path key={i} d={`M${330 + i * 40},290 V316`} className="f-attn" markerStart="url(#ah-gray)" markerEnd="url(#ah-gray)" />
          ))}
          <UTokens y={322} hasPrompt={hasPrompt} />
          <rect x={320} y={356} width={278} height={26} rx={4} className="f-legend" />
          <rect x={330} y={363} width={12} height={12} rx={2.5} className="tk tk-p" />
          <text x={348} y={373} className="f-legend-t">
            Prompt tokens
          </text>
          <rect x={432} y={363} width={12} height={12} rx={2.5} className="tk tk-q" />
          <text x={450} y={373} className="f-legend-t">
            Queries
          </text>
          <rect x={512} y={363} width={12} height={12} rx={2.5} className="tk tk-v" />
          <text x={530} y={373} className="f-legend-t">
            Visual tokens
          </text>

          <path d="M459,402 V415" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />

          <rect x={310} y={418} width={298} height={82} rx={8} className="f-sub" />
          <Label x={459} y={437} className="f-sub-t f-sub-t-sm">
            3) Sparse Prompt-Conditioned Representations
          </Label>
          <TokenRow items={["q", "q", "q", "q", "…", "q", "q"]} x={320} y={452} />
          <Label x={459} y={492} className="f-tiny">
            Q · 10 tokens per view
          </Label>
        </g>

        {/* ---------------------------------------------------------------- (c) waypoint prediction head */}
        <g className={`f-stage${stateOf("head")}`} data-stage="head">
          <text x={827} y={27} textAnchor="middle" className="f-title">
            c. Waypoint Prediction Head
          </text>

          <rect x={660} y={42} width={198} height={70} rx={8} className="f-card f-card-cool" />
          <Label x={759} y={63}>Sparse Representations</Label>
          <rect x={672} y={74} width={174} height={28} rx={8} className="f-dash-cool" />
          <TokenRow items={["q", "q", "q", "…", "q"]} x={684} y={79} size={18} step={32} />

          <rect x={870} y={42} width={124} height={70} rx={8} className="f-card f-card-green" />
          <Label x={932} y={63} className="f-lb f-green-t">
            Visibility Query
          </Label>
          <rect x={922} y={79} width={20} height={20} rx={4} className="tk tk-g" />

          <path d="M759,112 V125" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />
          <path d="M932,112 V125" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />
          <rect x={660} y={128} width={334} height={26} rx={6} className="f-plain" />
          <Label x={827} y={146}>Transformer Decoder</Label>
          <path d="M759,154 V165" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />
          <path d="M932,154 V165" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />

          <rect x={660} y={168} width={198} height={26} rx={6} className="f-card f-card-blue" />
          <Label x={759} y={186} className="f-lb f-ink-t">
            Waypoint Decoder
          </Label>
          <rect x={870} y={168} width={124} height={26} rx={6} className="f-card f-card-green" />
          <Label x={932} y={186} className="f-lb f-green-t">
            MLP
          </Label>
          <path d="M759,194 V205" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />
          <path d="M932,194 V205" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />

          <rect x={660} y={208} width={198} height={78} rx={8} className="f-box" />
          <path d={smoothPath(WAYPOINTS)} className="f-curve" />
          {WAYPOINTS.map(([cx, cy]) => (
            <circle key={cx} cx={cx} cy={cy} r={2.6} className="f-dot" />
          ))}
          <circle cx={680} cy={236} r={4} className="f-bot" />
          <rect x={675} y={242} width={10} height={14} rx={3} className="f-bot" />
          <circle cx={844} cy={224} r={4} className="f-human" />
          <rect x={840} y={230} width={8} height={15} rx={3} className="f-human" />
          <Label x={759} y={279}>Trajectory</Label>

          <rect x={870} y={208} width={124} height={78} rx={8} className="f-box f-box-green" />
          <line x1={888} y1={252} x2={976} y2={252} className="f-axis" />
          <rect x={904} y={240} width={16} height={12} className="f-bar" />
          <rect x={942} y={222} width={16} height={30} className="f-bar" />
          <Label x={912} y={263} className="f-tick">
            0
          </Label>
          <Label x={950} y={263} className="f-tick">
            1
          </Label>
          <Label x={932} y={279} className="f-lb f-green-t">
            Visibility
          </Label>
        </g>

        {/* ---------------------------------------------------------------- (d) action-conditioned world model */}
        <g className={`f-stage${stateOf("world")}`} data-stage="world">
          <text x={827} y={317} textAnchor="middle" className="f-title f-title-sm">
            d. Action-Conditioned World Model
          </text>

          <Label x={708} y={343} className="f-sm-b">
            Current State
          </Label>
          <rect x={662} y={350} width={92} height={32} rx={7} className="f-dash-cool f-fill-cool" />
          <TokenRow items={["q", "q", "…", "q"]} x={670} y={358} size={16} step={22} />
          <Label x={708} y={403} className="f-sm-b">
            Trajectory
          </Label>
          <rect x={662} y={410} width={92} height={32} rx={7} className="f-dash-cool f-fill-cool" />
          <path d="M674,432 C688,418 698,428 710,430 S734,418 746,418" className="f-curve f-curve-sm" />
          {[
            [688, 424],
            [710, 430],
            [730, 424],
          ].map(([cx, cy]) => (
            <circle key={cx} cx={cx} cy={cy} r={2.6} className="f-dot" />
          ))}

          <path d="M756,366 H765" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />
          <path d="M756,426 H765" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />
          <rect x={768} y={352} width={68} height={90} rx={8} className="f-box" />
          <g className="f-net">
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <g key={deg}>
                  <line x1={802} y1={372} x2={802 + Math.cos(rad) * 9} y2={372 + Math.sin(rad) * 9} />
                  <circle cx={802 + Math.cos(rad) * 9} cy={372 + Math.sin(rad) * 9} r={2} />
                </g>
              );
            })}
            <circle cx={802} cy={372} r={3} />
          </g>
          {["Action", "Fusion", "MLP"].map((line, i) => (
            <Label key={line} x={802} y={399 + i * 14} className="f-enc-t">
              {line}
            </Label>
          ))}
          <path d="M838,366 H845" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />

          <Label x={921} y={343} className="f-sm-b">
            Action-Conditioned State
          </Label>
          <rect x={848} y={350} width={146} height={32} rx={7} className="f-dash-warm f-fill-warm" />
          <TokenRow items={["s", "s", "…", "s", "s"]} x={860} y={358} size={16} step={26} />
          <path d="M921,382 V391" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />
          <rect x={848} y={394} width={146} height={24} rx={6} className="f-plain" />
          <Label x={921} y={410.5} className="f-sm-b">
            Latent World Model
          </Label>
          <path d="M921,418 V429" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />
          <Label x={921} y={443} className="f-sm-b">
            Predicted Next State
          </Label>
          <rect x={848} y={449} width={146} height={30} rx={7} className="f-dash-warm f-fill-warm" />
          <TokenRow items={["s", "s", "…", "s", "s"]} x={860} y={456} size={16} step={26} />
          <path d="M921,479 V509" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />

          <rect x={662} y={490} width={184} height={72} rx={8} className="f-box f-box-green" />
          <text x={674} y={507} className="f-sm-b f-green-t">
            Future State Encoding
          </text>
          <image href={siteContent.heroReel[0].poster} x={672} y={518} width={40} height={30} preserveAspectRatio="xMidYMid slice" />
          <rect x={672} y={518} width={40} height={30} className="f-frame" />
          <path d="M714,533 H721" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />
          <rect x={724} y={518} width={42} height={30} rx={4} className="f-plain f-plain-gray" />
          <Label x={745} y={530} className="f-tiny-b">
            EMA
          </Label>
          <Label x={745} y={542} className="f-tiny-b">
            Encoder
          </Label>
          <path d="M768,533 H775" className="f-arr f-arr-gray" markerEnd="url(#ah-gray)" />
          <rect x={778} y={521} width={60} height={24} rx={6} className="f-dash-cool f-fill-cool" />
          <TokenRow items={["v", "v", "v"]} x={784} y={527} size={12} step={17} />
          <Label x={808} y={557} className="f-tiny">
            target next state
          </Label>

          <rect x={858} y={512} width={136} height={36} rx={6} className="f-box" />
          <Label x={926} y={527} className="f-enc-t">
            Latent Alignment
          </Label>
          <Label x={926} y={541} className="f-enc-t">
            Loss
          </Label>
          <path d="M840,533 H855" className="f-arr f-arr-gray f-sg" markerEnd="url(#ah-gray)" />
          <circle cx={848} cy={533} r={3.6} className="f-sg-dot" />
        </g>

        {/* ---------------------------------------------------------------- tokens in motion */}
        <g className="fl" aria-hidden="true">
          {phase ? <PhaseLayer key={`${cycle}-${index}`} phase={phase} modality={modality} /> : null}
        </g>
      </svg>
      <FlowLedger
        phases={phases}
        index={index}
        animated={animated}
        paused={paused}
        onToggle={() => setPaused((p) => !p)}
        onRestart={() => {
          setPaused(false);
          setRestarts((n) => n + 1);
        }}
      />
    </>
  );
}
