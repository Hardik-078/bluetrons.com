"use client";

import { FloatingDock, DockItem } from "@/components/ui/floating-dock";
import { Home, Sparkles, Shield } from "lucide-react";
import { revealChrome, useChromeVisibility } from "@/lib/useChromeVisibility";

const DOCK_ITEMS: DockItem[] = [
  {
    title: "Home",
    icon: <Home className="h-full w-full" />,
    href: "/",
  },
  {
    title: "About",
    icon: <Sparkles className="h-full w-full" />,
    href: "/about",
  },
  {
    title: "Terms",
    icon: <Shield className="h-full w-full" />,
    href: "/terms",
  },
];

/**
 * Floating dock nav. The wordmark lives in SiteHeader, not here.
 *
 * Leaves with the wordmark while the page is scrolled down, and also stays
 * away near the end of the page, where it would otherwise sit on top of the
 * partners and the footer (lib/useChromeVisibility.ts). The wrapper is
 * display: contents, so it adds no box and the docks stay fixed to the frame;
 * it only exists to hear focus arriving inside them.
 */
export default function DockNavigation() {
  const { hidden, atEnd } = useChromeVisibility();

  return (
    <div className="contents" onFocusCapture={revealChrome}>
      <FloatingDock items={DOCK_ITEMS} hidden={hidden || atEnd} />
    </div>
  );
}
