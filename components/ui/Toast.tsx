"use client";

import { AnimatePresence, motion } from "motion/react";

/** Small bottom-centre toast. Controlled by the parent via `message`. */
export function Toast({ message }: { message: string | null }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
      <AnimatePresence>
        {message ? (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 rounded-full border border-line bg-ink-2/95 px-5 py-3 text-sm text-paper shadow-2xl backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full bg-accent" />
            {message}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
