"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { LIFECYCLE } from "@/lib/aboutContent";

const COUNT = LIFECYCLE.length;

/** Space kept between the numeral's foot and the bottom of the frame, in px. */
const MARKER_CLEARANCE = 24;

/**
 * How an engagement runs.
 *
 * COMPOSITION
 *
 * Six stages held on one pinned frame, laid out as full-bleed rows: mono
 * index in a gutter, stage name in the content column, a rule under each. The
 * claim sits above them and stays there, so the argument and its evidence are
 * on screen together instead of the reader having to carry one to the other.
 *
 * One numeral in the left gutter, set very large, travels down to whichever
 * stage is live. It is the only big graphic object in the section and it is
 * doing three jobs at once: it says where you are, it is the progress
 * indicator, and it is what makes the frame feel navigated rather than
 * watched. A separate progress bar would have been a fourth element saying
 * something this already says.
 *
 * MECHANISM
 *
 * Nothing in the list moves. The rows are laid out once, and scroll only
 * changes which is live, so the scene does no layout work at any point: the
 * live row grows by transform from its own left edge, its note fades up, and
 * its rule gains an accent segment. All of that is CSS driven by one data
 * attribute.
 *
 * The attribute changes six times across the whole scene rather than once a
 * frame -- the scroll value is read through a MotionValue event, so React
 * never re-renders on a scroll frame. The travelling numeral is continuous
 * and lives entirely on a MotionValue, so it slides between rows rather than
 * snapping between them.
 *
 * Row geometry is measured once and on resize, not per frame, so the numeral
 * lands on a real row position instead of an assumed one. The same pass
 * measures how low the numeral may hang: it overhangs its row downward, and
 * on the last stages that overhang would otherwise run it into the bottom of
 * the pinned frame and be cut off. So its travel stops short of that edge,
 * however short the viewport.
 */
export default function Engagement() {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLOListElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  // Row top edges (the numeral hangs from the live row's rule), and the
  // lowest offset the numeral may take without leaving the frame.
  const [geometry, setGeometry] = useState<{ tops: number[]; limit: number }>(
    { tops: [], limit: Number.POSITIVE_INFINITY },
  );

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(COUNT - 1, Math.max(0, Math.floor(v * COUNT * 0.999)));
    setActive((prev) => (prev === next ? prev : next));
  });

  /**
   * The numeral has to land on real row positions, and the rows are sized by
   * the viewport. Measuring once after layout and again on resize keeps the
   * scroll path free of reads entirely.
   */
  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const list = rowsRef.current;
      const marker = markerRef.current;
      if (!stage || !list || !marker) return;
      const base = list.getBoundingClientRect().top;
      const listTop = base - stage.getBoundingClientRect().top;
      setGeometry({
        tops: Array.from(list.children)
          .filter((el) => el.classList.contains("prc-row"))
          .map((el) => (el as HTMLElement).getBoundingClientRect().top - base),
        limit:
          stage.clientHeight - listTop - marker.offsetHeight - MARKER_CLEARANCE,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (rowsRef.current) ro.observe(rowsRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Continuous position along the measured rows, so the numeral travels with
  // the scroll instead of jumping when the index flips.
  const markerY = useTransform(scrollYProgress, (v) => {
    const { tops, limit } = geometry;
    if (tops.length === 0) return 0;
    const at = Math.min(COUNT - 1.0001, Math.max(0, v * COUNT * 0.999));
    const i = Math.floor(at);
    const next = Math.min(tops.length - 1, i + 1);
    return Math.min(limit, tops[i] + (tops[next] - tops[i]) * (at - i));
  });

  const markerSpring = useSpring(markerY, {
    stiffness: 160,
    damping: 30,
    restDelta: 0.4,
  });

  const current = LIFECYCLE[active];

  return (
    <section ref={trackRef} className="prc" aria-label="How an engagement runs">
      <div ref={stageRef} className="prc-stage">
        <header className="prc-head">
          <span aria-hidden="true" />
          <h2 className="prc-statement">A partner, not a supplier.</h2>
          <p className="prc-lede">
            We understand the requirement first, then own the solution through
            every stage of its life.
          </p>
          <p className="prc-count">
            {current.step} / {String(COUNT).padStart(2, "0")}
          </p>
        </header>

        <ol className="prc-rows" ref={rowsRef}>
          {LIFECYCLE.map((stage, i) => (
            <li
              key={stage.step}
              className="prc-row"
              data-live={i === active ? "true" : undefined}
            >
              <span className="prc-row-mark" aria-hidden="true" />
              <span className="prc-row-gutter" aria-hidden="true" />
              <span className="prc-row-num">{stage.step}</span>
              <div className="prc-row-body">
                <h3 className="prc-row-title">{stage.title}</h3>
                <p className="prc-row-note">{stage.note}</p>
              </div>
            </li>
          ))}

          {/* The one large graphic object, and the progress indicator. */}
          <motion.div
            ref={markerRef}
            className="prc-marker"
            aria-hidden="true"
            style={{ y: markerSpring }}
          >
            <span className="prc-marker-inner">
              <span className="prc-marker-digits">{current.step}</span>
              <span className="prc-marker-rule" />
            </span>
          </motion.div>
        </ol>
      </div>
    </section>
  );
}
