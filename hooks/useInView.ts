"use client";

import { useEffect, useState, type RefObject } from "react";

/** True while the element intersects the viewport (plus `rootMargin`). */
export function useInView<T extends Element>(ref: RefObject<T | null>, rootMargin = "0px"): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

/** Plays a muted <video> while it is on screen and pauses it when it leaves. */
export function useAutoPause(ref: RefObject<HTMLVideoElement | null>, enabled = true) {
  useEffect(() => {
    const video = ref.current;
    if (!video || !enabled) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [ref, enabled]);
}
