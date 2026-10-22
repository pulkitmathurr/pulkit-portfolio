"use client";

import { useRef } from "react";
import Image from "next/image";
import { useAutoPause } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { Letterbox } from "@/components/ui/Letterbox";
import { Timecode } from "@/components/ui/Timecode";

/** A letterboxed clip that only plays while visible. Falls back to the poster. */
export function StageClip({ src, poster, label, start }: { src?: string; poster: string; label: string; start: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  useAutoPause(ref, Boolean(src) && !reduced);

  return (
    <Letterbox>
      <Image src={poster} alt={label} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
      {src && !reduced ? (
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div className="absolute right-3 bottom-2 left-3 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.25em] text-paper/80 uppercase">{label}</span>
        <Timecode className="text-paper/70" start={start} />
      </div>
    </Letterbox>
  );
}
