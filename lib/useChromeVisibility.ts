"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the floating chrome -- the wordmark at the top and the dock at the
 * foot -- should be out of the way.
 *
 * Scrolling down is reading, so both leave; scrolling up is looking for
 * somewhere to go, so both come back. Near the top of the page they always
 * show. Near the end of the page the dock stays away even on the way back up
 * (`atEnd`): the partners and the footer live under it there, and the
 * footer carries its own links.
 *
 * One store for both, so they always move together, and module state rather
 * than a provider because they sit in different branches of the layout. It
 * notifies only when the answer changes, never per frame.
 */
export type ChromeVisibility = { hidden: boolean; atEnd: boolean };

/** Within this many px of the top, the chrome always shows. */
const TOP_ZONE = 96;
/** Travel in one direction, in px, before it counts as a change of intent. */
const INTENT = 12;
/** Within this many px of the end of the document, the dock stays away. */
const END_ZONE = 240;

const INITIAL: ChromeVisibility = { hidden: false, atEnd: false };

/** Seconds the chrome takes to leave and to come back. */
const LEAVE_S = 0.75;
const RETURN_S = 0.95;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The one transition the wordmark and the dock both use, so they always move
 * at the same pace. Coming back is a touch slower than leaving: the return is
 * the part the eye is on.
 */
export function chromeTransition(hidden: boolean) {
  return { duration: hidden ? LEAVE_S : RETURN_S, ease: EASE };
}

let state = INITIAL;
const listeners = new Set<() => void>();
let stop: (() => void) | null = null;

function commit(next: ChromeVisibility) {
  if (next.hidden === state.hidden && next.atEnd === state.atEnd) return;
  state = next;
  listeners.forEach((listener) => listener());
}

function start() {
  let lastY = Math.max(0, window.scrollY);
  let travel = 0;
  // Cached rather than read per scroll: a layout read inside a scroll handler
  // can force layout on every frame while other scroll effects are writing.
  let docH = document.documentElement.scrollHeight;

  const update = () => {
    const y = Math.max(0, window.scrollY);
    const delta = y - lastY;
    lastY = y;
    // A change of direction starts the count again, so a small wobble back
    // never flips the chrome.
    if (delta !== 0 && Math.sign(delta) !== Math.sign(travel)) travel = 0;
    travel += delta;

    let hidden = state.hidden;
    if (y <= TOP_ZONE) hidden = false;
    else if (travel >= INTENT) hidden = true;
    else if (travel <= -INTENT) hidden = false;

    // Only on a page with somewhere to scroll: a short page is all "end".
    const room = docH - window.innerHeight;
    const atEnd = y > TOP_ZONE && room > END_ZONE && y >= room - END_ZONE;

    commit({ hidden, atEnd });
  };

  const measure = () => {
    docH = document.documentElement.scrollHeight;
    update();
  };

  const resize = new ResizeObserver(measure);
  resize.observe(document.body);
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", measure);
  measure();

  return () => {
    resize.disconnect();
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", measure);
  };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!stop) stop = start();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && stop) {
      stop();
      stop = null;
    }
  };
}

export function useChromeVisibility() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => INITIAL,
  );
}

/**
 * Brings the chrome back until the next scroll down. For keyboard focus: a
 * link that has just received focus must never be sitting off screen.
 */
export function revealChrome() {
  commit({ hidden: false, atEnd: false });
}
