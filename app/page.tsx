import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import Threshold from "@/components/sections/Threshold";
import Commitments from "@/components/sections/Commitments";
import Capabilities from "@/components/sections/Capabilities";
import Sectors from "@/components/sections/Sectors";
import Close from "@/components/sections/Close";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description:
    "Bluetron Infotech LLP delivers IT infrastructure, enterprise networking, cybersecurity, data centre, surveillance, audio-visual, power and managed services for Corporate, Government, PSU, Education and Enterprise customers.",
};

/**
 * One composition, dark to light and back.
 *
 * The hero establishes the brand in a dark technology environment. The
 * threshold is where the page crosses over, once and on purpose. The three
 * sections between it and the close run on paper, each with its own layout
 * but all on the same grid, type scale and hairline system. The close returns
 * to the dark and hands off to the footer.
 *
 * .env-light is a token scope, not a theme: there is no switch, no
 * preference and nothing stored. See globals.css.
 */
export default function Home() {
  return (
    <div className="sec-page flex w-full flex-col">
      {/* The hero is passed to the threshold rather than placed before it:
          the two share one pinned track, so the transition happens THROUGH
          the hero instead of after it. The hero component itself is
          untouched -- it is the same markup, on a plane that moves. */}
      <Threshold>
        <HeroSection />
      </Threshold>

      <div className="env-light env-light-ground" data-ground="light">
        {/* Technology, reliability, commitment: one band each */}
        <Commitments />

        {/* The eleven solution lines */}
        <Capabilities />

        {/* Corporate, Government, PSU, Education, Enterprise */}
        <Sectors />
      </div>

      {/* Technology partners, then the closing statement */}
      <Close />
    </div>
  );
}
