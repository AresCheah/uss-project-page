import { useEffect, useRef, useState } from "react";

type Options = {
  /** Fraction of the element that must be visible before it counts as in view. */
  threshold?: number;
  /** Once true, stay true. Useful for one-shot entrance animations. */
  once?: boolean;
  rootMargin?: string;
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
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
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
