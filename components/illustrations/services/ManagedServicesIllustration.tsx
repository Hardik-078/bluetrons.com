import { Box, Dot, Frame, Label, Link, Node, Orbit, Plate, type P3 } from "./primitives";

const HUB_TOP: P3 = [55, 55, 33];

/** Satellite positions (lowest corner), back to front, and whether a signal
    runs to them. */
const BACK: { at: P3; signal?: boolean }[] = [
  { at: [6, 10, 0] },
  { at: [90, 8, 0], signal: true },
  { at: [8, 90, 0], signal: true },
];
const FRONT: P3 = [92, 88, 0];

const top = ([x, y]: P3): P3 => [x + 6, y + 6, 14];

/** 10 Managed IT Services: a central operations point watching the systems
    around it. */
export default function ManagedServicesIllustration() {
  return (
    <Frame>
      <Plate />
      <Orbit at={[55, 55, 0]} r={48} order={1} />
      <Orbit at={[55, 55, 0]} r={30} order={1} />

      {BACK.map(({ at }) => (
        <Box key={at.join()} at={at} size={[12, 12, 14]} order={1} />
      ))}

      <Box at={[44, 44, 0]} size={[22, 22, 30]} order={2}>
        {[8, 14, 20].map((z) => (
          <Dot key={z} at={[66, 48, z]} />
        ))}
      </Box>
      <Box at={[42, 42, 30]} size={[26, 26, 3]} order={3} glass />

      {BACK.map(({ at, signal }) => (
        <Link key={at.join()} pts={[HUB_TOP, top(at)]} order={4} signal={signal} />
      ))}
      <Link pts={[HUB_TOP, top(FRONT)]} order={4} />
      <Box at={FRONT} size={[12, 12, 14]} order={3} />

      {[...BACK.map(({ at }) => at), FRONT].map((at) => (
        <Node key={at.join()} at={top(at)} r={1.3} order={5} />
      ))}
      <Node at={HUB_TOP} r={1.7} tone="cyan" order={6} />
      <Label at={HUB_TOP} dx={22} dy={-46} text="NOC" />
    </Frame>
  );
}
