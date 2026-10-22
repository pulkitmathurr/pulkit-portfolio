"use client";

import { nav, site } from "@/data/content";
import { scrollToId, useLenis } from "@/components/providers/SmoothScroll";

/** Minimal top bar: name on the left, section links on the right (desktop). */
export function Nav() {
  const lenis = useLenis();
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(lenis, id);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <div className="flex items-center justify-between px-4 pt-4 md:px-6 md:pt-6">
        <a href="#top" onClick={go("top")} className="pointer-events-auto font-display text-xl tracking-[0.15em] text-paper">
          {site.name.split(" ").map((p) => p[0]).join("")}
          <span className="text-accent">.</span>
        </a>
        <nav aria-label="Sections" className="pointer-events-auto hidden gap-7 md:flex">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={go(n.id)} className="font-mono text-[11px] tracking-[0.25em] text-paper/80 uppercase transition hover:text-paper">
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
