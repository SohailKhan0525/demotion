import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { build } from "esbuild";
import { loadTs } from "./helpers.mjs";

const read = path => readFileSync(path, "utf8");

test("gallery renders the actual components and its overlapping transitions cover exactly 24 beats", async () => {
  const bundle = await build({
    entryPoints: ["src/showcase/Gallery.tsx"], bundle: true, packages: "external",
    platform: "node", format: "cjs", write: false, metafile: true,
  });
  const module = { exports: {} };
  runInNewContext(bundle.outputFiles[0].text, { module, require: createRequire(import.meta.url) });
  const { ComponentGallery } = module.exports;
  const parts = Array.from(ComponentGallery().props.children);
  const length = part => part.props.durationInFrames ?? -part.props.timing.getDurationInFrames({ fps: 60 });
  assert.deepEqual(parts.map(length), [255, -15, 255, -15, 240]);
  const { SHOWCASE_CHAPTERS, showcaseClock } = await loadTs("src/showcase/timeline.ts");
  const gallery = SHOWCASE_CHAPTERS.find(chapter => chapter.id === "gallery");
  assert.equal(parts.reduce((sum, part) => sum + length(part), 0), showcaseClock.duration(gallery.endBeat - gallery.startBeat));

  const inputs = Object.values(bundle.metafile.outputs)[0].inputs;
  for (const name of [
    "components/Safari.tsx", "components/CloudGradient.tsx", "components/CardFan.tsx", "components/LoadingButton.tsx",
    "v2/primitives.tsx", "components/reel/typography.tsx", "components/reel/geometry.tsx", "components/reel/motion.tsx",
    "three/RubiksCube.tsx", "transitions/scaleFadeBlur.tsx", "transitions/speedRampCut.tsx",
  ]) assert.ok(inputs[`src/${name}`]?.bytesInOutput > 0, `missing live implementation: ${name}`);
});

test("the showcase has continuous chapters, a registered composition and matching package examples", async () => {
  const { SHOWCASE_CHAPTERS, SHOWCASE_BEATS, SHOWCASE_COMMAND, showcaseClock } = await loadTs("src/showcase/timeline.ts");
  assert.deepEqual(SHOWCASE_CHAPTERS.map(c => c.id), [
    "intro", "starter", "launch", "data", "specimens-a", "promo", "lab", "ui", "gallery", "specimens-b",
    "illustration", "depth", "specimens-c", "audio", "canvas", "close",
  ]);
  let end = 0;
  for (const chapter of SHOWCASE_CHAPTERS) {
    assert.equal(chapter.startBeat, end, `gap or overlap before ${chapter.id}`);
    assert.ok(chapter.endBeat > end);
    assert.ok(chapter.title.trim());
    let beats = 0;
    for (const cut of chapter.cuts) {
      assert.ok(Number.isInteger(cut.startFrame) && cut.startFrame >= 0);
      assert.ok(cut.beats > 0);
      beats += cut.beats;
    }
    assert.equal(beats, chapter.endBeat - chapter.startBeat);
    end = chapter.endBeat;
  }
  assert.equal(end, SHOWCASE_BEATS);
  assert.equal(showcaseClock.fps, 60);
  assert.equal(showcaseClock.bpm, 120);
  assert.match(read("src/Root.tsx"), /id="Showcase"/);
  const pkg = JSON.parse(read("package.json"));
  assert.ok(existsSync(pkg.bin.demotion));
  assert.equal(SHOWCASE_COMMAND, `npx --yes ${pkg.name}@latest showcase`);
  assert.match(read("src/lab/UI.tsx"), /createBeatClock \} from "\$\{packageJson\.name\}"/);
  assert.ok(pkg.exports["./three"]);
});

test("the filmed starter and studies reach every public legacy, reel and v2 component module", async () => {
  const bundle = await build({
    entryPoints: ["template/src/MyVideo.tsx", "src/showcase/Gallery.tsx", "src/showcase/Specimens.tsx"],
    alias: { "@demotion/cli": "./src/lib.ts" }, bundle: true, packages: "external",
    platform: "browser", format: "esm", outdir: "out", write: false, metafile: true,
  });
  const used = new Set();
  for (const output of Object.values(bundle.metafile.outputs)) {
    for (const [path, input] of Object.entries(output.inputs)) {
      if (input.bytesInOutput > 0) used.add(path);
    }
  }
  for (const dir of ["src/components", "src/v2"]) {
    for (const file of readdirSync(dir, { recursive: true })) {
      if (file.endsWith(".tsx")) assert.ok(used.has(`${dir}/${file.replaceAll("\\", "/")}`), `no filmed example of ${file}`);
    }
  }
  const { SHOWCASE_CHAPTERS, showcaseClock } = await loadTs("src/showcase/timeline.ts");
  const cuts = SHOWCASE_CHAPTERS.flatMap(chapter => chapter.cuts);
  function ranges(source) {
    return cuts.filter(cut => cut.source === source)
      .map(cut => [cut.startFrame, cut.startFrame + showcaseClock.duration(cut.beats)]);
  }
  assert.deepEqual(ranges("starter"), [[0, 300]]);
  assert.deepEqual(ranges("ComponentGallery"), [[0, 720]]);
  assert.deepEqual(ranges("Specimens"), [[0, 480], [480, 960], [960, 1440]]);
});
