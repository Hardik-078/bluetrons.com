"use client";

import type { ComponentType } from "react";
import CloudIllustration from "./CloudIllustration";
import CollaborationIllustration from "./CollaborationIllustration";
import ComputingIllustration from "./ComputingIllustration";
import InfrastructureIllustration from "./InfrastructureIllustration";
import InstallationIllustration from "./InstallationIllustration";
import ManagedServicesIllustration from "./ManagedServicesIllustration";
import NetworkingIllustration from "./NetworkingIllustration";
import PowerIllustration from "./PowerIllustration";
import SecurityIllustration from "./SecurityIllustration";
import SoftwareIllustration from "./SoftwareIllustration";
import SurveillanceIllustration from "./SurveillanceIllustration";

/** Service id (lib/aboutContent.ts) to its illustration. */
const ILLUSTRATIONS: Record<string, ComponentType> = {
  "it-infrastructure": InfrastructureIllustration,
  networking: NetworkingIllustration,
  "data-center": CloudIllustration,
  cybersecurity: SecurityIllustration,
  "audio-visual": CollaborationIllustration,
  surveillance: SurveillanceIllustration,
  products: ComputingIllustration,
  "cloud-software": SoftwareIllustration,
  power: PowerIllustration,
  "managed-services": ManagedServicesIllustration,
  support: InstallationIllustration,
};

export function ServiceIllustration({ id }: { id: string }) {
  const Illustration = ILLUSTRATIONS[id];
  return Illustration ? <Illustration /> : null;
}

/**
 * The gradients every illustration paints with, defined once for the page
 * and referenced by id from the stylesheet. Kept in the layout (zero size,
 * not display: none) because a gradient inside a hidden SVG does not render.
 * Colours come from the section's tokens where one exists.
 */
export function IllustrationDefs() {
  return (
    <svg
      className="svc-ill-defs"
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="bt-ill-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f7f7f4" />
        </linearGradient>
        <linearGradient id="bt-ill-l" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efefeb" />
          <stop offset="1" stopColor="#e3e3de" />
        </linearGradient>
        <linearGradient id="bt-ill-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3e4e0" />
          <stop offset="1" stopColor="#d4d6d2" />
        </linearGradient>
        <linearGradient id="bt-ill-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f7fc" />
          <stop offset="1" stopColor="#dde7f5" />
        </linearGradient>
        <linearGradient id="bt-ill-active" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "rgb(var(--brand-cyan-rgb))", stopOpacity: 0.22 }} />
          <stop offset="1" style={{ stopColor: "var(--accent)", stopOpacity: 0.28 }} />
        </linearGradient>
        <linearGradient id="bt-ill-cone" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" style={{ stopColor: "var(--accent)", stopOpacity: 0.16 }} />
          <stop offset="1" style={{ stopColor: "var(--accent)", stopOpacity: 0.02 }} />
        </linearGradient>
        <radialGradient id="bt-ill-shadow">
          <stop offset="0" stopColor="#0b0d0f" stopOpacity="0.12" />
          <stop offset="0.6" stopColor="#0b0d0f" stopOpacity="0.045" />
          <stop offset="1" stopColor="#0b0d0f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bt-ill-glow">
          <stop offset="0" style={{ stopColor: "rgb(var(--brand-cyan-rgb))", stopOpacity: 0.42 }} />
          <stop offset="1" style={{ stopColor: "rgb(var(--brand-cyan-rgb))", stopOpacity: 0 }} />
        </radialGradient>
      </defs>
    </svg>
  );
}
