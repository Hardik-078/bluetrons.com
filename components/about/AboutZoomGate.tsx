"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { MARK_BARS, MARK_GRADIENT_STOPS } from "@/components/BluetronsMark";
import { useIntroComplete } from "@/lib/useIntroComplete";
import ScrollCue from "@/components/ScrollCue";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Deterministic star positions.
 *
 * Math.random() at render would produce different markup on server and client
 * and blow up hydration, so the field is generated once at module scope from a
 * fixed seed.
 */
function seeded(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function makeField(count: number, seed: number) {
  const rand = seeded(seed);
  return Array.from({ length: count }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: 0.8 + rand() * 1.6,
    opacity: 0.18 + rand() * 0.5,
  }));
}

const FIELD_FAR = makeField(48, 11);
const FIELD_MID = makeField(28, 77);
const FIELD_NEAR = makeField(14, 404);

/**
 * Each bar's escape vector, as a fraction of the shared travel distance.
 * The bars sit on a 45-degree axis running lower-left to upper-right, so they
 * separate along the perpendicular: bar 1 exits up-left, bar 3 exits down-right,
 * and bar 2 passes closest to the lens. The camera goes through the gaps.
 */
const BAR_ESCAPE = [
  { x: -1, y: -1 },
  { x: -0.3, y: -0.3 },
  { x: 1, y: 1 },
] as const;

