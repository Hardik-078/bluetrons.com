"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query.
 *
 * Server snapshot is always false, so anything gated on this renders in its
 * non-enhanced form first. Callers must make that the correct resting state —
 * a scroll-driven transform, for example, starts at zero either way, so there
 * is no hydration shift.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === "undefined") return () => {};
      const media = window.matchMedia(query);
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  }, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
