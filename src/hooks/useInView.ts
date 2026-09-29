import { useEffect, useRef, useState } from "react";

type Options = {
  /** Fraction of the element that must be visible before it counts as in view. */
  threshold?: number;
  /** Once true, stay true. Useful for one-shot entrance animations. */
  once?: boolean;
  rootMargin?: string;
  /**
   * Value to start from before the observer has reported. Autoplaying media
   * passes true so the failure mode is "it plays" rather than "it is stuck on
   * a blank first frame".
   */
  initial?: boolean;
};

/**
 * Tracks whether a node is inside the viewport. Falls back to "always visible"
 * when IntersectionObserver is unavailable (jsdom, very old browsers), so the
 * content is never hidden behind an animation that can't run.
 */
export function useInView<T extends HTMLElement>({
  threshold = 0.25,
  once = true,
  rootMargin = "0px",
  initial = false,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(initial);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // A batched callback can carry several records for the same node; the
        // last one is the current state. Reading entries[0] leaves the hook
        // stuck on a stale "not intersecting" during a fast scroll.
        const entry = entries[entries.length - 1];
        if (!entry) return;

        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView };
}
