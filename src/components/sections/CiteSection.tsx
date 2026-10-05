import { useState } from "react";
import { Check, Copy } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import { siteContent } from "@/content/siteContent";

export default function CiteSection() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(siteContent.bibtex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="cite" className="section section-alt">
      <div className="wrap">
        <SectionHead index="06" label="Cite" title="Citation" />
        <div className="cite-card">
          <button type="button" className="copy-btn" onClick={copy}>
            {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <pre>
            <code>{siteContent.bibtex}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
