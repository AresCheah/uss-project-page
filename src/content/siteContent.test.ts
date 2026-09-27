import { pageSections, siteContent, type TableData } from "./siteContent";

function findDataRow(table: TableData, label: string) {
  return table.rows.find((row) => row.type !== "group" && row.label === label);
}

describe("site content", () => {
  it("keeps the expected paper metadata and demo slots", () => {
    expect(siteContent.authors).toHaveLength(7);
    expect(siteContent.links).toHaveLength(3);
    expect(siteContent.demos).toHaveLength(7);
    expect(pageSections.map((section) => section.id)).toEqual([
      "motivation",
      "contributions",
      "method",
      "experiments",
      "bibtex",
    ]);
  });

  it("reports the published EVT-Bench and real-world numbers", () => {
    // STT SR, DT SR, AT SR and FPS of the language policy.
    expect(findDataRow(siteContent.benchmarkTable, "USS (language)")).toMatchObject({
      values: expect.arrayContaining([
        { value: "70.8", emphasis: "red" },
        { value: "49.8", emphasis: "red" },
        { value: "34.2", emphasis: "red" },
        { value: "57.0", emphasis: "red" },
      ]),
    });

    expect(findDataRow(siteContent.realWorldTable, "Similar people")).toMatchObject({
      values: ["45%", { value: "90%", emphasis: "bold" }, "80%", "70%"],
    });
  });
});
