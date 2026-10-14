import { SR, loudnessLUFS, midi, place, reverb, rng, type Stereo } from "./dsp";
import * as S from "./synth";
import type { Cue, MusicSpec, SoundtrackSpec } from "./types";

export type Soundtrack = { sampleRate: number; left: Float32Array; right: Float32Array; lufs: number; peak: number; seconds: number };

const DEFAULT_CHORDS = [
  { bass: 45, notes: [57, 60, 64] }, // Am
  { bass: 41, notes: [53, 57, 60] }, // F
  { bass: 48, notes: [55, 60, 64] }, // C
  { bass: 43, notes: [55, 59, 62] }, // G
];
const SCALE = [69, 72, 74, 76, 79, 81, 84, 86, 88, 91];
const on = (ranges: [number, number][] | undefined, beat: number) => !!ranges && ranges.some(([a, b]) => beat >= a && beat < b);

const placeCue = (sfx: Stereo, c: Cue, beatS: number, r: () => number) => {
  const t = c.at * beatS;
  const d = (c.dur ?? 1) * beatS;
  const g = c.gain ?? 1;
  const pan = c.pan ?? 0;
  switch (c.kind) {
    case "hit": place(sfx, S.hit(r), t, 0.85 * g); break;
    case "flashHit": place(sfx, S.hit(r), t, 0.85 * g); place(sfx, S.crack(r), t, 0.7 * g); break;
    case "whoosh": { const pre = 0.75; place(sfx, S.whoosh(r, pre), t - pre - 0.015, 0.55 * g, pan); break; }
    case "swoosh": place(sfx, S.whoosh(r, d * 0.9, 0.18), t + d * 0.1 - 0.015, 0.5 * g, pan); break;
    case "pop": place(sfx, S.pop(), t, 0.8 * g, pan); break;
    case "click": place(sfx, S.mouseClick(r), t, 0.85 * g, pan); break;
    case "tick": for (let i = 0; i < 4; i++) place(sfx, S.tick(2600 + 380 * i), t + (i * d) / 4, 0.5 * g, -0.3 + 0.2 * i); break;
    case "typing": { const n = c.steps ?? 12; for (let i = 0; i < n; i++) place(sfx, S.keyClick(r, i), t + (i * d) / n + (((i * 2654435761) >>> 0) % 1000) / 1000 * 0.012, 0.55 * g, ((i % 5) - 2) * 0.08); break; }
    case "count": place(sfx, S.countTone(c.freq ?? 880), t, 0.7 * g, pan); break;
    case "countRun": { const n = c.steps ?? 8; for (let i = 0; i < n; i++) place(sfx, S.countTone(midi(SCALE[i % SCALE.length])), t + (i * d) / n, 0.55 * g); break; }
    case "tileRun": { const n = c.steps ?? 8; for (let i = 0; i < n; i++) place(sfx, S.pop(520 + 55 * i, 900 + 70 * i), t + (i * d) / n, 0.5 * g, ((i % 4) - 1.5) * 0.18); break; }
    case "rise": place(sfx, S.riser(r, d), t, 0.5 * g); break;
    case "swell": place(sfx, S.swell(r, d), t, 0.9 * g); break;
    case "shimmer": place(sfx, S.shimmer(r, d), t, 0.9 * g); break;
    case "chime": [880, 1318.5, 1760].forEach((f, i) => place(sfx, S.bell(f), t + i * 0.07, 0.42 * g, (i - 1) * 0.15)); break;
  }
};

