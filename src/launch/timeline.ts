import { createBeatClock } from "../core/clock";
import type { SoundtrackSpec, Cue } from "../audio/types";
import type { WipeKind } from "../engine/Wipe";
import type { Theme } from "../engine/theme";
import { INIT_CMD, RENDER_CMD, MYVIDEO } from "./code";

export const launchClock = createBeatClock({ bpm: 120, fps: 60 });
type ShotSpec = { id: string; beats: number; bg: keyof Theme; wipe?: WipeKind; accent?: keyof Theme; cut?: "flash" };
export const SHOTS = [
  { id: "motion", beats: 2, bg: "field" },
  { id: "code", beats: 2, bg: "chalk", wipe: "slide", accent: "accent" },
  { id: "meet", beats: 3, bg: "ink", wipe: "slats", accent: "field" },
  { id: "nolist", beats: 4, bg: "chalk", wipe: "diagonal", accent: "spark" },
  { id: "terminal", beats: 4, bg: "ink", wipe: "slide", accent: "accent" },
  { id: "codepanel", beats: 4, bg: "field", wipe: "iris", accent: "ink" },
  { id: "number", beats: 3, bg: "chalk", wipe: "slats", accent: "field" },
  { id: "stack", beats: 10, bg: "ink", wipe: "diagonal", accent: "accent" },
  { id: "bands", beats: 4, bg: "field", wipe: "slide", accent: "spark" },
  { id: "sound", beats: 4, bg: "ink", wipe: "slats", accent: "accent" },
  { id: "license", beats: 4, bg: "chalk", wipe: "iris", accent: "ink" },
  { id: "ptext", beats: 2, bg: "ink", wipe: "slide", accent: "spark", cut: "flash" },
  { id: "final", beats: 6, bg: "field", wipe: "diagonal", accent: "accent" },
] as const satisfies readonly ShotSpec[];
export type LaunchShotId = typeof SHOTS[number]["id"];
export const LAUNCH_BEATS = SHOTS.reduce((sum, s) => sum + s.beats, 0);
export const shotStart = (id: LaunchShotId) => {
  let beat = 0;
  for (const shot of SHOTS) { if (shot.id === id) return beat; beat += shot.beats; }
  throw new Error(`Unknown launch shot: ${id}`);
};
export const launchSpec = (): SoundtrackSpec => {
  let beat = 0;
  const cues: Cue[] = [];
  for (const shot of SHOTS) {
    if (beat > 0) cues.push({ at: beat, kind: "whoosh", gain: 0.6 });
    cues.push({ at: beat, kind: "cut" in shot && shot.cut === "flash" ? "flashHit" : "hit", gain: 0.7 });
    beat += shot.beats;
  }
  cues.push(
    { at: shotStart("terminal") + 0.2, kind: "typing", dur: 1.25, steps: INIT_CMD.length, gain: 0.5 },
    { at: shotStart("codepanel") + 0.1, kind: "tileRun", dur: 2.6, steps: MYVIDEO.length, gain: 0.4 },
    { at: shotStart("number"), kind: "countRun", dur: 1, steps: 4 },
    { at: shotStart("stack") + 6.4, kind: "typing", dur: 0.8, steps: RENDER_CMD.length, gain: 0.5 },
    { at: shotStart("final") + 0.5, kind: "chime", gain: 0.6 },
  );
  return { bpm: launchClock.bpm, beats: LAUNCH_BEATS, cues, tail: 2, fadeOut: 1.4, targetLUFS: -14,
    music: { kick: [[12, LAUNCH_BEATS - 6]], hat: [[16, LAUNCH_BEATS - 6]], clap: [[20, LAUNCH_BEATS - 8]], arp: [[0, LAUNCH_BEATS]], bass: [[0, LAUNCH_BEATS]] } };
};
