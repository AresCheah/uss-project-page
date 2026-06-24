import { Menu } from "lucide-react";
import { pageSections } from "@/content/siteContent";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/useActiveSection";

export default function TopNav() {
  const activeSection = useActiveSection(pageSections.map((section) => section.id));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="motion-fade-in mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3 lg:px-8">
        <a
          href="#hero"
          className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-slate-500 transition hover:text-slate-900"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600">
            <Menu className="h-4 w-4" />
          </span>
          USS Project Page
        </a>
        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white p-1 md:flex">
          {pageSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "rounded-full px-3.5 py-2 text-[11px] tracking-[0.16em] text-slate-500 transition",
                activeSection === section.id
                  ? "bg-slate-900 text-white"
                  : "hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
