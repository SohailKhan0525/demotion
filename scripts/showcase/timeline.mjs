import { build } from "esbuild";
import { fileURLToPath } from "node:url";
const compiled = await build({ entryPoints: [fileURLToPath(new URL("../../src/showcase/timeline.ts", import.meta.url))], bundle: true, platform: "node", format: "esm", write: false });
const timeline = await import("data:text/javascript;base64," + Buffer.from(compiled.outputFiles[0].text).toString("base64"));
export const { showcaseClock: clock, SHOWCASE_BEATS: beats, SHOWCASE_CHAPTERS: chapters } = timeline;
export const frames = clock.duration(beats), seconds = clock.seconds(beats);
export const marks = chapters.map(({ id, title, startBeat, endBeat }) => ({
  id, title, startFrame: clock.frame(startBeat), endFrame: clock.frame(endBeat), startSeconds: clock.seconds(startBeat), endSeconds: clock.seconds(endBeat),
}));
