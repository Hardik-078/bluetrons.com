"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** What the fixed chrome is currently floating over. */
export type Ground = "dark" | "light";

/**
 * How far below the viewport top the header's contents actually sit. The
 * chrome only cares about the strip the wordmark occupies, not the whole
 * screen, so this is where the sampling line goes.
 */
export const HEADER_LINE = 72;

/**
 * Tells the fixed chrome which environment is behind it.
 *
 * The header, the cursor and the dock never move, but the page slides two
 * different grounds underneath them: near-black at the top and bottom, paper
 * through the middle. Two things break on the wrong one -- the wordmark's
 * cyan half measures ~1.9:1 on paper, and the cursor's hover dot is white.
 * So the page reports what is behind the header and those two read it.
 *
 * This is not the theme system coming back in a hat. There is no preference,
 * no storage, no pre-paint script and nothing the visitor can set; the value
 * is derived from scroll position alone, and exactly three CSS rules consume
 * it (see globals.css).
 *
 * Mechanics: sections declare `data-ground`, and the observer watches the
 * band from the header line to the foot of the viewport. Whichever declared
 * section actually spans the line owns the chrome. The measuring pass only
 * runs when something enters or leaves that band -- never per frame -- and
 * only ever touches the handful of elements currently inside it.
 *
 * Re-runs per route. Only the homepage crosses grounds; every other page is
 * dark throughout and declares nothing, so arriving on one has to clear the
 * attribute rather than inherit whichever half of the homepage you left from.
 */
export function useGroundObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-ground]")
    );
    if (targets.length === 0) {
      delete document.documentElement.dataset.ground;
      return;
    }

    const inBand = new Set<HTMLElement>();

    const resolve = () => {
      let owner: HTMLElement | null = null;
      for (const el of inBand) {
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= HEADER_LINE && bottom > HEADER_LINE) {
          // Later in document order paints on top, so it wins an overlap.
          if (!owner || el.compareDocumentPosition(owner) &
              Node.DOCUMENT_POSITION_PRECEDING) {
            owner = el;
          }
        }
      }

      // Nothing spans the line during a rubber-band overscroll, and nothing
      // spans it for the whole of the threshold either -- that boundary moves
      // by transform, so no element crosses the line for this to measure. The
      // threshold reports its own ground while it owns the screen, so holding
      // the last answer here is what lets the two hand off cleanly instead of
      // fighting over the attribute.
      if (!owner) return;

      const ground = owner.dataset.ground as Ground;
      if (document.documentElement.dataset.ground !== ground) {
        document.documentElement.dataset.ground = ground;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) inBand.add(el);
          else inBand.delete(el);
        }
        resolve();
      },
      { rootMargin: `-${HEADER_LINE}px 0px 0px 0px` }
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      delete document.documentElement.dataset.ground;
    };
  }, [pathname]);
}
