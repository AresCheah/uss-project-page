import { siteContent, type MethodStep, type ModalityId } from "@/content/siteContent";

type StageId = MethodStep["id"];

const ORDER: StageId[] = ["prompt", "vision", "fusion", "head", "world"];

/** Prompt tokens drawn per modality: [CLS] + nouns, 4 and 9 RoIAlign tokens; a mask enters through memory. */
const PROMPT_TOKENS: Record<ModalityId, number> = { text: 5, point: 4, box: 9, mask: 0 };

const MODALITY_CLASS: Record<ModalityId, string> = {
  text: "m-text",
  point: "m-point",
  box: "m-box",
  mask: "m-mask",
};

function tokens(n: number, x: number, y: number, size: number, step: number, className: string) {
  return Array.from({ length: n }, (_, i) => (
    <rect key={i} x={x + i * step} y={y} width={size} height={size} rx={2.5} className={className} />
  ));
}

function grid(cols: number, rows: number, x: number, y: number, size: number, step: number, className: string) {
  const cells = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      cells.push(<rect key={`${r}-${c}`} x={x + c * step} y={y + r * step} width={size} height={size} rx={2.5} className={className} />);
    }
  }
  return cells;
}

function Header({ n, title }: { n: number; title: string }) {
  return (
    <>
      <rect x={0} y={0} width={22} height={22} rx={6} className="dg-badge" />
      <text x={11} y={15.5} textAnchor="middle" className="dg-bn">
        {n}
      </text>
      <text x={32} y={16} className="dg-hd">
        {title}
      </text>
    </>
  );
}

/**
 * A schematic of the USS architecture (the paper's Figure 2), drawn so each
 * part can be dimmed or lit as the reader moves through the method steps.
 * `active` is null when nothing is being followed, which draws every stage at
 * full strength.
 */
