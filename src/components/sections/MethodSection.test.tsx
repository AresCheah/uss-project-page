import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MethodSection from "./MethodSection";
import { siteContent } from "@/content/siteContent";
import { flowFor } from "@/components/method/flowScript";

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

  it("spells out the token flow of the step being read", () => {
    render(<MethodSection />);

    // One ledger entry per hop of the world-model step, each naming what moves where.
    const phases = flowFor("world", "box");
    expect(document.querySelectorAll(".fl-steps li")).toHaveLength(phases.length);
    const written = within(document.querySelector(".fl-list") as HTMLElement);
    phases.forEach((phase) => {
      expect(written.getByText(phase.route)).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "Pause the token flow" })).toBeInTheDocument();
  });

  it("counts the prompt tokens each prompt type produces", async () => {
    const user = userEvent.setup();
    render(<MethodSection />);

    const promptTokens = () => document.querySelectorAll('[data-stage="fusion"] .tk-p').length;
    const boxCount = promptTokens();
    await user.click(screen.getByRole("button", { name: "Point" }));
    // A box yields 9 prompt tokens and a point 4; the self-attention and fusion rows are unchanged.
    expect(boxCount - promptTokens()).toBe(5);
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
