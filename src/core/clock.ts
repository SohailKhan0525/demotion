import { decay } from "./math";

export type BeatClock = {
  fps: number;
  bpm: number;
  /** frames per beat (may be fractional, e.g. 28.125 at 128 BPM / 60 fps) */
  framesPerBeat: number;
  framesPerBar: number;
  /** frame at which beat 0 lands */
  offset: number;
  /** beats -> frame (rounded to a whole frame) */
  frame: (beats: number) => number;
  /** frame -> beats (fractional) */
  beats: (frame: number) => number;
  /** seconds since the most recent beat landed (0 on the beat's own frame) */
  sinceBeat: (frame: number) => number;
  /** seconds since the most recent downbeat of a bar */
  sinceBar: (frame: number) => number;
  /** total frames for `beats` beats */
  duration: (beats: number) => number;
  /** seconds for `beats` beats */
  seconds: (beats: number) => number;
};

/**
 * One clock drives every keyframe AND every sound, so picture and audio can never drift.
 * Author in beats; the clock turns them into frames.
 */
export const createBeatClock = ({ bpm = 120, fps = 60, beatsPerBar = 4, offset = 0 }: { bpm?: number; fps?: number; beatsPerBar?: number; offset?: number } = {}): BeatClock => {
  const framesPerBeat = (fps * 60) / bpm;
  const framesPerBar = framesPerBeat * beatsPerBar;
  const beats = (frame: number) => (frame - offset) / framesPerBeat;
  const frameOf = (n: number) => Math.round(offset + n * framesPerBeat);
  // index of the beat that most recently landed, measured against the ROUNDED landing frames, so the frame a
  // beat lands on is always "0 seconds since the beat", never "the end of the previous one"
  const beatIndex = (frame: number) => {
    let n = Math.floor(beats(frame));
    if (frameOf(n + 1) <= frame) n++;
    if (frameOf(n) > frame) n--;
    return n;
  };
  const sinceBeat = (frame: number) => (frame - frameOf(beatIndex(frame))) / fps;
  const sinceBar = (frame: number) => {
    const bar = Math.floor(beatIndex(frame) / beatsPerBar);
    return (frame - frameOf(bar * beatsPerBar)) / fps;
  };
  return {
    fps, bpm, framesPerBeat, framesPerBar, offset,
    frame: frameOf,
    beats,
    sinceBeat,
    sinceBar,
    duration: (n) => Math.round(n * framesPerBeat),
    seconds: (n) => (n * 60) / bpm,
  };
};

/** camera "thump": 1 right on the beat, decaying toward 0. */
export const beatPunch = (clock: BeatClock, frame: number, tau = 0.09) => decay(clock.sinceBeat(frame), tau);
export const barPunch = (clock: BeatClock, frame: number, tau = 0.16) => decay(clock.sinceBar(frame), tau);
