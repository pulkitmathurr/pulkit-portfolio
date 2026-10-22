"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { hero, site } from "@/data/content";
import { useAutoPause, useInView } from "@/hooks/useInView";
import { useIsMobile, useReducedMotion } from "@/hooks/useMediaQuery";
import { scrollToId, useLenis } from "@/components/providers/SmoothScroll";
import { Timecode } from "@/components/ui/Timecode";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const lenis = useLenis();
  const inView = useInView(root);
  const hasVideo = Boolean(hero.showreelMp4 || hero.showreelWebm);
  const [first, last] = site.name.toUpperCase().split(" ");

  useAutoPause(video, hasVideo && !reduced);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrance
        gsap.from("[data-hero-in]", { y: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.08, delay: 0.15 });

        // On scroll: the name splits apart and fades while the frame zooms out.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
        tl.to("[data-split=left]", { xPercent: -35, autoAlpha: 0, ease: "none" }, 0)
          .to("[data-split=right]", { xPercent: 35, autoAlpha: 0, ease: "none" }, 0)
          .to("[data-hero-fade]", { y: -60, autoAlpha: 0, ease: "none" }, 0)
          .fromTo("[data-hero-frame]", { scale: 1 }, { scale: 0.82, borderRadius: 18, ease: "none" }, 0)
          .to("[data-hero-dim]", { opacity: 0.85, ease: "none" }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" aria-label="Intro" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink">
      {/* Showreel frame */}
      <div data-hero-frame className="absolute inset-0 overflow-hidden will-change-transform">
        <Image src={hero.poster} alt="" fill priority sizes="100vw" className="object-cover" />
        {hasVideo && !reduced ? (
          <video
            ref={video}
            className="absolute inset-0 h-full w-full object-cover"
            poster={hero.poster}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-hidden
          >
            {hero.showreelWebm ? <source src={hero.showreelWebm} type="video/webm" /> : null}
            {hero.showreelMp4 ? <source src={hero.showreelMp4} type="video/mp4" /> : null}
          </video>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/20 to-ink/90" />
        <div data-hero-dim className="absolute inset-0 bg-ink opacity-0" />
      </div>

      {/* 3D dust in a projector beam */}
      {!reduced ? (
        <div className="pointer-events-none absolute inset-0">
          <HeroScene lite={mobile} active={inView} />
        </div>
      ) : null}

      {/* Letterbox bars (2.39:1) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[max(0px,calc((100svh-100vw/2.39)/2))] max-h-[14svh] bg-black" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[max(0px,calc((100svh-100vw/2.39)/2))] max-h-[14svh] bg-black" />

      {/* HUD */}
      <div data-hero-fade className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-4 md:p-6">
        <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-paper/80 uppercase">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" /> Rec · Showreel
        </span>
        <Timecode className="text-paper/70" start={24 * 3} />
      </div>

      {/* Title */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center">
        <div data-hero-fade>
          <p data-hero-in className="mb-4 font-mono text-[9px] tracking-[0.2em] text-paper/70 uppercase sm:text-[10px] sm:tracking-[0.35em] md:text-xs">
            {hero.kicker}
          </p>
        </div>
        <h1 className="font-display text-[clamp(4.5rem,17vw,15rem)] leading-[0.82] tracking-tight text-paper uppercase">
          <span className="sr-only">{site.name}</span>
          <span aria-hidden className="flex flex-col items-center gap-0 md:flex-row md:gap-[0.2em]">
            <span data-hero-in className="block">
              <span data-split="left" className="block">
                {first}
              </span>
            </span>
            <span data-hero-in className="block">
              <span data-split="right" className="block">
                {last}
              </span>
            </span>
          </span>
        </h1>
        <div data-hero-fade className="flex w-full flex-col items-center">
        <p data-hero-in className="mt-4 text-xs tracking-[0.14em] whitespace-nowrap text-paper/90 uppercase sm:text-sm sm:tracking-[0.2em] md:text-base">
          {site.title.split("|").map((part, i) => (
            <span key={part}>
              {i > 0 ? <span className="mx-2 text-accent sm:mx-3">|</span> : null}
              {part.trim()}
            </span>
          ))}
        </p>

        <div data-hero-in className="mt-9 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={() => scrollToId(lenis, "work")}
            data-cursor="play"
            className="group inline-flex items-center justify-center gap-3 bg-accent px-7 py-4 font-display text-xl tracking-wider text-paper transition hover:bg-paper hover:text-ink"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3 fill-current" aria-hidden>
              <path d="M2 1l9 5-9 5z" />
            </svg>
            {hero.ctaPrimary}
          </button>
          <a
            href={site.resume}
            download
            className="inline-flex items-center justify-center gap-3 border border-paper/40 px-7 py-4 font-display text-xl tracking-wider text-paper backdrop-blur-sm transition hover:border-paper hover:bg-paper/10"
          >
            {hero.ctaSecondary}
            <svg viewBox="0 0 12 12" className="h-3 w-3 stroke-current" fill="none" strokeWidth="1.5" aria-hidden>
              <path d="M6 1v8M2.5 5.5L6 9l3.5-3.5M1 11h10" />
            </svg>
          </a>
        </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div data-hero-fade className="pointer-events-none absolute inset-x-0 bottom-[max(3rem,calc(min((100svh-100vw/2.39)/2,14svh)+0.75rem))] z-20 flex justify-center [@media(max-height:720px)]:hidden">
        <span className="flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-paper/60 uppercase">
          Scroll
          <span className="h-8 w-px origin-top animate-pulse bg-paper/50" />
        </span>
      </div>
    </section>
  );
}
