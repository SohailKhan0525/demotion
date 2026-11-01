import { useMemo } from "react";
import { getLength, getPointAtLength, normalizePath, parsePath, reduceInstructions, serializeInstructions, type ReducedInstruction } from "@remotion/paths";
import { clamp01, inOutCubic } from "../core/math";
import { useShot } from "../engine/context";

/** Shot-local beats. Reduced motion displays the completed, static state at every frame. */
export type IllustrationTiming = { at?: number; over?: number; reducedMotion?: boolean };

export type PathMotionOptions = IllustrationTiming & {
  /** One continuous SVG subpath. Relative commands and curves are supported. */
  d: string;
  /** Fractions of the path length, in [0, 1]. Set from > to to travel backwards. */
  from?: number;
  to?: number;
  /** Orient the local positive x axis along the direction of travel. */
  rotate?: boolean;
  /** Additional rotation in degrees; also applied when rotate is false. */
  rotationOffset?: number;
};

export type PathMotion = {
  x: number;
  y: number;
  /** Rotation in degrees. */
  angle: number;
  /** Eased time progress, in [0, 1]. */
  progress: number;
  /** Current fraction of the total path length, in [0, 1]. */
  pathProgress: number;
  /** SVG transform for a group whose artwork is centered at (0, 0). */
  transform: string;
};

export const finite = (value: number, name: string) => {
  if (!Number.isFinite(value)) throw new Error(`${name} must be finite`);
};

export const timingProgress = (shot: ReturnType<typeof useShot>, at: number, over: number, reducedMotion: boolean) => {
  finite(at, "at"); finite(over, "over");
  if (over < 0) throw new Error("over must be non-negative");
  const start = shot.at(at), end = shot.at(at + over);
  finite(start, "start frame"); finite(end, "end frame");
  if (reducedMotion) return 1;
  if (shot.frame < start) return 0;
  if (end <= start) return 1;
  return clamp01((shot.frame - start) / (end - start));
};

const MAX_COORDINATE = 1_000_000;
const bounded = (value: number) => Number.isFinite(value) && Math.abs(value) <= MAX_COORDINATE;

/** Canonical geometry keeps browser drawing and numeric sampling in agreement. */
export const preparePath = (d: string) => {
  if (typeof d !== "string" || d.length === 0 || d.length > 32_768) {
    throw new Error("d must be a non-empty SVG path of at most 32768 characters");
  }
  if (!/^\s*[Mm]/.test(d) || /[^\s,0-9.+\-eEaAcChHlLmMqQsStTvVzZ]/.test(d)) {
    throw new Error("d must contain valid SVG path commands and finite coordinates");
  }
  const normalized = parsePath(normalizePath(d));
  if (normalized.length > 1024 || normalized.filter(i => i.type === "M").length !== 1) {
    throw new Error("d requires one continuous subpath and at most 1024 instructions; split separate subpaths into separate components");
  }
  for (const instruction of normalized) {
    for (const value of Object.values(instruction)) {
      if (typeof value === "number" && !bounded(value)) throw new Error("SVG coordinates must be finite and within ±1000000");
    }
  }
  // SVG defines a zero-radius arc as a straight line. Normalize it before the
  // upstream arc solver, which otherwise returns an incorrect zero-length path.
  const arcs = normalized.map(i => i.type === "A" && (i.rx === 0 || i.ry === 0) ? { type: "L" as const, x: i.x, y: i.y } : i);
  const reduced = reduceInstructions(arcs);
  const clean: ReducedInstruction[] = [];
  let x = 0, y = 0, moveX = 0, moveY = 0;
  for (const i of reduced) {
    for (const value of Object.values(i)) {
      if (typeof value === "number" && !bounded(value)) throw new Error("SVG geometry must be finite and within ±1000000");
    }
    if (i.type === "M") { moveX = i.x; moveY = i.y; }
    // A collapsed cubic has no tangent and upstream point sampling yields NaN.
    if (i.type === "C" && i.x === x && i.y === y && i.cp1x === x && i.cp1y === y && i.cp2x === x && i.cp2y === y) continue;
    if (i.type === "L" && i.x === x && i.y === y) continue;
    if (i.type === "Z") {
      if (x === moveX && y === moveY) continue;
      x = moveX; y = moveY;
    } else { x = i.x; y = i.y; }
    clean.push(i);
  }
  const path = serializeInstructions(clean);
  const length = getLength(path);
  if (!Number.isFinite(length) || length <= 0 || length > 100_000_000) {
    throw new Error("d must have a positive finite length no greater than 100000000");
  }
  return { d: path, length };
};

export const usePreparedPath = (d: string) => useMemo(() => preparePath(d), [d]);

/** Beat-driven path position; no DOM measurements, timers, or accumulated state. */
export const usePathMotion = ({ d, at = 0, over = 2, from = 0, to = 1, rotate = true, rotationOffset = 0, reducedMotion = false }: PathMotionOptions): PathMotion => {
  const shot = useShot();
  const path = usePreparedPath(d);
  finite(from, "from"); finite(to, "to"); finite(rotationOffset, "rotationOffset");
  if (from < 0 || from > 1 || to < 0 || to > 1) throw new Error("from and to must be in [0, 1]");
  const progress = inOutCubic(timingProgress(shot, at, over, reducedMotion));
  const pathProgress = clamp01(from + (to - from) * progress);
  const distance = pathProgress * path.length;
  const point = getPointAtLength(path.d, distance);
  if (!point || !bounded(point.x) || !bounded(point.y)) throw new Error("Cannot sample finite SVG path geometry");
  let angle = rotationOffset;
  if (rotate && from !== to) {
    // Finite differences also work at stationary Bezier endpoints. Sampling in
    // path order avoids the inverted arc tangents in @remotion/paths 4.0.528.
    const epsilon = Math.min(path.length / 1000, 0.1);
    const before = getPointAtLength(path.d, Math.max(0, distance - epsilon));
    const after = getPointAtLength(path.d, Math.min(path.length, distance + epsilon));
    if (!before || !after || !bounded(before.x) || !bounded(before.y) || !bounded(after.x) || !bounded(after.y)) {
      throw new Error("Cannot sample finite SVG path tangent");
    }
    const direction = to < from ? -1 : 1;
    angle += Math.atan2((after.y - before.y) * direction, (after.x - before.x) * direction) * 180 / Math.PI;
  }
  // Keep equivalent rotations bounded, including user-supplied offsets.
  angle = ((angle % 360) + 360) % 360;
  return { ...point, angle, progress, pathProgress, transform: `translate(${point.x} ${point.y}) rotate(${angle})` };
};
