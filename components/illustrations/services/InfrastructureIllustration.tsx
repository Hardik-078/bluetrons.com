import { Box, Detail, Dot, Frame, Guide, Link, Node, Plate } from "./primitives";

const UNITS = [10, 22, 34, 46, 58, 70, 82];

/** 01 IT Infrastructure: a server rack beside a storage unit, cabled. */
export default function InfrastructureIllustration() {
  return (
    <Frame>
      <Plate />
      <Guide pts={[[22, 76, 0], [22, 76, 94]]} order={1} />

      <Box at={[28, 30, 0]} size={[44, 46, 94]} order={1}>
        <Detail segments={UNITS.map((z) => [[72, 32, z], [72, 74, z]])} />
        <Detail segments={UNITS.map((z) => [[30, 76, z], [70, 76, z]])} />
        {UNITS.map((z) => (
          <Dot key={z} at={[72, 36, z + 6]} />
        ))}
      </Box>

      <Box at={[80, 42, 0]} size={[22, 34, 42]} order={2}>
        <Detail segments={[50, 58, 66].map((y) => [[102, y, 6], [102, y, 36]])} />
      </Box>

      <Link
        pts={[[60, 76, 0], [60, 90, 0], [91, 90, 0], [91, 76, 0]]}
        order={3}
        signal
      />
      <Node at={[72, 36, 52]} r={1.5} order={4} />
      <Node at={[72, 36, 76]} r={1.5} tone="cyan" order={5} />
    </Frame>
  );
}
