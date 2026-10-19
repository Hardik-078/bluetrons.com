import {
  Box,
  Dot,
  Frame,
  Label,
  Link,
  Node,
  Orbit,
  Plate,
  Quad,
  type P3,
} from "./primitives";

/** Endpoint centres, back to front. */
const ENDPOINTS: P3[] = [
  [11, 27, 0],
  [79, 11, 0],
  [15, 79, 0],
  [57, 97, 0],
  [97, 67, 0],
];
const SIGNALLED = new Set([1, 3]);

/** 02 Enterprise Networking: a core switch and the endpoints it connects. */
export default function NetworkingIllustration() {
  return (
    <Frame>
      <Plate />
      <Orbit at={[55, 55, 0]} r={48} order={1} />

      {ENDPOINTS.map(([x, y], i) => (
        <Link
          key={i}
          pts={[[55, 55, 0.5], [x, y, 0.5]]}
          order={2}
          signal={SIGNALLED.has(i)}
        />
      ))}

      {ENDPOINTS.slice(0, 3).map(([x, y], i) => (
        <Box key={i} at={[x - 5, y - 5, 0]} size={[10, 10, 8]} order={1} />
      ))}

      <Box at={[40, 40, 0]} size={[30, 30, 12]} order={1}>
        <Quad
          corners={[[47, 47, 12], [63, 47, 12], [63, 63, 12], [47, 63, 12]]}
          className="ill-inset"
        />
        {[45, 50, 55, 60].map((y) => (
          <Dot key={y} at={[70, y, 6]} />
        ))}
      </Box>

      {ENDPOINTS.slice(3).map(([x, y], i) => (
        <Box key={i} at={[x - 5, y - 5, 0]} size={[10, 10, 8]} order={2} />
      ))}

      <Node at={[70, 65, 6]} r={1.3} order={4} />
      <Node at={[11, 27, 8]} r={1.4} order={5} />
      <Node at={[97, 67, 8]} r={1.5} tone="cyan" order={5} />
      <Label at={[55, 55, 12]} dx={30} dy={-46} text="CORE" />
    </Frame>
  );
}
