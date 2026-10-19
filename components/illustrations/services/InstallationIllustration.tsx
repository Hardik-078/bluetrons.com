import { motion } from "motion/react";
import {
  Box,
  Detail,
  Frame,
  Guide,
  Label,
  Link,
  Node,
  Plate,
  Quad,
  draw,
  path,
} from "./primitives";

const SLOT: [number, number][] = [
  [30, 46],
  [56, 46],
  [56, 66],
  [30, 66],
];

/**
 * 11 Installation, Integration & Technical Support: a module being lowered
 * into its slot, the system cabled to a second device, and a commissioning
 * check.
 */
export default function InstallationIllustration() {
  return (
    <Frame>
      <Plate />

      <Box at={[16, 34, 0]} size={[60, 44, 34]} order={1}>
        <Quad corners={SLOT.map(([x, y]) => [x, y, 34] as const)} className="ill-slot" />
        <Detail segments={[8, 16, 24].map((z) => [[76, 40, z], [76, 72, z]])} />
      </Box>

      {SLOT.map(([x, y]) => (
        <Guide key={`${x}-${y}`} pts={[[x, y, 34], [x, y, 54]]} order={3} />
      ))}
      <Box at={[30, 46, 54]} size={[26, 20, 10]} order={2} />
      <motion.path
        className="ill-link"
        d={path([[60, 51, 50], [60, 56, 45], [60, 61, 50]])}
        variants={draw}
        custom={4}
      />

      <Box at={[88, 52, 0]} size={[14, 24, 20]} order={2} />
      <Link
        pts={[[70, 78, 0.5], [70, 84, 0.5], [95, 84, 0.5], [95, 76, 0.5]]}
        order={4}
        signal
      />

      <Node at={[76, 40, 28]} r={1.2} order={5} />
      <Node at={[95, 64, 20]} r={1.6} tone="cyan" order={6} />
      <Label at={[95, 64, 20]} dx={14} dy={-40} text="COMMISSION" />
    </Frame>
  );
}
