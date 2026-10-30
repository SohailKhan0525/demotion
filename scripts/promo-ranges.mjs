/** Inclusive frame ranges with no overlap or dropped frames, including uneven splits. */
export const splitFrames = (frames, workers) => {
  if (!Number.isInteger(frames) || frames < 1 || !Number.isInteger(workers) || workers < 1 || workers > Math.min(frames, 8)) throw new Error("Use positive integer frames and 1–8 workers (at most one per frame)");
  return Array.from({ length: workers }, (_, i) => [Math.floor(i * frames / workers), Math.floor((i + 1) * frames / workers) - 1]);
};
