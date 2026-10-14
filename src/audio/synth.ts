import { SR, bp, gauss, hp, len, lp, midi, noiseBuf, normalize, svfSweep, type Buf } from "./dsp";

type R = () => number;
const T = (sec: number) => { const n = len(sec); const t = new Float32Array(n); for (let i = 0; i < n; i++) t[i] = i / SR; return t; };
const phaseOf = (freq: (t: number) => number, n: number) => { const p = new Float32Array(n); let a = 0; for (let i = 0; i < n; i++) { a += freq(i / SR) / SR; p[i] = a * 2 * Math.PI; } return p; };
const saw = (ph: number) => 2 * (ph / (2 * Math.PI) - Math.floor(ph / (2 * Math.PI) + 0.5));
const mulEnv = (x: Buf, f: (t: number) => number) => { for (let i = 0; i < x.length; i++) x[i] *= f(i / SR); return x; };
const add = (a: Buf, b: Buf, g = 1, off = 0) => { for (let i = 0; i < b.length && i + off < a.length; i++) a[i + off] += b[i] * g; return a; };

export const kick = (r: R): Buf => {
  const n = len(0.42), t = T(0.42);
  const ph = phaseOf((x) => 46 + 130 * Math.exp(-x * 30), n);
  const y = new Float32Array(n);
  const click = lp(noiseBuf(0.42, r), 1500);
  for (let i = 0; i < n; i++) y[i] = (Math.sin(ph[i]) * Math.exp(-t[i] * 9) + click[i] * Math.exp(-t[i] * 120) * 0.3) * 0.85;
  return y;
};
export const hat = (r: R, open = false): Buf => { const d = open ? 0.16 : 0.05; return mulEnv(hp(noiseBuf(d, r), 7000), (t) => Math.exp(-t * (open ? 28 : 110)) * 0.22); };
export const clap = (r: R): Buf => {
  const y = new Float32Array(len(0.22));
  for (const d of [0, 0.011, 0.023]) {
    const seg = mulEnv(hp(lp(noiseBuf(0.22, r), 3800), 900), (t) => Math.exp(-t * 40));
    add(y, seg, 0.3, Math.round(d * SR));
  }
  return y;
};
export const bassNote = (freq: number, dur: number): Buf => {
  const y = T(dur);
  for (let i = 0; i < y.length; i++) { const t = i / SR; y[i] = (Math.sin(2 * Math.PI * freq * t) + 0.25 * Math.sin(4 * Math.PI * freq * t)) * Math.min(1, t * 120) * Math.min(1, (dur - t) * 60) * 0.32; }
  return y;
};
export const padNote = (freq: number, dur: number): Buf => {
  const n = len(dur), y = new Float32Array(n);
  for (const det of [-0.006, 0, 0.006]) for (let i = 0; i < n; i++) y[i] += saw(2 * Math.PI * freq * (1 + det) * (i / SR));
  const f = lp(y, 1400);
  for (let i = 0; i < n; i++) { const t = i / SR; f[i] *= Math.min(1, t / 0.9) * Math.min(1, (dur - t) / 0.9) * 0.09; }
  return f;
};
export const pluck = (freq: number): Buf => {
  const n = len(0.42), y = new Float32Array(n);
  for (let i = 0; i < n; i++) { const ph = 2 * Math.PI * freq * (i / SR); y[i] = saw(ph) * 0.6 + Math.sin(ph) * 0.4; }
  const a = lp(y, 5500, 0.5), b = lp(y, 500);
  for (let i = 0; i < n; i++) { const t = i / SR, m = Math.exp(-t * 14); y[i] = (a[i] * m + b[i] * (1 - m)) * Math.exp(-t * 7) * 0.32; }
  return y;
};
export const hit = (r: R): Buf => {
  const n = len(0.7), ph = phaseOf((x) => 45 + 110 * Math.exp(-x * 22), n);
  const click = lp(noiseBuf(0.7, r), 900);
  const y = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR; y[i] = Math.sin(ph[i]) * Math.exp(-t * 6.5) * 0.95 + click[i] * Math.exp(-t * 60) * 0.5; }
  return y;
};
export const crack = (r: R): Buf => mulEnv(hp(noiseBuf(0.09, r), 3500), (t) => Math.exp(-t * 55) * 0.6);
export const tick = (freq = 3000): Buf => { const y = T(0.09); for (let i = 0; i < y.length; i++) { const t = i / SR; y[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 85) * 0.5; } return y; };
export const keyClick = (r: R, i: number): Buf => {
  const f = 1800 + ((i * 137) % 900);
  const y = mulEnv(hp(noiseBuf(0.05, r), 3800), (t) => Math.exp(-t * 300) * 0.5);
  for (let k = 0; k < y.length; k++) { const t = k / SR; y[k] += Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 130) * 0.32; }
  return y;
};
export const pop = (f0 = 420, f1 = 800): Buf => {
  const n = len(0.22), ph = phaseOf((x) => f0 + (f1 - f0) * (1 - Math.exp(-x * 40)), n);
  const y = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR; y[i] = (Math.sin(ph[i]) * Math.exp(-t * 20) + 0.25 * Math.sin(2 * ph[i]) * Math.exp(-t * 35)) * 0.7; }
  return y;
};
export const mouseClick = (r: R): Buf => {
  const y = new Float32Array(len(0.16));
  const down = mulEnv(hp(noiseBuf(0.16, r), 2500), (t) => Math.exp(-t * 400) * 0.55);
  for (let i = 0; i < y.length; i++) { const t = i / SR; y[i] = down[i] + Math.sin(2 * Math.PI * 1100 * t) * Math.exp(-t * 110) * 0.45; }
  const up = hp(noiseBuf(0.085, r), 3500);
  const k = Math.round(0.075 * SR);
  for (let i = 0; i < up.length && i + k < y.length; i++) { const t = i / SR; y[i + k] += up[i] * Math.exp(-t * 500) * 0.25 + Math.sin(2 * Math.PI * 1500 * t) * Math.exp(-t * 150) * 0.2; }
  return y;
};
export const countTone = (freq: number): Buf => { const y = T(0.16); for (let i = 0; i < y.length; i++) { const t = i / SR; y[i] = (Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(4 * Math.PI * freq * t)) * Math.exp(-t * 26) * 0.45; } return y; };
export const bell = (freq: number, dur = 1.4, tau = 0.45): Buf => {
  const y = T(dur);
  for (let i = 0; i < y.length; i++) { const t = i / SR, w = 2 * Math.PI * freq * t; y[i] = (Math.sin(w) + 0.35 * Math.sin(2.76 * w) + 0.2 * Math.sin(5.4 * w)) * Math.exp(-t / tau) * Math.min(1, t * 400); }
  return y;
};
/** rising noise sweep whose crest lands exactly at `dur`, then a short tail */
export const whoosh = (r: R, dur = 0.75, tail = 0.22): Buf => {
  const rise = len(dur), n = rise + len(tail);
  const noise = noiseBuf(n / SR, r);
  const y = svfSweep(noise, 350, 6500, 0.75);
  for (let i = 0; i < n; i++) y[i] *= i < rise ? Math.pow(i / rise, 2.4) : Math.exp(-(i - rise) / (0.06 * SR));
  return normalize(y);
};
export const riser = (r: R, dur: number): Buf => {
  const n = len(dur);
  const sw = normalize(svfSweep(noiseBuf(dur, r), 500, 9000, 0.5), 0.8);
  const ph = phaseOf((x) => 300 * Math.pow(6, x / dur), n);
  const y = new Float32Array(n);
  for (let i = 0; i < n; i++) { const x = i / n; y[i] = (sw[i] + Math.sin(ph[i]) * 0.25) * Math.pow(x, 2.5); }
  return y;
};
export const swell = (r: R, dur: number): Buf => {
  const total = dur + 1.6, n = len(total), y = new Float32Array(n);
  for (const f of [midi(57), midi(64), midi(69), midi(72)]) for (let i = 0; i < n; i++) { const t = i / SR; y[i] += Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 1.004 * t); }
  const f = lp(y, 2400), nz = hp(noiseBuf(total, r), 4000);
  for (let i = 0; i < n; i++) { const t = i / SR, att = Math.pow(Math.min(1, t / dur), 2), rel = Math.exp(-Math.max(0, t - dur) * 2.6); f[i] = f[i] * att * rel * 0.13 + nz[i] * att * rel * 0.05; }
  return f;
};
export const shimmer = (r: R, dur: number): Buf => {
  const y = new Float32Array(len(dur + 1));
  const notes = [81, 84, 88, 91, 93, 96];
  const k = Math.floor(dur * 14);
  for (let i = 0; i < k; i++) {
    const t0 = i / 14 + r() * 0.05;
    const b = bell(midi(notes[Math.floor(r() * notes.length)]), 0.7, 0.16);
    add(y, b, 0.05 + r() * 0.08, Math.round(t0 * SR));
  }
  return y;
};
export { gauss, bp };
