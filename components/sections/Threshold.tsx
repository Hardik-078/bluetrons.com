"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { HEADER_LINE } from "@/lib/useGroundObserver";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * Travel of each axis hairline, as a fraction of the shared distance. Three
 * different rates is what makes three parallel lines read as three depths
 * rather than as one graphic.
 */
const GEO_RATE = [1, 0.62, 0.3] as const;

/** Where the hero is pinned. Mirrors the breakpoint in sections.css. */
const PINNED_QUERY = "(min-width: 900px)";

/**
 * The threshold.
 *
 * The hero is a dark technology environment and everything below it is paper.
 * The change between them is not staged by script. The hero is pinned for one
 * viewport and the light ground is laid out over that viewport
 * (.env-light-ground in globals.css), so the paper simply scrolls up across
 * the hero with the page, carrying a feathered, cyan-edged lip.
 *
 * That boundary is layout, which is the whole point. A surface driven from
 * scroll progress through a spring trails the page by more the faster it
 * moves, and anything that has to meet it has to be corrected against it
 * every frame. A box that scrolls moves exactly with the scroll, at any
 * speed, and scrubs backwards for free.
 *
 * WHAT MOVES
 *
 * Only the hero's plane, and only on transform and opacity: it drifts up,
 * advances very slightly toward the viewer and fades as the paper reaches it,
 * so it is overtaken rather than scrolled away. Nothing about its type, layout
 * or content changes -- it is the same component, placed on a plane that
 * moves. The dark also gets structure of its own for the passage: three
 * hairlines on the mark's 45-degree axis, drifting at three rates.
 *
 * Every value is a plain function of the pin's progress, with no spring:
 * smoothing belongs to the page's scroll (components/SmoothScroll.tsx), and a
 * second smoothing layer here would only put the hero out of step with the
 * paper arriving over it.
 *
 * THE GROUND
 *
 * The threshold reports the ground to the fixed chrome itself while its track
 * spans the header line. The ground observer only measures when a section
 * enters or leaves the band under the header, and here the paper crosses the
 * line while the track it overlaps is still inside that band, so the observer
 * never sees it happen. Past the track, the observer is the only writer
 * again. The ground's place is measured once per resize; per scroll it is
 * arithmetic.
 */
export default function Threshold({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pinned = useMediaQuery(PINNED_QUERY);

  const { scrollY, scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Below the breakpoint the track is only as tall as the hero, so the pin
  // has no length and its progress reads as complete from the top of the
  // page. The gate holds the hero at rest there. A motion value rather than a
  // closure, so the transform chain hears it change.
  const gate = useMotionValue(0);
  useEffect(() => {
    gate.set(pinned ? 1 : 0);
  }, [gate, pinned]);

  const p = useTransform(
    [scrollYProgress, gate],
    ([v = 0, g = 0]: number[]) => v * g,
  );

  // --- The hero, being overtaken -------------------------------------------
  // Scaling UP rather than down: the hero passes the viewer instead of
  // retreating from them. 4.5% is as far as that goes before it stops being
  // depth and starts being a zoom. The paper's opaque edge reaches the middle
  // of the frame at about two thirds of the pin, so the hero is gone just
  // after it: it dims as the paper approaches rather than being cut by it.
  const heroScale = useTransform(p, [0.05, 1], [1, 1.045], { clamp: true });
  const heroY = useTransform(p, [0.05, 1], ["0vh", "-8vh"], { clamp: true });
  const heroOpacity = useTransform(p, [0.1, 0.75], [1, 0], { clamp: true });

  // --- The axis -------------------------------------------------------------
  const geoOpacity = useTransform(p, [0.05, 0.25, 0.65, 0.9], [0, 1, 1, 0], {
    clamp: true,
  });
  const geoTravel = useTransform(p, [0, 1], [0, -46], { clamp: true });

  // --- The handoff ----------------------------------------------------------
  useEffect(() => {
    let groundTop = Number.NaN;
    let trackBottom = Number.NaN;

    const publish = () => {
      if (Number.isNaN(groundTop)) return;
      const y = window.scrollY;
      const edge = groundTop - y;
      if (y < trackBottom - HEADER_LINE) {
        const next = edge <= HEADER_LINE ? "light" : "dark";
        if (document.documentElement.dataset.ground !== next) {
          document.documentElement.dataset.ground = next;
        }
      }
    };

    // offsetTop, not a bounding rect: layout position, including the negative
    // margin that pulls the ground over the pin, and ignoring every transform
    // on the way up.
    const docTop = (el: HTMLElement) => {
      let top = 0;
      for (
        let n: HTMLElement | null = el;
        n;
        n = n.offsetParent as HTMLElement | null
      ) {
        top += n.offsetTop;
      }
      return top;
    };

    const measure = () => {
      const track = trackRef.current;
      // The ground is the element laid out after the track.
      const ground = track?.nextElementSibling;
      groundTop = Number.NaN;
      trackBottom = Number.NaN;
      if (pinned && track && ground instanceof HTMLElement) {
        groundTop = docTop(ground);
        trackBottom = docTop(track) + track.offsetHeight;
      }
      publish();
    };

    measure();
    window.addEventListener("resize", measure);
    const off = scrollY.on("change", publish);
    return () => {
      off();
      window.removeEventListener("resize", measure);
    };
  }, [pinned, scrollY]);

  return (
    // Declares the dark ground for the fixed chrome, so scrolling back up off
    // the paper hands the header back to the dark (lib/useGroundObserver.ts).
    // It is also the only stretch of the homepage the pointer trail shows
    // through, so the trail stops drawing once it has scrolled away
    // (components/ui/canvas.tsx).
    <div
      ref={trackRef}
      className="thr"
      data-ground="dark"
      data-pointer-trail-window
    >
      <div className="thr-hero">
        {/* The hero component itself is untouched; only the plane it sits on
            moves. */}
        <motion.div
          className="thr-hero-plane"
          style={{ scale: heroScale, y: heroY, opacity: heroOpacity }}
        >
          {children}
        </motion.div>

        {/* The mark's axis, three depths of it. */}
        <motion.div
          className="thr-geo"
          aria-hidden="true"
          style={{ opacity: geoOpacity }}
        >
          <div className="thr-geo-axis">
            {GEO_RATE.map((rate, i) => (
              <GeoLine key={i} travel={geoTravel} rate={rate} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** One hairline on the mark's axis, travelling at its own rate. */
function GeoLine({
  travel,
  rate,
}: {
  travel: MotionValue<number>;
  rate: number;
}) {
  const x = useTransform(travel, (v) => `${v * rate}vmax`);
  return <motion.span className="thr-geo-line" style={{ x }} />;
}
