import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { MotionProject, Shot } from "../engine/MotionProject";
import { demotionTheme as T } from "../engine/theme";
import { decay, clamp01 } from "../core/math";
import { LaunchShot } from "./shots";
import { SHOTS, launchClock, shotStart, LAUNCH_BEATS } from "./timeline";

export const LaunchDemo: React.FC<{ muted?: boolean }> = ({ muted = false }) => {
  const frame = useCurrentFrame();
  const flash = decay((frame - launchClock.frame(shotStart("ptext"))) / launchClock.fps, 0.055);
  return <AbsoluteFill>
    {!muted && <Audio src={staticFile("launch-soundtrack.wav")} volume={(f) => clamp01((launchClock.duration(LAUNCH_BEATS) - f) / (launchClock.fps * 1.4))} />}
    <MotionProject clock={launchClock}>
      {SHOTS.map((shot) => <Shot key={shot.id} beats={shot.beats} bg={T[shot.bg]} blurSamples={shot.id === "stack" ? 1 : 6}
        wipe={"wipe" in shot ? { kind: shot.wipe, accent: T[shot.accent] } : undefined}>
        <LaunchShot id={shot.id} />
      </Shot>)}
    </MotionProject>
    {flash > 0.005 && <AbsoluteFill style={{ background: T.chalk, opacity: flash * 0.6, pointerEvents: "none" }} />}
  </AbsoluteFill>;
};
