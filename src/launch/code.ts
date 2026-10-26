// Exact starter source, checked against template/src/MyVideo.tsx by tests.
export const MYVIDEO_SOURCE = "import { Series } from \"remotion\";\nimport { TitleCard, highlight } from \"demotion\";\n\nexport const MyVideo = () => (\n  <Series>\n    <Series.Sequence durationInFrames={60}>\n      <TitleCard text={[highlight(\"Hello, \", \"#14121f\"),\n        highlight(\"demotion\", \"#a21caf\")]} />\n    </Series.Sequence>\n    <Series.Sequence durationInFrames={90}>\n      <TitleCard text=\"Every frame is code.\" />\n    </Series.Sequence>\n  </Series>\n);\n";
import { demotionTheme as T } from "../engine/theme";
export const MYVIDEO = MYVIDEO_SOURCE.trimEnd().split("\n").map((line) =>
  line.split(/("[^"\n]*"|\b(?:import|from|export|const)\b|\b\d+\b)/g).filter(Boolean).map((text) => ({
    text, color: text.startsWith('"') ? T.accent : /^(import|from|export|const)$/.test(text) ? T.spark : T.chalk,
  })));

export const INIT_CMD = "node bin/demotion.js init my-video";
export const RENDER_CMD = "npm run render:4k";