export default function MethodDiagram({ active, modality }: { active: StageId | null; modality: ModalityId }) {
  const reached = active ? ORDER.indexOf(active) : -1;
  const stageClass = (id: StageId) => {
    if (!active) return "dg-stage";
    const index = ORDER.indexOf(id);
    if (index === reached) return "dg-stage is-on";
    return index < reached ? "dg-stage is-past" : "dg-stage is-idle";
  };
  const flowing = (...ids: StageId[]) => (active && ids.includes(active) ? "dg-link is-flow" : "dg-link");

  const nPrompt = PROMPT_TOKENS[modality];
  const isMask = modality === "mask";
  const current = siteContent.promptModalities.find((item) => item.id === modality)!;
  const promptStart = 162 - (nPrompt * 16 - 4) / 2;

  return (
    <svg
      className="dg"
      viewBox="0 0 640 700"
      role="img"
      aria-label="Schematic of the USS architecture: prompt encoding, visual encoding with memory, vision-prompt fusion, the waypoint head, and the training-only world model."
      data-active={active ?? "all"}
      data-modality={modality}
    >
      <defs>
        <marker id="dg-ah" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--heading)" />
        </marker>
        <marker id="dg-ah-mut" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--axis)" />
        </marker>
        <marker id="dg-ah-blue" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--blue)" />
        </marker>
        <marker id="dg-ah-teal" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--teal)" />
        </marker>
        <marker id="dg-ah-purple" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--purple)" />
        </marker>
        <clipPath id="dg-cam">
          <rect x={344} y={74} width={56} height={40} rx={4} />
        </clipPath>
      </defs>

      {/* links between stages, drawn first so the panels sit on top */}
      <path d="M162,206 C162,240 120,246 120,276" className={flowing("prompt", "fusion")} markerEnd="url(#dg-ah-mut)" />
      <path d="M528,206 V278" className={flowing("vision", "fusion")} markerEnd="url(#dg-ah-mut)" />
      <path d="M92,402 V480" className={flowing("fusion", "head")} markerEnd="url(#dg-ah-mut)" />
      <path d="M244,512 C244,600 191,596 191,636" className={`${flowing("head", "world")} dg-dash`} markerEnd="url(#dg-ah-mut)" />

      {/* 1 · prompt encoding */}
      <g className={stageClass("prompt")} data-stage="prompt">
        <rect x={12} y={12} width={300} height={196} rx={16} className="dg-frame" />
        <g transform="translate(26 26)">
          <Header n={1} title="PROMPT" />
        </g>
        <text x={298} y={42} textAnchor="end" className="dg-note">
          once, at t = 1
        </text>
        {siteContent.promptModalities.map((item, i) => {
          const x = 28 + i * 68;
          const selected = item.id === modality;
          return (
            <g key={item.id} className={MODALITY_CLASS[item.id]}>
              <path
                d={`M${x + 30},88 C${x + 30},104 162,100 162,114`}
                className={`dg-feed${selected ? " is-sel" : ""}`}
              />
              <g className={`dg-chip${selected ? " is-sel" : ""}`}>
                <rect x={x} y={60} width={60} height={28} rx={8} />
                <text x={x + 30} y={78.5} textAnchor="middle">
                  {item.label}
                </text>
              </g>
            </g>
          );
        })}
        <rect x={82} y={116} width={160} height={30} rx={8} className="dg-box" />
        <text x={162} y={135.5} textAnchor="middle" className="dg-lb">
          Prompt encoder
        </text>
        {isMask ? (
          <>
            <path d="M242,131 C292,131 300,165 340,165 H492" className="dg-mask-route" markerEnd="url(#dg-ah-purple)" />
            <text x={162} y={177} textAnchor="middle" className="dg-anchor-t">
              dense prior → memory
            </text>
          </>
        ) : (
          tokens(nPrompt, promptStart, 164, 12, 16, "dg-tok-y")
        )}
        <text x={162} y={198} textAnchor="middle" className="dg-sm">
          Y · {current.short}
        </text>
      </g>

      {/* 2 · visual encoding with temporal memory */}
      <g className={stageClass("vision")} data-stage="vision">
        <rect x={328} y={12} width={300} height={196} rx={16} className="dg-frame" />
        <g transform="translate(342 26)">
          <Header n={2} title="VISION + MEMORY" />
        </g>
        <text x={614} y={42} textAnchor="end" className="dg-note">
          per view
        </text>
        <rect x={352} y={64} width={56} height={40} rx={4} className="dg-frames" />
        <rect x={348} y={69} width={56} height={40} rx={4} className="dg-frames" />
        <image
          href={siteContent.promptModalities[0].image}
          x={344}
          y={74}
          width={56}
          height={40}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#dg-cam)"
        />
        <rect x={344} y={74} width={56} height={40} rx={4} fill="none" className="dg-frames" />
        <text x={374} y={130} textAnchor="middle" className="dg-sm">
          RGB · 3 views
        </text>
        <path d="M404,92 H410" className="dg-arr" markerEnd="url(#dg-ah)" />
        <path d="M413,62 L487,73 L487,111 L413,122 Z" className="dg-box" />
        <text x={450} y={95} textAnchor="middle" className="dg-mono">
          PE-Spatial
        </text>
        <path d="M488,92 H497" className="dg-arr" markerEnd="url(#dg-ah)" />
        {grid(4, 3, 500, 70, 11, 15, "dg-tok-v")}
        <text x={528} y={128} textAnchor="middle" className="dg-sm">
          V_t · patch tokens
        </text>
        {[3, 2, 1].map((k) => (
          <rect key={k} x={500 + k * 4} y={150 - k * 4} width={56} height={30} rx={4} className="dg-frames" />
        ))}
        <rect x={500} y={150} width={56} height={30} rx={4} className="dg-soft" />
        {isMask ? (
          <>
            <rect x={504} y={154} width={48} height={22} rx={4} className="dg-anchor" />
            <text x={528} y={168.5} textAnchor="middle" className="dg-anchor-t">
              anchor
            </text>
          </>
        ) : (
          <text x={528} y={169} textAnchor="middle" className="dg-mono">
            16 frames
          </text>
        )}
        <path d="M584,165 C604,165 604,90 568,90" className="dg-thin" markerEnd="url(#dg-ah-mut)" />
        <text x={612} y={132} textAnchor="end" className="dg-sm" transform="rotate(-90 612 132)">
          attend
        </text>
        <text x={528} y={198} textAnchor="middle" className="dg-sm">
          sliding memory bank
        </text>
      </g>

      {/* 3 · vision-prompt fusion */}
      <g className={stageClass("fusion")} data-stage="fusion">
        <rect x={12} y={232} width={616} height={178} rx={16} className="dg-frame" />
        <g transform="translate(26 246)">
          <Header n={3} title="VISION-PROMPT FUSION" />
        </g>
        <text x={614} y={262} textAnchor="end" className="dg-note">
          read · write · read
        </text>
        <rect x={22} y={280} width={198} height={56} rx={10} className="dg-soft dg-dash" />
        <text x={212} y={293} textAnchor="end" className="dg-sm">
          self-attn
        </text>
        {tokens(10, 30, 288, 10, 13, "dg-tok-q")}
        <text x={30} y={326} className="dg-sm">
          q ×10
        </text>
        {isMask ? (
          <text x={72} y={326} className="dg-anchor-t">
            mask enters via memory
          </text>
        ) : (
          tokens(nPrompt, 72, 316, 10, 13, "dg-tok-y")
        )}

        <path d="M436,288 H232" className="dg-arr dg-read" markerEnd="url(#dg-ah-blue)" />
        <text x={334} y={283} textAnchor="middle" className="dg-sm">
          ① read
        </text>
        <path d="M232,308 H436" className="dg-arr dg-write" markerEnd="url(#dg-ah-teal)" />
        <text x={334} y={303} textAnchor="middle" className="dg-sm">
          ② write back
        </text>
        <path d="M436,328 H232" className="dg-arr dg-read" markerEnd="url(#dg-ah-blue)" />
        <text x={334} y={323} textAnchor="middle" className="dg-sm">
          ③ read
        </text>

        {grid(9, 4, 452, 280, 12, 16, "dg-tok-v")}
        <rect x={497} y={293} width={38} height={50} rx={5} className="dg-focus" />
        <text x={522} y={360} textAnchor="middle" className="dg-sm">
          Z · fused visual tokens
        </text>

        <path d="M92,338 V364" className="dg-arr" markerEnd="url(#dg-ah)" />
        {tokens(10, 30, 372, 10, 13, "dg-tok-qs")}
        <text x={166} y={381} className="dg-lb">
          Q
        </text>
        <text x={180} y={381} className="dg-sm">
          sparse prompt-conditioned state, 10 tokens per view
        </text>
      </g>

      {/* 4 · waypoint prediction head */}
      <g className={stageClass("head")} data-stage="head">
        <rect x={12} y={434} width={616} height={122} rx={16} className="dg-frame" />
        <g transform="translate(26 448)">
          <Header n={4} title="WAYPOINT HEAD" />
        </g>
        <text x={614} y={464} textAnchor="end" className="dg-note">
          execute ŵ₁, then re-plan
        </text>
        <rect x={28} y={482} width={128} height={30} rx={8} className="dg-box" />
        <text x={92} y={501.5} textAnchor="middle" className="dg-lb">
          Shared decoder
        </text>
        <path d="M156,497 H176" className="dg-arr" markerEnd="url(#dg-ah)" />
        <rect x={180} y={482} width={128} height={30} rx={8} className="dg-box" />
        <text x={244} y={501.5} textAnchor="middle" className="dg-lb">
          Waypoint decoder
        </text>
        <path d="M308,497 H330" className="dg-arr" markerEnd="url(#dg-ah)" />

        {[18, 6, 13].map((h, i) => (
          <rect key={i} x={36 + i * 12} y={546 - h} width={8} height={h} rx={2} className="dg-vis" />
        ))}
        <text x={76} y={544} className="dg-sm">
          presence per view
        </text>

        <path d="M348,532 C400,530 430,508 470,504 S560,486 590,486" className="dg-traj" />
        {[
          [348, 532],
          [372, 529],
          [396, 523],
          [420, 515],
          [444, 508],
          [468, 504],
          [492, 501],
          [516, 497],
          [540, 492],
          [562, 489],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i === 0 ? 5.5 : 3.6} className={i === 0 ? "dg-wp1" : "dg-wp"} />
        ))}
        <text x={348} y={550} textAnchor="middle" className="dg-sm">
          ŵ₁
        </text>
        <text x={470} y={530} className="dg-sm">
          10 egocentric waypoints
        </text>
        <circle cx={600} cy={474} r={5} className="dg-person" />
        <rect x={595.5} y={481} width={9} height={18} rx={4} className="dg-person" />
      </g>

      {/* 5 · action-conditioned world model (training only) */}
      <g className={`${stageClass("world")} dg-world`} data-stage="world">
        <rect x={12} y={580} width={616} height={108} rx={16} className="dg-frame" />
        <g transform="translate(26 594)">
          <Header n={5} title="WORLD MODEL" />
        </g>
        <rect x={164} y={597} width={86} height={20} rx={10} className="dg-pill" />
        <text x={207} y={611} textAnchor="middle" className="dg-pill-t">
          training only
        </text>
        <text x={614} y={610} textAnchor="end" className="dg-note">
          removed at inference
        </text>

        <text x={28} y={650} className="dg-mono">
          Sₜ
        </text>
        {tokens(4, 46, 641, 9, 12, "dg-tok-qs")}
        <text x={28} y={674} className="dg-mono">
          a = vec(Ŵₜ)
        </text>
        <path d="M100,646 C112,646 112,655 124,655" className="dg-thin" markerEnd="url(#dg-ah-mut)" />
        <path d="M108,670 C116,670 116,658 124,658" className="dg-thin" />
        <rect x={128} y={640} width={126} height={30} rx={8} className="dg-box" />
        <text x={191} y={659.5} textAnchor="middle" className="dg-lb">
          Action-fusion MLP
        </text>
        <path d="M254,655 H270" className="dg-arr" markerEnd="url(#dg-ah)" />
        <rect x={274} y={640} width={112} height={30} rx={8} className="dg-box" />
        <text x={330} y={659.5} textAnchor="middle" className="dg-lb">
          Latent predictor
        </text>
        <path d="M386,655 H402" className="dg-arr" markerEnd="url(#dg-ah)" />
        <text x={438} y={636} textAnchor="middle" className="dg-sm">
          Ŝₜ₊₁
        </text>
        {tokens(5, 406, 650, 10, 13, "dg-tok-t")}
        <text x={503} y={659} textAnchor="middle" className="dg-mono">
          ↔ SmoothL1
        </text>
        <text x={578} y={636} textAnchor="middle" className="dg-sm">
          EMA target · sg
        </text>
        {tokens(5, 546, 650, 10, 13, "dg-tok-e")}
      </g>
    </svg>
  );
}
