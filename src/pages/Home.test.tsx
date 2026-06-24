import { render, screen } from "@testing-library/react";
import Home from "./Home";

describe("Home page", () => {
  it("renders the project title and key sections", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /Unified Spatial-Semantic Prompts for Embodied Visual Tracking/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /Motivation/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /One architecture that turns heterogeneous prompts into egocentric waypoints/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Seven real-robot slots ready for your final videos/i }),
    ).toBeInTheDocument();
  });
});
