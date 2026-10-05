import { useEffect, useState } from "react";

/**
 * Returns the key of the last node whose top edge has scrolled above a marker
 * line at `ratio` of the viewport height, or null while none has. Reading
 * positions on scroll, rather than waiting for intersection events, keeps the
 * answer right after fast flings and anchor jumps, which can carry a node
 * past a thin trigger band between two frames. The handful of rect reads per
 * scroll event is cheap, and React skips the render when the key is unchanged.
 */
export function useScrollMarker(getNodes: () => HTMLElement[], keyOf: (node: HTMLElement) => string, ratio: number) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * ratio;
      let next: string | null = null;
      for (const node of getNodes()) {
        if (node.getBoundingClientRect().top <= line) next = keyOf(node);
      }
      setCurrent(next);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // getNodes and keyOf are read fresh on every update; the ratio fixes the line.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratio]);

  return current;
}
