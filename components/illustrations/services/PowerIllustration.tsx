import { Box, Detail, Frame, Guide, Label, Link, Node, Plate, Quad } from "./primitives";

/** 09 Power Backup: a UPS fed by a battery cabinet, keeping a load running,
    with a backup path held in reserve. */
export default function PowerIllustration() {
  return (
    <Frame>
      <Plate />

      <Box at={[22, 34, 0]} size={[26, 34, 72]} order={1}>
        <Quad
          corners={[[48, 38, 54], [48, 56, 54], [48, 56, 64], [48, 38, 64]]}
          className="ill-screen"
        />
        <Detail segments={[12, 16, 20, 24, 28].map((z) => [[48, 40, z], [48, 62, z]])} />
      </Box>

      <Box at={[58, 34, 0]} size={[40, 34, 40]} order={2}>
        <Detail segments={[42, 51, 60].map((y) => [[98, y, 6], [98, y, 34]])} />
        <Detail segments={[68, 78, 88].map((x) => [[x, 68, 6], [x, 68, 34]])} />
      </Box>
      <Link pts={[[70, 51, 40], [70, 51, 46], [48, 51, 46]]} order={3} />

      <Guide pts={[[80, 68, 0.5], [80, 86, 0.5]]} order={3} />
      <Box at={[66, 86, 0]} size={[22, 14, 16]} order={3} />
      <Link pts={[[35, 68, 0.5], [35, 93, 0.5], [66, 93, 0.5]]} order={4} signal />

      <Node at={[48, 47, 59]} r={1.4} tone="cyan" order={5} />
      <Node at={[77, 93, 16]} r={1.4} order={5} />
      <Label at={[35, 51, 72]} dx={-16} dy={-22} text="CONTINUITY" />
    </Frame>
  );
}
