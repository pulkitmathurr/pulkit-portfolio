"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  /** Small slate label, e.g. "02 — Work" */
  scene: string;
  title: string;
  sub?: string;
  className?: string;
};

/** Section heading that wipes in like a film cut (clip-path) as it enters the viewport. */
export function SectionTitle({ scene, title, sub, className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
        tl.fromTo("[data-wipe-bar]", { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power3.inOut", transformOrigin: "left" })
          .fromTo(
            "[data-wipe-text]",
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power4.inOut" },
            "-=0.15",
          )
          .to("[data-wipe-bar]", { scaleX: 0, transformOrigin: "right", duration: 0.35, ease: "power3.in" }, "-=0.45");
        if (sub) tl.fromTo("[data-wipe-sub]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.3");
      });
    },
    { scope: root, dependencies: [sub] },
  );

  return (
    <div ref={root} className={`mb-10 md:mb-14 ${className}`}>
      <p className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
        <span className="inline-block h-px w-8 bg-accent" />
        {scene}
      </p>
      <div className="relative">
        <h2
          data-wipe-text
          className="font-display text-[clamp(3rem,10vw,8.5rem)] leading-[0.85] tracking-tight text-paper uppercase"
        >
          {title}
        </h2>
        <span data-wipe-bar aria-hidden className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-accent" />
      </div>
      {sub ? (
        <p data-wipe-sub className="mt-4 max-w-xl text-base text-muted md:text-lg">
          {sub}
        </p>
      ) : null}
    </div>
  );
}
