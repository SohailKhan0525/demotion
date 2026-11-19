import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { createCanvas } from "@napi-rs/canvas";

test("the standalone title renderer reproduces a PNG after seeking across all three acts", () => {
  const html = readFileSync(new URL("../examples/canvas-launch.html", import.meta.url), "utf8");
  const script = html.match(/<script id="title-card-renderer">([\s\S]*?)<\/script>/);
  assert.ok(script, "expected the same renderer script used by the browser and launch film");
  const drawTitleCard = runInNewContext(script[1] + "\ndrawTitleCard;");
  const canvas = createCanvas(960, 540);
  const ctx = canvas.getContext("2d");
  function render(beat, title = "Daybreak") {
    drawTitleCard(ctx, { title, bpm: 96, beat });
    return canvas.toBuffer("image/png");
  }
  const draft = render(0);
  const timing = render(4.5);
  const final = render(9);
  assert.notDeepEqual(draft, timing);
  assert.notDeepEqual(timing, final);
  assert.notDeepEqual(final, render(9, "On cue"));
  assert.deepEqual(draft, render(0));
  assert.deepEqual(final, render(9));
  assert.deepEqual(timing, render(4.5));
});
