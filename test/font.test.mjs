import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { build } from "esbuild";

const require = createRequire(import.meta.url);

test("source and installed headings wait for Archivo before caching their fitted widths", async () => {
  const { outputFiles } = await build({
    stdin: { contents: [
      'export { ensureFontsLoaded, FONT_FAMILY } from "./src/font";',
      'export { KineticHeadline } from "./src/type/KineticHeadline";',
      'export { WideStack } from "./src/type/WideStack";',
    ].join("\n"), resolveDir: process.cwd() },
    bundle: true, packages: "external", platform: "node", format: "cjs", write: false,
  });

  const document = { fonts: new Set() };
  const archivo = Promise.withResolvers();
  const measured = [], held = new Set(), cleanups = [];
  let redraws = 0;
  const modules = {
    react: {
      ...require("react"),
      useContext: () => ({ clock: { fps: 60, frame: beat => beat * 30 }, startBeat: 0, startFrame: 0, pre: 0 }),
      useReducer: () => [0, () => { redraws++; }],
      useLayoutEffect: setup => { const cleanup = setup(); if (cleanup) cleanups.push(cleanup); },
    },
    remotion: {
      AbsoluteFill: "div",
      staticFile: name => name, useCurrentFrame: () => 40, useVideoConfig: () => ({ height: 1080 }),
      delayRender() { const handle = Symbol(); held.add(handle); return handle; },
      continueRender: handle => assert.ok(held.delete(handle)),
      cancelRender: error => { throw error; },
    },
    "@remotion/fonts": { loadFont: ({ family }) => family === "Archivo" ? archivo.promise : Promise.resolve() },
    "@remotion/layout-utils": { measureText({ fontFamily }) { measured.push(fontFamily); return { width: 830 }; } },
  };
  function loadCopy() {
    const module = { exports: {} };
    runInNewContext(outputFiles[0].text, { module, document, require: id => modules[id] ?? require(id) });
    return module.exports;
  }

  const loader = loadCopy(), toolkit = loadCopy();
  const renderTitles = () => {
    const props = { text: "MOTION", color: "ivory", accent: "lime" };
    return [toolkit.KineticHeadline(props), toolkit.WideStack({ ...props, widths: [62] })];
  };
  renderTitles();
  assert.deepEqual(measured.splice(0), [toolkit.FONT_FAMILY, toolkit.FONT_FAMILY]);
  const loaded = loader.ensureFontsLoaded();
  assert.deepEqual(renderTitles(), [null, null]);
  assert.deepEqual(measured, []);
  assert.equal(held.size, 2);

  document.fonts.add({ family: "Archivo", status: "loaded" });
  archivo.resolve();
  await loaded;
  assert.equal(redraws, 2);
  assert.ok(renderTitles().every(Boolean));
  assert.deepEqual(measured, ["Archivo", "Archivo"]);
  for (const cleanup of cleanups) cleanup();
  assert.equal(held.size, 0);
});