const renderMusic = (m: MusicSpec, beats: number, beatS: number, st: Stereo, r: () => number) => {
  const chords = m.chords ?? DEFAULT_CHORDS;
  const kicks: number[] = [];
  for (let bar = 0; bar * 4 < beats + 1; bar++) {
    const b0 = bar * 4;
    const ch = chords[bar % chords.length];
    if (m.pad !== false) {
      const lvl = b0 < 8 ? 0.55 : b0 < 20 ? 0.8 : 1;
      const tail = Math.max(0, 1 - Math.max(0, b0 - (beats - 4)) / 4);
      for (const n of ch.notes) place(st, S.padNote(midi(n), 4 * beatS + 1.4), b0 * beatS - 0.2, lvl * tail * 0.9, ((n % 3) - 1) * 0.25);
    }
    for (let step = 0; step < 8; step++) {
      const bt = b0 + step * 0.5;
      if (bt >= beats) break;
      const tt = bt * beatS;
      if (on(m.arp, bt)) {
        const idx = [0, 1, 2, 1, 0, 2, 1, 2][step];
        const note = ch.notes[idx] + (step % 4 === 3 ? 12 : 0);
        place(st, S.pluck(midi(note + 12)), tt, bt < 20 ? 0.5 : 0.75, step % 2 ? 0.35 : -0.35);
      }
      if (on(m.bass, bt) && [0, 3, 4, 6].includes(step)) place(st, S.bassNote(midi(ch.bass), 0.32), tt, bt >= 20 ? 0.85 : 0.55);
    }
    for (let beat = 0; beat < 4; beat++) {
      const bt = b0 + beat;
      if (bt >= beats) break;
      const tt = bt * beatS;
      if (on(m.kick, bt)) { place(st, S.kick(r), tt, 0.9); kicks.push(tt); }
      if (on(m.clap, bt) && (beat === 1 || beat === 3)) place(st, S.clap(r), tt, 0.8);
      if (on(m.hat, bt)) { place(st, S.hat(r), tt + 0.5 * beatS, 0.9); place(st, S.hat(r), tt + 0.25 * beatS, 0.45); place(st, S.hat(r), tt + 0.75 * beatS, 0.45); }
    }
  }
  // sidechain: duck the whole bed briefly after every kick so the kick punches through
  const N = st[0].length, duck = new Float32Array(N).fill(1), len = Math.round(0.45 * SR);
  for (const k of kicks) { const i0 = Math.round(k * SR); for (let i = 0; i < len && i0 + i < N; i++) duck[i0 + i] -= 0.42 * Math.exp(-i / SR / 0.11); }
  for (let i = 0; i < N; i++) { const d = 0.45 + 0.55 * Math.min(1, Math.max(0.45, duck[i])); st[0][i] *= d; st[1][i] *= d; }
};

/**
 * Renders the whole soundtrack — music bed + every cue — on the same beat clock as the picture, and masters it
 * to a target integrated loudness (ITU-R BS.1770 LUFS) with a soft ceiling at about -1 dBFS.
 * Pure TypeScript: no Python, no native modules, deterministic for a given spec.
 */
export const renderSoundtrack = (spec: SoundtrackSpec): Soundtrack => {
  const beatS = 60 / spec.bpm;
  const N = Math.round((spec.beats * beatS + (spec.tail ?? 1.5)) * SR);
  const r = rng(spec.seed ?? 7);
  const mk = (): Stereo => [new Float32Array(N), new Float32Array(N)];
  const music = mk(), sfx = mk();
  if (spec.music !== false) renderMusic(spec.music ?? {}, spec.beats, beatS, music, r);
  for (const c of spec.cues) placeCue(sfx, c, beatS, r);

  const mrev = reverb(music), srev = reverb(sfx);
  const level = (spec.music === false ? 0 : (spec.music?.level ?? 1)) * 0.62;
  const out = mk();
  for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) out[c][i] = Math.tanh((music[c][i] + mrev[c][i] * 0.66) * level * 1.15 + (sfx[c][i] + srev[c][i] * 0.48));

  const fade = Math.round((spec.fadeOut ?? 1) * SR);
  const ceil = 0.89; // about -1 dBFS
  const applyGain = (g: number) => {
    for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) { const f = i >= N - fade ? (N - i) / fade : 1; out[c][i] = ceil * Math.tanh((out[c][i] * g * f) / ceil); }
  };
  const target = spec.targetLUFS ?? -14;
  const base = out.map((a) => Float32Array.from(a)) as Stereo;
  let gain = 1;
  for (let pass = 0; pass < 3; pass++) {
    for (let c = 0; c < 2; c++) out[c].set(base[c]);
    applyGain(gain);
    const l = loudnessLUFS(out);
    if (!isFinite(l) || Math.abs(l - target) < 0.15) break;
    gain *= Math.pow(10, (target - l) / 20);
  }
  let peak = 0;
  for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(out[c][i]));
  return { sampleRate: SR, left: out[0], right: out[1], lufs: loudnessLUFS(out), peak, seconds: N / SR };
};
