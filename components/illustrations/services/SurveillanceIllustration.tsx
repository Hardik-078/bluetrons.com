import { motion } from "motion/react";
import {
  Box,
  Detail,
  Dot,
  Frame,
  Label,
  Link,
  Node,
  Plate,
  Quad,
  RingLink,
  fade,
  points,
} from "./primitives";

/** 06 Surveillance & Security: a camera on a building corner, its field of
    view on the ground, and a detection inside it. */
export default function SurveillanceIllustration() {
  return (
    <Frame>
      <Plate />
      <motion.g variants={fade} custom={1}>
        <Quad
          corners={[[46, 46, 0], [100, 56, 0], [94, 100, 0], [40, 92, 0]]}
          className="ill-zone"
        />
      </motion.g>

      <Box at={[8, 8, 0]} size={[96, 6, 54]} order={1}>
        <Detail segments={[18, 36].map((z) => [[8, 14, z], [104, 14, z]])} />
      </Box>
      <Box at={[8, 14, 0]} size={[6, 90, 54]} order={1}>
        <Detail segments={[18, 36].map((z) => [[14, 14, z], [14, 104, z]])} />
      </Box>

      <Box at={[14, 14, 48]} size={[10, 4, 2]} order={2} />
      <Box at={[24, 16, 42]} size={[14, 6, 8]} order={2}>
        <Dot at={[38, 19, 46]} r={1.9} className="ill-lens" />
      </Box>

      <motion.polygon
        className="ill-cone"
        points={points([[38, 19, 46], [100, 56, 0], [40, 92, 0]])}
        variants={fade}
        custom={3}
      />
      <Link pts={[[38, 19, 46], [70, 74, 0]]} order={4} signal />
      <RingLink at={[70, 74, 0]} r={8} order={4} />
      <Node at={[70, 74, 0]} r={1.7} tone="cyan" order={5} />
      <Label at={[70, 74, 0]} dx={16} dy={-16} text="DETECTION" />
    </Frame>
  );
}
