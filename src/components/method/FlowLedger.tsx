import { Pause, Play, RotateCcw } from "lucide-react";
import type { Phase } from "./flowScript";

/**
 * The written token flow under the figure: one chip per phase, the phase that
 * is moving now highlighted, and its route and payload spelled out.
 */
export default function FlowLedger({
  phases,
  index,
  animated,
  paused,
  onToggle,
  onRestart,
}: {
  phases: Phase[];
  index: number;
  animated: boolean;
  paused: boolean;
  onToggle: () => void;
  onRestart: () => void;
}) {
  if (phases.length === 0) {
    return (
      <div className="fl-ledger is-empty">
        <p className="fl-now">
          Token flow: prompt → <b>9 / 4 prompt tokens</b> · frame → <b>1024 patch tokens</b> per view · fusion →{" "}
          <b>10 queries</b> per view · head → <b>10 waypoints</b> + visibility. Scroll to a step to watch it move.
        </p>
      </div>
    );
  }

  const holding = index >= phases.length;
  const current = holding ? null : phases[index];

  return (
    <div className="fl-ledger">
      <div className="fl-row">
        <ol className="fl-steps" aria-label="Token flow of this step">
          {phases.map((phase, i) => (
            <li
              key={phase.id}
              className={!animated ? "is-static" : i === index ? "is-now" : i < index ? "is-done" : undefined}
              aria-current={animated && i === index ? "step" : undefined}
            >
              <span className="fl-i">{i + 1}</span>
              {phase.short}
            </li>
          ))}
        </ol>
        {animated ? (
          <span className="fl-ctl">
            <button type="button" onClick={onRestart} aria-label="Replay this step">
              <RotateCcw size={14} aria-hidden="true" />
            </button>
            <button type="button" onClick={onToggle} aria-label={paused ? "Play the token flow" : "Pause the token flow"}>
              {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
            </button>
          </span>
        ) : null}
      </div>
      {animated ? (
        <p className="fl-now" aria-hidden="true">
          {current ? (
            <>
              <b>{current.route}</b>
              <span className="fl-sep" aria-hidden="true">
                ·
              </span>
              {current.detail}
            </>
          ) : (
            <span className="fl-muted">All tokens delivered. Replaying…</span>
          )}
        </p>
      ) : null}
      {/* The full written flow: visible when the figure does not move, and always available to screen readers. */}
      <ol className={animated ? "fl-list fl-sr" : "fl-list"}>
        {phases.map((phase) => (
          <li key={phase.id}>
            <b>{phase.route}</b> · {phase.detail}
          </li>
        ))}
      </ol>
    </div>
  );
}
