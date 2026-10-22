"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { contact } from "@/data/content";
import { scrollToId, useLenis } from "@/components/providers/SmoothScroll";

/** Sticky CTA that appears once the hero is gone and hides again at the contact section. */
export function HireMeButton() {
  const lenis = useLenis();
  const [heroVisible, setHeroVisible] = useState(true);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const contactEl = document.getElementById("contact");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setHeroVisible(e.isIntersecting);
        if (e.target === contactEl) setContactVisible(e.isIntersecting);
      }
    });
    if (hero) io.observe(hero);
    if (contactEl) io.observe(contactEl);
    return () => io.disconnect();
  }, []);

  const show = !heroVisible && !contactVisible;

  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          type="button"
          onClick={() => scrollToId(lenis, "contact")}
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[70] flex items-center gap-2.5 rounded-full bg-accent py-3 pr-5 pl-4 font-display text-xl tracking-wider text-paper shadow-[0_10px_40px_rgba(192,57,43,0.45)] transition-colors hover:bg-paper hover:text-ink md:right-6 md:bottom-6"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-paper opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-paper" />
          </span>
          {contact.hireMe}
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
