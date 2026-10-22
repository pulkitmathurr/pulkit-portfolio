import { skills, tools } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";

function ToolIcon({ icon }: { icon: (typeof tools)[number]["icon"] }) {
  if (icon === "gemini")
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-accent" aria-hidden>
        <path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10z" />
      </svg>
    );
  if (icon === "capcut")
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 stroke-accent" fill="none" strokeWidth="1.8" aria-hidden>
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M8.5 7.5L20 18M8.5 16.5L20 6" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 stroke-paper/50" fill="none" strokeWidth="1.5" strokeDasharray="3 3" aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" />
      <path d="M12 8v8M8 12h8" strokeDasharray="none" />
    </svg>
  );
}

function Marquee({ items, reverse = false, duration = 40 }: { items: string[]; reverse?: boolean; duration?: number }) {
  // Content is duplicated so the -50% translate loops seamlessly.
  const row = [...items, ...items];
  return (
    <div className="relative flex overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div
        className="marquee flex w-max shrink-0 items-center"
        data-reverse={reverse ? "" : undefined}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {[row, row].flat().map((s, i) => (
          <span key={i} aria-hidden={i >= items.length} className="flex items-center font-display text-4xl tracking-wide whitespace-nowrap text-paper md:text-6xl">
            {s}
            <span className="mx-6 text-2xl text-accent md:mx-10 md:text-3xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Tools() {
  return (
    <Section id="tools" ariaLabel="Tools and skills" className="pt-24 pb-28 md:pt-36 md:pb-36">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionTitle scene="04 — Toolkit" title="Tools & Skills" />
      </div>

      <Marquee items={skills} duration={45} />

      <div className="mx-auto mt-14 grid max-w-7xl gap-4 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
        {tools.map((t) => (
          <div key={t.name} className="group flex items-center gap-5 border border-line bg-ink-2 p-6 transition hover:border-accent/60">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line transition group-hover:rotate-12">
              <ToolIcon icon={t.icon} />
            </span>
            <span>
              <span className="block font-display text-2xl tracking-wide text-paper">{t.name}</span>
              <span className="block text-sm text-muted">{t.note}</span>
            </span>
          </div>
        ))}
      </div>

      <ul className="mx-auto mt-10 flex max-w-7xl flex-wrap gap-2 px-4 md:px-8" aria-label="Skills">
        {skills.map((s) => (
          <li key={s} className="border border-line px-3.5 py-2 font-mono text-xs tracking-wider text-paper/85 uppercase transition hover:border-accent hover:text-paper">
            {s}
          </li>
        ))}
      </ul>
    </Section>
  );
}
