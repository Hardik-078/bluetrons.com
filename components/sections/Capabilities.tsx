"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Cctv,
  Cloud,
  Database,
  Laptop,
  LifeBuoy,
  Network,
  PlugZap,
  Presentation,
  Server,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { CAPABILITIES, type Capability } from "@/lib/aboutContent";
import {
  IllustrationDefs,
  ServiceIllustration,
} from "@/components/illustrations/services";

const EASE = [0.16, 1, 0.3, 1] as const;

const ICONS: Record<string, LucideIcon> = {
  "it-infrastructure": Server,
  networking: Network,
  "data-center": Database,
  cybersecurity: ShieldCheck,
  "audio-visual": Presentation,
  surveillance: Cctv,
  products: Laptop,
  "cloud-software": Cloud,
  power: PlugZap,
  "managed-services": Wrench,
  support: LifeBuoy,
};

/**
 * The eleven service areas.
 *
 * COMPOSITION
 *
 * A compact index on one narrow column: an index number, the service name,
 * its spec, a short lede, and the details behind a native disclosure (no
 * script, keyboard reachable). The list is the section. Eleven entries with a
 * spec, a lede and five details each is a lot of material, and a scannable
 * column is what keeps it readable.
 *
 * THE ILLUSTRATIONS
 *
 * One technical drawing per service (components/illustrations/services), all
 * built from the same kit so they read as one family. They are a peripheral
 * layer rather than part of the grid: each belongs to its service and hangs
 * just outside the column, alternating left and right down the list,
 * positioned against its own row. So they take no width from the text and add
 * no height to the section. Where the margins are too narrow to hold them,
 * each drops into its row instead.
 *
 * MOTION
 *
 * An illustration builds itself once, as its service comes into view: plate,
 * solids, connections, then its accent points. When the build has settled a
 * signal runs along its connection once, and pointing at or focusing the
 * service runs it again. Nothing loops. Under reduced motion the drawings are
 * simply there.
 */
export default function Capabilities() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="cap" aria-label="Solutions and services">
      <IllustrationDefs />

      <div className="cap-head">
        <p className="sec-eyebrow mb-7">Solutions &amp; services</p>
        <h2 className="sec-heading">Eleven lines, one partner.</h2>
      </div>

      <ol className="cap-list">
        {CAPABILITIES.map((cap, i) => (
          <Item
            key={cap.id}
            cap={cap}
            side={i % 2 === 0 ? "left" : "right"}
            reduce={reduce}
          />
        ))}
      </ol>
    </section>
  );
}

function Item({
  cap,
  side,
  reduce,
}: {
  cap: Capability;
  side: "left" | "right";
  reduce: boolean;
}) {
  const Icon = ICONS[cap.id] ?? Server;
  // Arms the one-time signal once the illustration has been seen.
  const [seen, setSeen] = useState(false);

  return (
    <li
      className="cap-item"
      data-side={side}
      data-seen={seen ? "true" : undefined}
    >
      <div className="cap-item-head">
        <span className="cap-item-index">{cap.index}</span>
        <div className="min-w-0">
          <h3 className="cap-item-title">
            <Icon className="cap-item-icon" aria-hidden="true" />
            {cap.title}
          </h3>
          <p className="cap-item-spec">{cap.spec}</p>

          {/* In the flow on narrow screens; lifted out beside the column on
              wide ones (sections.css), so it never changes the row. */}
          <motion.div
            className="cap-shot"
            initial={reduce ? "shown" : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.45 }}
            onViewportEnter={() => setSeen(true)}
            variants={{
              hidden: { opacity: 0, x: side === "left" ? -12 : 12 },
              shown: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
            }}
          >
            <ServiceIllustration id={cap.id} />
          </motion.div>

          <p className="cap-item-lede">{cap.lede}</p>

          <details className="cap-disclosure">
            <summary className="cap-summary">
              {cap.detail.length} capabilities
            </summary>
            <ul className="cap-detail-list">
              {cap.detail.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </li>
  );
}
