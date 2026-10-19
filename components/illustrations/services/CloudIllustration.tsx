import { Box, Detail, Frame, Guide, Link, Node, Plate, Puck } from "./primitives";

const BAYS = [24, 34, 44, 54, 64, 74];

/** 03 Data Center & Cloud: two server halls, and a cloud formed above them,
    held clear of the buildings and tied to them by its uplinks. */
export default function CloudIllustration() {
  return (
    <Frame>
      <Plate />

      <Box at={[14, 28, 0]} size={[72, 18, 26]} order={1}>
        <Detail segments={BAYS.map((x) => [[x, 46, 5], [x, 46, 21]])} />
      </Box>
      <Box at={[14, 56, 0]} size={[72, 18, 26]} order={2}>
        <Detail segments={BAYS.map((x) => [[x, 74, 5], [x, 74, 21]])} />
      </Box>

      <Guide pts={[[24, 37, 26], [24, 37, 72]]} order={2} />
      <Guide pts={[[78, 65, 26], [78, 65, 72]]} order={2} />
      <Link pts={[[50, 65, 26], [50, 65, 72]]} order={3} signal />

      <Puck at={[50, 50, 72]} r={30} h={2} order={3} glass />
      <Puck at={[36, 50, 75]} r={14} h={7} order={4} />
      <Puck at={[60, 40, 75]} r={17} h={12} order={4} />
      <Puck at={[56, 62, 75]} r={12} h={5} order={5} />

      <Node at={[22, 65, 26]} r={1.4} order={5} />
      <Node at={[60, 40, 87]} r={1.6} tone="cyan" order={6} />
    </Frame>
  );
}
