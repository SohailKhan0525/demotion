import React from "react";
import { createBeatClock } from "../core/clock";
import { demotionTheme as T } from "../engine/theme";
import { MotionProject, Shot } from "../engine/MotionProject";
import { KineticHeadline } from "../type/KineticHeadline";
import { WideStack } from "../type/WideStack";

export const labClock = createBeatClock({ bpm: 120, fps: 60 });
export const LAB_BEATS = 8;

/** look-development sandbox: a few shots to judge the engine's feel */
export const Lab: React.FC = () => (
  <MotionProject clock={labClock}>
    <Shot beats={2} bg={T.field}>
      <KineticHeadline text="MOTION" color={T.chalk} accent={T.accent} accentIndex={3} />
    </Shot>
    <Shot beats={2} bg={T.chalk} wipe={{ kind: "slide", accent: T.accent }}>
      <WideStack text="CODE" color={T.ink} accent={T.spark} />
    </Shot>
    <Shot beats={2} bg={T.ink} wipe={{ kind: "slats", accent: T.field }}>
      <KineticHeadline text="demotion" color={T.chalk} accent={T.accent} accentIndex={4} width={1400} wdth={100} />
    </Shot>
    <Shot beats={2} bg={T.spark} wipe={{ kind: "iris", accent: T.ink }}>
      <WideStack text="RENDER" color={T.ink} accent={T.chalk} widths={[75, 125]} />
    </Shot>
  </MotionProject>
);
