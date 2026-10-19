import {
  Box,
  Dot,
  Frame,
  Label,
  Node,
  Orbit,
  Plate,
  Quad,
  RingLink,
} from "./primitives";

/** 04 Cybersecurity: a protected core inside a guarded perimeter. */
export default function SecurityIllustration() {
  return (
    <Frame>
      <Plate />
      <Orbit at={[55, 55, 0]} r={53} order={1} />
      <RingLink at={[55, 55, 0]} r={44} order={2} signal />

      <Box at={[53, 9, 0]} size={[4, 4, 22]} order={2} />
      <Box at={[9, 53, 0]} size={[4, 4, 22]} order={2} />

      <Box at={[44, 44, 0]} size={[22, 22, 26]} order={1}>
        <Dot at={[66, 55, 17]} r={1.8} className="ill-node" />
        <Quad
          corners={[[66, 54.3, 9], [66, 55.7, 9], [66, 55.7, 15], [66, 54.3, 15]]}
          className="ill-node"
        />
      </Box>
      <Box at={[34, 34, 0]} size={[42, 42, 42]} order={3} glass />

      <Box at={[97, 53, 0]} size={[4, 4, 22]} order={3} />
      <Box at={[53, 97, 0]} size={[4, 4, 22]} order={3} />

      <Node at={[55, 11, 22]} r={1.3} order={5} />
      <Node at={[11, 55, 22]} r={1.3} order={5} />
      <Node at={[99, 55, 22]} r={1.4} tone="cyan" order={5} />
      <Node at={[55, 99, 22]} r={1.3} order={5} />
      <Label at={[34, 34, 42]} dx={14} dy={-52} text="PERIMETER" />
    </Frame>
  );
}
