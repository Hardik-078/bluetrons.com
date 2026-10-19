/** `color` at `alpha` percent, for gradient stops built from tokens. */
const fade = (color: string, alpha: number) =>
  `color-mix(in srgb, ${color} ${alpha}%, transparent)`;

/** Two tokens mixed, `share` percent of the first. */
const mix = (a: string, b: string, share: number) =>
  `color-mix(in srgb, ${a} ${share}%, ${b})`;

/**
 * The glows are soft gradients drawn at their blurred size, not blurred
 * elements. They used to be a hard radial under `filter: blur(140px)` and
 * `blur(160px)`, and a filter that size is re-run by the compositor on every
 * frame the screen changes -- every frame of a scroll -- which alone held the
 * page to a fraction of its frame rate. The stops below trace the blurred
 * falloff (measured against the old rendering: under a quarter of one 8-bit
 * level of difference on average), so the look is unchanged and the layers
 * are painted once.
 *
 * Each glow keeps its original box for placement; the gradient extends past
 * it by the old blur's reach (2.5 sigma) on every side.
 */
export default function BackgroundMesh() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Primary Cyan Energy Core (Top Center / Hero) */}
      <div
        className="absolute -top-[25%] left-1/2 h-[650px] w-[800px] -translate-x-1/2"
        style={{ opacity: "var(--mesh-opacity-1)" }}
      >
        <div
          className="absolute -inset-[350px]"
          style={{
            background: `radial-gradient(ellipse closest-side,
              ${mix("var(--accent)", "var(--accent-deep)", 72)} 0%,
              ${fade(mix("var(--accent)", "var(--accent-deep)", 50), 90)} 22%,
              ${fade(mix("var(--accent)", "var(--accent-deep)", 20), 70)} 40%,
              ${fade("var(--accent-deep)", 40)} 54%,
              ${fade("var(--accent-deep)", 15)} 69%,
              ${fade("var(--accent-deep)", 3.5)} 84%,
              transparent 100%)`,
          }}
        />
      </div>

      {/* Secondary Deep Cobalt Pool (Bottom Left) */}
      <div
        className="absolute top-[60%] -left-[10%] h-[500px] w-[600px]"
        style={{ opacity: "var(--mesh-opacity-2)" }}
      >
        <div
          className="absolute -inset-[400px]"
          style={{
            background: `radial-gradient(ellipse closest-side,
              ${fade("var(--accent-deep)", 50)} 0%,
              ${fade(mix("var(--accent-deep)", "var(--surface-base)", 72), 32)} 35%,
              ${fade("var(--surface-base)", 18)} 58%,
              ${fade("var(--surface-base)", 5)} 78%,
              transparent 100%)`,
          }}
        />
      </div>

      {/* Vignette Edge Shading */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--surface-base)_95%)]" />
    </div>
  );
}
