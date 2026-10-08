/**
 * Computes a blur-in-pixels amount from how fast `getValue(frame)` is
 * changing right now, by sampling one frame back and scaling the delta.
 * Used to add real motion blur to fast transforms (a panel flying in, a
 * card fanning out) instead of leaving fast motion crisp and "cheap"
 * looking. Pass the same function you use to compute position/rotation.
 */
export const useMotionBlur = (
  getValue: (frame: number) => number,
  frame: number,
  options?: { sensitivity?: number; max?: number }
): number => {
  const { sensitivity = 1, max = 18 } = options ?? {};
  const now = getValue(frame);
  const prev = getValue(frame - 1);
  const velocity = Math.abs(now - prev);
  return Math.min(max, velocity * sensitivity);
};
