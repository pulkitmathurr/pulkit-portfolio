"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  id: string;
  children: ReactNode;
  className?: string;
  /** Fade from black as the section enters, like a film cut. */
  fade?: boolean;
  ariaLabel?: string;
};

/** Major page section with a fade-from-black transition on enter. */
export function Section({ id, children, className = "", fade = true, ariaLabel }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!fade) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-fade-black]",
          { opacity: 1 },
          {
            opacity: 0,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 95%", end: "top 35%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id={id} ref={root} aria-label={ariaLabel} className={`relative ${className}`}>
      {children}
      {fade ? <div data-fade-black aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-ink opacity-0" /> : null}
    </section>
  );
}
