import { createBeatClock } from "../core/clock";
import type { SoundtrackSpec } from "../audio/types";

// V2 names the second film, not a 2.0 npm release.
export const v2Clock = createBeatClock({ bpm: 128, fps: 60 });
export const V2_SHOTS = [
  { id: "hook", beats: 4, bg: "ink", wipe: undefined },
  { id: "brand", beats: 4, bg: "field", wipe: "slats" },
  { id: "data", beats: 8, bg: "ink", wipe: "diagonal" },
  { id: "captions", beats: 8, bg: "chalk", wipe: "slide" },
  { id: "code", beats: 6, bg: "field", wipe: "iris" },
  { id: "identity", beats: 6, bg: "ink", wipe: "slats" },
  { id: "system", beats: 8, bg: "chalk", wipe: "diagonal" },
  { id: "sound", beats: 6, bg: "ink", wipe: "slide" },
  { id: "license", beats: 6, bg: "chalk", wipe: "iris" },
  { id: "final", beats: 8, bg: "field", wipe: "diagonal" },
] as const;
export type V2ShotId = typeof V2_SHOTS[number]["id"];
export const V2_BEATS = V2_SHOTS.reduce((sum, shot) => sum + shot.beats, 0);
export const v2Start = (id: V2ShotId) => {
  let beat = 0;
  for (const shot of V2_SHOTS) { if (shot.id === id) return beat; beat += shot.beats; }
  throw new Error(`Unknown V2 shot: ${id}`);
};

export const V2_INSTALL = "npx --yes @demotion/cli@latest init my-video";
export const V2_API_NAMES = ["CountUp", "BarChart", "CaptionTrack", "LowerThird", "ProgressRing"] as const;
export const V2_CODE = [
  'import { CountUp, BarChart } from "@demotion/cli";',
  '',
  '// Inside a MotionProject <Shot>',
  '<CountUp value={128} suffix=" BPM" over={2} />',
  '<BarChart data={[',
  '  { label: "Scene A", value: 4 },',
  '  { label: "Scene B", value: 8 },',
  ']} suffix=" beats" />',
] as const;

export const v2Soundtrack = (): SoundtrackSpec => ({
  bpm: v2Clock.bpm, beats: V2_BEATS, tail: 1.5, fadeOut: 1.5, targetLUFS: -14,
  music: { kick: [[8, 56]], hat: [[16, 56]], clap: [[24, 56]], bass: [[0, 64]], arp: [[0, 64]] },
  cues: [
    ...V2_SHOTS.flatMap((shot, i) => [
      ...(i ? [{ at: v2Start(shot.id), kind: "whoosh" as const, gain: 0.45 }] : []),
      { at: v2Start(shot.id), kind: "hit" as const, gain: 0.6 },
    ]),
    { at: v2Start("data") + 0.5, kind: "countRun", dur: 2, steps: 8, gain: 0.35 },
    { at: v2Start("code") + 0.2, kind: "tileRun", dur: 3.4, steps: V2_CODE.length, gain: 0.4 },
    { at: v2Start("identity") + 0.5, kind: "pop", gain: 0.5 },
    { at: v2Start("final") + 0.5, kind: "chime", gain: 0.5 },
  ],
});
