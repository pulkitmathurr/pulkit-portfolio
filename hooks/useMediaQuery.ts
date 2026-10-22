"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Subscribes to a CSS media query. Returns `false` on the server. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

/** Desktop = wide screen with a precise pointer that can hover. */
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px) and (hover: hover) and (pointer: fine)");

export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
