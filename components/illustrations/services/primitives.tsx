"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";

/**
 * The drawing kit every service illustration is built from.
 *
 * One projection, one plate, one set of surfaces, one line weight and one
 * accent treatment, so eleven different subjects still read as one family.
 * Illustrations describe objects in a small 3D space (the plate is 110 units
 * square, z is up) and these helpers project it isometrically into a
 * 240 x 240 viewBox. Colour lives in the stylesheet (sections.css, the
 * `ill-` classes), not here.
 *
 * Motion is declarative: the primitives carry `hidden` / `shown` variants, so
 * an illustration builds itself when an ancestor switches to `shown`. `order`
 * staggers the build: plate, then solids, then lines, then signals.
 */

export type P3 = readonly [number, number, number];

const EASE = [0.16, 1, 0.3, 1] as const;
const COS30 = Math.cos(Math.PI / 6);
const ORIGIN_X = 120;
const ORIGIN_Y = 98;

const r2 = (n: number) => Math.round(n * 100) / 100;

/** A point in the illustration's space, projected into the viewBox. */
export function iso([x, y, z]: P3): [number, number] {
  return [r2(ORIGIN_X + (x - y) * COS30), r2(ORIGIN_Y + (x + y) * 0.5 - z)];
}

export function points(list: readonly P3[]) {
  return list.map((p) => iso(p).join(",")).join(" ");
}

export function path(list: readonly P3[], close = false) {
  const d = list
    .map((p, i) => `${i === 0 ? "M" : "L"}${iso(p).join(" ")}`)
    .join(" ");
  return close ? `${d} Z` : d;
}

/** Several open segments as one path. */
export function lines(segments: readonly (readonly P3[])[]) {
  return segments.map((s) => path(s)).join(" ");
}

/** A circle lying on a horizontal plane: in this projection, an ellipse. */
export function ring(cx: number, cy: number, z: number, r: number) {
  const [x, y] = iso([cx, cy, z]);
  return { cx: x, cy: y, rx: r2(r * 1.2247449), ry: r2(r * 0.7071068) };
}

const delay = (order: number) => 0.12 + order * 0.09;

export const rise: Variants = {
  hidden: { opacity: 0, y: 6 },
  shown: (order: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: delay(order), ease: EASE },
  }),
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  shown: (order: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.8, delay: delay(order), ease: EASE },
  }),
};

export const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (order: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.1, delay: delay(order), ease: EASE },
      opacity: { duration: 0.2, delay: delay(order) },
    },
  }),
};

export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  shown: (order: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: delay(order), ease: EASE },
  }),
};

/** The canvas. Decorative: the service's own heading names it. */
export function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      className="svc-ill"
      viewBox="0 0 240 240"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** The ground every object stands on: a soft shadow, a dashed plate and
    registration ticks at its corners. */
export function Plate({ size = 110 }: { size?: number }) {
  const shadow = ring(size / 2, size / 2, 0, size * 0.64);
  const corners: P3[] = [
    [0, 0, 0],
    [size, 0, 0],
    [size, size, 0],
    [0, size, 0],
  ];
  return (
    <motion.g variants={fade} custom={0}>
      <ellipse className="ill-shadow" {...shadow} />
      <polygon className="ill-plate" points={points(corners)} />
      <path
        className="ill-tick"
        d={lines(
          corners.flatMap(([x, y]) => [
            [
              [x - 4, y, 0],
              [x + 4, y, 0],
            ],
            [
              [x, y - 4, 0],
              [x, y + 4, 0],
            ],
          ]),
        )}
      />
    </motion.g>
  );
}

/**
 * A rectangular solid: `at` is its lowest corner, `size` its extent along
 * x, y and z. The visible faces are the top, the +y face (lower left) and the
 * +x face (lower right). Children are drawn on top of it and rise with it.
 */
