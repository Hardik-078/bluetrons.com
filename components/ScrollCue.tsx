"use client";

import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useIntroComplete } from "@/lib/useIntroComplete";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Scrolled this far, in px, the cue has made its point and is gone. */
const FADE_DISTANCE = 160;

/**
 * The heroes' hint that the page goes on: a mono label running down beside a
 * hairline, with a drop of accent travelling the hairline and resting between
 * runs. Where it stands is the page's call (see .scroll-cue in globals.css).
 *
 * It arrives after the hero's own entrance (`delay`, counted from the intro
 * clearing) and leaves over the first few scroll steps, because by then the
 * visitor has found out for themselves. Once it has faded the loop is paused
 * as well as hidden (styles in globals.css), so it costs nothing for the rest
 * of the page. Decorative: scrolling is how the page is read anyway, so it is
 * hidden from assistive technology and takes no pointer events.
 */
export default function ScrollCue({
  delay = 0,
  className,
}: {
  /** Seconds after the intro clears before the cue appears. */
  delay?: number;
  /** Positions the cue; the component itself takes no layout decisions. */
  className?: string;
}) {
  const introDone = useIntroComplete();
  const reduce = useReducedMotion() ?? false;

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, FADE_DISTANCE], [1, 0]);

  // Changes only when the scroll crosses the threshold, not once a frame.
  const [gone, setGone] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y >= FADE_DISTANCE;
    setGone((prev) => (prev === next ? prev : next));
  });

  return (
    <div className={className} style={{ pointerEvents: "none" }} aria-hidden="true">
      <motion.div
        className="scroll-cue"
        data-gone={gone ? "true" : undefined}
        initial={{ opacity: 0, y: reduce ? 0 : 8 }}
        animate={introDone ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        <motion.div className="scroll-cue-inner" style={{ opacity }}>
          <span className="scroll-cue-label">Scroll</span>
          <span className="scroll-cue-track">
            <span className="scroll-cue-drop" />
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
