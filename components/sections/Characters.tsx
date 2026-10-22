"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { characters, type CharacterSheet } from "@/data/content";
import { useMediaQuery, useReducedMotion } from "@/hooks/useMediaQuery";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Lightbox } from "@/components/ui/Lightbox";

gsap.registerPlugin(ScrollTrigger);

function SheetCard({ c, sizes, priority = false }: { c: CharacterSheet; sizes: string; priority?: boolean }) {
  return (
    <>
      <div className="relative aspect-[4/5] overflow-hidden border border-line bg-ink-2">
        <Image src={c.image} alt={`${c.name}: ${c.note}`} fill sizes={sizes} priority={priority} className="object-cover" draggable={false} />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/85 to-transparent" />
        <span className="absolute right-2.5 bottom-2.5 bg-accent px-2 py-0.5 font-mono text-[10px] tracking-widest text-paper uppercase">{c.project}</span>
      </div>
      <p className="mt-3 font-display text-2xl leading-none tracking-wide text-paper">{c.name}</p>
      <p className="mt-1 text-xs text-muted">{c.note}</p>
    </>
  );
}

/**
 * Desktop: cards arranged in a ring in 3D space (CSS 3D, GPU-cheap),
 * rotated by scrolling past the section and by dragging.
 */
function Ring({ onOpen }: { onOpen: (i: number) => void }) {
  const scene = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const n = characters.length;
  const step = 360 / n;
  const cardW = 300;
  const radius = Math.round(cardW / 2 / Math.tan(Math.PI / n)) + 90;

  useEffect(() => {
    const sceneEl = scene.current;
    const ringEl = ring.current;
    if (!sceneEl || !ringEl) return;

    const state = { scroll: 0, drag: 0, target: 0, current: 0, velocity: 0 };
    let dragging: { x: number; base: number; moved: number } | null = null;

    const st = ScrollTrigger.create({
      trigger: sceneEl,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        state.scroll = self.progress * -step * (n - 1);
      },
    });

    const tick = () => {
      if (!dragging) state.drag += state.velocity;
      state.velocity *= 0.92;
      state.target = state.scroll + state.drag;
      state.current += (state.target - state.current) * 0.08;
      ringEl.style.transform = `translateZ(${-radius}px) rotateY(${state.current}deg)`;
      // Fade cards that face away
      ringEl.querySelectorAll<HTMLElement>("[data-ring-card]").forEach((card, i) => {
        const a = (((i * step + state.current) % 360) + 360) % 360;
        const facing = Math.cos((a * Math.PI) / 180);
        card.style.opacity = String(0.25 + Math.max(0, facing) * 0.75);
      });
    };
    gsap.ticker.add(tick);

    const onDown = (e: PointerEvent) => {
      dragging = { x: e.clientX, base: state.drag, moved: 0 };
      state.velocity = 0;
      sceneEl.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragging.x;
      dragging.moved = Math.max(dragging.moved, Math.abs(dx));
      const next = dragging.base + dx * 0.25;
      state.velocity = next - state.drag;
      state.drag = next;
    };
    const onUp = (e: PointerEvent) => {
      const d = dragging;
      dragging = null;
      if (d && d.moved < 6) {
        // It was a click: open the card under the pointer
        sceneEl.releasePointerCapture(e.pointerId);
        const hit = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-ring-card]");
        if (hit) onOpen(Number(hit.dataset.index));
      }
    };

    sceneEl.addEventListener("pointerdown", onDown);
    sceneEl.addEventListener("pointermove", onMove);
    sceneEl.addEventListener("pointerup", onUp);
    sceneEl.addEventListener("pointercancel", onUp);
    return () => {
      st.kill();
      gsap.ticker.remove(tick);
      sceneEl.removeEventListener("pointerdown", onDown);
      sceneEl.removeEventListener("pointermove", onMove);
      sceneEl.removeEventListener("pointerup", onUp);
      sceneEl.removeEventListener("pointercancel", onUp);
    };
  }, [n, step, radius, onOpen]);

  return (
    <div
      ref={scene}
      data-cursor="drag"
      className="relative mx-auto flex h-[680px] touch-pan-y items-center justify-center select-none [perspective:1500px]"
    >
      <div ref={ring} className="relative h-[520px] [transform-style:preserve-3d]" style={{ width: cardW }}>
        {characters.map((c, i) => (
          <div
            key={c.id}
            data-ring-card
            data-index={i}
            className="absolute inset-0 [backface-visibility:hidden]"
            style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
          >
            <button
              type="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpen(i))}
              className="block w-full text-left transition-transform duration-300 hover:-translate-y-2"
              aria-label={`Open ${c.name} character sheet`}
              data-cursor="view"
            >
              <SheetCard c={c} sizes="300px" />
            </button>
          </div>
        ))}
      </div>
      <p className="absolute bottom-0 font-mono text-[10px] tracking-[0.3em] text-muted uppercase">Drag or scroll to rotate · click to open</p>
    </div>
  );
}

/** Phones / reduced motion: native swipe carousel with scroll-snap. */
function Swipe({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8">
      {characters.map((c, i) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onOpen(i)}
          className="w-[72vw] max-w-[300px] shrink-0 snap-center text-left md:w-[300px]"
          aria-label={`Open ${c.name} character sheet`}
        >
          <SheetCard c={c} sizes="(min-width: 768px) 300px, 72vw" />
        </button>
      ))}
    </div>
  );
}

export function Characters() {
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  const [open, setOpen] = useState<number | null>(null);
  const useRing = wide && !reduced;
  const close = useCallback(() => setOpen(null), []);

  return (
    <Section id="characters" ariaLabel="Character sheets" className="overflow-hidden px-4 pt-24 pb-28 md:px-8 md:pt-36 md:pb-36">
      <div className="mx-auto max-w-7xl">
        <SectionTitle scene="03 — Characters" title="Character Sheets" sub="Front, side and back views, expressions and outfits. The same face in every shot." />
        {useRing ? <Ring onOpen={setOpen} /> : <Swipe onOpen={setOpen} />}
      </div>
      <AnimatePresence>
        {open !== null ? <Lightbox items={characters} index={open} onIndex={setOpen} onClose={close} /> : null}
      </AnimatePresence>
    </Section>
  );
}
