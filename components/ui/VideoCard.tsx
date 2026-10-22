"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { Video } from "@/data/content";
import { resetTilt, useTilt } from "@/hooks/useTilt";
import { useReducedMotion } from "@/hooks/useMediaQuery";

type Props = {
  video: Video;
  index: number;
  onOpen: (id: string) => void;
};

export function VideoCard({ video, index, onOpen }: Props) {
  const reduced = useReducedMotion();
  const tilt = useTilt<HTMLDivElement>(9, !reduced && !video.comingSoon);
  const preview = useRef<HTMLVideoElement>(null);
  const [previewOn, setPreviewOn] = useState(false);
  const locked = Boolean(video.comingSoon);

  const startPreview = () => {
    if (!video.previewSrc || reduced) return;
    setPreviewOn(true);
    // src is only attached on first hover so nothing downloads up front
    requestAnimationFrame(() => preview.current?.play().catch(() => {}));
  };
  const stopPreview = () => {
    preview.current?.pause();
    setPreviewOn(false);
  };

  const body = (
    <>
      <motion.div
        layoutId={locked ? undefined : `media-${video.id}`}
        className="relative aspect-video overflow-hidden bg-black"
      >
        <Image
          src={video.thumbnail}
          alt={locked ? "" : `${video.title} thumbnail`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className={`object-cover transition duration-700 group-hover:scale-105 ${locked ? "scale-110 blur-md grayscale" : ""}`}
        />
        {video.previewSrc && !locked ? (
          <video
            ref={preview}
            src={previewOn ? video.previewSrc : undefined}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${previewOn ? "opacity-100" : "opacity-0"}`}
          />
        ) : null}
        {/* glare follows the pointer (set by useTilt) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(circle at var(--glare-x,50%) var(--glare-y,50%), rgba(255,255,255,0.14), transparent 55%)" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
        <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.25em] text-paper/80">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute top-3 right-3 bg-black/60 px-2 py-1 font-mono text-[10px] tracking-widest text-paper/90">
          {video.duration}
        </span>
        {locked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
            <svg viewBox="0 0 24 24" className="h-8 w-8 stroke-paper/80" fill="none" strokeWidth="1.5" aria-hidden>
              <rect x="5" y="11" width="14" height="10" rx="1" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            <span className="font-display text-2xl tracking-widest text-paper/90">Coming soon</span>
          </div>
        ) : (
          <span className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-paper shadow-lg transition group-hover:scale-110 md:opacity-0 md:group-hover:opacity-100">
            <svg viewBox="0 0 12 12" className="ml-0.5 h-3.5 w-3.5 fill-current" aria-hidden>
              <path d="M2 1l9 5-9 5z" />
            </svg>
          </span>
        )}
      </motion.div>
      <div className="flex items-start justify-between gap-4 pt-4">
        <div className="min-w-0">
          <h3 className="font-display text-3xl leading-none tracking-wide text-paper md:text-4xl">{video.title}</h3>
          <p className="mt-1 font-mono text-[11px] tracking-[0.2em] text-accent uppercase">{video.type}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{video.tagline}</p>
        </div>
      </div>
    </>
  );

  return (
    <div
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={(e) => {
        tilt.onPointerLeave(e);
        stopPreview();
      }}
      onPointerEnter={(e) => e.pointerType !== "touch" && startPreview()}
      className="group relative transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d]"
    >
      {locked ? (
        <div aria-label={`${video.title}: coming soon`} className="block opacity-80">
          {body}
        </div>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            stopPreview();
            resetTilt(e.currentTarget.parentElement);
            onOpen(video.id);
          }}
          data-cursor="play"
          aria-label={`Play ${video.title}`}
          className="block w-full text-left"
        >
          {body}
        </button>
      )}
    </div>
  );
}
