import test from "node:test";
import assert from "node:assert/strict";
import { loadTs } from "./helpers.mjs";

const A = await loadTs("src/audio/index.ts");
const SR = A.AUDIO_SAMPLE_RATE;

test("a cue lands on its beat to within a millisecond", () => {
  // 120 BPM: beat 2 = 1.000 s, beat 5 = 2.500 s
  const s = A.renderSoundtrack({ bpm: 120, beats: 8, music: false, cues: [{ at: 2, kind: "click" }, { at: 5, kind: "pop" }], targetLUFS: -18 });
  const onset = (t) => {
    // first sample after t-60ms that rises above 4% of the local peak
    const a = Math.round((t - 0.06) * SR), b = Math.round((t + 0.12) * SR);
    let peak = 0;
    for (let i = a; i < b; i++) peak = Math.max(peak, Math.abs(s.left[i]));
    for (let i = a; i < b; i++) if (Math.abs(s.left[i]) > peak * 0.04) return i / SR;
  };
  assert.ok(Math.abs(onset(1.0) - 1.0) < 0.001, `click onset ${onset(1.0)}`);
  assert.ok(Math.abs(onset(2.5) - 2.5) < 0.001, `pop onset ${onset(2.5)}`);
});

test("a whoosh's crest lands on the beat it leads into", () => {
  const s = A.renderSoundtrack({ bpm: 120, beats: 8, music: false, cues: [{ at: 4, kind: "whoosh" }], targetLUFS: -18 });
  // energy envelope in 5 ms windows, find the loudest window before the tail
  const win = Math.round(0.005 * SR);
  let best = 0, bestT = 0;
  for (let i = Math.round(1.0 * SR); i < Math.round(2.4 * SR); i += win) {
    let e = 0;
    for (let k = 0; k < win; k++) e += s.left[i + k] ** 2;
    if (e > best) { best = e; bestT = i / SR; }
  }
  assert.ok(Math.abs(bestT - 2.0) < 0.04, `crest at ${bestT}s, expected 2.0s`);
});

test("master hits the target loudness and respects the peak ceiling", () => {
  const spec = { bpm: 120, beats: 16, targetLUFS: -14, cues: [{ at: 0, kind: "hit" }, { at: 8, kind: "chime" }], music: { kick: [[2, 16]], hat: [[4, 16]], arp: [[0, 16]], bass: [[0, 16]] } };
  const s = A.renderSoundtrack(spec);
  assert.ok(Math.abs(s.lufs - -14) < 0.7, `LUFS ${s.lufs.toFixed(2)}`);
  assert.ok(s.peak <= 0.9, `peak ${s.peak}`);
  assert.ok(s.seconds > 8 && s.seconds < 11.5);
});

test("rendering is deterministic", () => {
  const spec = { bpm: 128, beats: 8, cues: [{ at: 1, kind: "typing", dur: 2, steps: 10 }], music: { kick: [[0, 8]] } };
  const a = A.renderSoundtrack(spec), b = A.renderSoundtrack(spec);
  let same = true;
  for (let i = 0; i < a.left.length; i += 97) if (a.left[i] !== b.left[i]) { same = false; break; }
  assert.ok(same);
});

test("the music bed runs at the requested tempo (kick-band autocorrelation, 1 ms resolution)", () => {
  const bpm = 124;
  const s = A.renderSoundtrack({ bpm, beats: 32, cues: [], music: { kick: [[0, 32]], pad: false }, targetLUFS: -16 });
  const hop = Math.round(SR / 1000);
  const env = [];
  let lp = 0;
  for (let i = 0; i < s.left.length; i += hop) { let m = 0; for (let k = 0; k < hop && i + k < s.left.length; k++) m += Math.abs(s.left[i + k]); lp = 0.7 * lp + 0.3 * (m / hop); env.push(lp); }
  const d = env.map((v, i) => (i ? Math.max(0, v - env[i - 1]) : 0));
  let bestLag = 0, bestV = -1;
  for (let lag = 350; lag <= 800; lag++) { let a = 0; for (let i = 0; i + lag < d.length; i++) a += d[i] * d[i + lag]; if (a > bestV) { bestV = a; bestLag = lag; } } // 75..171 BPM
  const est = 60 / (bestLag / 1000);
  assert.ok(Math.abs(est - bpm) < 1.5, `estimated ${est.toFixed(2)} BPM`);
});

test("WAV encoding is a valid 16-bit stereo file of the right size", () => {
  const s = A.renderSoundtrack({ bpm: 120, beats: 2, cues: [{ at: 0, kind: "pop" }], music: false });
  const w = A.encodeWav(s);
  const txt = (o) => String.fromCharCode(w[o], w[o + 1], w[o + 2], w[o + 3]);
  assert.equal(txt(0), "RIFF"); assert.equal(txt(8), "WAVE"); assert.equal(txt(36), "data");
  assert.equal(w.length, 44 + s.left.length * 4);
});
