import { inQuart, outExpo, prog } from "../core/math";

/** Stagger starts, but keep every layer covered on the cut and gone by the end. */
export const wipeLayerProgress = (frame: number, at: number, lead: number, tail: number, delay: number) => ({
  cover: frame >= at ? 1 : inQuart(prog(frame, at - lead + delay, Math.max(1, lead - delay))),
  uncover: frame >= at + tail ? 1 : outExpo(prog(frame, at + delay, Math.max(1, tail - delay))),
});
