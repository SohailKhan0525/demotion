import React from "react";
import packageJson from "../../package.json";
import { AbsoluteFill } from "remotion";
import { createBeatClock } from "../core/clock";
import { MotionProject, Shot } from "../engine/MotionProject";
import { demotionTheme as T } from "../engine/theme";
import { Terminal } from "../ui/Terminal";
import { CodePanel } from "../ui/CodePanel";

export const uiClock = createBeatClock({ bpm: 120, fps: 60 });
export const UI_BEATS = 8;
export const UI: React.FC = () => <MotionProject clock={uiClock} hud={<div style={{ position: "absolute", left: 200, top: 60, fontFamily: "Archivo", fontSize: 48, fontWeight: 800, color: T.ink, background: T.accent, padding: "8px 18px", borderRadius: 8 }}>CODE, ON THE BEAT.</div>}>
  <Shot beats={4} bg={T.chalk}>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Terminal fontSize={40} title="demotion / local workflow" lines={[
        { at: 0.2, text: "node bin/demotion.js --version", type: 1.3, prompt: true },
        { at: 1.7, text: packageJson.version, color: T.accent },
        { at: 2.2, text: "npm run build", type: 0.8, prompt: true },
      ]} />
    </AbsoluteFill>
  </Shot>
  <Shot beats={4} bg={T.field} wipe={{ kind: "slats", accent: T.accent }}>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <CodePanel fontSize={34} file="Beat-clock example" at={0.1} over={2.6} lines={[
        [{ text: "import ", color: T.accent }, { text: '{ createBeatClock } from "demotion";' }],
        "", "const clock = createBeatClock({", "  bpm: 120,", "  fps: 60,", "});", "",
        [{ text: "clock.frame(4)", color: T.accent }, { text: " // 120 frames" }],
      ]} />
    </AbsoluteFill>
  </Shot>
</MotionProject>;
