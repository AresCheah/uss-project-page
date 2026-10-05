import SectionHead from "@/components/ui/SectionHead";
import { percent, siteContent, type ModalityId } from "@/content/siteContent";

const MODALITY_CLASS: Record<ModalityId, string> = {
  text: "m-text",
  point: "m-point",
  box: "m-box",
  mask: "m-mask",
};

/** Real-world table columns are Text, Box, Point, Mask. */
const COLUMN_MODALITY: ModalityId[] = ["text", "box", "point", "mask"];

export default function OverviewSection() {
  const similar = siteContent.realWorldTable.rows.find((row) => row.type !== "group" && row.label === "Similar people");
  const similarValues = similar && similar.type !== "group" ? similar.values : [];
  const maxFps = Math.max(...siteContent.speedComparison.map((entry) => entry.fps));

  return (
    <section id="overview" className="section">
      <div className="wrap">
        <SectionHead
          index="01"
          label="Overview"
          title="Different scenarios favor different ways of naming the target."
          lede="Embodied trackers usually fix the target interface in advance: an implicit convention, or a language description. USS treats text, a point, a box and a mask as complementary specifications, and lets the scenario decide which one to use."
        />

        <div className="bento">
          <article className="card b-problem">
            <div className="big-stat">
              <p className="card-kicker">
                <i className="kdot" style={{ ["--kc" as string]: "var(--orange)" }} />
                The problem
              </p>
              <h3 className="card-title">A description can fit more than one person</h3>
              <p className="big-num">
                9<span className="of">/ 20</span>
              </p>
              <p className="big-note">
                In the similar-people scene both candidates wear a black top. Language holds the right person in{" "}
                <strong>9 of 20</strong> trials; a box placed on them once holds them in <strong>18 of 20</strong>.
              </p>
            </div>
            <div className="meter-block">
              <p className="meter-title">Success rate, similar-people scene, 20 real-robot trials each</p>
              {siteContent.realWorldTable.columns.map((column, i) => {
                const value = percent(similarValues[i] ?? "0") ?? 0;
                return (
                  <div key={column} className={`meter-row ${MODALITY_CLASS[COLUMN_MODALITY[i]]}`}>
                    <span className="meter-label">
                      <i aria-hidden="true" />
                      {column}
                    </span>
                    <span className="meter-val">{value}%</span>
                    <span className="meter-track">
                      <span className="meter-fill" style={{ width: `${value}%` }} />
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="card-foot">
              Only the trousers differ, so the description still identifies the target uniquely: the failure is in
              grounding it, not in the words.
            </p>
          </article>

          <article className="card b-idea card-accent">
            <p className="card-kicker">
              <i className="kdot" />
              The idea
            </p>
            <h3 className="card-title">Four interchangeable prompts, one architecture</h3>
            <div className="thumb-grid">
              {siteContent.promptModalities.map((item) => (
                <figure key={item.id} className={`thumb ${MODALITY_CLASS[item.id]}`}>
                  <img src={item.image} alt={`${item.label} prompt`} loading="lazy" />
                  <figcaption>
                    <b>{item.label}</b>
                    {item.short}
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="card-body small">
              Language can name a target that is not in view; a spatial prompt designates a visible instance directly.
              One USS instance is trained per prompt type under an identical recipe.
            </p>
          </article>

          <article className="card b-cost">
            <p className="card-kicker">
              <i className="kdot" style={{ ["--kc" as string]: "var(--sky)" }} />
              Cost
            </p>
            <h3 className="card-title">Encoded once, nothing extra at run time</h3>
            <p className="card-body">
              The prompt is given once at t = 1 and never recomputed; afterwards only the RGB stream is re-encoded. The
              world model that regularizes training is removed at inference.
            </p>
            <ul className="chips">
              <li>Prompt encoded once</li>
              <li>No re-designation</li>
              <li>World model dropped at inference</li>
            </ul>
          </article>

          <article className="card b-result">
            <p className="card-kicker">
              <i className="kdot" />
              The result
            </p>
            <h3 className="card-title">Best non-MLLM tracker on EVT-Bench</h3>
            <div className="hero-num">
              <span className="hn">70.8 · 49.8 · 34.2</span>
              <span className="hn-unit">SR</span>
            </div>
            <ul className="split-chips">
              <li>
                <small>STT</small>
                <b>+27.9</b>
              </li>
              <li>
                <small>DT</small>
                <b>+34.1</b>
              </li>
              <li>
                <small>AT</small>
                <b>+15.9</b>
              </li>
            </ul>
            <p className="card-foot">Language policy, standard protocol; gains over the best prior non-MLLM entry.</p>
          </article>

          <article className="card b-speed">
            <p className="card-kicker">
              <i className="kdot" style={{ ["--kc" as string]: "var(--sky)" }} />
              Speed
            </p>
            <h3 className="card-title">57 FPS on an RTX 4090</h3>
            <div className="fps-bars">
              {siteContent.speedComparison.map((entry) => (
                <div key={entry.label} className={`fps-row${entry.family === "uss" ? " is-uss" : ""}`}>
                  <span>{entry.family === "uss" ? "USS" : entry.label}</span>
                  <span className="fps-track">
                    <span className="fps-bar" style={{ width: `${(entry.fps / maxFps) * 100}%` }} />
                  </span>
                  <b>{entry.fps}</b>
                </div>
              ))}
            </div>
            <p className="card-foot">Baseline throughput as reported, not re-benchmarked.</p>
          </article>

          <article className="card b-robot">
            <p className="card-kicker">
              <i className="kdot" style={{ ["--kc" as string]: "var(--fuchsia)" }} />
              Real robot
            </p>
            <h3 className="card-title">From simulation to a Unitree G1, zero-shot</h3>
            <p className="card-body">
              <strong>320 trials</strong> across four indoor scenes and four prompt types, with a single-view policy
              trained only in simulation: no real-world data, fine-tuning or calibration.
            </p>
            <ul className="chips">
              <li>4 scenes</li>
              <li>4 prompts</li>
              <li>20 trials each</li>
            </ul>
          </article>
        </div>

        <figure className="float-card">
          <div className="fig-white">
            <img
              src={siteContent.figures.motivation}
              alt="Figure 1: language suits a target outside the robot's view; a spatial prompt suits similar-looking targets and time-critical designation. USS conditions one policy on any of text, point, box or mask."
              loading="lazy"
            />
          </div>
          <figcaption>
            <span className="fig-tag">Figure 1</span>
            <b>Complementary prompts motivate a unified design.</b> Language reaches a target outside the robot's view; a
            spatial prompt designates a visible instance directly, which helps among similar-looking people or under
            time pressure.
            <a className="fig-open" href={siteContent.figures.motivation} target="_blank" rel="noreferrer">
              Full size ↗
            </a>
          </figcaption>
        </figure>

        <div className="abstract">
          <h3 className="side-label">Abstract</h3>
          <div className="abstract-body">
            {siteContent.abstract.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="contribs">
          {siteContent.contributions.map((item, i) => (
            <article key={item.title} className="contrib">
              <span className="contrib-n">C{i + 1}</span>
              <h3>{item.title}</h3>
              <ul className="dots-list">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
