import { useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import MethodDiagram from "@/components/method/MethodDiagram";
import SectionHead from "@/components/ui/SectionHead";
import { useScrollMarker } from "@/hooks/useScrollMarker";
import { siteContent, type MethodStep, type ModalityId } from "@/content/siteContent";

type StageId = MethodStep["id"];

const MODALITY_CLASS: Record<ModalityId, string> = {
  text: "m-text",
  point: "m-point",
  box: "m-box",
  mask: "m-mask",
};

function PromptPicker({ modality, onChange }: { modality: ModalityId; onChange: (id: ModalityId) => void }) {
  const current = siteContent.promptModalities.find((item) => item.id === modality)!;

  return (
    <>
      <div className="seg" role="group" aria-label="Prompt type">
        {siteContent.promptModalities.map((item) => (
          <button
            key={item.id}
            type="button"
            className={MODALITY_CLASS[item.id]}
            aria-pressed={item.id === modality}
            onClick={() => onChange(item.id)}
          >
            <i aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </div>
      <div className={`pick ${MODALITY_CLASS[modality]}`}>
        <img src={current.image} alt={`${current.label} prompt on the first frame`} loading="lazy" />
        <dl>
          <div>
            <dt>Given as</dt>
            <dd>{current.given}</dd>
          </div>
          <div>
            <dt>Encoded as</dt>
            <dd>{current.encoded}</dd>
          </div>
        </dl>
      </div>
    </>
  );
}

export default function MethodSection() {
  const steps = siteContent.methodSteps;
  const [modality, setModality] = useState<ModalityId>("box");
  const listRef = useRef<HTMLOListElement | null>(null);

  // The step whose card has crossed the middle of the viewport is the one being read.
  const active = useScrollMarker(
    () => Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-step]") ?? []),
    (node) => node.dataset.step ?? "",
    0.5,
  ) as StageId | null;
  const live = typeof window !== "undefined";

  const activeIndex = active ? steps.findIndex((step) => step.id === active) : -1;
  const activeStep = activeIndex >= 0 ? steps[activeIndex] : null;

  return (
    <section id="method" className="section section-alt">
      <div className="wrap">
        <SectionHead
          index="02"
          label="Method"
          title="One designation in, egocentric waypoints out."
          lede="USS is one architecture, instantiated once per prompt type and trained under an identical recipe. It encodes the prompt once, fuses it with a memory-backed visual stream, and decodes waypoints; a latent world model shapes training and is then removed."
        />
        <p className="sy-hint">
          <ArrowDown size={16} aria-hidden="true" />
          Scroll through the pipeline; the diagram follows each step.
        </p>

        <div className={`sy${live ? " sy-live" : ""}`}>
          <div className="sy-fig-col">
            <div className="sy-sticky">
              <figure className="sy-fig">
                <MethodDiagram active={active} modality={modality} />
                <figcaption className="sy-cap">
                  <span className="sy-count">
                    {activeStep ? (
                      <>
                        Step <b>{activeIndex + 1}</b> of {steps.length} · {activeStep.kicker}
                      </>
                    ) : (
                      <>Five steps, Figure 2 of the paper</>
                    )}
                  </span>
                  <span className="sy-prog" aria-hidden="true">
                    {steps.map((step, i) => (
                      <i key={step.id} className={i === activeIndex ? "on" : i < activeIndex ? "done" : undefined} />
                    ))}
                  </span>
                  <a className="fig-open" href={siteContent.figures.method} target="_blank" rel="noreferrer">
                    Paper figure ↗
                  </a>
                </figcaption>
              </figure>
            </div>
          </div>

          <ol className="sy-steps" ref={listRef}>
            {steps.map((step, i) => (
              <li
                key={step.id}
                className={`sy-step${step.id === active ? " is-active" : ""}`}
                data-step={step.id}
              >
                <article className="sy-card">
                  <div className="sy-kick">
                    <span className="sy-n">{i + 1}</span>
                    {step.kicker}
                    <span className="sy-tags">
                      {step.trainingOnly ? <span className="sy-tag train">Training only</span> : null}
                      <span className="sy-tag">Fig. 2 ({step.part})</span>
                    </span>
                  </div>
                  <h3>{step.title}</h3>
                  {step.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {step.id === "prompt" ? <PromptPicker modality={modality} onChange={setModality} /> : null}
                  {step.id === "prompt" ? (
                    <div className="sy-eq">
                      <div className="sy-eq-tag">{step.linesTag}</div>
                      <ol className="sy-eq-lines">
                        {siteContent.promptModalities.map((item) => (
                          <li
                            key={item.id}
                            className={`${MODALITY_CLASS[item.id]}${item.id === modality ? " is-sel" : ""}`}
                          >
                            {item.equation}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : null}
                  {step.lines ? (
                    <div className="sy-eq">
                      {step.linesTag ? <div className="sy-eq-tag">{step.linesTag}</div> : null}
                      <pre>{step.lines.join("\n")}</pre>
                    </div>
                  ) : null}
                  {step.fine ? <p className="sy-fine">{step.fine}</p> : null}
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
