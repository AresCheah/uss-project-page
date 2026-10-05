import { pageSections, siteContent, type TableData } from "./siteContent";

function findDataRow(table: TableData, label: string) {
  return table.rows.find((row) => row.type !== "group" && row.label === label);
}

describe("site content", () => {
  it("keeps the expected paper metadata and demo slots", () => {
    expect(siteContent.authors).toHaveLength(7);
    expect(siteContent.demos).toHaveLength(7);
    expect(pageSections.map((section) => section.id)).toEqual([
      "overview",
      "method",
      "results",
      "real-robot",
      "cite",
    ]);
  });

  it("reports the published EVT-Bench and real-world numbers", () => {
    // STT SR, DT SR, AT SR and FPS of the language policy.
    expect(findDataRow(siteContent.benchmarkTable, "USS (language)")).toMatchObject({
      values: expect.arrayContaining([
        { value: "70.8", emphasis: "best-a" },
        { value: "49.8", emphasis: "best-a" },
        { value: "34.2", emphasis: "best-a" },
        { value: "57.0", emphasis: "best-a" },
      ]),
    });

    expect(findDataRow(siteContent.realWorldTable, "Similar people")).toMatchObject({
      values: ["45%", { value: "90%", emphasis: "bold" }, "80%", "70%"],
    });
  });

  it("keeps the method steps and the ablation in step with the paper", () => {
    expect(siteContent.promptModalities.map((item) => item.id)).toEqual(["text", "point", "box", "mask"]);
    expect(siteContent.methodSteps.map((step) => step.id)).toEqual(["prompt", "vision", "fusion", "head", "world"]);
    expect(siteContent.methodSteps.filter((step) => step.trainingOnly).map((step) => step.id)).toEqual(["world"]);

    const sr = Object.fromEntries(siteContent.ablation.map((row) => [row.label, row.sr]));
    expect(sr["Default USS"]).toBe(83.6);
    expect(sr["Mem. 0"]).toBe(72.2);
    expect(sr["w/o WM"]).toBe(80.4);

    // The throughput chart must not drift from the FPS column of the table.
    const uss = siteContent.speedComparison.find((entry) => entry.family === "uss");
    expect(uss?.fps).toBe(57);
    expect(Math.max(...siteContent.speedComparison.map((entry) => entry.fps))).toBe(57);
  });
});
