import type { ReactNode } from "react";

/**
 * Frames its children in a 2.39:1 "scope" window with black bars and
 * corner crop marks. Children should fill the box (absolute / object-cover).
 */
export function Letterbox({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative aspect-[2.39/1] w-full overflow-hidden bg-black ${className}`}>
      {children}
      <span aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.75)]" />
      {(["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"] as const).map(
        (pos) => (
          <span key={pos} aria-hidden className={`pointer-events-none absolute h-4 w-4 border-paper/50 ${pos}`} />
        ),
      )}
    </div>
  );
}
