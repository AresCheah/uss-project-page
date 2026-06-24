import { ArrowUpRight, FileText } from "lucide-react";
import { getAuthorNote, siteContent } from "@/content/siteContent";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function HeroSection() {
  const ntuLogo = siteContent.logos.find((logo) => logo.name === "NTU");
  const marsLogo = siteContent.logos.find((logo) => logo.name === "MARS Lab");

  return (
    <AnimatedSection id="hero" className="relative overflow-hidden px-6 pb-8 pt-16 lg:px-8 lg:pb-10 lg:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="space-y-5 border-b border-slate-200 pb-8 pt-2 text-center">
          <div className="motion-fade-up space-y-3">
            <h1 className="font-display mx-auto max-w-5xl text-[2.3rem] font-semibold leading-[1.05] tracking-[-0.01em] text-slate-900 sm:text-[3rem] lg:text-[3.55rem]">
              {siteContent.title}
            </h1>
          </div>

          <div className="motion-fade-up motion-delay-1 mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[0.98rem] leading-8 text-slate-600">
            {siteContent.authors.map((author, index) => (
              <span key={author.name}>
                <span>{author.name}</span>
                <sup className="ml-1 text-brand-cyan">{getAuthorNote(author.note)}</sup>
                {index < siteContent.authors.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>

          <div className="motion-fade-up motion-delay-2 space-y-3 text-sm text-slate-500">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <p className="text-[0.97rem] font-medium text-slate-600">{siteContent.institution}</p>
              <p className="text-[0.95rem] text-slate-500">
                <span className="text-brand-cyan">*</span> Equal contribution
                <span className="ml-4 text-brand-cyan">†</span> Corresponding author
              </p>
            </div>
          </div>

          <div className="motion-fade-up motion-delay-3 pt-1">
            <div className="mx-auto flex max-w-[760px] flex-wrap items-center justify-center gap-10 rounded-[16px] border border-slate-200 bg-white px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="h-[92px] w-[74px] overflow-hidden rounded-sm">
                  <img
                    src={ntuLogo?.src}
                    alt="NTU logo"
                    className="h-full w-auto max-w-none object-cover object-left"
                  />
                </div>
                <div className="text-left font-sans leading-[0.9]">
                  <p className="text-[1.05rem] font-[800] uppercase tracking-[-0.02em] text-slate-900 sm:text-[1.22rem]">
                    Nanyang
                  </p>
                  <p className="text-[1.05rem] font-[800] uppercase tracking-[-0.02em] text-slate-900 sm:text-[1.22rem]">
                    Technological
                  </p>
                  <p className="text-[1.05rem] font-[800] uppercase tracking-[-0.02em] text-slate-900 sm:text-[1.22rem]">
                    University
                  </p>
                  <p className="mt-2 text-[0.86rem] font-[800] uppercase tracking-[0.18em] text-[#c62828] sm:text-[0.95rem]">
                    Singapore
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-[76px] w-[84px] overflow-hidden rounded-sm">
                  <img
                    src={marsLogo?.src}
                    alt="MARS Lab logo"
                    className="h-full w-auto max-w-none object-cover object-left"
                  />
                </div>
                <div className="text-left font-sans leading-[0.84]">
                  <p className="text-[1.5rem] font-[800] tracking-[-0.05em] text-slate-900 sm:text-[2rem]">
                    MARS
                  </p>
                  <p className="text-[1.5rem] font-[800] tracking-[-0.05em] text-slate-900 sm:text-[2rem]">
                    Lab
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="motion-fade-up motion-delay-4 flex flex-wrap justify-center gap-3 pt-1">
            {siteContent.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group inline-flex min-w-[120px] items-center justify-center gap-2.5 rounded-[12px] border border-slate-200 bg-white px-4 py-2.5 text-[0.95rem] text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <FileText className="h-4 w-4 text-slate-400" />
                {link.label}
                {link.pending ? (
                  <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    Pending
                  </span>
                ) : (
                  <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
