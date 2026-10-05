import { useEffect, useRef } from "react";
import type { ModalityId } from "@/content/siteContent";
import { NODES, WAYPOINTS, smoothPath, travelOf, type Cargo, type Effect, type Packet, type Phase, type TokenKind } from "./flowScript";

const TOKEN_FILL: Record<Exclude<TokenKind, "m">, string> = {
  p: "#F0B074",
  q: "#79BDE8",
  v: "#46698A",
  s: "#B27C3E",
  g: "#8DB38D",
  w: "#2F4D6B",
};
const CHIP_STROKE: Record<TokenKind, string> = {
  p: "#D2934F",
  q: "#3C7DB5",
  v: "#46698A",
  s: "#B27C3E",
  g: "#5F7F5F",
  w: "#2F4D6B",
  m: "#4F46E5",
};
const MODALITY_COLOR: Record<ModalityId, string> = { text: "#E8712A", point: "#1D9BD7", box: "#4F46E5", mask: "#C23FC9" };

const SIZE = 7;
const GAP = 2;
const STILL = /^M\s*-?[\d.]+\s*,\s*-?[\d.]+\s*$/;

/** Width and height of a packet's tokens, so its caption can sit beside them. */
function cargoBox(cargo: Cargo): [number, number] {
  if ("none" in cargo) return [0, 0];
  if ("frame" in cargo) return [26, 19];
  if (cargo.kind === "m") return [14, 12];
  const shown = Math.min(cargo.show ?? cargo.count, 10);
  const pitch = cargo.kind === "w" ? 8 : SIZE + GAP;
  return [shown * pitch - GAP, SIZE];
}

function CargoView({ cargo, modality }: { cargo: Cargo; modality: ModalityId }) {
  if ("none" in cargo) return null;
  if ("frame" in cargo) {
    return (
      <g>
        <rect x={-13} y={-9.5} width={26} height={19} rx={2} fill="#DCE5EE" stroke="#46698A" strokeWidth={1.2} />
        <path d="M-10,6 L-3,-1 L2,3 L6,-2 L11,6 Z" fill="#7F9BB6" />
        <circle cx={6} cy={-4.5} r={2.2} fill="#F6CFA4" />
      </g>
    );
  }
  if (cargo.kind === "m") {
    const c = MODALITY_COLOR[modality];
    if (modality === "point") return <circle r={4.5} fill={c} stroke="#FFFFFF" strokeWidth={1.6} />;
    if (modality === "mask") return <path d="M-6,5 C-8,-2 -3,-7 1,-6 C6,-5 8,0 5,5 Z" fill={c} opacity={0.85} />;
    return <rect x={-7} y={-6} width={14} height={12} fill="none" stroke={c} strokeWidth={2} />;
  }
  const shown = Math.min(cargo.show ?? cargo.count, 10);
  const [w] = cargoBox(cargo);
  const fill = TOKEN_FILL[cargo.kind];
  if (cargo.kind === "w") {
    return (
      <g>
        {Array.from({ length: shown }, (_, i) => (
          <circle key={i} cx={-w / 2 + 3 + i * 8} cy={0} r={2.8} fill={fill} />
        ))}
      </g>
    );
  }
  return (
    <g>
      {Array.from({ length: shown }, (_, i) => (
        <rect
          key={i}
          x={-w / 2 + i * (SIZE + GAP)}
          y={-SIZE / 2}
          width={SIZE}
          height={SIZE}
          rx={1.6}
          fill={fill}
          stroke="#FFFFFF"
          strokeWidth={0.6}
        />
      ))}
    </g>
  );
}

/** Captions are set in the monospace face, 0.6 em per character at 11 px. */
const chipWidth = (text: string) => Math.round(text.length * 6.6 + 16);

function Chip({ text, kind, x, y }: { text: string; kind: TokenKind; x: number; y: number }) {
  const w = chipWidth(text);
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-w / 2} y={-9} width={w} height={18} rx={9} className="fl-chip" style={{ stroke: CHIP_STROKE[kind] }} />
      <text y={3.9} textAnchor="middle" className="fl-chip-t">
        {text}
      </text>
    </g>
  );
}

function chipOffset(packet: Packet): [number, number] {
  if (!packet.chip) return [0, 0];
  const [w, h] = cargoBox(packet.cargo);
  if (w === 0) return [0, 0];
  const cw = chipWidth(packet.chip);
  switch (packet.chipAt ?? "above") {
    case "below":
      return [0, h / 2 + 14];
    case "left":
      return [-(w / 2 + cw / 2 + 6), 0];
    case "right":
      return [w / 2 + cw / 2 + 6, 0];
    default:
      return [0, -(h / 2 + 14)];
  }
}

