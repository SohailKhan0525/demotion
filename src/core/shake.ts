import { decay, noise1 } from "./math";

export type ShakeHit = { frame: number; amp?: number };

/**
 * Camera shake that only exists right after a hit, then dies away (decaying noise, not constant jitter).
 * Returns pixel offsets and a small rotation in degrees.
 */
export const shake = (frame: number, fps: number, hits: ShakeHit[], { tau = 0.18, hz = 22, amp = 14, rot = 0.6 }: { tau?: number; hz?: number; amp?: number; rot?: number } = {}) => {
  let x = 0, y = 0, r = 0;
  hits.forEach((h, i) => {
    const t = (frame - h.frame) / fps;
    if (t < 0) return;
    const e = decay(t, tau) * (h.amp ?? 1);
    if (e < 0.002) return;
    x += noise1(11 + i * 7, t * hz) * amp * e;
    y += noise1(23 + i * 7, t * hz) * amp * e;
    r += noise1(37 + i * 7, t * hz) * rot * e;
  });
  return { x, y, rotate: r };
};
