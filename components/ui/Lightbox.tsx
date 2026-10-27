"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { CharacterSheet } from "@/data/content";
import { useLenis } from "@/components/providers/SmoothScroll";

type Props = {
  items: CharacterSheet[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
};

const MIN = 1;
const MAX = 4;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Fullscreen image viewer with wheel / pinch / double-tap zoom and drag-to-pan. */
export function Lightbox({ items, index, onIndex, onClose }: Props) {
  const lenis = useLenis();
  const item = items[index];
  const stage = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const [shot, setShot] = useState(0);
  const current = item.views?.[shot] ?? item;
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);

  /** Zoom by a delta; `toggle` jumps between 1x and 2.2x. */
  const zoomBy = useCallback((delta: number | "toggle") => {
    setView((v) => {
      const s = delta === "toggle" ? (v.scale > 1 ? 1 : 2.2) : clamp(v.scale + delta, MIN, MAX);
      return s === 1 ? { scale: 1, x: 0, y: 0 } : { scale: s, x: v.x, y: v.y };
    });
  }, []);

  const go = useCallback(
    (dir: number) => {
      setView({ scale: 1, x: 0, y: 0 });
      setShot(0);
      onIndex((index + dir + items.length) % items.length);
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "+" || e.key === "=") zoomBy(0.5);
      else if (e.key === "-") zoomBy(-0.5);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lenis, onClose, go, zoomBy]);

  // Wheel zoom (non-passive so the page does not scroll)
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setView((v) => {
        const s = clamp(v.scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12), MIN, MAX);
        return s === 1 ? { scale: 1, x: 0, y: 0 } : { ...v, scale: s };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: ReactPointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: view.scale };
      drag.current = null;
    } else {
      drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    }
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const s = clamp((pinch.current.scale * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.current.dist, MIN, MAX);
      setView((v) => ({ ...v, scale: s }));
    } else if (drag.current && view.scale > 1) {
      const d = drag.current;
      setView((v) => ({ ...v, x: d.vx + (e.clientX - d.x) / v.scale, y: d.vy + (e.clientY - d.y) / v.scale }));
    }
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) {
      const d = drag.current;
      drag.current = null;
      // Swipe left/right to change sheet when not zoomed
      if (d && view.scale === 1 && e.pointerType !== "mouse") {
        const dx = e.clientX - d.x;
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
      }
      if (view.scale <= 1.02) setView({ scale: 1, x: 0, y: 0 });
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} character sheet`}
      className="fixed inset-0 z-[80] flex flex-col bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-lenis-prevent
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 md:px-6">
        <div className="min-w-0">
          <p className="truncate font-display text-2xl leading-none tracking-wide text-paper md:text-3xl">{item.name}</p>
          <p className="truncate font-mono text-[11px] tracking-wider text-muted">
            {item.project} · {item.note}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => zoomBy(-0.5)} className="lb-btn" aria-label="Zoom out">
            −
          </button>
          <span className="w-12 text-center font-mono text-xs text-muted tabular-nums">{Math.round(view.scale * 100)}%</span>
          <button type="button" onClick={() => zoomBy(0.5)} className="lb-btn" aria-label="Zoom in">
            +
          </button>
          <button type="button" onClick={onClose} className="lb-btn ml-2 hover:!bg-accent" aria-label="Close">
            ✕
          </button>
        </div>
      </div>

      <div
        ref={stage}
        className={`relative flex-1 touch-none overflow-hidden select-none ${view.scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => zoomBy("toggle")}
      >
        <div
          className="absolute inset-4 transition-transform duration-75 ease-out md:inset-8"
          style={{ transform: `scale(${view.scale}) translate(${view.x}px, ${view.y}px)` }}
        >
          <Image key={current.image} src={current.image} alt={`${item.name}: ${item.note}`} fill sizes="100vw" quality={90} className="object-contain" draggable={false} />
        </div>
      </div>

      {item.views ? (
        <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto border-t border-line px-4 py-3">
          {item.views.map((v, i) => (
            <button
              key={v.image}
              type="button"
              onClick={() => {
                setView({ scale: 1, x: 0, y: 0 });
                setShot(i);
              }}
              className={`shrink-0 text-center transition-opacity ${i === shot ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
              aria-label={`${item.name}, ${v.label}`}
              aria-pressed={i === shot}
            >
              <span className={`relative block h-14 w-14 overflow-hidden border ${i === shot ? "border-accent" : "border-line"}`}>
                <Image src={v.image} alt="" fill sizes="56px" className="object-cover" draggable={false} />
              </span>
              <span className="mt-1 block font-mono text-[9px] tracking-wider text-muted uppercase">{v.label}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between border-t border-line px-4 py-3 md:px-6">
        <button type="button" onClick={() => go(-1)} className="lb-btn !w-auto px-4 font-mono text-xs tracking-widest">
          ← PREV
        </button>
        <span className="font-mono text-xs text-muted tabular-nums">
          {index + 1} / {items.length} · <span className="hidden sm:inline">scroll or pinch to zoom, drag to pan</span>
          <span className="sm:hidden">pinch to zoom</span>
        </span>
        <button type="button" onClick={() => go(1)} className="lb-btn !w-auto px-4 font-mono text-xs tracking-widest">
          NEXT →
        </button>
      </div>
    </motion.div>
  );
}
