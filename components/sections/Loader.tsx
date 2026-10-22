"use client";

import { useEffect } from "react";

const DURATION = 1400;

function finish() {
  const html = document.documentElement;
  if (html.dataset.intro !== "1") return;
  try {
    sessionStorage.setItem("intro-seen", "1");
  } catch {}
  html.dataset.intro = "out";
  window.setTimeout(() => delete html.dataset.intro, 400);
}

/**
 * Film-leader countdown (3, 2, 1) shown on the first visit of a session.
 * Visibility is decided before paint by the inline script in app/layout.tsx;
 * the countdown itself is pure CSS. Click, tap or any key skips it.
 */
export function Loader() {
  useEffect(() => {
    if (document.documentElement.dataset.intro !== "1") return;
    const t = window.setTimeout(finish, DURATION);
    window.addEventListener("keydown", finish, { once: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", finish);
    };
  }, []);

  return (
    <div
      className="intro fixed inset-0 z-[200] items-center justify-center bg-ink"
      onClick={finish}
      role="presentation"
    >
      <div className="intro-flicker absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(240,236,228,0.16),transparent_60%)]" />
      <div className="relative flex aspect-square w-[min(62vw,340px)] items-center justify-center">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full text-paper/60" aria-hidden>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="0.75" />
          <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeWidth="0.75" />
          <g className="intro-sweep" style={{ transformOrigin: "100px 100px" }}>
            <path d="M100 100 L100 8 A92 92 0 0 1 192 100 Z" fill="rgba(192,57,43,0.35)" />
          </g>
        </svg>
        <div className="relative grid font-display text-[clamp(7rem,30vw,11rem)] leading-none text-paper">
          {["3", "2", "1"].map((n) => (
            <span key={n} className="intro-num col-start-1 row-start-1 text-center">
              {n}
            </span>
          ))}
        </div>
      </div>
      <p className="absolute bottom-8 font-mono text-[10px] tracking-[0.35em] text-muted uppercase">Tap to skip</p>
    </div>
  );
}
