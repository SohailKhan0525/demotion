import React from "react";
import { AbsoluteFill, Composition, registerRoot } from "remotion";
import {
  DrawPath, FollowPath, MotionProject, Shot, WorkflowIllustration,
  createBeatClock, demotionTheme, ensureFontsLoaded,
} from "@demotion/cli";

ensureFontsLoaded();
export const illustrationClock = createBeatClock({ bpm: 128, fps: 60 });
const route = "M120 360C340 60 620 660 840 360";

export const IllustrationStory = () => (
  <MotionProject clock={illustrationClock} camera={{ beat: 0.002, bar: 0.004, drift: 0.002, shakeAmp: 0.12 }}>
    <Shot beats={8} bg={demotionTheme.chalk} hit={0.25}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <WorkflowIllustration width={1440} height={900} at={0.25} />
      </AbsoluteFill>
    </Shot>
    <Shot beats={8} bg={demotionTheme.ink} wipe={{ kind: "slats" }} hit={0.25}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <svg width={1440} height={900} viewBox="0 0 960 600" role="img" aria-label="A marker follows a drawn curved path">
          <DrawPath d={route} at={0.25} over={3} stroke={demotionTheme.chalk} strokeWidth={6} />
          <FollowPath d={route} at={0.25} over={4}>
            <path d="M-17-12L20 0L-17 12L-9 0Z" fill={demotionTheme.accent} />
          </FollowPath>
        </svg>
      </AbsoluteFill>
    </Shot>
  </MotionProject>
);

const Root = () => <Composition id="IllustrationStory" component={IllustrationStory} durationInFrames={illustrationClock.duration(16)} fps={60} width={1920} height={1080} />;
registerRoot(Root);
