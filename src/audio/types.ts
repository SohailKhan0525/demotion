export type CueKind =
  | "hit" | "flashHit" | "whoosh" | "swoosh" | "pop" | "click" | "tick" | "typing"
  | "count" | "countRun" | "tileRun" | "rise" | "swell" | "shimmer" | "chime";

/** One sound, placed on the beat clock. `at` and `dur` are in beats, exactly like your <Shot> beats. */
export type Cue = {
  at: number;
  kind: CueKind;
  /** beats: length of risers/swells/typing runs; for "whoosh" the pre-roll is fixed so its crest lands on `at` */
  dur?: number;
  /** "typing": number of key clicks; "countRun"/"tileRun": number of notes */
  steps?: number;
  /** "count": pitch in Hz */
  freq?: number;
  gain?: number;
  pan?: number;
};

export type MusicSpec = {
  /** [startBeat, endBeat] ranges where each layer plays; omit a layer to turn it off */
  kick?: [number, number][];
  hat?: [number, number][];
  clap?: [number, number][];
  arp?: [number, number][];
  bass?: [number, number][];
  /** pad plays through the whole piece when true (default) */
  pad?: boolean;
  /** 0..1.5 relative level of the whole bed (default 1) */
  level?: number;
  /** chord per bar: bass note (MIDI) + chord notes. Default: Am F C G */
  chords?: { bass: number; notes: number[] }[];
};

export type SoundtrackSpec = {
  bpm: number;
  /** total length of the picture in beats */
  beats: number;
  cues: Cue[];
  /** music bed, or false for sound effects only */
  music?: MusicSpec | false;
  /** seconds of reverb tail after the last beat (default 1.5) */
  tail?: number;
  /** integrated loudness to master to (default -14 LUFS, the streaming norm) */
  targetLUFS?: number;
  /** seconds of fade-out at the very end (default 1) */
  fadeOut?: number;
  seed?: number;
};
