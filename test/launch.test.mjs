import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { loadTs } from "./helpers.mjs";
const { SHOTS, LAUNCH_BEATS, launchClock, launchSpec, shotStart } = await loadTs("src/launch/timeline.ts");
const { MYVIDEO_SOURCE, MYVIDEO, INIT_CMD, RENDER_CMD } = await loadTs("src/launch/code.ts");

test("launch picture cuts and sound hits share the same 52-beat clock", () => {
  assert.equal(LAUNCH_BEATS, 52);
  assert.equal(launchClock.duration(LAUNCH_BEATS), 1560);
  const spec = launchSpec();
  assert.equal(spec.bpm, launchClock.bpm);
  let beat = 0;
  for (let i = 0; i < SHOTS.length; i++) {
    const shot = SHOTS[i];
    assert.equal(shotStart(shot.id), beat);
    if (i) assert.notEqual(shot.bg, SHOTS[i - 1].bg);
    const hits = spec.cues.filter((c) => c.at === beat && ["hit", "flashHit"].includes(c.kind));
    assert.equal(hits.length, 1);
    assert.equal(Math.round(hits[0].at * 60 / spec.bpm * launchClock.fps), launchClock.frame(beat));
    if (i) assert.ok(spec.cues.some((c) => c.at === beat && c.kind === "whoosh"));
    beat += shot.beats;
  }
  assert.equal(spec.cues.find((c) => c.kind === "flashHit").at, shotStart("ptext"));
});

test("starter code on screen matches source byte for byte", () => {
  assert.equal(MYVIDEO_SOURCE, fs.readFileSync("template/src/MyVideo.tsx", "utf8"));
  assert.equal(MYVIDEO.map((line) => line.map((t) => t.text).join("")).join("\n") + "\n", MYVIDEO_SOURCE);
  const root = fs.readFileSync("template/src/Root.tsx", "utf8");
  assert.match(root, /durationInFrames=\{150\}/);
  assert.match(MYVIDEO_SOURCE, /durationInFrames=\{60\}/);
  assert.match(MYVIDEO_SOURCE, /durationInFrames=\{90\}/);
  const pkg = JSON.parse(fs.readFileSync("template/package.json"));
  assert.equal(RENDER_CMD, "npm run render:4k");
  assert.match(pkg.scripts["render:4k"], /out\/video-4k.mp4 --scale=2/);
  assert.match(root, /width=\{1920\}/);
  assert.match(root, /height=\{1080\}/);
});

test("launch CLI demonstration uses real scaffold output and actual typing length", () => {
  assert.equal(INIT_CMD, "node bin/demotion.js init my-video");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "launch-cli-"));
  try {
    const output = execFileSync(process.execPath, [path.resolve("bin/demotion.js"), "init", "my-video"], { cwd: dir, encoding: "utf8" });
    const shots = fs.readFileSync("src/launch/shots.tsx", "utf8");
    for (const line of output.trimEnd().split("\n").filter(Boolean)) assert.ok(shots.includes(line), `missing actual CLI output: ${line}`);
    const typing = launchSpec().cues.find((c) => c.kind === "typing");
    assert.equal(typing.steps, INIT_CMD.length);
    assert.equal(typing.at, shotStart("terminal") + 0.2);
    assert.ok(shots.includes("PRE-RELEASE · BUILD FROM SOURCE"));
    assert.ok(!shots.includes("npm i demotion"));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
