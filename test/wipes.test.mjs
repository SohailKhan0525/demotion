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
