import { Box, Frame, Link, Node, Plate, Puck, Quad } from "./primitives";

/** 05 Audio-Visual & Collaboration: a meeting display, a table and a room
    microphone linked to it. */
export default function CollaborationIllustration() {
  return (
    <Frame>
      <Plate />

      <Box at={[12, 50, 0]} size={[8, 10, 26]} order={1} />
      <Box at={[14, 22, 26]} size={[4, 66, 46]} order={1}>
        <Quad
          corners={[[18, 26, 30], [18, 53, 30], [18, 53, 47], [18, 26, 47]]}
          className="ill-screen"
        />
        <Quad
          corners={[[18, 26, 51], [18, 53, 51], [18, 53, 68], [18, 26, 68]]}
          className="ill-screen"
        />
        <Quad
          corners={[[18, 57, 30], [18, 84, 30], [18, 84, 47], [18, 57, 47]]}
          className="ill-screen"
        />
        <Quad
          corners={[[18, 57, 51], [18, 84, 51], [18, 84, 68], [18, 57, 68]]}
          className="ill-screen ill-screen-active"
        />
      </Box>

      <Box at={[56, 50, 0]} size={[14, 14, 16]} order={2} />
      <Box at={[38, 36, 16]} size={[50, 40, 3]} order={2} />
      <Link
        pts={[[58, 56, 19.2], [38, 56, 19.2], [18, 56, 34]]}
        order={3}
        signal
      />
      <Puck at={[63, 56, 19]} r={6} h={2} order={3} />

      <Box at={[92, 42, 0]} size={[8, 8, 11]} order={3} />
      <Box at={[92, 62, 0]} size={[8, 8, 11]} order={3} />

      <Node at={[18, 70, 59.5]} r={1.4} order={5} />
      <Node at={[63, 56, 21]} r={1.5} tone="cyan" order={5} />
    </Frame>
  );
}
