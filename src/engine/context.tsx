import React, { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";
import type { BeatClock } from "../core/clock";
import type { Theme } from "./theme";

export type ShotInfo = {
  clock: BeatClock;
  theme: Theme;
  /** global frame at which this shot's beat 0 lands */
  startFrame: number;
  /** frames this shot is mounted before it becomes visible (entrances begin under the wipe) */
  pre: number;
  /** length in frames from its landing beat to the next shot's landing beat */
  durationFrames: number;
  /** beat position of this shot's start on the project timeline */
  startBeat: number;
};

export const ShotContext = createContext<ShotInfo | null>(null);

/**
 * Inside a <Shot>: author in the shot's own beats.
 *   const { at, frame } = useShot();   at(1.5)  // frame number of beat 1.5 of THIS shot
 */
export const useShot = () => {
  const info = useContext(ShotContext);
  if (!info) throw new Error("useShot() must be used inside a <Shot>");
  const local = useCurrentFrame(); // local to the Sequence, which starts `pre` frames before the landing beat
  const frame = local - info.pre; // 0 exactly on the shot's landing beat; negative while hidden under the wipe
  const at = (beats: number) => info.clock.frame(info.startBeat + beats) - info.startFrame;
  return { ...info, frame, at, seconds: frame / info.clock.fps };
};
