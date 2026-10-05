import { useEffect, useState } from "react";
import { HOLD_MS, PHASE_MS, type Phase } from "./flowScript";

/**
 * Steps through a list of phases, holds briefly once all have played, then
 * loops. `index === phases.length` is the hold. `cycle` changes on every pass
 * so the layer for a phase remounts and its animations restart.
 */
export function useFlowTimeline(phases: Phase[], playing: boolean, resetKey: string) {
  const [state, setState] = useState({ index: 0, cycle: 0, key: resetKey });

  // A new step or prompt type starts from its first phase.
  if (state.key !== resetKey) setState({ index: 0, cycle: state.cycle + 1, key: resetKey });

  useEffect(() => {
    if (!playing || phases.length === 0) return;
    const holding = state.index >= phases.length;
    const wait = holding ? HOLD_MS : (phases[state.index].dur ?? PHASE_MS);
    const timer = window.setTimeout(() => {
      setState((s) =>
        s.index >= phases.length ? { ...s, index: 0, cycle: s.cycle + 1 } : { ...s, index: s.index + 1 },
      );
    }, wait);
    return () => window.clearTimeout(timer);
  }, [playing, phases, state.index, state.cycle]);

  return { index: state.key === resetKey ? state.index : 0, cycle: state.cycle };
}

export function usePrefersReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.(query).matches);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const update = () => setReduced(mq.matches);
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}
