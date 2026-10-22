"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { breakdown } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StageClip } from "@/components/ui/StageClip";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function StageHeader({ n, title, note }: { n: number; title: string; note: string }) {
  return (
    <div className="mb-5 flex items-end gap-4">
      <span className="font-display text-7xl leading-[0.8] text-accent md:text-8xl">{String(n).padStart(2, "0")}</span>
      <div>
        <h3 className="font-display text-3xl leading-none tracking-wide text-paper md:text-4xl">{title}</h3>
        <p className="mt-1 text-sm text-muted">{note}</p>
      </div>
    </div>
  );
}

function Terminal() {
  return (
    <div className="overflow-hidden border border-line bg-[#0d0d0d] shadow-2xl">
      <div className="flex items-center gap-2 border-b border-line bg-ink-2 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        <span className="h-2.5 w-2.5 rounded-full bg-paper/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-paper/25" />
        <span className="ml-3 truncate font-mono text-[11px] text-muted">prompt.txt · {breakdown.prompt.model}</span>
      </div>
      <pre className="max-h-[46svh] overflow-auto p-5 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-paper/90 md:p-6 md:text-[13.5px]">
        <span className="text-accent select-none">$ </span>
        {breakdown.prompt.text}
        <span className="ml-0.5 inline-block h-[1.1em] w-2 translate-y-[3px] animate-pulse bg-paper/80" />
      </pre>
      <div className="border-t border-line px-5 py-2.5 font-mono text-[11px] text-muted">{breakdown.prompt.settings}</div>
    </div>
  );
}

export function BehindTheScenes() {
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop: pin the section and scroll the three stages sideways.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current;
        if (!el) return;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.to("[data-bts-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: pin.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
        return () => tween.kill();
      });
    },
    { scope: pin },
  );

  const stages = [
    { title: "Prompt", note: "What I asked the model for.", body: <Terminal /> },
    {
      title: breakdown.raw.label,
      note: breakdown.raw.note,
      body: <StageClip src={breakdown.raw.src} poster={breakdown.raw.poster} label="Raw · ungraded" start={24 * 40} />,
    },
    {
      title: breakdown.final.label,
      note: breakdown.final.note,
      body: <StageClip src={breakdown.final.src} poster={breakdown.final.poster} label="Final · graded" start={24 * 52} />,
    },
  ];

  return (
    <Section id="process" ariaLabel="Behind the scenes" className="bg-ink-2">
      <div ref={pin} className="relative overflow-hidden lg:h-[100svh]">
        <div className="px-4 pt-24 md:px-8 md:pt-32 lg:pt-20">
          <div className="mx-auto max-w-7xl">
            <SectionTitle scene={`02 — Process · ${breakdown.videoTitle}`} title="Behind the Scenes" sub={breakdown.intro} className="!mb-8 lg:!mb-10" />
          </div>
        </div>

        <div
          ref={track}
          className="flex flex-col gap-16 px-4 pb-24 md:px-8 lg:w-max lg:flex-row lg:gap-[6vw] lg:pr-[10vw] lg:pb-0 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
        >
          {stages.map((s, i) => (
            <div key={s.title} className="relative lg:w-[min(62vw,980px)]">
              <StageHeader n={i + 1} title={s.title} note={s.note} />
              {s.body}
              {i < stages.length - 1 ? (
                <span aria-hidden className="absolute top-1/2 -right-[4.5vw] hidden font-display text-5xl text-paper/20 lg:block">
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-8 hidden px-8 lg:block">
          <div className="mx-auto h-px max-w-7xl bg-line">
            <div data-bts-progress className="h-px origin-left scale-x-0 bg-accent" />
          </div>
        </div>
      </div>
    </Section>
  );
}
