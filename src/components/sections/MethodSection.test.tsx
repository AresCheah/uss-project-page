import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MethodSection from "./MethodSection";
import { siteContent } from "@/content/siteContent";

const diagram = () => document.querySelector("svg.dg") as SVGSVGElement;

describe("MethodSection", () => {
  it("shows every step of the method", () => {
    render(<MethodSection />);

    siteContent.methodSteps.forEach((step) => {
      expect(screen.getByRole("heading", { name: step.title })).toBeInTheDocument();
    });
  });

  it("lights the stage of the step being read", () => {
    render(<MethodSection />);

    // The test observer reports every step as on screen, so the last one wins.
    expect(diagram()).toHaveAttribute("data-active", "world");
    expect(document.querySelector('[data-stage="world"]')).toHaveClass("is-on");
    expect(document.querySelector('[data-stage="prompt"]')).toHaveClass("is-past");
  });

  it("routes a mask prompt through memory instead of prompt tokens", async () => {
    const user = userEvent.setup();
    render(<MethodSection />);

    expect(diagram()).toHaveAttribute("data-modality", "box");

    await user.click(screen.getByRole("button", { name: "Mask" }));

    expect(diagram()).toHaveAttribute("data-modality", "mask");
    expect(screen.getByRole("button", { name: "Mask" })).toHaveAttribute("aria-pressed", "true");
    // A mask never becomes prompt tokens; it is stored in memory as an anchor.
    expect(screen.getByText("mask → memory")).toBeInTheDocument();
    expect(screen.getByText("+ mask anchor")).toBeInTheDocument();
  });
});
