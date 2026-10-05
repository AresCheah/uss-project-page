import { useEffect, useRef, useState } from "react";
import { ArrowDown, Code2, FileText, Quote } from "lucide-react";
import { getAuthorNote, siteContent, type ModalityId } from "@/content/siteContent";

const MODALITY_CLASS: Record<ModalityId, string> = {
  text: "m-text",
  point: "m-point",
  box: "m-box",
  mask: "m-mask",
};

const stats = [
  { value: "320", unit: "", label: "zero-shot trials on a Unitree G1, with policies trained only in simulation", color: "var(--teal)" },
  { value: "18", unit: "/ 20", label: "box-prompt successes with two people in black, against 9 / 20 for language", color: "var(--gold)" },
  { value: "57", unit: "FPS", label: "for the language policy on an RTX 4090; MLLM trackers report 4.8–10", color: "var(--blue)" },
  { value: "+34.1", unit: "SR", label: "points on EVT-Bench DT over the best prior non-MLLM tracker", color: "var(--purple)" },
];

function HeroReel() {
  const reel = siteContent.heroReel;
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const current = reel[index];

  const play = () => {
    const started = videoRef.current?.play();
    if (started && typeof started.catch === "function") started.catch(() => {});
  };

  // Pause only while the tab is hidden, so the reel never sticks on a blank frame.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) videoRef.current?.pause();
      else play();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div className="reel">
      <div className="reel-frame">
        <video
          ref={videoRef}
          key={current.videoSrc}
          poster={current.poster}
          src={current.videoSrc}
          autoPlay
          muted
          playsInline
          preload="metadata"
          aria-label={current.title}
          onCanPlay={play}
          onEnded={() => setIndex((value) => (value + 1) % reel.length)}
        />
      </div>
      <div className="reel-meta">
        <div>
          <p className="reel-tag">{current.tag}</p>
          <p className="reel-title">{current.title}</p>
        </div>
        <div className="reel-dots">
          {reel.map((item, i) => (
            <button
              key={item.videoSrc}
              type="button"
              aria-label={`Play: ${item.title}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
      <div className="prompt-strip">
        {siteContent.promptModalities.map((item) => (
          <figure key={item.id} className={`prompt-thumb ${MODALITY_CLASS[item.id]}`}>
            <img src={item.image} alt={`${item.label} prompt`} />
            <figcaption>
              <i aria-hidden="true" />
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="hero" id="top">
      <div className="aurora" aria-hidden="true">
        <span className="a1" />
        <span className="a2" />
        <span className="a3" />
        <span className="a4" />
      </div>
      <div className="hero-grid" aria-hidden="true" />

      <div className="wrap">
        <div className="hero-inner">
          <div>
            <p className="eyebrow-pill">
              <span className="dot" />
              USS
              <span className="sep" />
              Embodied visual tracking
              <span className="sep" />
              {siteContent.date}
            </p>
            <h1 className="display">
              USS: Unifying <span className="grad"><span className="nw">Spatial-Semantic</span> Prompting</span> for End to End
              Embodied Visual Tracking
            </h1>
            <p className="lede">
              <span className="tldr">TL;DR</span>
              {siteContent.tldr}
            </p>
            <p className="authors">
              {siteContent.authors.map((author) => {
                const note = getAuthorNote(author.note);
                return (
                  <span key={author.name}>
                    {author.href ? (
                      <a href={author.href} target="_blank" rel="noreferrer">
                        {author.name}
                      </a>
                    ) : (
                      author.name
                    )}
                    {note ? <sup>{note}</sup> : null}
                  </span>
                );
              })}
            </p>
            <p className="affils">
              <span>{siteContent.institution}</span>
              <span>
                <sup>*</sup>Equal contribution
              </span>
              <span>
                <sup>†</sup>Corresponding author
              </span>
            </p>
            <div className="cta">
              <a className="btn btn-primary" href={siteContent.links.pdf} target="_blank" rel="noreferrer">
                <FileText size={17} aria-hidden="true" />
                Paper
              </a>
              <a className="btn btn-ghost" href={siteContent.links.arxiv} target="_blank" rel="noreferrer">
                <span aria-hidden="true" style={{ fontWeight: 700, fontFamily: "var(--font-display)" }}>
                  χ
                </span>
                arXiv
              </a>
              <span className="btn btn-ghost is-disabled" aria-disabled="true">
                <Code2 size={17} aria-hidden="true" />
                Code <span className="soon">soon</span>
              </span>
              <a className="btn btn-ghost" href="#cite">
                <Quote size={16} aria-hidden="true" />
                BibTeX
              </a>
            </div>
          </div>

          <figure className="hero-media">
            <HeroReel />
            <figcaption>
              <b>Zero-shot on a Unitree G1</b>, with policies trained only in simulation. The four thumbnails are the
              four ways to designate the same person.
            </figcaption>
          </figure>
        </div>

        <div className="stats">
          {stats.map((stat) => (
            <div key={stat.label} className="stat" style={{ ["--sc" as string]: stat.color }}>
              <b>
                {stat.value}
                {stat.unit ? <small>{stat.unit}</small> : null}
              </b>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <a className="scroll-cue" href="#overview">
          <span>
            <ArrowDown size={15} aria-hidden="true" />
          </span>
          Scroll
        </a>
      </div>
    </section>
  );
}
