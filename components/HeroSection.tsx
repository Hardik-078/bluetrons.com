"use client";

import { useEffect, useRef, useState } from "react";
import { useIntroComplete } from "@/lib/useIntroComplete";
import ScrollCue from "@/components/ScrollCue";

export default function HeroSection() {
  const eyebrowText = "LAUNCHING VERY SOON";
  const isReady = useIntroComplete();

  // The accent's glitter is an endless filter animation, repainted every
  // frame. It is only worth that while the hero can be seen, so it pauses
  // once the section has scrolled away and resumes when it comes back.
  const sectionRef = useRef<HTMLElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry.isIntersecting)
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 pt-28 pb-14 sm:py-20 text-center overflow-clip"
    >
      <div className="relative z-10 mx-auto max-w-[960px] flex flex-col items-center mt-5 sm:mt-0">
        {/* Staggered Letter Eyebrow - Fires only after loader completes */}
        <p className="hero-eyebrow" aria-label={eyebrowText}>
          {eyebrowText.split("").map((char, index) => (
            <span
              key={index}
              className={`hero-eyebrow-char ${isReady ? "is-animating" : ""}`}
              style={{
                animationDelay: isReady ? `${(0.04 + index * 0.024).toFixed(3)}s` : "0s",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </p>

        {/* Monumental Hero Title */}
        <h1 className="hero-title">
          <span className="block">
            <span
              className={`hero-word ${isReady ? "is-animating" : ""}`}
              style={{ animationDelay: isReady ? "0.32s" : "0s" }}
            >
              Building&nbsp;
            </span>
            <span
              className={`hero-word ${isReady ? "is-animating" : ""}`}
              style={{ animationDelay: isReady ? "0.46s" : "0s" }}
            >
              What&apos;s
            </span>
          </span>
          <span className="block">
            <em
              className={`hero-accent ${isReady ? "is-animating" : ""}`}
              data-paused={onScreen ? undefined : "true"}
              style={{ animationDelay: isReady ? "0.68s" : "0s" }}
            >
              Next.
            </em>
          </span>
        </h1>

        {/* High-Contrast Editorial Subtitle */}
        <p
          className={`hero-subtitle ${isReady ? "is-animating" : ""}`}
          style={{ animationDelay: isReady ? "0.95s" : "0s" }}
        >
          Bluetrons is an advanced technology company engineering intelligent systems, future products, and next-generation software from first principles.
        </p>
      </div>

      {/* Arrives as the subtitle settles. In the corner, level with the dock:
          the copy and the dock hold the centre (see .scroll-cue). */}
      <ScrollCue
        delay={1.6}
        className="absolute bottom-4 right-4 md:bottom-5 md:right-8"
      />
    </section>
  );
}
