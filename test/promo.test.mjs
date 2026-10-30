import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { build } from "esbuild";
import { loadTs } from "./helpers.mjs";
import { hasFaststart, validatePromoMetadata } from "../scripts/promo-media.mjs";
import { splitFrames } from "../scripts/promo-ranges.mjs";

const t = await loadTs("src/promo/timeline.ts");

test("parallel renders partition every global frame once, even with uneven ranges", () => {
  for (const [frames, workers] of [[3360, 3], [3360, 2], [17, 3], [1, 1]]) {
    const ranges = splitFrames(frames, workers);
    const flattened = ranges.flatMap(([start, end]) => Array.from({ length: end - start + 1 }, (_, i) => start + i));
    assert.deepEqual(flattened, Array.from({ length: frames }, (_, i) => i));
  }
  for (const workers of [0, -1, NaN, 1.5, 9]) assert.throws(() => splitFrames(3360, workers));
});

test("promo scene boundaries, caption clicks and music share the 56-second clock", () => {
  assert.equal(t.PROMO_BEATS, 112);
  assert.equal(t.promoClock.duration(t.PROMO_BEATS), 3360);
  assert.equal(t.promoClock.seconds(t.PROMO_BEATS), 56);
  const audio = t.promoSoundtrack();
  assert.equal(audio.bpm, t.promoClock.bpm);
  assert.equal(audio.beats, t.PROMO_BEATS);
  let sum = 0;
  for (const [i, shot] of t.PROMO_SHOTS.entries()) {
    assert.equal(t.promoStart(shot.id), sum);
    if (i) assert.ok(audio.cues.some(c => c.at === sum && c.kind === "whoosh"));
    sum += shot.beats;
  }
  for (const cue of t.PROMO_CAPTIONS) assert.ok(audio.cues.some(c => c.kind === "click" && c.at === t.promoStart("captions") + cue.at));
  assert.equal(t.promoClock.seconds(t.PROMO_SHOTS.find(s => s.id === "intro").beats), 4);
  assert.equal(t.promoClock.seconds(t.PROMO_SHOTS.find(s => s.id === "code").beats), 6);
  assert.equal(t.promoClock.seconds(t.PROMO_SHOTS.find(s => s.id === "type").beats), 4);
  for (const c of audio.cues) assert.ok(c.at >= 0 && c.at < t.PROMO_BEATS);
  assert.equal(t.PROMO_SHOTS.at(-1).beats, 12, "End card holds for six seconds");
});

test("promo's visible code is the complete example's real Shot, and bundles", async () => {
  const example = fs.readFileSync("examples/promo-scene.tsx", "utf8");
  const shot = example.match(/    (<Shot[\s\S]+?<\/Shot>)/)[1].split("\n").map((s, i) => i ? s.slice(4) : s).join("\n");
  assert.equal(shot, t.PROMO_CODE.join("\n"));
  await build({ entryPoints: ["examples/promo-scene.tsx"], bundle: true, platform: "browser", write: false, logLevel: "silent" });
  const api = await import("../dist/index.js");
  for (const name of [...t.PROMO_SOURCE_APIS, "KineticHeadline", "CodePanel", "CameraRig", "MotionProject", "Shot"]) assert.equal(typeof api[name], "function", name);
});

test("promo commands target the actual CLI and starter tasks", () => {
  const pkg = JSON.parse(fs.readFileSync("package.json"));
  const template = JSON.parse(fs.readFileSync("template/package.json"));
  assert.equal(t.PROMO_INSTALL, `npx --yes ${pkg.name}@latest init my-video`);
  assert.deepEqual(t.PROMO_COMMANDS.slice(1), ["cd my-video", "npm install", "npm start"]);
  assert.match(template.scripts.start, /remotion studio/);
  assert.equal(t.PROMO_RENDER, "npm run render");
  assert.match(template.scripts.render, /out\/video.mp4/);
  const source = fs.readFileSync("src/promo/PromoLaunch.tsx", "utf8");
  assert.match(source, /New APIs are not in npm 0.1.0/);
  assert.match(source, /Commercial license for business/);
});

test("promo documentation registers the exported example and its actual frame count", async () => {
  const doc = fs.readFileSync("docs/promo/README.md", "utf8");
  const registration = doc.match(/```tsx\n([\s\S]*?)\n```/)[1];
  await build({ stdin: { contents: registration.replace('"./PromoScene"', '"./examples/promo-scene"'), loader: "tsx", resolveDir: process.cwd() }, bundle: true, platform: "browser", write: false, logLevel: "silent" });
  assert.match(registration, /durationInFrames=\{PROMO_EXAMPLE_FRAMES\}/);
  assert.match(registration, /fps=\{promoExampleClock.fps\}/);
});

const expected = { seconds: 56, frames: 3360, fps: 60 };
const metadata = () => ({ streams: [
  { codec_type: "video", codec_name: "h264", width: 1920, height: 1080, nb_frames: "3360", avg_frame_rate: "60/1", pix_fmt: "yuv420p", color_range: "tv", color_space: "bt709", start_time: "0", duration: "56" },
  { codec_type: "audio", codec_name: "aac", channels: 2, sample_rate: "48000", start_time: "0", duration: "56" },
], format: { duration: "56" } });

test("promo delivery rejects wrong color range, missing or late audio and a truncated stream", () => {
  assert.doesNotThrow(() => validatePromoMetadata(metadata(), expected));
  for (const change of [m => { m.streams[0].color_range = "pc"; }, m => { m.streams.pop(); }, m => { m.streams[1].start_time = "0.1"; }, m => { m.streams[1].duration = "55"; }, m => { m.streams[0].nb_frames = "3300"; }]) {
    const m = metadata(); change(m); assert.throws(() => validatePromoMetadata(m, expected));
  }
});

test("faststart validation checks real MP4 box order and rejects malformed sizes", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "promo-media-"));
  const file = path.join(dir, "fixture.mp4");
  const box = name => { const b = Buffer.alloc(8); b.writeUInt32BE(8); b.write(name, 4); return b; };
  try {
    fs.writeFileSync(file, Buffer.concat([box("ftyp"), box("moov"), box("mdat")]));
    assert.equal(hasFaststart(file), true);
    fs.writeFileSync(file, Buffer.concat([box("ftyp"), box("mdat"), box("moov")]));
    assert.equal(hasFaststart(file), false);
    fs.writeFileSync(file, Buffer.from([0, 0, 0, 2, 109, 111, 111, 118]));
    assert.equal(hasFaststart(file), false);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