/** Starts every SMIL animation inside `node` now, plus `delay` seconds. */
function useBegin(delay: number) {
  const ref = useRef<SVGGElement | null>(null);
  useEffect(() => {
    ref.current?.querySelectorAll("animate, animateMotion").forEach((node) => {
      const anim = node as SVGAnimationElement;
      if (typeof anim.beginElementAt === "function") anim.beginElementAt(delay);
    });
  }, [delay]);
  return ref;
}

function PacketView({ packet, travel, modality }: { packet: Packet; travel: number; modality: ModalityId }) {
  const delay = ((packet.delay ?? 0) * travel) / 1000;
  const dur = `${Math.max(travel * (1 - (packet.delay ?? 0)), 300)}ms`;
  const ref = useBegin(delay);
  const still = STILL.test(packet.path);
  const [cx, cy] = chipOffset(packet);
  const kind: TokenKind = "kind" in packet.cargo ? packet.cargo.kind : "v";
  const start = still ? packet.path.replace(/^M\s*/, "").split(",").map(Number) : null;

  return (
    <g ref={ref} opacity={0} transform={start ? `translate(${start[0]},${start[1]})` : undefined} className="fl-pk">
      <CargoView cargo={packet.cargo} modality={modality} />
      {packet.chip ? <Chip text={packet.chip} kind={kind} x={cx} y={cy} /> : null}
      {still ? null : (
        <animateMotion
          path={packet.path}
          dur={dur}
          begin="indefinite"
          fill="freeze"
          calcMode="spline"
          keyPoints="0;1"
          keyTimes="0;1"
          keySplines="0.45 0 0.25 1"
        />
      )}
      <animate
        attributeName="opacity"
        dur={dur}
        begin="indefinite"
        fill="freeze"
        values={still ? "0;1;1;0" : "0;1;1;0.0"}
        keyTimes={still ? "0;0.15;0.85;1" : "0;0.1;0.88;1"}
      />
    </g>
  );
}

const COLS = [330, 370, 450, 490, 530, 570];

function EffectView({ effect, travel }: { effect: Effect; travel: number }) {
  const style = { ["--fl-t" as string]: `${travel}ms` };
  switch (effect.kind) {
    case "arcs":
      return (
        <g className="fl-fx fl-arcs" style={style}>
          {[
            [330, 360],
            [360, 500],
            [330, 530],
            [420, 590],
            [500, 560],
          ].map(([a, b]) => (
            <path key={`${a}-${b}`} d={`M${a},168 Q${(a + b) / 2},${168 - Math.min(30, (b - a) * 0.3)} ${b},168`} markerEnd="url(#ah-flow)" />
          ))}
        </g>
      );
    case "arrows-down":
    case "arrows-up":
      return (
        <g className={`fl-fx fl-arrows ${effect.kind === "arrows-up" ? "is-up" : ""}`} style={style}>
          {COLS.map((x) => (
            <path key={x} d={effect.kind === "arrows-up" ? `M${x},318 V289` : `M${x},288 V317`} markerEnd="url(#ah-flow)" />
          ))}
        </g>
      );
    case "dense-keys":
      return (
        <g className="fl-fx fl-keys" style={style}>
          <path d="M604,272 H642 V141 H657" markerEnd="url(#ah-slate)" />
        </g>
      );
    case "waypoints": {
      const d = smoothPath(WAYPOINTS);
      return (
        <g className="fl-fx fl-wp" style={style}>
          <path d={d} pathLength={1} />
          {WAYPOINTS.map(([x, y], i) => (
            <circle key={x} cx={x} cy={y} r={4.2} style={{ animationDelay: `${120 + i * 90}ms` }} />
          ))}
          <rect x={942} y={222} width={16} height={30} className="fl-bar" />
        </g>
      );
    }
  }
}

/** One phase of the token flow: packets in motion, side effects and arrival flashes. */
export function PhaseLayer({ phase, modality }: { phase: Phase; modality: ModalityId }) {
  const travel = travelOf(phase);
  return (
    <g className="fl-phase" data-phase={phase.id}>
      {(phase.effects ?? []).map((effect) => (
        <EffectView key={effect.kind} effect={effect} travel={travel} />
      ))}
      {(phase.hit ?? []).map((id) => {
        const [x, y, w, h] = NODES[id];
        return (
          <rect
            key={id}
            x={x - 3}
            y={y - 3}
            width={w + 6}
            height={h + 6}
            rx={9}
            className="fl-hit"
            style={{ animationDelay: `${Math.round(travel * 0.85)}ms` }}
          />
        );
      })}
      {phase.packets.map((packet, i) => (
        <PacketView key={i} packet={packet} travel={travel} modality={modality} />
      ))}
    </g>
  );
}
