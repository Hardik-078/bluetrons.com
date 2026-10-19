"use client";

import Reveal from "./Reveal";
import BluetronsMark from "@/components/BluetronsMark";
import { PARTNERS } from "@/lib/aboutContent";

/**
 * The ending.
 *
 * The page returns to the dark environment, and deliberately faster than it
 * left: the threshold takes a full viewport to open into the light, this
 * takes a fifth of one to shut. The asymmetry is the point. Opening is a
 * fade; arriving somewhere is a close.
 *
 * Partners are set as an index rather than a logo wall. There are no licensed
 * marks in this repository, and putting six companies' trademarks on the page
 * would claim more than the company profile does. Type says the same thing
 * and says it honestly.
 */
export default function Close() {
  return (
    <>
      {/* The ramp back. Two halves report their own ground so the fixed chrome
          flips at the right moment rather than a screen early. */}
      <div className="close-seam relative" aria-hidden="true">
        <div data-ground="light" className="absolute inset-x-0 top-0 h-1/2" />
        <div data-ground="dark" className="absolute inset-x-0 bottom-0 h-1/2" />
      </div>
      <span className="close-seam-rule" aria-hidden="true" />

      <section className="close" data-ground="dark" aria-label="Partners">
        <div className="close-inner">
          <Reveal>
            <p className="sec-eyebrow mb-7">Technology partners</p>
          </Reveal>

          <ul className="close-partners">
            {PARTNERS.map((partner, i) => (
              <Reveal as="li" key={partner} order={i} y={12} className="sec-partner">
                {partner}
              </Reveal>
            ))}
          </ul>

          <div className="mt-[clamp(4rem,11vw,8rem)] flex flex-col items-start gap-[clamp(3rem,8vw,5rem)] lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Reveal>
                <BluetronsMark size={40} glow={false} className="mb-9" />
              </Reveal>
              <Reveal order={1}>
                <h2 className="close-statement">
                  Simplifying technology.
                  <span className="sec-display-accent block">
                    Strengthening businesses.
                  </span>
                </h2>
              </Reveal>
              <Reveal order={2}>
                <p className="sec-lede mt-8">
                  Tell us what the business needs to do. We will scope the
                  solution, supply it, commission it and support it.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
