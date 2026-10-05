import { render, screen } from "@testing-library/react";
import Home from "./Home";

describe("Home page", () => {
  it("renders the title and every section", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Unifying Spatial-Semantic Prompting for End to End Embodied Visual Tracking/i,
      }),
    ).toBeInTheDocument();

    for (const id of ["overview", "method", "results", "real-robot", "cite"]) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: /EVT-Bench, three splits/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Success rate by scene and prompt/i })).toBeInTheDocument();
  });
});
