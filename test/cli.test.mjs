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
  const rootPkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  assert.equal(pj.dependencies[rootPkg.name], `^${rootPkg.version}`);
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

test("init accepts human-readable paths and prints a working cd command", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "demotion-paths-"));
  try {
    for (const [folder, expectedName] of [
      ["My Video", "my-video"],
      ['Sam\'s "Video"', "sam-s-video"],
      ["🎬", "my-video"],
      ["-demo", "demo"],
      ["node_modules", "my-video"],
      ["favicon.ico", "my-video"],
    ]) {
      const out = execFileSync(process.execPath, [path.resolve("bin/demotion.js"), "init", folder], { cwd: dir, encoding: "utf8" });
      const target = path.join(dir, folder);
      const manifest = JSON.parse(fs.readFileSync(path.join(target, "package.json"), "utf8"));
      assert.equal(manifest.name, expectedName);
      assert.ok(fs.existsSync(path.join(target, "src/MyVideo.tsx")));
      const cdCommand = out.match(/^Next: (.+) && npm install && npm start$/m)[1];
      const reached = execFileSync("bash", ["-c", `${cdCommand} && pwd -P`], { cwd: dir, encoding: "utf8" }).trim();
      assert.equal(reached, fs.realpathSync(target));
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("init rejects an existing file without modifying it or printing a stack trace", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "demotion-file-"));
  try {
    const target = path.join(dir, "video");
    fs.writeFileSync(target, "keep this file");
    assert.throws(() => execFileSync(process.execPath, [path.resolve("bin/demotion.js"), "init", "video"], { cwd: dir, stdio: "pipe" }), error => {
      assert.equal(error.status, 1);
      assert.match(error.stderr.toString(), /already exists and is not an empty directory/);
      assert.doesNotMatch(error.stderr.toString(), /ENOTDIR|node:fs|at file:/);
      return true;
    });
    assert.equal(fs.readFileSync(target, "utf8"), "keep this file");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
