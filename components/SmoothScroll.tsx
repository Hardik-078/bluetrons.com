"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

/**
 * Smooths the page's scroll.
 *
 * The homepage is built from sticky layers that the next section scrolls over:
 * the hero under the paper, the three commitments as stacked tabs. Layout like
 * that is exactly as smooth as the scroll driving it, and a mouse wheel moves
 * the page in notch-sized jumps. Lenis eases toward each wheel target instead,
 * so every cover travels continuously.
 *
 * It still scrolls the window itself, so sticky positioning, scroll events and
 * every useScroll on the site keep working unchanged, with nothing to sync.
 * Touch is left native: phones already scroll with momentum.
 *
 * Not mounted for reduced motion. Eased scrolling is motion the visitor did not
 * ask for, and native scrolling is the correct fallback.
 */
export default function SmoothScroll() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: true, autoRaf: true }} />
  );
}
