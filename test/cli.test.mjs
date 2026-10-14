import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

test("demotion init scaffolds a complete project (fonts, licenses, sources)", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "demotion-"));
  const out = execFileSync("node", [path.resolve("bin/demotion.js"), "init", "my-video"], { cwd: dir }).toString();
  assert.match(out, /Created my-video\//);
  assert.match(out, /ko-fi\.com\/qofenoai/);
  const p = path.join(dir, "my-video");
  for (const f of ["package.json", "remotion.config.ts", "tsconfig.json", "src/index.ts", "src/Root.tsx", "src/MyVideo.tsx", "README.md", ".gitignore",
    "public/fonts/ArchivoVariable.woff2", "public/fonts/AbrilFatface.woff2", "public/fonts/JetBrainsMonoVariable.woff2", "public/fonts/licenses/OFL-archivo.txt"]) {
    assert.ok(fs.existsSync(path.join(p, f)), `${f} missing`);
  }
  const pj = JSON.parse(fs.readFileSync(path.join(p, "package.json"), "utf8"));
  assert.equal(pj.name, "my-video");
  assert.match(pj.dependencies["@agent-qofeno/demotion"], /^\^\d/);
  assert.equal(pj.scripts["render:4k"].includes("--scale=2"), true);
  assert.throws(() => execFileSync("node", [path.resolve("bin/demotion.js"), "init", "my-video"], { cwd: dir, stdio: "pipe" }), "refuses to overwrite a non-empty folder");
});

test("demotion audio renders a mastered WAV from a cue file", { skip: !fs.existsSync("dist/audio.js") && "run `npm run build` first" }, () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "demotion-audio-"));
  const spec = path.join(dir, "cues.json");
  fs.writeFileSync(spec, JSON.stringify({ bpm: 120, beats: 4, targetLUFS: -14, music: { kick: [[0, 4]], arp: [[0, 4]] }, cues: [{ at: 0, kind: "hit" }, { at: 2, kind: "pop" }] }));
  const out = execFileSync("node", [path.resolve("bin/demotion.js"), "audio", spec, path.join(dir, "out", "s.wav")]).toString();
  assert.match(out, /LUFS/);
  const wav = fs.readFileSync(path.join(dir, "out", "s.wav"));
  assert.equal(wav.subarray(0, 4).toString(), "RIFF");
  const lufs = Number(out.match(/(-?\d+\.\d) LUFS/)[1]);
  assert.ok(Math.abs(lufs - -14) < 1, `mastered to ${lufs}`);
});
