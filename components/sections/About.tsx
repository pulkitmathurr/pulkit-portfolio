"use client";

import Image from "next/image";
import { about, site } from "@/data/content";
import { useTilt } from "@/hooks/useTilt";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function About() {
  const reduced = useReducedMotion();
  const tilt = useTilt<HTMLDivElement>(8, !reduced);

  return (
    <Section id="about" ariaLabel="About" className="bg-ink-2 px-4 pt-24 pb-28 md:px-8 md:pt-36 md:pb-36">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.3fr_1fr] md:gap-16">
        <div>
          <SectionTitle scene="05 — About" title="Behind the Camera" />
          <div className="space-y-5 text-lg leading-relaxed text-paper/85 md:text-xl">
            {about.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
          <p className="mt-8 flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-muted uppercase">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {site.location} · Open to work
          </p>
        </div>

        {about.photo ? (
          <div
            onPointerMove={tilt.onPointerMove}
            onPointerLeave={tilt.onPointerLeave}
            className="relative mx-auto w-full max-w-sm transition-transform duration-300 ease-out md:max-w-none"
          >
            <div className="relative aspect-[4/5] overflow-hidden border border-line">
              <Image src={about.photo} alt={site.name} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover grayscale-[35%] contrast-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            </div>
            <span aria-hidden className="absolute -right-3 -bottom-3 -z-10 h-full w-full border border-accent/60" />
            <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.25em] text-paper/80 uppercase">Director · Producer</span>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
