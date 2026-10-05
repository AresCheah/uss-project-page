import { useEffect, useState } from "react";
import { FileText, Menu, Moon, Sun } from "lucide-react";
import { pageSections, siteContent } from "@/content/siteContent";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useTheme } from "@/hooks/useTheme";

const sectionIds = pageSections.map((section) => section.id);

/** Four squares, one per prompt type, in the page's prompt colours. */
export function BrandMark() {
  return (
    <svg className="brand-logo" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#1B1A27" />
      <rect x="7" y="7" width="8" height="8" rx="2" fill="#E8712A" />
      <rect x="17" y="7" width="8" height="8" rx="2" fill="#1D9BD7" />
      <rect x="7" y="17" width="8" height="8" rx="2" fill="#4F46E5" />
      <rect x="17" y="17" width="8" height="8" rx="2" fill="#C23FC9" />
    </svg>
  );
}

export default function TopNav() {
  const active = useActiveSection(sectionIds);
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <a className="brand" href="#top" aria-label="USS, back to top">
            <BrandMark />
            <span className="brand-name">{siteContent.shortTitle}</span>
          </a>
          <nav className="nav-links" aria-label="Sections">
            {pageSections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className={active === section.id ? "active" : undefined}>
                {section.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <details className="menu">
              <summary className="icon-btn" aria-label="Sections">
                <Menu size={18} />
              </summary>
              <nav className="menu-panel" aria-label="Sections">
                {pageSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
            </details>
            <a className="btn btn-primary btn-sm" href={siteContent.links.pdf} target="_blank" rel="noreferrer">
              <FileText size={15} aria-hidden="true" />
              Paper
            </a>
          </div>
        </div>
      </header>

      <ol className="rail" aria-label="Section progress">
        {pageSections.map((section, i) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={active === section.id ? "active" : undefined}
              aria-label={section.label}
              title={section.label}
            >
              {String(i + 1).padStart(2, "0")}
            </a>
          </li>
        ))}
      </ol>
    </>
  );
}
