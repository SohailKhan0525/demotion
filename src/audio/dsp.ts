/** Small, dependency-free DSP toolkit (runs in Node, no Python, no native modules). */
export const SR = 48000;
export type Buf = Float32Array;
export type Stereo = [Float32Array, Float32Array];

/** deterministic RNG so the same spec always renders the same audio */
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
export const gauss = (r: () => number) => {
  let u = 0, v = 0;
  while (u === 0) u = r();
  while (v === 0) v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

export const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
export const len = (sec: number) => Math.max(1, Math.round(sec * SR));
export const noiseBuf = (sec: number, r: () => number): Buf => {
  const b = new Float32Array(len(sec));
  for (let i = 0; i < b.length; i++) b[i] = gauss(r);
  return b;
};

type BQ = { b0: number; b1: number; b2: number; a1: number; a2: number };
const biquadCoefs = (type: "lp" | "hp" | "bp", fc: number, q: number): BQ => {
  const w0 = (2 * Math.PI * Math.min(fc, SR * 0.45)) / SR;
  const cos = Math.cos(w0), alpha = Math.sin(w0) / (2 * q);
  const a0 = 1 + alpha;
  let b0: number, b1: number, b2: number;
  if (type === "lp") { b0 = (1 - cos) / 2; b1 = 1 - cos; b2 = b0; }
  else if (type === "hp") { b0 = (1 + cos) / 2; b1 = -(1 + cos); b2 = b0; }
  else { b0 = alpha; b1 = 0; b2 = -alpha; }
  return { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: (-2 * cos) / a0, a2: (1 - alpha) / a0 };
};
export const applyBiquad = (x: Buf, c: BQ): Buf => {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = c.b0 * x[i] + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
};
export const lp = (x: Buf, fc: number, q = 0.707) => applyBiquad(x, biquadCoefs("lp", fc, q));
export const hp = (x: Buf, fc: number, q = 0.707) => applyBiquad(x, biquadCoefs("hp", fc, q));
export const bp = (x: Buf, fc: number, q = 1) => applyBiquad(x, biquadCoefs("bp", fc, q));

/** resonant band-pass whose centre frequency sweeps exponentially f0 -> f1 (whooshes, risers) */
export const svfSweep = (noise: Buf, f0: number, f1: number, q = 0.9): Buf => {
  const n = noise.length;
  const out = new Float32Array(n);
  let low = 0, band = 0;
  for (let i = 0; i < n; i++) {
    const fs = f0 * Math.pow(f1 / f0, i / n);
    const f = 2 * Math.sin((Math.PI * Math.min(fs, SR * 0.45)) / SR);
    low += f * band;
    const high = noise[i] - low - q * band;
    band += f * high;
    out[i] = band;
  }
  return out;
};

export const normalize = (x: Buf, peak = 1) => {
  let m = 1e-9;
  for (let i = 0; i < x.length; i++) m = Math.max(m, Math.abs(x[i]));
  const k = peak / m;
  for (let i = 0; i < x.length; i++) x[i] *= k;
  return x;
};

/** mix mono `sig` into stereo `buf` starting at `t0` seconds */
export const place = (buf: Stereo, sig: Buf, t0: number, gain = 1, pan = 0) => {
  const i0 = Math.round(t0 * SR);
  const l = gain * (1 - Math.max(0, pan)), r = gain * (1 + Math.min(0, pan));
  for (let i = 0; i < sig.length; i++) {
    const j = i0 + i;
    if (j < 0 || j >= buf[0].length) continue;
    buf[0][j] += sig[i] * l;
    buf[1][j] += sig[i] * r;
  }
};

/** Freeverb-style algorithmic reverb (8 combs + 4 all-passes per channel). Returns the wet signal only. */
export const reverb = (inp: Stereo, { room = 0.86, damp = 0.25 }: { room?: number; damp?: number } = {}): Stereo => {
  const k = SR / 44100;
  const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((t) => Math.round(t * k));
  const apT = [556, 441, 341, 225].map((t) => Math.round(t * k));
  const spread = Math.round(23 * k);
  const run = (x: Buf, off: number): Buf => {
    const out = new Float32Array(x.length);
    const combs = combT.map((t) => ({ buf: new Float32Array(t + off), i: 0, store: 0 }));
    const aps = apT.map((t) => ({ buf: new Float32Array(t + off), i: 0 }));
    for (let n = 0; n < x.length; n++) {
      const v = x[n] * 0.015;
      let acc = 0;
      for (const c of combs) {
        const o = c.buf[c.i];
        c.store = o * (1 - damp) + c.store * damp;
        c.buf[c.i] = v + c.store * room;
        c.i = (c.i + 1) % c.buf.length;
        acc += o;
      }
      for (const a of aps) {
        const bo = a.buf[a.i];
        const o = -acc + bo;
        a.buf[a.i] = acc + bo * 0.5;
        a.i = (a.i + 1) % a.buf.length;
        acc = o;
      }
      out[n] = acc;
    }
    return out;
  };
  return [run(inp[0], 0), run(inp[1], spread)];
};

/* -------- loudness: ITU-R BS.1770-4 integrated LUFS (K-weighting, gated) -------- */
const kWeight = (x: Buf): Buf => {
  const s1: BQ = { b0: 1.53512485958697, b1: -2.69169618940638, b2: 1.19839281085285, a1: -1.69065929318241, a2: 0.73248077421585 };
  const s2: BQ = { b0: 1, b1: -2, b2: 1, a1: -1.99004745483398, a2: 0.99007225036621 };
  return applyBiquad(applyBiquad(x, s1), s2); // coefficients are the standard's, valid at 48 kHz
};
export const loudnessLUFS = (st: Stereo): number => {
  const [l, r] = [kWeight(st[0]), kWeight(st[1])];
  const block = Math.round(0.4 * SR), hop = Math.round(0.1 * SR);
  const ms: number[] = [];
  for (let s = 0; s + block <= l.length; s += hop) {
    let a = 0;
    for (let i = s; i < s + block; i++) a += l[i] * l[i] + r[i] * r[i];
    ms.push(a / block);
  }
  const lk = (z: number) => -0.691 + 10 * Math.log10(z);
  const abs = ms.filter((z) => lk(z) > -70);
  if (!abs.length) return -Infinity;
  const mean = (a: number[]) => a.reduce((p, c) => p + c, 0) / a.length;
  const rel = lk(mean(abs)) - 10;
  const kept = abs.filter((z) => lk(z) > rel);
  return kept.length ? lk(mean(kept)) : -Infinity;
};
