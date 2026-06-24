import { useEffect, useRef, useState, type CSSProperties, type PropsWithChildren } from "react";

type AnimatedSectionProps = PropsWithChildren<{
  id?: string;
  className?: string;
  delayMs?: number;
}>;

export default function AnimatedSection({
  id,
  className,
  delayMs = 0,
  children,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`reveal-section ${visible ? "is-visible" : ""} ${className ?? ""}`}
      style={{ transitionDelay: `${delayMs}ms` } as CSSProperties}
    >
      {children}
    </section>
  );
}
