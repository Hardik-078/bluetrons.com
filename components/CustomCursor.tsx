"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHovered = false;
    let isVisible = false;
    let animId = 0;

    // 60FPS fluid spring lerp for outer trailing halo ring. Runs only while
    // the ring is still catching up: once it sits on the dot the loop stops,
    // and the next mouse move starts it again, so a still pointer (or a wheel
    // scroll, which never moves it) costs no frames.
    const renderLoop = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      if (Math.abs(mouseX - ringX) < 0.1 && Math.abs(mouseY - ringY) < 0.1) {
        ringX = mouseX;
        ringY = mouseY;
        animId = 0;
      } else {
        animId = requestAnimationFrame(renderLoop);
      }
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }

      // Zero-latency instant position update for central micro-dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      if (!animId) animId = requestAnimationFrame(renderLoop);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest("a") ||
        target?.closest("button") ||
        target?.closest("[role='button']") ||
        target?.closest("input") ||
        target?.closest("textarea")
      ) {
        if (!isHovered) {
          isHovered = true;
          ring.classList.add("cursor-ring-hover");
          dot.classList.add("cursor-dot-hover");
        }
      } else {
        if (isHovered) {
          isHovered = false;
          ring.classList.remove("cursor-ring-hover");
          dot.classList.remove("cursor-dot-hover");
        }
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isVisible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Precision Instant Micro Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[99999] h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_var(--accent)] opacity-0 transition-[width,height,background-color] duration-200"
        aria-hidden="true"
      />

      {/* Trailing Fluid Halo Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[99998] h-9 w-9 rounded-full border border-accent/70 bg-accent/5 shadow-[0_0_18px_rgb(var(--accent-rgb)/0.3)] opacity-0 transition-[width,height,background-color,border-color] duration-300"
        aria-hidden="true"
      />
    </>
  );
}
