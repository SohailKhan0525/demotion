import timeline from "./timeline.json";

export const FPS: number = timeline.fps;
export const BPM: number = timeline.bpm;
/** frames per musical beat (120 BPM @ 30fps = 15) */
export const BEAT: number = (FPS * 60) / BPM;

type Ev = { name: string; beat: number; dur?: number };
type Scene = { id: string; beats: number; events: Ev[] };

const scenes = timeline.scenes as Scene[];

export const sceneOrder = scenes.map((s) => s.id);

export const sceneFrames = (id: string): number => {
  const s = scenes.find((x) => x.id === id);
  if (!s) throw new Error(`unknown scene ${id}`);
  return Math.round(s.beats * BEAT);
};

/** frame (relative to scene start) at which a named event fires */
export const ev = (scene: string, name: string): number => {
  const s = scenes.find((x) => x.id === scene);
  const e = s?.events.find((x) => x.name === name);
  if (!e) throw new Error(`unknown event ${scene}.${name}`);
  return Math.round(e.beat * BEAT);
};

/** duration in frames of a named event (falls back to `fallback` beats) */
export const evDur = (scene: string, name: string, fallback = 1): number => {
  const s = scenes.find((x) => x.id === scene);
  const e = s?.events.find((x) => x.name === name);
  return Math.round((e?.dur ?? fallback) * BEAT);
};

export const TOTAL_FRAMES = scenes.reduce((a, s) => a + Math.round(s.beats * BEAT), 0);

/** start frame of a scene on the global timeline */
export const sceneStart = (id: string): number => {
  let f = 0;
  for (const s of scenes) {
    if (s.id === id) return f;
    f += Math.round(s.beats * BEAT);
  }
  throw new Error(`unknown scene ${id}`);
};

/** substring of `text` typed between two frames */
export const typed = (text: string, frame: number, start: number, dur: number): string => {
  const p = Math.min(1, Math.max(0, (frame - start) / dur));
  return text.slice(0, Math.floor(p * text.length + 0.0001));
};
