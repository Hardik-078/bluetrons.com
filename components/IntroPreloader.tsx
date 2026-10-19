"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";

const emptySubscribe = () => () => {};

function useHasSeenIntro() {
  return useSyncExternalStore(
    emptySubscribe,
    () => Boolean(typeof window !== "undefined" && sessionStorage.getItem("bt_intro_shown")),
    () => false
  );
}

function notifyIntroComplete() {
  if (typeof window !== "undefined") {
    (window as unknown as { __BT_INTRO_DONE?: boolean }).__BT_INTRO_DONE = true;
    window.dispatchEvent(new CustomEvent("bt_intro_complete"));
  }
}

export default function IntroPreloader() {
  const hasSeen = useHasSeenIntro();
  const [dismissed, setDismissed] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (hasSeen) {
      notifyIntroComplete();
      return;
    }

    // Trigger fade-out and notify hero section to begin entrance choreography
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
      notifyIntroComplete();
    }, 1400);

    const removeTimer = setTimeout(() => {
      setDismissed(true);
      sessionStorage.setItem("bt_intro_shown", "true");
    }, 1900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [hasSeen]);

  if (hasSeen || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("bt_intro_shown", "true");
    notifyIntroComplete();
  };

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-surface-base overflow-hidden cursor-pointer select-none transition-opacity duration-600 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* Glowing Horizon Line */}
      <div className="horizon-laser" />

      {/* Central Emblem & Orbital Laser Ring */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Orbital SVG Ring */}
        <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48">
          <svg
            className="absolute inset-0 w-full h-full animate-ring-draw"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              style={{ stroke: "var(--accent)" }}
              strokeWidth="1.5"
              strokeDasharray="290"
              strokeDashoffset="290"
              strokeLinecap="round"
              className="circle-draw"
            />
          </svg>

          {/* Central Prominent Logo Emblem */}
          <div className="relative flex items-center justify-center">
            <Image
              src="/images/bluetrons-logo.webp"
              alt="Bluetrons Sigil"
              width={939}
              height={143}
              priority
              unoptimized
              className="h-10 sm:h-14 w-auto object-contain animate-sigil-glow drop-shadow-[0_0_28px_var(--logo-glow)]"
            />
          </div>
        </div>

        {/* Brand Tagline */}
        <div className="mt-6 font-mono text-[11px] tracking-[0.35em] uppercase text-accent-ink opacity-90">
          BLUETRONS
        </div>
      </div>

      {/* Floating Ascending Particle Dots */}
      <div className="pointer-events-none absolute inset-0">
        <span className="particle-dot" style={{ left: "20%", animationDelay: "0.1s" }} />
        <span className="particle-dot" style={{ left: "40%", animationDelay: "0.4s" }} />
        <span className="particle-dot" style={{ left: "60%", animationDelay: "0.2s" }} />
        <span className="particle-dot" style={{ left: "80%", animationDelay: "0.5s" }} />
      </div>
    </div>
  );
}
