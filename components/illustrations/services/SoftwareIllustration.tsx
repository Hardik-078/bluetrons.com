import { Box, Frame, Guide, Link, Node, Plate, type P3 } from "./primitives";

const CORNERS: [number, number][] = [
  [18, 18],
  [92, 18],
  [92, 92],
  [18, 92],
];

/** Module positions on the top layer, back to front, and which are active. */
const MODULES: { at: P3; active?: boolean }[] = [23, 45, 67]
  .flatMap((x) => [23, 45, 67].map((y) => [x, y] as const))
  .sort((a, b) => a[0] + a[1] - (b[0] + b[1]))
  .map(([x, y]) => ({
    at: [x, y, 56] as P3,
    active: (x === 45 && y === 23) || (x === 67 && y === 67),
  }));

/** 08 Software & Licensing: stacked software layers, with modules on top and
    one being activated through them. */
export default function SoftwareIllustration() {
  return (
    <Frame>
      <Plate />
      {CORNERS.map(([x, y]) => (
        <Guide key={`${x}-${y}`} pts={[[x, y, 8], [x, y, 54]]} order={1} />
      ))}

      <Box at={[18, 18, 6]} size={[74, 74, 2]} order={1} glass />
      <Box at={[18, 18, 30]} size={[74, 74, 2]} order={2} glass />
      <Link pts={[[76, 76, 8], [76, 76, 56]]} order={4} signal />
      <Box at={[18, 18, 54]} size={[74, 74, 2]} order={3} />

      {MODULES.map(({ at, active }) => (
        <Box
          key={`${at[0]}-${at[1]}`}
          at={at}
          size={[18, 18, 5]}
          order={4}
          top={active ? "ill-top-active" : undefined}
        />
      ))}

      <Node at={[92, 92, 32]} r={1.3} order={5} />
      <Node at={[76, 76, 61]} r={1.6} tone="cyan" order={6} />
    </Frame>
  );
}
