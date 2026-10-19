"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

interface RevealProps {
  children: ReactNode;
  /** Stagger position. Multiplied by 60ms, capped so long lists never crawl. */
  order?: number;
  /** Travel distance in px. */
  y?: number;
  className?: string;
  as?: "div" | "li" | "span" | "p";
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Scroll-triggered entrance. Replaces the inline whileInView blocks that were
 * copy-pasted through the old About chapters, so timing stays consistent.
 */
export default function Reveal({
  children,
  order = 0,
  y = 24,
  className = "",
  as = "div",
}: RevealProps) {
  const Component = motion[as];

  // 60ms between items reads as a cascade; past ~8 items the wait stops
  // being decorative and starts feeling like latency.
  const delay = Math.min(order, 8) * 0.06;


  return (
    <Component
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}
