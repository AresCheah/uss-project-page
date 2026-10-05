import SectionHead from "@/components/ui/SectionHead";
import { cellValue, siteContent, type Cell } from "@/content/siteContent";

function cellClass(cell: Cell, index: number) {
  const classes = [];
  if (typeof cell !== "string" && cell.emphasis) classes.push(`e-${cell.emphasis}`);
  // A divider before each split (STT, DT, AT) and before FPS.
  if (index % 3 === 0) classes.push("split");
  return classes.join(" ") || undefined;
}

function BenchmarkTable() {
  const table = siteContent.benchmarkTable;

  return (
    <figure className="table-card big">
      <div className="table-title">
        <span className="fig-tag">Table 2</span>
        <h3>EVT-Bench, three splits</h3>
      </div>
      <p className="table-lede">{table.caption}</p>
      <div className="table-wrap" tabIndex={0} role="region" aria-label="EVT-Bench results table">
        <table className="dt">
          <thead>
            <tr>
              <th rowSpan={2}>Method</th>
              <th colSpan={3} className="cg">
                STT
              </th>
              <th colSpan={3} className="cg">
                DT
              </th>
              <th colSpan={3} className="cg">
                AT
              </th>
              <th rowSpan={2} className="cg">
                FPS ↑
              </th>
            </tr>
            <tr>
              {["SR ↑", "TR ↑", "CR ↓", "SR ↑", "TR ↑", "CR ↓", "SR ↑", "TR ↑", "CR ↓"].map((label, i) => (
                <th key={i} className={i % 3 === 0 ? "split" : undefined}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) =>
              row.type === "group" ? (
                <tr key={row.label} className="grp">
                  <th colSpan={11}>{row.label}</th>
                </tr>
              ) : (
                <tr key={row.label} className={row.highlight ? "uss" : undefined}>
                  <th scope="row">{row.label}</th>
                  {row.values.map((cell, i) => (
                    <td key={i} className={cellClass(cell, i)}>
                      {cellValue(cell)}
                    </td>
                  ))}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <figcaption>
        <p className="legend">
          <span>
            <i style={{ background: "var(--teal)" }} />
            best non-MLLM, language
          </span>
          <span>
            <i style={{ background: "var(--blue)" }} />
            best MLLM, language
          </span>
          <span>
            <b style={{ color: "var(--heading)" }}>bold</b>&nbsp;best spatial prompt
          </span>
        </p>
        <ul className="table-notes">
          {table.notes?.slice(1).map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}

function SpeedChart() {
  const entries = siteContent.speedComparison;
  const max = Math.max(...entries.map((entry) => entry.fps));

  return (
    <figure className="table-card">
      <div className="table-title">
        <span className="fig-tag">Throughput</span>
        <h3>Several times the MLLM trackers' frame rate</h3>
      </div>
      <p className="chart-sub">Frames per second. USS is measured; baselines are taken as reported.</p>
      <div className="speed">
        {entries.map((entry) => (
          <div key={entry.label} className={`speed-row f-${entry.family}`}>
            <span className="lbl">
              {entry.label}
              <small>{entry.note}</small>
            </span>
            <span className="speed-track">
              <span className="speed-bar" style={{ width: `${(entry.fps / max) * 100}%` }} />
            </span>
            <b>{entry.fps.toFixed(1)}</b>
          </div>
        ))}
      </div>
      <figcaption>
        At 10 FPS a forward pass fills a whole 100 ms control period; at 57 FPS it takes about a sixth. TrackVLA,
        TrackVLA++ and USS all stream images to an off-board server.
      </figcaption>
    </figure>
  );
}

function AblationChart() {
  const rows = siteContent.ablation;
  const base = rows.find((row) => row.isDefault)!;
  // Symmetric-enough axis from -12 to +2 SR points around the default.
  const lo = -12;
  const hi = 2;
  const pos = (value: number) => ((value - lo) / (hi - lo)) * 100;
  const ticks = [-12, -8, -4, 0];

  return (
    <figure className="table-card">
      <div className="table-title">
        <span className="fig-tag">Table 3</span>
        <h3>Memory matters most</h3>
      </div>
      <p className="chart-sub">Change in DT success rate against the default, box prompts on EVT-Bench.</p>
      <div className="abl">
        {rows.map((row) => {
          const delta = Math.round((row.sr - base.sr) * 10) / 10;
          const left = Math.min(pos(delta), pos(0));
          const width = Math.abs(pos(delta) - pos(0));
          return (
            <div key={row.label} className={`abl-row${row.isDefault ? " is-default" : ""}`}>
              <span className="lbl">
                {row.label}
                <small>{row.change}</small>
              </span>
              <span className="abl-track">
                <span className="abl-zero" style={{ left: `${pos(0)}%` }} />
                {row.isDefault ? null : (
                  <span className={`abl-bar ${delta < 0 ? "neg" : "pos"}`} style={{ left: `${left}%`, width: `${width}%` }} />
                )}
              </span>
              <b>{row.isDefault ? `${row.sr}` : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`}</b>
            </div>
          );
        })}
        <div className="abl-axis" aria-hidden="true">
          <span />
          <div>
            {ticks.map((tick) => (
              <span key={tick} style={{ left: `${pos(tick)}%` }}>
                {tick}
              </span>
            ))}
          </div>
          <span />
        </div>
      </div>
      <figcaption>
        Removing temporal memory costs 11.4 SR, cross-view fusion 5.5 and the world-model loss 3.2. A 32-frame memory
        adds only 0.5 SR for twice the memory tokens, so 16 frames stays the default.
      </figcaption>
    </figure>
  );
}

export default function ResultsSection() {
  return (
    <section id="results" className="section">
      <div className="wrap">
        <SectionHead
          index="03"
          label="Results"
          title="The strongest non-MLLM tracker on EVT-Bench, at 57 FPS."
          lede="Under the standard language protocol USS leads every modular non-MLLM baseline on all three splits. The MLLM trackers remain stronger on success rate, at a fraction of the throughput."
        />

        <div className="facts-grid">
          <div className="fact">
            <h3>Benchmark</h3>
            <p>
              <b>EVT-Bench</b>: Single-Target (STT), Distracted (DT) and Ambiguity Tracking (AT), each with 1,405
              held-out episodes in 101 unseen scenes, evaluated on the full split.
            </p>
          </div>
          <div className="fact">
            <h3>Metrics</h3>
            <p>
              <b>SR</b> success rate, <b>TR</b> share of steps with a valid following relationship, <b>CR</b>{" "}
              collision-terminated episodes, and <b>FPS</b>. One run of one trained instance per prompt type.
            </p>
          </div>
          <div className="fact">
            <h3>Protocols</h3>
            <p>
              Language rows use the standard initialization. Spatial rows start with the target visible and the heading
              perturbed within ±20°: a <b>separate protocol</b>, not ranked against language.
            </p>
          </div>
        </div>

        <BenchmarkTable />

        <div className="two-up">
          <SpeedChart />
          <AblationChart />
        </div>
      </div>
    </section>
  );
}
