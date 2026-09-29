import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ArchitectureWalkthrough from "./ArchitectureWalkthrough";
import { siteContent } from "@/content/siteContent";

const figure = () => document.querySelector("[data-stage]") as HTMLElement;

describe("ArchitectureWalkthrough", () => {
  it("offers every prompt modality and every pipeline stage", () => {
    render(<ArchitectureWalkthrough />);

    const tabs = within(screen.getByRole("tablist")).getAllByRole("tab");
    expect(tabs.map((tab) => tab.textContent)).toEqual(["Text", "Point", "Box", "Mask"]);

    siteContent.architectureSteps.forEach((step) => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    });
  });

  it("moves the prompt marker when a different modality is picked", async () => {
    const user = userEvent.setup();
    render(<ArchitectureWalkthrough />);

    expect(figure()).toHaveAttribute("data-modality", "box");

    await user.click(screen.getByRole("tab", { name: "Mask" }));

    expect(figure()).toHaveAttribute("data-modality", "mask");
    expect(screen.getByRole("tab", { name: "Mask" })).toHaveAttribute("aria-selected", "true");
  });

  it("advances on its own and stops once a stage is picked", () => {
    vi.useFakeTimers();

    try {
      render(<ArchitectureWalkthrough />);

      // The spotlight, not the presence of a box, says which part is lit: the
      // whole figure is on screen the entire time.
      expect(figure()).toHaveAttribute("data-stage", "input");

      act(() => {
        vi.advanceTimersByTime(6100);
      });
      expect(figure()).toHaveAttribute("data-stage", "align");

      // Picking a stage hands control to the reader, and the timer stops.
      fireEvent.click(screen.getByText("Waypoint prediction head"));
      expect(figure()).toHaveAttribute("data-stage", "head");

      act(() => {
        vi.advanceTimersByTime(18000);
      });
      expect(figure()).toHaveAttribute("data-stage", "head");
    } finally {
      vi.useRealTimers();
    }
  });
});
