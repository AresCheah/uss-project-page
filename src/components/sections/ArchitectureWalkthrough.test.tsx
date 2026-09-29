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

  it("switches the diagram to the mask route, which bypasses prompt tokens", async () => {
    const user = userEvent.setup();
    render(<ArchitectureWalkthrough />);

    // The box prompt is the default and reaches fusion as prompt tokens.
    expect(screen.getByText("prompt tokens")).toBeInTheDocument();
    expect(screen.queryByText("dense anchor")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Mask" }));

    // A mask is stored in memory as a dense anchor instead.
    expect(screen.getByText("dense anchor")).toBeInTheDocument();
    expect(screen.queryByText("prompt tokens")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Mask" })).toHaveAttribute("aria-selected", "true");
  });
});
