"use client";

import { useId } from "react";
import { motion } from "motion/react";

interface BluetronsMarkProps {
  className?: string;
  size?: number;
  animated?: boolean;
  glow?: boolean;
}

/**
 * Geometry of the Bluetrons three-line diagonal mark — the motif that replaces
 * the "E" in the wordmark. Three parallel bars on a 45-degree axis.
 *
 * Exported so AboutZoomGate can drive the same bars individually without
 * duplicating the coordinates.
 *
 * Gradient stops are applied via `style`, never the stop-color presentation
 * attribute: var() is not resolved inside SVG presentation attributes in
 * Chrome, which would render the mark with no paint at all.
 */
export const MARK_BARS = [
  { id: "bar-1", x1: 26, y1: 46, x2: 56, y2: 16, delay: 0.1 },
  { id: "bar-2", x1: 38, y1: 58, x2: 68, y2: 28, delay: 0.22 },
  { id: "bar-3", x1: 50, y1: 70, x2: 80, y2: 40, delay: 0.34 },
] as const;

export const MARK_GRADIENT_STOPS = [
  { offset: "0%", color: "var(--mark-stop-1)" },
  { offset: "50%", color: "var(--mark-stop-2)" },
  { offset: "100%", color: "var(--mark-stop-3)" },
] as const;

/**
 * Authentic Bluetrons three-line diagonal mark.
 */
export default function BluetronsMark({
  className = "",
  size = 48,
  animated = true,
  glow = true,
}: BluetronsMarkProps) {

  // The mark renders many times on a single page. Hardcoded defs ids would
  // collide across instances and later marks could resolve the wrong paint
  // server, so scope both ids per instance.
  const uid = useId().replace(/:/g, "");
  const gradientId = `mark-grad-${uid}`;
  const bloomId = `mark-bloom-${uid}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label="Bluetrons Mark"
    >
      {glow && (
        <div
          className="absolute inset-0 -z-10 rounded-full blur-xl opacity-50 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--accent) 0%, var(--accent-deep) 65%, transparent 80%)",
          }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            {MARK_GRADIENT_STOPS.map((stop) => (
              <stop
                key={stop.offset}
                offset={stop.offset}
                style={{ stopColor: stop.color }}
              />
            ))}
          </linearGradient>
          <filter id={bloomId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {MARK_BARS.map((bar) => {
          const shared = {
            x1: bar.x1,
            y1: bar.y1,
            x2: bar.x2,
            y2: bar.y2,
            stroke: `url(#${gradientId})`,
            strokeWidth: 7,
            strokeLinecap: "round" as const,
            filter: glow ? `url(#${bloomId})` : undefined,
          };

          if (!animated) {
            return <line key={bar.id} {...shared} />;
          }

          return (
            <motion.line
              key={bar.id}
              {...shared}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                pathLength: {
                  duration: 0.85,
                  delay: bar.delay,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: {
                  duration: 0.3,
                  delay: bar.delay,
                  ease: "easeOut",
                },
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
