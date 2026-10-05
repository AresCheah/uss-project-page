import SectionHead from "@/components/ui/SectionHead";

export default function LimitationsSection() {
  return (
    <section id="limitations" className="section">
      <div className="wrap">
        <SectionHead index="05" label="Limitations" title="What the evidence does not show" />
        <div className="lim-grid">
          <article className="lim">
            <h3>Scope of the claims</h3>
            <ul className="dots-list">
              <li>
                A spatial prompt needs the target to be visible when it is given; only language can name a target out
                of view.
              </li>
              <li>
                Spatial-prompt rows on EVT-Bench use a separate, visible-target protocol and are not ranked against any
                language-prompt result.
              </li>
              <li>The similar-people margin measures how reliably a sufficient description is grounded and held in that scene, not a general advantage of spatial prompts.</li>
              <li>Each EVT-Bench number comes from a single run of one trained instance, so there is no variance across seeds.</li>
            </ul>
          </article>
          <article className="lim">
            <h3>Limitations</h3>
            <ul className="dots-list">
              <li>
                The model is trained with relatively well-formed spatial prompts; prompt-noise augmentation or light
                prompt refinement would make it more robust to imprecise designation.
              </li>
              <li>
                The locomotion policy is simple: mainly flat-ground walking, without low-level obstacle avoidance or
                terrain-aware control.
              </li>
              <li>
                A mask enters only as a dense memory anchor, never through prompt-token fusion; routing it through that
                path is left to future work.
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
