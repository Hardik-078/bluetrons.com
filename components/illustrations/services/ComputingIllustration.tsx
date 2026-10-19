import { motion } from "motion/react";
import { Box, Frame, Link, Node, Plate, Quad, rise } from "./primitives";

/** 07 End-User Computing: a desk with a monitor, a laptop and a phone. */
export default function ComputingIllustration() {
  return (
    <Frame>
      <Plate />

      <Box at={[24, 42, 0]} size={[10, 42, 26]} order={1} />
      <Box at={[86, 42, 0]} size={[10, 42, 26]} order={1} />
      <Box at={[20, 36, 26]} size={[80, 52, 3]} order={2} />

      <Box at={[38, 56, 29]} size={[6, 8, 9]} order={3} />
      <Box at={[34, 42, 38]} size={[3, 36, 26]} order={3}>
        <Quad
          corners={[[37, 45, 41], [37, 75, 41], [37, 75, 61], [37, 45, 61]]}
          className="ill-screen"
        />
      </Box>

      <Link
        pts={[[58, 66, 29.2], [46, 66, 29.2], [46, 62, 29.2]]}
        order={4}
        signal
      />

      <Box at={[58, 56, 29]} size={[24, 20, 1.5]} order={4}>
        <Quad
          corners={[[61, 59, 30.5], [74, 59, 30.5], [74, 73, 30.5], [61, 73, 30.5]]}
          className="ill-inset"
        />
      </Box>
      <motion.g variants={rise} custom={4}>
        <Quad
          corners={[[58, 56, 30.5], [58, 76, 30.5], [52, 76, 48], [52, 56, 48]]}
          className="ill-face ill-r"
        />
        <Quad
          corners={[[57.4, 58, 32.6], [57.4, 74, 32.6], [52.8, 74, 45.8], [52.8, 58, 45.8]]}
          className="ill-screen"
        />
      </motion.g>

      <Box at={[86, 70, 29]} size={[9, 6, 1]} order={5} />

      <Node at={[37, 60, 39.5]} r={1.2} order={5} />
      <Node at={[55, 66, 40]} r={1.5} tone="cyan" order={6} />
    </Frame>
  );
}
