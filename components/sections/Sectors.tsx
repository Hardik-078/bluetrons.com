"use client";

import { motion } from "motion/react";
import { SECTORS } from "@/lib/aboutContent";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Who the company serves.
 *
 * This used to be five parallax card plates, which is the shape every page
 * reaches for and the reason this one stopped feeling like a brand. Five
 * names and five one-line notes do not need containers: they need a table of
 * contents.
 *
 * So the name is the largest type in the light band and the note sits beside
 * it at a sixth of the size. That difference is the entire hierarchy, and it
 * is doing more work than a border ever did.
 *
 * The reveal is a mask, not a fade: the name rises into a clipped box, which
 * reads as type being set rather than as an element switching on. It is a
 * transform inside an overflow box, so it stays on the compositor.
 *
 * The trigger sits on the row rather than on the name, and the name follows
 * through a variant. Putting it on the name deadlocks: the name starts
 * translated fully outside its own clip box, an IntersectionObserver honours
 * ancestor clipping, so the element that is waiting to be seen can never be
 * seen and the reveal never fires.
 */
export default function Sectors() {
  return (
    <section className="sct" aria-label="Who we serve">
      <div className="sct-inner">
        <ol>
          {SECTORS.map((sector) => (
            <motion.li
              key={sector.id}
              className="sct-row"
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.55 }}
            >
              <span className="sct-mark" aria-hidden="true" />
              <span className="sct-mask">
                <motion.span
                  className="sct-name"
                  variants={{ hidden: { y: "108%" }, shown: { y: "0%" } }}
                  transition={{ duration: 0.85, ease: EASE }}
                >
                  {sector.name}
                </motion.span>
              </span>
              <motion.p
                className="sct-note"
                variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              >
                {sector.note}
              </motion.p>
            </motion.li>
          ))}
        </ol>

        <motion.p
          className="sct-close"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          Our strength is a one-stop technology platform: multi-technology
          expertise, professional execution, quality products and responsive
          support, under one accountable partner.
        </motion.p>
      </div>
    </section>
  );
}
