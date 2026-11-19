import test from "node:test";
import assert from "node:assert/strict";
import { loadTs } from "./helpers.mjs";
const { wipeLayerProgress } = await loadTs("src/engine/wipeTiming.ts");

test("every delayed wipe layer covers the entire screen on the cut and clears by the deadline", () => {
  for (const delay of [0, 3, ...Array.from({ length: 8 }, (_, i) => 3 + i * 1.4)]) {
    assert.equal(wipeLayerProgress(100, 100, 14, 16, delay).cover, 1);
    assert.equal(wipeLayerProgress(100, 100, 14, 16, delay).uncover, 0);
    assert.equal(wipeLayerProgress(116, 100, 14, 16, delay).uncover, 1);
    assert.equal(wipeLayerProgress(85, 100, 14, 16, delay).cover, 0);
    assert.ok(wipeLayerProgress(99, 100, 14, 16, delay).cover < 1);
    assert.ok(wipeLayerProgress(115, 100, 14, 16, delay).uncover > 0.99);
  }
});

test("diagonal wipes cover every corner on the cut and clear the canvas at both ends", async () => {
  const { Wipe } = await import("../dist/index.js");
  const at = 100, lead = 14, tail = 16;
  const spec = { kind: "diagonal", color: "blue", accent: "green", lead, tail };
  for (const [width, height] of [[1920, 1080], [1080, 1920], [3840, 2160]]) {
    for (const frame of [at - lead, at, at + tail]) {
      const layers = Wipe({ spec, frame, at, width, height }).props.children;
      for (const layer of layers) {
        const style = layer.props.style;
        const angle = Number(style.transform.match(/skewX\(([-.\d]+)deg\)/)[1]);
        const cornerShift = height / 2 * Math.abs(Math.tan(angle * Math.PI / 180));
        const right = style.left + style.width;
        if (frame < at) assert.ok(right + cornerShift <= 0, "a corner is visible before the wipe");
        if (frame === at) {
          assert.ok(style.left + cornerShift <= 0, "left corner is uncovered at the cut");
          assert.ok(right - cornerShift >= width, "right corner is uncovered at the cut");
        }
        if (frame > at) assert.ok(style.left - cornerShift >= width, "a corner lingers after the wipe");
      }
    }
  }
});
