import { createBeatClock } from "../core/clock";
import type { SoundtrackSpec } from "../audio/types";

export const promoClock = createBeatClock({ bpm: 120, fps: 60 });
export const PROMO_SHOTS = [
  { id: "intro", beats: 8, label: "Meet demotion" },
  { id: "workflow", beats: 8, label: "React to video" },
  { id: "code", beats: 12, label: "Compose a scene" },
  { id: "type", beats: 8, label: "Kinetic typography" },
  { id: "timing", beats: 8, label: "One beat clock" },
  { id: "data", beats: 12, label: "Data stories" },
  { id: "captions", beats: 8, label: "Authored captions" },
  { id: "toolkit", beats: 8, label: "Composable parts" },
  { id: "sound", beats: 8, label: "Procedural sound" },
  { id: "render", beats: 8, label: "Render locally" },
  { id: "install", beats: 12, label: "Start creating" },
  { id: "close", beats: 12, label: "Made with demotion" },
] as const;
export type PromoShotId = typeof PROMO_SHOTS[number]["id"];
export const PROMO_BEATS = PROMO_SHOTS.reduce((n, s) => n + s.beats, 0);
export const promoStart = (id: PromoShotId) => {
  let beat = 0;
  for (const shot of PROMO_SHOTS) { if (shot.id === id) return beat; beat += shot.beats; }
  throw new Error(`Unknown promo scene: ${id}`);
};
export const PROMO_INSTALL = "npx --yes @demotion/cli@latest init my-video";
export const PROMO_COMMANDS = [PROMO_INSTALL, "cd my-video", "npm install", "npm start"] as const;
export const PROMO_RENDER = "npm run render";
export const PROMO_CODE = [
  '<Shot beats={8} bg={theme.field}>',
  '  <KineticHeadline',
  '    text="Make it move."',
  '    color={theme.chalk}',
  '    accent={theme.accent}',
  '  />',
  '</Shot>',
] as const;
export const PROMO_SOURCE_APIS = ["CountUp", "BarChart", "CaptionTrack", "LowerThird", "ProgressRing"] as const;
export const PROMO_CAPTIONS = [
  { at: 0.4, beats: 2.5, text: "Write the words." },
  { at: 2.9, beats: 2.5, text: "Choose their moment." },
  { at: 5.4, beats: 2.6, text: "Keep the story clear." },
] as const;

// Original score. The uploaded reference's audio is never redistributed.
export const promoSoundtrack = (): SoundtrackSpec => ({
  bpm: promoClock.bpm, beats: PROMO_BEATS, tail: 2, fadeOut: 2, targetLUFS: -16, seed: 29,
  music: {
    level: 0.76, pad: true,
    chords: [
      { bass: 48, notes: [60, 64, 67, 71] },
      { bass: 43, notes: [59, 62, 67, 69] },
      { bass: 45, notes: [57, 60, 64, 67] },
      { bass: 41, notes: [57, 60, 64, 65] },
    ],
    arp: [[0, 96]], bass: [[8, 100]], kick: [[16, 88]],
    hat: [[36, 56], [72, 88]], clap: [[44, 56], [72, 80]],
  },
  cues: [
    ...PROMO_SHOTS.slice(1).map(s => ({ at: promoStart(s.id), kind: "whoosh" as const, gain: 0.12 })),
    { at: 0.4, kind: "chime", gain: 0.35 },
    { at: promoStart("workflow") + 1, kind: "tileRun", dur: 2, steps: 3, gain: 0.3 },
    { at: promoStart("code") + 0.6, kind: "typing", dur: 3.5, steps: 12, gain: 0.2 },
    { at: promoStart("type") + 0.6, kind: "pop", gain: 0.3 },
    { at: promoStart("data") + 0.8, kind: "countRun", dur: 2, steps: 6, gain: 0.2 },
    ...PROMO_CAPTIONS.map(c => ({ at: promoStart("captions") + c.at, kind: "click" as const, gain: 0.16 })),
    { at: promoStart("sound") + 2, kind: "chime", gain: 0.6 },
    { at: promoStart("render") + 4, kind: "chime", gain: 0.3 },
    { at: promoStart("close") + 1, kind: "shimmer", dur: 4, gain: 0.2 },
  ],
});
