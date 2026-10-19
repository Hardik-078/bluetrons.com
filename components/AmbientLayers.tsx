"use client";

import { usePathname } from "next/navigation";
import BackgroundMesh from "@/components/BackgroundMesh";
import InteractiveCanvas from "@/components/InteractiveCanvas";

/**
 * Site-wide ambient background layers.
 *
 * /about builds its own deep-space environment and needs a clean stage for its
 * scroll choreography, so both global layers are suppressed there. Unmounting
 * the canvas also stops its requestAnimationFrame loop (the trail cleans up
 * after itself), so nothing competes with the scroll-driven zoom for the main
 * thread.
 */
export default function AmbientLayers() {
  const pathname = usePathname();

  if (pathname === "/about") return null;

  return (
    <>
      <InteractiveCanvas />
      <BackgroundMesh />
    </>
  );
}
