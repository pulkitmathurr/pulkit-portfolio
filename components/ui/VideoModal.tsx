"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { Video } from "@/data/content";
import { toEmbedUrl } from "@/lib/embed";
import { useLenis } from "@/components/providers/SmoothScroll";

type Props = { video: Video; onClose: () => void };

/** Fullscreen player. The media box shares a layoutId with the card thumbnail. */
export function VideoModal({ video, onClose }: Props) {
  const lenis = useLenis();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const embed = toEmbedUrl(video.url);

  useEffect(() => {
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      opener?.focus({ preventScroll: true });
    };
  }, [lenis, onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={video.title} className="fixed inset-0 z-[80]">
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div data-lenis-prevent className="relative h-full overflow-y-auto overscroll-contain">
        <div className="mx-auto flex min-h-full max-w-6xl flex-col justify-center px-4 py-16 md:px-8">
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            className="fixed top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 bg-black/60 text-paper transition hover:border-accent hover:bg-accent md:top-6 md:right-6"
            aria-label="Close video"
          >
            <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 stroke-current" strokeWidth="1.5" aria-hidden>
              <path d="M1 1l10 10M11 1L1 11" />
            </svg>
          </button>

          <motion.div
            layoutId={`media-${video.id}`}
            className="relative aspect-video w-full overflow-hidden bg-black shadow-2xl"
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            {embed ? (
              <iframe
                src={embed}
                title={video.title}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                loading="lazy"
              />
            ) : video.src ? (
              <video
                src={video.src}
                poster={video.thumbnail}
                title={video.title}
                className="absolute inset-0 h-full w-full"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <>
                <Image src={video.thumbnail} alt="" fill sizes="(min-width: 1152px) 1152px, 100vw" className="object-cover" />
                <div className="absolute inset-0 flex items-end justify-center bg-black/55 pb-6">
                  <p className="font-mono text-xs tracking-[0.25em] text-paper/80 uppercase">Full video link coming soon</p>
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4 } }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.15 } }}
            className="mt-8 grid gap-10 md:grid-cols-[1.6fr_1fr]"
          >
            <div>
              <p className="font-mono text-[11px] tracking-[0.25em] text-accent uppercase">
                {video.type} · {video.duration}
              </p>
              <h2 className="mt-2 font-display text-5xl leading-none text-paper md:text-7xl">{video.title}</h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-paper/80 md:text-lg">{video.description}</p>
              {video.tools.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {video.tools.map((t) => (
                    <span key={t} className="border border-line px-3 py-1.5 font-mono text-[11px] tracking-wider text-paper/80">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            {video.roles.length ? (
              <div className="border-t border-line pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
                <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-muted uppercase">My role</p>
                <ul className="space-y-2">
                  {video.roles.map((r) => (
                    <li key={r} className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
                      <span className="font-display text-2xl tracking-wide text-paper">{r}</span>
                      <span className="font-mono text-[11px] text-muted">Pulkit Mathur</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
