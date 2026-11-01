import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { build } from "esbuild";
import { loadTs } from "./helpers.mjs";

const film = await loadTs("src/update-film/timeline.ts");

test("update film score and eight chapters share a 40-second timeline", () => {
  assert.equal(film.UPDATE_BEATS, 80);
  assert.equal(film.updateClock.duration(film.UPDATE_BEATS), 2400);
  assert.equal(film.updateClock.seconds(film.UPDATE_BEATS), 40);
  const audio = film.updateSoundtrack();
  assert.equal(audio.bpm, film.updateClock.bpm);
  assert.equal(audio.beats, film.UPDATE_BEATS);
  let sum = 0;
  for (const [i, shot] of film.UPDATE_SHOTS.entries()) {
    assert.equal(film.updateStart(shot.id), sum);
    if (i) assert.ok(audio.cues.some(cue => cue.at === sum && cue.kind === "whoosh"));
    sum += shot.beats;
  }
  for (const cue of audio.cues) assert.ok(cue.at >= 0 && cue.at < sum);
  assert.equal(film.updateClock.seconds(film.UPDATE_SHOTS.at(-1).beats), 6);
});

test("the exact on-screen update code builds against the public package", async () => {
  const snippet = `import React from 'react'; import {DrawPath, FollowPath} from '@demotion/cli';
const route = 'M40 200C200 40 600 360 760 200';
export const Scene = () => (${film.UPDATE_CODE.join("\n")});`;
  await build({ stdin: {contents: snippet, loader: "tsx", resolveDir: process.cwd()}, bundle: true, platform: "browser", write: false, logLevel: "silent" });
  const api = await import("../dist/index.js");
  for (const name of ["DrawPath", "FollowPath", "WorkflowIllustration", "usePathMotion"]) assert.equal(typeof api[name], "function", name);
  const three = await import("../dist/three.js");
  for (const name of ["Scene3D", "ExtrudedSvg"]) assert.equal(typeof three[name], "function", name);
  assert.equal(film.UPDATE_INSTALL, `npx --yes ${JSON.parse(fs.readFileSync("package.json")).name}@latest init my-video`);
});
