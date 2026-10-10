import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { barPunch, beatPunch, type BeatClock } from "../core/clock";
import { shake, type ShakeHit } from "../core/shake";

/**
 * The virtual camera. Everything inside gets a tiny scale "thump" on every beat, a bigger one on every
 * bar, a slow push-in, and a shake that only appears right after a hit and then decays.
 */
export const CameraRig: React.FC<{
  clock: BeatClock;
  /** frames where something lands hard (shot starts, impacts) */
  hits?: ShakeHit[];
  beat?: number; // scale added at the peak of each beat punch
  bar?: number; // scale added at the peak of each bar punch
  drift?: number; // slow push-in, scale per second
  shakeAmp?: number; // px
  children: React.ReactNode;
}> = ({ clock, hits = [], beat = 0.006, bar = 0.016, drift = 0.004, shakeAmp = 12, children }) => {
  const frame = useCurrentFrame();
  const s = shake(frame, clock.fps, hits, { amp: shakeAmp, rot: 0.5 });
  const scale = 1 + beat * beatPunch(clock, frame) + bar * barPunch(clock, frame) + drift * (frame / clock.fps);
  return (
    <AbsoluteFill style={{ transform: `translate(${s.x}px, ${s.y}px) rotate(${s.rotate}deg) scale(${scale})`, transformOrigin: "50% 50%" }}>
      {children}
    </AbsoluteFill>
  );
};
