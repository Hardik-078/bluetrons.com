"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  chromeTransition,
  revealChrome,
  useChromeVisibility,
} from "@/lib/useChromeVisibility";

/**
 * The fixed top row: the wordmark.
 *
 * It gets out of the way while the page is being read. Scrolling down slides
 * it up out of the frame and scrolling up brings it back
 * (lib/useChromeVisibility.ts, shared with the dock so the two always move
 * together). That replaced a veil that faded the page out beneath the mark,
 * and a shrink on the first stretch of scroll: with the mark gone whenever
 * content is travelling under it, there is nothing left for either to do.
 *
 * The wordmark is a cyan-to-cobalt gradient image and the page slides two
 * grounds under it, so it takes --logo-filter, which the ground observer
 * switches. Focus brings the row back, so the link is never focused while it
 * is off screen.
 */
export default function SiteHeader() {
  const { hidden } = useChromeVisibility();
  const reduce = useReducedMotion();

  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-0 z-40"
      initial={false}
      // Reduced motion keeps the fade and drops the travel.
      animate={{
        y: hidden && !reduce ? "-140%" : "0%",
        opacity: hidden ? 0 : 1,
      }}
      transition={chromeTransition(hidden)}
      onFocusCapture={revealChrome}
    >
      <div className="relative flex items-center px-4 py-3 sm:px-6 md:px-10 md:py-4">
        <div
          className={cn(hidden ? "pointer-events-none" : "pointer-events-auto")}
        >
          <Link
            href="/"
            className="group inline-flex items-center rounded-sm transition-transform duration-200 ease-out active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            aria-label="Bluetrons home"
          >
            <Image
              src="/images/bluetrons-logo.webp"
              alt="Bluetrons"
              width={939}
              height={143}
              priority
              unoptimized
              className="site-wordmark h-4 w-auto object-contain sm:h-[18px] md:h-5"
            />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
