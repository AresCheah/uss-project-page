import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ArchitectureWalkthrough from "./ArchitectureWalkthrough";
import { siteContent } from "@/content/siteContent";

describe("ArchitectureWalkthrough", () => {
  it("offers every prompt modality and every pipeline step", () => {
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

    // Every rect is 0x0 in jsdom, so the scroll tracker lands on the last
    // stage; pick stage (a) explicitly, which is where the encoder is named.
    await user.click(screen.getByText("Input encoding"));

    // The box prompt is the default.
    expect(screen.getByText("Box Encoder")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Mask" }));

    expect(screen.getByText("Mask Encoder")).toBeInTheDocument();
    expect(screen.queryByText("Box Encoder")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Mask" })).toHaveAttribute("aria-selected", "true");
  });
});
