import { render, screen } from "@testing-library/react";
import Home from "./Home";

describe("Home page", () => {
  it("renders the project title and key sections", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /Unifying Spatial-Semantic Prompting for End to End Embodied Visual Tracking/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /^Motivation$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Method$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Experiments$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Real-World Experiments/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Simulation Benchmark/i })).toBeInTheDocument();
  });
});
