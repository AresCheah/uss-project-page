import { useScrollMarker } from "@/hooks/useScrollMarker";

/** The section whose top has passed a line a third of the way down the viewport. */
export function useActiveSection(sectionIds: string[]) {
  const active = useScrollMarker(
    () => sectionIds.map((id) => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node)),
    (node) => node.id,
    0.34,
  );
  return active ?? "";
}
