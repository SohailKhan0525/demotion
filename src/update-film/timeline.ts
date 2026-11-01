import { createBeatClock } from "../core/clock";
import type { SoundtrackSpec } from "../audio/types";

export const UPDATE_VERSION = "0.3.0";
export const updateClock = createBeatClock({ bpm: 120, fps: 60 });
export const UPDATE_SHOTS = [
  { id: "hero", beats: 8 },
  { id: "draw", beats: 12 },
  { id: "follow", beats: 12 },
  { id: "depth", beats: 12 },
  { id: "assembly", beats: 8 },
  { id: "workflow", beats: 8 },
  { id: "code", beats: 8 },
  { id: "close", beats: 12 },
] as const;
export type UpdateShotId = typeof UPDATE_SHOTS[number]["id"];
export const UPDATE_BEATS = UPDATE_SHOTS.reduce((sum, shot) => sum + shot.beats, 0);
export const updateStart = (id: UpdateShotId) => {
  let beat = 0;
  for (const shot of UPDATE_SHOTS) { if (shot.id === id) return beat; beat += shot.beats; }
  throw new Error(`Unknown update shot: ${id}`);
};
export const UPDATE_INSTALL = "npx --yes @demotion/cli@latest init my-video";
export const UPDATE_CODE = [
  '<svg viewBox="0 0 800 400">',
  '  <DrawPath d={route} over={4} />',
  '  <FollowPath d={route} over={4}>',
  '    <circle r={12} fill="currentColor" />',
  '  </FollowPath>',
  '</svg>',
] as const;

export const updateSoundtrack = (): SoundtrackSpec => ({
  bpm: updateClock.bpm, beats: UPDATE_BEATS, tail: 2, fadeOut: 2, targetLUFS: -15, seed: 73,
  music: {
    level: 0.78, pad: true,
    chords: [
      { bass: 43, notes: [55, 62, 65, 69] },
      { bass: 46, notes: [58, 62, 65, 72] },
      { bass: 41, notes: [57, 60, 65, 69] },
      { bass: 48, notes: [55, 60, 64, 67] },
    ],
    arp: [[0, 68]], bass: [[8, 72]], kick: [[20, 60]], hat: [[32, 60]], clap: [[44, 52]],
  },
  cues: [
    { at: 0, kind: "chime", gain: 0.35 },
    ...UPDATE_SHOTS.slice(1).map(s => ({ at: updateStart(s.id), kind: "whoosh" as const, gain: 0.17 })),
    { at: updateStart("draw") + 1, kind: "typing", dur: 4, steps: 12, gain: 0.11 },
    { at: updateStart("follow") + 0.6, kind: "shimmer", dur: 4, gain: 0.17 },
    { at: updateStart("depth") + 0.6, kind: "hit", gain: 0.3 },
    { at: updateStart("assembly") + 1, kind: "tileRun", dur: 2, steps: 3, gain: 0.25 },
    { at: updateStart("workflow") + 2, kind: "chime", gain: 0.3 },
    { at: updateStart("close") + 0.4, kind: "chime", gain: 0.45 },
  ],
});
