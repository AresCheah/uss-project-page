import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ArchitectureWalkthrough from "./ArchitectureWalkthrough";
import { siteContent } from "@/content/siteContent";

describe("ArchitectureWalkthrough", () => {
  it("offers every prompt modality and every pipeline stage", () => {
    render(<ArchitectureWalkthrough />);

    const tabs = within(screen.getByRole("tablist")).getAllByRole("tab");
    expect(tabs.map((tab) => tab.textContent)).toEqual(["Text", "Point", "Box", "Mask"]);

    siteContent.architectureSteps.forEach((step) => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    });
  });

  it("switches the figure to the mask prompt and its encoder", async () => {
    const user = userEvent.setup();
    render(<ArchitectureWalkthrough />);

    // Stage (a) is where the encoder is named; it is the one shown first.
    expect(screen.getByText("Box Encoder")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Mask" }));

    expect(screen.getByText("Mask Encoder")).toBeInTheDocument();
    expect(screen.queryByText("Box Encoder")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Mask" })).toHaveAttribute("aria-selected", "true");
  });

  it("advances on its own and stops once a stage is picked", () => {
    vi.useFakeTimers();

    try {
      render(<ArchitectureWalkthrough />);

      // Every part is on one canvas, so the spotlight - not the presence of a
      // box - is what says which stage is being explained.
      const figure = () => screen.getByRole("img").getAttribute("aria-label");
      expect(figure()).toContain("part input");

      act(() => {
        vi.advanceTimersByTime(6100);
      });
      expect(figure()).toContain("part align");

      // Picking a stage hands control to the reader, and the timer stops.
      fireEvent.click(screen.getByText("Waypoint prediction head"));
      expect(figure()).toContain("part head");

      act(() => {
        vi.advanceTimersByTime(18000);
      });
      expect(figure()).toContain("part head");
    } finally {
      vi.useRealTimers();
    }
  });
});
