"use client";

import { useCallback, type PointerEvent } from "react";

const REST = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";

/** Puts a tilted element back to rest. */
export function resetTilt(el: HTMLElement | null) {
  if (el) el.style.transform = REST;
}

/**
 * 3D perspective tilt that follows the pointer. Spread the returned handlers
 * on the element; it writes CSS transforms directly (no re-renders).
 * Mouse/pen only, never touch.
 */
export function useTilt<T extends HTMLElement>(max = 10, enabled = true) {
  const onPointerMove = useCallback(
    (e: PointerEvent<T>) => {
      if (!enabled || e.pointerType === "touch") return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale(1.02)`;
      el.style.setProperty("--glare-x", `${(px + 0.5) * 100}%`);
      el.style.setProperty("--glare-y", `${(py + 0.5) * 100}%`);
    },
    [max, enabled],
  );

  const onPointerLeave = useCallback((e: PointerEvent<T>) => resetTilt(e.currentTarget), []);

  return { onPointerMove, onPointerLeave };
}
