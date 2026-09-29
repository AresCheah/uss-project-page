import "@testing-library/jest-dom";

// jsdom implements neither of these, and the page leans on both: sections
// reveal themselves via IntersectionObserver and the walkthrough scrolls the
// step you click into view.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(private readonly callback: IntersectionObserverCallback) {}

  // Report every observed node as visible so content that is gated behind an
  // entrance animation is actually asserted against.
  observe(target: Element): void {
    this.callback(
      [{ isIntersecting: true, intersectionRatio: 1, target } as IntersectionObserverEntry],
      this,
    );
  }

  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;

window.scrollTo = (() => {}) as typeof window.scrollTo;