function StarField({
  field,
  y,
  scale,
  opacity,
  blur,
}: {
  field: ReturnType<typeof makeField>;
  y: MotionValue<string>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  blur?: string;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ y, scale, opacity, filter: blur, willChange: "transform" }}
    >
      {/* Inner wrapper carries the theme multiplier so it composes with the
          seeded per-star opacity below and the animated opacity above. On
          light these are dark ink specks, not points of light, and the field
          is thinned so it reads as dust rather than noise. */}
      <div className="absolute inset-0" style={{ opacity: "var(--star-alpha)" }}>
        {field.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[var(--star)]"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function AboutZoomGate() {
  const trackRef = useRef<HTMLDivElement>(null);
  const introDone = useIntroComplete();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Light spring only — enough to take the stepping out of a scrubbed value
  // without introducing lag between the finger and the frame.
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // The camera push. Non-linear so it accelerates the way a real dolly does
  // rather than crawling forward at a constant rate.
  const markScale = useTransform(p, [0, 0.1, 0.45, 0.86], [1, 1.35, 6, 26]);
  const markOpacity = useTransform(p, [0, 0.72, 0.88], [1, 1, 0]);
  const stageBlur = useTransform(p, [0, 0.7, 0.9], [0, 0, 3]);
  const stageFilter = useMotionTemplate`blur(${stageBlur}px)`;
  const markTransform = useMotionTemplate`translate3d(-50%, -50%, 0) scale(${markScale})`;

  // Bars hold together through the approach, then separate hard as they reach
  // the lens — that late split is what sells "passing between them".
  const barTravel = useTransform(p, [0.3, 0.86], [0, 190]);
  const barStretch = useTransform(p, [0.45, 0.86], [1, 1.5]);

  // Hooks cannot run inside a map, so the three escape vectors are derived
  // explicitly. MARK_BARS is a fixed three-entry tuple, so this stays in sync.
  const bar0X = useTransform(barTravel, (v) => v * BAR_ESCAPE[0].x);
  const bar0Y = useTransform(barTravel, (v) => v * BAR_ESCAPE[0].y);
  const bar1X = useTransform(barTravel, (v) => v * BAR_ESCAPE[1].x);
  const bar1Y = useTransform(barTravel, (v) => v * BAR_ESCAPE[1].y);
  const bar2X = useTransform(barTravel, (v) => v * BAR_ESCAPE[2].x);
  const bar2Y = useTransform(barTravel, (v) => v * BAR_ESCAPE[2].y);
  const barOffsets = [
    { x: bar0X, y: bar0Y },
    { x: bar1X, y: bar1Y },
    { x: bar2X, y: bar2Y },
  ];

  // The headline sits on a far plane: it resolves at well under half the rate
  // of the mark, so it reads as genuinely distant rather than merely delayed.
  const lineBlur = useTransform(p, [0.3, 0.66], [18, 0]);
  const lineFilter = useMotionTemplate`blur(${lineBlur}px)`;
  const lineOpacity = useTransform(p, [0.28, 0.62], [0, 1]);
  const lineScale = useTransform(p, [0.28, 0.72], [1.14, 1]);
  const lineY = useTransform(p, [0, 1], ["6vh", "-6vh"]);

  // Opening beat: wordmark and label, gone well before the push begins.
  const introOpacity = useTransform(p, [0, 0.12], [1, 0]);
  const introY = useTransform(p, [0, 0.12], ["0vh", "-4vh"]);

  const farY = useTransform(p, [0, 1], ["0vh", "-6vh"]);
  const farScale = useTransform(p, [0, 1], [1, 1.5]);
  const farOpacity = useTransform(p, [0, 0.9], [0.9, 0.25]);

  const midY = useTransform(p, [0, 1], ["0vh", "-18vh"]);
  const midScale = useTransform(p, [0, 1], [1, 3]);
  const midOpacity = useTransform(p, [0, 0.85], [0.8, 0]);

  const nearY = useTransform(p, [0, 1], ["0vh", "-42vh"]);
  const nearScale = useTransform(p, [0, 1], [1, 7]);
  const nearOpacity = useTransform(p, [0, 0.7], [0.7, 0]);

  const railScale = useTransform(p, [0, 1], [0, 1]);


  return (
    <section
      ref={trackRef}
      className="sec-track relative h-[260vh] w-full md:h-[340vh]"
      aria-label="Introduction"
    >
      <div className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-clip">
        {/* Depth planes, slowest first. */}
        <StarField field={FIELD_FAR} y={farY} scale={farScale} opacity={farOpacity} />
        <StarField field={FIELD_MID} y={midY} scale={midScale} opacity={midOpacity} />
        <StarField
          field={FIELD_NEAR}
          y={nearY}
          scale={nearScale}
          opacity={nearOpacity}
          blur="blur(1px)"
        />

        {/* Core glow, anchored behind the mark. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
          style={{
            opacity: "var(--hero-glow-opacity)",
            background:
              "radial-gradient(circle, var(--hero-glow-1) 0%, var(--hero-glow-2) 55%, transparent 75%)",
          }}
        />

        {/* The headline, on the far plane behind the mark. */}
        <motion.div
          className="relative z-10 px-6 text-center"
          style={{
            opacity: lineOpacity,
            scale: lineScale,
            y: lineY,
            filter: lineFilter,
            willChange: "transform, opacity",
          }}
        >
          <h1 className="sec-display">
            <span className="block">Technology.</span>
            <span className="block">Reliability.</span>
            <span className="sec-display-accent block">Commitment.</span>
          </h1>
        </motion.div>

        {/* The mark. Blur lives on this wrapper, which is never scaled, so the
            radius stays in screen space instead of being multiplied by 26. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{ filter: stageFilter, opacity: markOpacity }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 h-[9vmin] w-[9vmin]"
            style={{ transform: markTransform, willChange: "transform" }}
          >
            {MARK_BARS.map((bar, i) => (
              <BarLayer
                key={bar.id}
                bar={bar}
                x={barOffsets[i].x}
                y={barOffsets[i].y}
                stretch={barStretch}
                gradientId={`zoom-bar-${i}`}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Opening beat. The wordmark is a raster asset, so it is shown at its
            resting size and faded out — never scaled up into the zoom. */}
        <motion.div
          className="absolute inset-x-0 bottom-[12vh] z-30 flex flex-col items-center gap-4 px-6"
          style={{ opacity: introOpacity, y: introY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        >
          <Image
            src="/images/bluetrons-logo.webp"
            alt="Bluetrons"
            width={939}
            height={143}
            priority
            unoptimized
            className="h-6 w-auto object-contain opacity-90 sm:h-7"
          />
          <p className="sec-eyebrow text-center">Bluetron Infotech LLP</p>
        </motion.div>

        {/* Progress rail — wayfinding for a long pinned scene. */}
        <div
          aria-hidden="true"
          className="absolute right-4 top-1/2 z-30 h-24 w-px -translate-y-1/2 bg-rule-strong md:right-8 md:h-32"
        >
          <motion.div
            className="h-full w-full origin-top bg-gradient-to-b from-accent to-accent-deep"
            style={{ scaleY: railScale }}
          />
        </div>

        {/* The way on, directly under the rail and on the same line. */}
        <ScrollCue
          delay={0.9}
          className="absolute bottom-4 right-4 z-30 md:bottom-5 md:right-8"
        />
      </div>
    </section>
  );
}

function BarLayer({
  bar,
  x,
  y,
  stretch,
  gradientId,
}: {
  bar: (typeof MARK_BARS)[number];
  x: MotionValue<number>;
  y: MotionValue<number>;
  stretch: MotionValue<number>;
  gradientId: string;
}) {
  const transform = useMotionTemplate`translate3d(${x}%, ${y}%, 0) scale(${stretch})`;

  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      className="absolute inset-0 h-full w-full overflow-visible"
      style={{ transform, willChange: "transform" }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
          {MARK_GRADIENT_STOPS.map((s) => (
            <stop key={s.offset} offset={s.offset} style={{ stopColor: s.color }} />
          ))}
        </linearGradient>
      </defs>
      <line
        x1={bar.x1}
        y1={bar.y1}
        x2={bar.x2}
        y2={bar.y2}
        stroke={`url(#${gradientId})`}
        strokeWidth={7}
        strokeLinecap="round"
      />
    </motion.svg>
  );
}
