"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Reveal from "@/components/sections/Reveal";
import { PRINCIPLES } from "@/lib/aboutContent";

const STATEMENT =
  "Bluetron Infotech LLP is a technology solutions and IT infrastructure company, committed to delivering reliable, scalable and cost-effective solutions for Corporate, Government, PSU, Education and Enterprise customers.";

const WORDS = STATEMENT.split(" ");

export default function AboutStatement() {
  const ref = useRef<HTMLParagraphElement>(null);

  // Tracked on the statement itself, not the section. The section runs on
  // through the lede, the principles and its own padding, so measuring it
  // left the last words resolving only once they had all but scrolled out of
  // the top of the frame. This starts as the first line rises into view and
  // finishes with the last line still well inside it, a little below centre.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.6"],
  });

  // Words resolve across scroll progress rather than on a single trigger, so
  // the paragraph reads as it is being pulled into focus.
  const reveal = useTransform(scrollYProgress, [0, 1], [0, WORDS.length]);

  return (
    <section
      className="sec-section relative overflow-clip px-6 py-32 sm:px-10 md:px-16 md:py-48"
      aria-label="Who we are"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="sec-eyebrow mb-10">Who we are</p>
        </Reveal>

        <p ref={ref} className="sec-statement">
          {WORDS.map((word, i) => (
            <StatementWord key={`${word}-${i}`} index={i} reveal={reveal}>
              {word}
            </StatementWord>
          ))}
        </p>

        <Reveal order={1}>
          <p className="sec-lede mt-12 max-w-2xl">
            Your trusted partner for tailored, end-to-end IT solutions — understanding
            each customer&apos;s business requirement, then carrying it through
            consultation and design to supply, implementation, commissioning and
            post-sales support.
          </p>
        </Reveal>

        <ul className="mt-16 flex flex-wrap gap-x-10 gap-y-5">
          {PRINCIPLES.map((principle, i) => (
            <Reveal as="li" key={principle} order={i + 2} className="sec-principle">
              <span className="sec-principle-dot" aria-hidden="true" />
              {principle}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StatementWord({
  children,
  index,
  reveal,
}: {
  children: string;
  index: number;
  reveal: MotionValue<number>;
}) {
  const opacity = useTransform(reveal, [index - 1, index + 1], [0.14, 1], {
    clamp: true,
  });

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
      {" "}
    </motion.span>
  );
}