export function Box({
  at,
  size,
  order = 1,
  glass = false,
  top,
  children,
}: {
  at: P3;
  size: P3;
  order?: number;
  glass?: boolean;
  top?: string;
  children?: ReactNode;
}) {
  const [x, y, z] = at;
  const [w, d, h] = size;
  const kind = glass ? "ill-glass" : "ill";
  return (
    <motion.g variants={rise} custom={order}>
      <polygon
        className={`ill-face ${kind}-l`}
        points={points([
          [x, y + d, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ])}
      />
      <polygon
        className={`ill-face ${kind}-r`}
        points={points([
          [x + w, y, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x + w, y, z + h],
        ])}
      />
      <polygon
        className={`ill-face ${top ?? `${kind}-top`}`}
        points={points([
          [x, y, z + h],
          [x + w, y, z + h],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ])}
      />
      {children}
    </motion.g>
  );
}

/** A short cylinder standing on a horizontal plane. */
export function Puck({
  at,
  r,
  h,
  order = 1,
  glass = false,
}: {
  at: P3;
  r: number;
  h: number;
  order?: number;
  glass?: boolean;
}) {
  const [cx, cy, z] = at;
  const bottom = ring(cx, cy, z, r);
  const top = ring(cx, cy, z + h, r);
  const kind = glass ? "ill-glass" : "ill";
  const side =
    `M${r2(bottom.cx - bottom.rx)} ${bottom.cy} ` +
    `A${bottom.rx} ${bottom.ry} 0 0 0 ${r2(bottom.cx + bottom.rx)} ${bottom.cy} ` +
    `L${r2(top.cx + top.rx)} ${top.cy} ` +
    `A${top.rx} ${top.ry} 0 0 1 ${r2(top.cx - top.rx)} ${top.cy} Z`;
  return (
    <motion.g variants={rise} custom={order}>
      <path className={`ill-face ${kind}-l`} d={side} />
      <ellipse className={`ill-face ${kind}-top`} {...top} />
    </motion.g>
  );
}

/** Any flat quadrilateral: a screen, a slot, a lid. */
export function Quad({
  corners,
  className,
}: {
  corners: readonly P3[];
  className: string;
}) {
  return <polygon className={className} points={points(corners)} />;
}

/** Fine surface detail: unit dividers, vents, courses. */
export function Detail({ segments }: { segments: readonly (readonly P3[])[] }) {
  return <path className="ill-detail" d={lines(segments)} />;
}

/** A small point on a surface: an indicator light, a lens. */
export function Dot({
  at,
  r = 1.1,
  className = "ill-led",
}: {
  at: P3;
  r?: number;
  className?: string;
}) {
  const [x, y] = iso(at);
  return <circle className={className} cx={x} cy={y} r={r} />;
}

/** A dashed construction line. */
export function Guide({ pts, order = 1 }: { pts: readonly P3[]; order?: number }) {
  return (
    <motion.path
      className="ill-guide"
      d={path(pts)}
      variants={fade}
      custom={order}
    />
  );
}

/** A dashed ring on the ground: a range, a radius. */
export function Orbit({
  at,
  r,
  order = 1,
}: {
  at: P3;
  r: number;
  order?: number;
}) {
  return (
    <motion.ellipse
      className="ill-orbit"
      {...ring(at[0], at[1], at[2], r)}
      variants={fade}
      custom={order}
    />
  );
}

/**
 * A connection, drawn in as the illustration builds. With `signal`, a short
 * cyan pulse can travel along it (the stylesheet decides when: once after
 * the build, and again on hover).
 */
export function Link({
  pts,
  order = 2,
  signal = false,
}: {
  pts: readonly P3[];
  order?: number;
  signal?: boolean;
}) {
  const d = path(pts);
  return (
    <>
      <motion.path className="ill-link" d={d} variants={draw} custom={order} />
      {signal && <path className="ill-signal" d={d} pathLength={100} />}
    </>
  );
}

/** A connection in the shape of a ring, with the same optional signal. */
export function RingLink({
  at,
  r,
  order = 2,
  signal = false,
}: {
  at: P3;
  r: number;
  order?: number;
  signal?: boolean;
}) {
  const e = ring(at[0], at[1], at[2], r);
  return (
    <>
      <motion.ellipse className="ill-link" {...e} variants={draw} custom={order} />
      {signal && <ellipse className="ill-signal" {...e} pathLength={100} />}
    </>
  );
}

/** An illuminated point: the accent, used sparingly. */
export function Node({
  at,
  r = 1.6,
  tone = "blue",
  order = 4,
}: {
  at: P3;
  r?: number;
  tone?: "blue" | "cyan";
  order?: number;
}) {
  const [x, y] = iso(at);
  return (
    <motion.g variants={pop} custom={order}>
      <circle className="ill-halo" cx={x} cy={y} r={r2(r * 3.4)} />
      <circle
        className={tone === "cyan" ? "ill-node ill-node-cyan" : "ill-node"}
        cx={x}
        cy={y}
        r={r}
      />
    </motion.g>
  );
}

/** A small technical label on a leader line. */
export function Label({
  at,
  dx,
  dy,
  text,
  order = 6,
}: {
  at: P3;
  dx: number;
  dy: number;
  text: string;
  order?: number;
}) {
  const [x, y] = iso(at);
  const dir = dx >= 0 ? 1 : -1;
  const tx = r2(x + dx);
  const ty = r2(y + dy);
  return (
    <motion.g className="ill-labelled" variants={fade} custom={order}>
      <circle className="ill-leader-dot" cx={x} cy={y} r={1} />
      <path
        className="ill-leader"
        d={`M${x} ${y} L${tx} ${ty} L${r2(tx + dir * 9)} ${ty}`}
      />
      <text
        className="ill-label"
        x={r2(tx + dir * 12)}
        y={r2(ty + 2.4)}
        textAnchor={dir > 0 ? "start" : "end"}
      >
        {text}
      </text>
    </motion.g>
  );
}
