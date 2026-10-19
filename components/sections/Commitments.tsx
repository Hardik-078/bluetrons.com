"use client";

import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { PILLARS } from "@/lib/aboutContent";

const EASE = [0.16, 1, 0.3, 1] as const;
const COUNT = PILLARS.length;

/**
 * The three the company leads with.
 *
 * THE ARRIVAL
 *
 * This section does nothing to arrive. The hero above it is pinned for one
 * viewport, and the light ground this sits on is laid out over the second
 * half of that pin (globals.css, .env-light-ground), so the paper simply
 * scrolls up over the hero with the page, carrying its own feathered edge.
 * Nothing is offset from script, so there is nothing to fall behind the
 * scroll at any speed.
 *
 * THE STACK
 *
 * Three bands, each sticky, each pinned one tab lower than the band before
 * (--i on .cmt-band). A band arriving covers the body of the one beneath it
 * and stops short of its word, so by the third band the first two words are
 * still stacked above it as tabs: the three read as one list being built
 * rather than three screens replacing each other. It is pure CSS -- scrubbing
 * backwards is free, and a band that has been covered costs nothing.
 *
 * Each band is at least as tall as the frame below its own pin line, which is
 * what guarantees the next band covers the whole of its body on arrival. The
 * last band's foot is the end of the track, so once it has been read the
 * three tabs leave together.
 *
 * THE MOTION
 *
 * The word rises through a mask the first time its tab comes into view, and
 * the lede and facets fade up after it. Nothing drifts while pinned: the
 * stack itself is the movement.
 */
export default function Commitments() {
  return (
    <section className="cmt" aria-label="Technology, reliability, commitment">
      {PILLARS.map((pillar, i) => (
        <Band key={pillar.word} pillar={pillar} index={i} />
      ))}
    </section>
  );
}

function Band({
  pillar,
  index,
}: {
  pillar: (typeof PILLARS)[number];
  index: number;
}) {
  const n = String(index + 1).padStart(2, "0");

  return (
    <article
      className="cmt-band"
      aria-label={pillar.word}
      style={{ "--i": index } as CSSProperties}
    >
      {/* Frames the body as a field with an edge rather than a gap, and
          carries the mark's geometry at its foot. */}
      <span className="cmt-spine" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>

      {/* The tab: the one row of the band that stays visible once the next
          band has arrived over it. Its height is --cmt-tab exactly, which is
          also the step between one band's pin line and the next. */}
      <div className="cmt-tab">
        <p className="cmt-num">{n}</p>

        {/* The trigger sits on the mask, not on the word. Putting it on the
            word deadlocks: the word starts translated fully outside its own
            clip box, an IntersectionObserver honours ancestor clipping, so the
            element waiting to be seen can never be seen and the reveal never
            fires. The mask is never clipped, so it can always report. */}
        <motion.h2
          className="cmt-word-mask"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.span
            className="cmt-word"
            variants={{ hidden: { y: "110%" }, shown: { y: "0%" } }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {pillar.word}
          </motion.span>
        </motion.h2>

        <p className="cmt-meta">
          {n} / {String(COUNT).padStart(2, "0")}
        </p>
      </div>

      <Foot pillar={pillar} />
    </article>
  );
}

function Foot({ pillar }: { pillar: (typeof PILLARS)[number] }) {
  return (
    <div className="cmt-foot">
      <motion.p
        className="cmt-lede"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
      >
        {pillar.note}
      </motion.p>

      <ul className="cmt-facets">
        {pillar.facets.map((facet, i) => (
          <motion.li
            key={facet}
            className="cmt-facet"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.55, delay: 0.2 + i * 0.06, ease: EASE }}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {facet}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
