import { pageSections, siteContent } from "./siteContent";

describe("site content", () => {
  it("keeps the expected paper metadata and demo slots", () => {
    expect(siteContent.authors).toHaveLength(7);
    expect(siteContent.links).toHaveLength(4);
    expect(siteContent.demos).toHaveLength(7);
    expect(pageSections.map((section) => section.id)).toEqual([
      "motivation",
      "contributions",
      "method",
      "experiments",
      "demos",
      "bibtex",
    ]);
  });
});
