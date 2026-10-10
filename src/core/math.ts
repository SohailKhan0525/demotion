/** Motion maths. Pure functions of time: no state, no randomness, safe to call at any frame. */

export const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
export const clamp01 = (x: number) => clamp(x, 0, 1);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const invLerp = (a: number, b: number, x: number) => (a === b ? 0 : (x - a) / (b - a));
export const remap = (x: number, a: number, b: number, c: number, d: number, ease: Ease = linear) =>
  lerp(c, d, ease(clamp01(invLerp(a, b, x))));

/** progress 0..1 of `frame` through the window [start, start + dur] */
export const prog = (frame: number, start: number, dur: number) => clamp01((frame - start) / Math.max(1e-6, dur));

export type Ease = (t: number) => number;

export const linear: Ease = (t) => t;
export const outQuad: Ease = (t) => 1 - (1 - t) * (1 - t);
export const outCubic: Ease = (t) => 1 - Math.pow(1 - t, 3);
export const inCubic: Ease = (t) => t * t * t;
export const inOutCubic: Ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const outQuart: Ease = (t) => 1 - Math.pow(1 - t, 4);
export const inQuart: Ease = (t) => t * t * t * t;
export const inOutQuart: Ease = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);
/** the workhorse: fast start, very long soft landing. Use this where you would have used "ease out". */
export const outExpo: Ease = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const inExpo: Ease = (t) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10));
export const inOutExpo: Ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2);
/** overshoots 1 then settles; `s` is the overshoot amount (1.70158 is the classic ~10%) */
export const outBack = (s = 1.70158): Ease => (t) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);

/** CSS-style cubic-bezier(x1, y1, x2, y2) easing (Newton-Raphson, same curves as CSS / design tools). */
export const bezier = (x1: number, y1: number, x2: number, y2: number): Ease => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t: number) => ((ax * t + bx) * t + cx) * t;
  const Y = (t: number) => ((ay * t + by) * t + cy) * t;
  const dX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = X(t) - x;
      if (Math.abs(err) < 1e-6) return Y(t);
      const d = dX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    let lo = 0, hi = 1;
    t = x;
    for (let i = 0; i < 24; i++) {
      const v = X(t);
      if (Math.abs(v - x) < 1e-6) break;
      if (v < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return Y(t);
  };
};

/** exponential decay envelope: 1 at t=0, 1/e after `tau` seconds. Used for hit punches and shakes. */
export const decay = (t: number, tau: number) => (t < 0 ? 0 : Math.exp(-t / tau));

/**
 * Closed-form damped spring from 0 -> 1 (a real harmonic oscillator, not a keyframe imitation).
 * `hz` is the natural frequency (cycles per second): 2-3 is soft, 5-7 is snappy.
 * `zeta` is the damping ratio: 1 = no overshoot, 0.4 = bouncy, 0.25 = very bouncy.
 * Returns the position at time `t` seconds (0 before t=0).
 */
export const spring = (t: number, hz = 4, zeta = 0.55): number => {
  if (t <= 0) return 0;
  const w = 2 * Math.PI * hz;
  if (zeta < 1) {
    const wd = w * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + ((zeta * w) / wd) * Math.sin(wd * t));
  }
  if (zeta === 1) return 1 - Math.exp(-w * t) * (1 + w * t);
  const s = Math.sqrt(zeta * zeta - 1);
  const r1 = -w * (zeta - s), r2 = -w * (zeta + s);
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
};

/** peak overshoot of `spring` for a given zeta (fraction above 1), handy for tuning and tests */
export const springOvershoot = (zeta: number) => (zeta >= 1 ? 0 : Math.exp((-Math.PI * zeta) / Math.sqrt(1 - zeta * zeta)));

/** cheap smooth 1-D value noise in [-1, 1], deterministic for a (seed, x) pair */
export const noise1 = (seed: number, x: number) => {
  const h = (n: number) => {
    let v = Math.imul(n | 0, 374761393) + Math.imul(seed | 0, 668265263);
    v = Math.imul(v ^ (v >>> 13), 1274126177);
    return ((v ^ (v >>> 16)) >>> 0) / 4294967295 * 2 - 1;
  };
  const i = Math.floor(x), f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerp(h(i), h(i + 1), u);
};
