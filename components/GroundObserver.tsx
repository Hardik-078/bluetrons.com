"use client";

import { useGroundObserver } from "@/lib/useGroundObserver";

/**
 * Mount point for the ground observer. Renders nothing; it exists so the
 * root layout can stay a Server Component while the effect runs once for the
 * whole document.
 */
export default function GroundObserver() {
  useGroundObserver();
  return null;
}
