"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";

const FPS = 24;
const pad = (n: number) => String(n).padStart(2, "0");

function format(frames: number) {
  const f = frames % FPS;
  const s = Math.floor(frames / FPS) % 60;
  const m = Math.floor(frames / FPS / 60) % 60;
  const h = Math.floor(frames / FPS / 3600);
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
}

/** Decorative SMPTE timecode running at 24 fps. Writes to the DOM directly (no re-renders). */
export function Timecode({ className = "", start = 0 }: { className?: string; start?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;
    const t0 = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      el.textContent = format(start + Math.floor(((now - t0) / 1000) * FPS));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, start]);

  return (
    <span ref={ref} aria-hidden className={`font-mono text-[11px] tracking-widest tabular-nums ${className}`}>
      {format(start)}
    </span>
  );
}
