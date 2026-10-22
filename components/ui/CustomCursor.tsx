"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useIsDesktop, useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Small dot that follows the mouse. Over any element with
 * `data-cursor="play"` it grows into a "PLAY" circle; `data-cursor="view"`
 * shows "VIEW", `data-cursor="drag"` shows "DRAG". Desktop only.
 */
export function CustomCursor() {
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const enabled = isDesktop && !reduced;

  useEffect(() => {
    if (!enabled || !dot.current || !label.current) return;
    const el = dot.current;
    const text = label.current;
    document.documentElement.classList.add("has-cursor");
    gsap.set(el, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(el, "x", { duration: 0.25, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.25, ease: "power3" });
    let mode = "";

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      gsap.to(el, { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
    };
    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor], a, button");
      const next = target?.dataset.cursor ?? (target ? "link" : "");
      if (next === mode) return;
      mode = next;
      const big = mode === "play" || mode === "view" || mode === "drag";
      text.textContent = big ? mode.toUpperCase() : "";
      gsap.to(el, {
        width: big ? 88 : mode === "link" ? 36 : 10,
        height: big ? 88 : mode === "link" ? 36 : 10,
        backgroundColor: big ? "rgba(192,57,43,0.92)" : mode === "link" ? "rgba(240,236,228,0)" : "rgba(240,236,228,1)",
        borderColor: mode === "link" ? "rgba(240,236,228,0.9)" : "rgba(240,236,228,0)",
        duration: 0.3,
        ease: "power3.out",
      });
    };
    const onLeave = () => gsap.to(el, { autoAlpha: 0, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] flex h-2.5 w-2.5 items-center justify-center rounded-full border border-transparent bg-paper opacity-0"
    >
      <span ref={label} className="font-display text-lg tracking-widest text-paper" />
    </div>
  );
}
