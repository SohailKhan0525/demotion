import { bezier, spring } from "../core/math";

export type Vector3Tuple = [number, number, number];
export type Scene3DCamera = {
  position?: Vector3Tuple;
  target?: Vector3Tuple;
  /** Perspective field of view in degrees. */
  fov?: number;
};
export type Scene3DCameraMove = Scene3DCamera & { beat: number };
export type ResolvedScene3DCamera = Required<Scene3DCamera>;
export type ExtrudedSvgReveal = {
  atBeat?: number;
  durationBeats?: number;
  /** Delay between filled SVG paths, in document order. */
  staggerBeats?: number;
  /** Initial world-space depth offset. */
  fromZ?: number;
};

export const finiteNumber = (value: number, name: string, min = -Infinity, max = Infinity) => {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${name} must be finite and between ${min} and ${max}.`);
  }
  return value;
};

export const validateVector3 = (value: Vector3Tuple, name: string) => {
  if (!Array.isArray(value) || value.length !== 3) throw new Error(`${name} must have three finite coordinates.`);
  value.forEach((n) => finiteNumber(n, name, -100000, 100000));
};

const resolveCamera = (camera: Scene3DCamera, previous: ResolvedScene3DCamera): ResolvedScene3DCamera => {
  const next = { position: camera.position ?? previous.position, target: camera.target ?? previous.target, fov: camera.fov ?? previous.fov };
  validateVector3(next.position, "Scene3D camera.position");
  validateVector3(next.target, "Scene3D camera.target");
  finiteNumber(next.fov, "Scene3D camera.fov", 1, 160);
  if (Math.hypot(...next.position.map((n, i) => n - next.target[i])) < 0.001) {
    throw new Error("Scene3D camera.position and target must differ.");
  }
  return next;
};

const cameraEase = bezier(0.42, 0, 0.58, 1);

/** Pure pose evaluation; seeking backward never depends on the previous frame. */
export const sampleScene3DCamera = (
  frame: number,
  at: (beat: number) => number,
  camera: Scene3DCamera = {},
  moves: readonly Scene3DCameraMove[] = [],
  reducedMotion = false,
): ResolvedScene3DCamera => {
  finiteNumber(frame, "Scene3D frame");
  let pose = resolveCamera(camera, { position: [0, 0, 9], target: [0, 0, 0], fov: 36 });
  if (moves.length > 128) throw new Error("Scene3D supports at most 128 camera moves.");
  const keys = moves.map((move, i) => {
    finiteNumber(move.beat, "Scene3D camera move beat");
    if (i > 0 && move.beat <= moves[i - 1].beat) throw new Error("Scene3D camera moves must have strictly increasing beats.");
    pose = resolveCamera(move, pose);
    const keyFrame = finiteNumber(at(move.beat), "Scene3D camera move frame");
    return { frame: keyFrame, pose };
  });
  if (keys.length === 0) return pose;
  if (reducedMotion || frame <= keys[0].frame) return keys[0].pose;
  for (let i = 1; i < keys.length; i++) {
    const left = keys[i - 1];
    const right = keys[i];
    if (frame >= right.frame) continue;
    const t = cameraEase((frame - left.frame) / (right.frame - left.frame));
    const mix = (a: number, b: number) => a + (b - a) * t;
    const vector = (a: Vector3Tuple, b: Vector3Tuple): Vector3Tuple => [mix(a[0], b[0]), mix(a[1], b[1]), mix(a[2], b[2])];
    return resolveCamera({ position: vector(left.pose.position, right.pose.position), target: vector(left.pose.target, right.pose.target), fov: mix(left.pose.fov, right.pose.fov) }, left.pose);
  }
  return keys[keys.length - 1].pose;
};

export const sampleExtrudedSvgReveal = (frame: number, at: (beat: number) => number, index: number, reveal: ExtrudedSvgReveal | undefined, reducedMotion: boolean) => {
  if (!reveal) return { scale: 1, z: 0, visible: true };
  const start = finiteNumber(reveal.atBeat ?? 0, "ExtrudedSvg reveal.atBeat");
  const duration = finiteNumber(reveal.durationBeats ?? 1.5, "ExtrudedSvg reveal.durationBeats", 0.001, 10000);
  const stagger = finiteNumber(reveal.staggerBeats ?? 0.12, "ExtrudedSvg reveal.staggerBeats", 0, 10000);
  const fromZ = finiteNumber(reveal.fromZ ?? -1, "ExtrudedSvg reveal.fromZ", -100000, 100000);
  if (reducedMotion) return { scale: 1, z: 0, visible: true };
  const startFrame = at(start + index * stagger);
  const endFrame = at(start + index * stagger + duration);
  const t = Math.min(1, Math.max(0, (frame - startFrame) / Math.max(1, endFrame - startFrame)));
  if (t === 1) return { scale: 1, z: 0, visible: true };
  const progress = spring(t, 1.5, 0.58);
  return { scale: Math.max(0.0001, progress), z: fromZ * (1 - progress), visible: frame >= startFrame };
};
