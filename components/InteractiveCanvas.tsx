"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { startPointerTrail } from "@/components/ui/canvas";

export default function InteractiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Restarted per route: each page marks its own see-through regions
  // (data-pointer-trail-window), and the trail has to watch the new ones.
  const pathname = usePathname();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startPointerTrail(canvas);
  }, [pathname]);

  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
