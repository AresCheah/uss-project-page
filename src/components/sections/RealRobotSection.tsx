import SectionHead from "@/components/ui/SectionHead";
import { cellValue, percent, siteContent } from "@/content/siteContent";

const COLUMN_CLASS: Record<string, string> = { Text: "m-text", Box: "m-box", Point: "m-point", Mask: "m-mask" };
const SCENE_IMAGE = `${import.meta.env.BASE_URL}assets/real-world/similar-semantic-1.jpg`;

export default function RealRobotSection() {
  const table = siteContent.realWorldTable;

  return (
    <section id="real-robot" className="section section-alt">
      <div className="wrap">
        <SectionHead
          index="04"
          label="Real robot"
          title="320 zero-shot trials on a Unitree G1."
          lede="The prompt types behave alike where the target is easy to tell apart, and separate in the one scene where a distractor shares most of the target's description."
        />

        <div className="matrix-grid">
          <figure className="table-card">
            <div className="table-title">
              <span className="fig-tag">Table 1</span>
              <h3>Success rate by scene and prompt</h3>
            </div>
            <p className="table-lede">{table.caption}</p>
            <table className="mx">
              <thead>
                <tr>
                  <th aria-label="Scene" />
                  {table.columns.map((column) => (
                    <th key={column} className={COLUMN_CLASS[column]}>
                      <i aria-hidden="true" />
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) =>
                  row.type === "group" ? null : (
                    <tr key={row.label} className={row.highlight ? "hl" : undefined}>
                      <th scope="row">{row.label}</th>
                      {row.values.map((cell, i) => {
                        const value = percent(cell) ?? 0;
                        const bold = typeof cell !== "string" && cell.emphasis === "bold";
                        return (
                          <td
                            key={i}
                            className={`${COLUMN_CLASS[table.columns[i]]}${bold ? " e-bold" : ""}`}
                            style={{ ["--v" as string]: Math.max(0, (value - 40) / 60).toFixed(2) }}
                          >
                            {cellValue(cell)}
                          </td>
                        );
                      })}
                    </tr>
                  ),
                )}
              </tbody>
            </table>
            <figcaption>{table.notes?.[0]}</figcaption>
          </figure>

          <article className="table-card robot-card">
            <img src={SCENE_IMAGE} alt="The similar-people scene: two people in black tops, the Unitree G1 behind them." loading="lazy" />
            <div className="table-title">
              <h3>How a trial runs</h3>
            </div>
            <ol className="pipeline">
              <li>
                <span>
                  A chest-mounted <b>RealSense D455</b> streams RGB over Ethernet to an <b>RTX 4090</b> server.
                </span>
              </li>
              <li>
                <span>
                  A <b>single-view</b> USS policy, trained only in simulation, predicts waypoints; no real-world data,
                  fine-tuning or calibration.
                </span>
              </li>
              <li>
                <span>
                  Velocity comes from the first waypoint, yaw rate from the last; the robot's gait controller handles
                  locomotion.
                </span>
              </li>
              <li>
                <span>
                  One prompt at the start with no later correction. A trial fails if the robot switches person, or turns
                  away and loses the target for more than five seconds.
                </span>
              </li>
            </ol>
          </article>
        </div>

        <div className="gallery-head">
          <h3>Rollouts</h3>
          <p>Egocentric view, robot trajectory and third-person view in every clip.</p>
        </div>
        <div className="gallery">
          {siteContent.demos.map((demo, i) => (
            <figure key={demo.videoSrc} className="clip">
              <video controls playsInline preload="none" poster={demo.poster} aria-label={demo.title}>
                <source src={demo.videoSrc} type="video/mp4" />
              </video>
              <figcaption>
                <span className={`t-tag${i === 0 ? " is-fail" : ""}`}>{demo.tag}</span>
                <h4>{demo.title}</h4>
                <p>{demo.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
