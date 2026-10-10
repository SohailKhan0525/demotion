import test from "node:test";
import assert from "node:assert/strict";
import { loadTs } from "./helpers.mjs";

const core = await loadTs("src/core/index.ts");
const near = (a, b, eps = 1e-3, msg = "") => assert.ok(Math.abs(a - b) <= eps, `${msg} expected ${b}, got ${a}`);

test("easings hit their endpoints", () => {
  for (const k of ["linear", "outCubic", "inCubic", "inOutCubic", "outQuart", "inQuart", "inOutQuart", "outExpo", "inExpo", "inOutExpo"]) {
    near(core[k](0), 0, 1e-3, k); near(core[k](1), 1, 1e-6, k);
  }
  near(core.outBack()(1), 1, 1e-9); near(core.outBack()(0), 0, 1e-9);
  assert.ok(core.outBack()(0.7) > 1, "outBack overshoots past 1");
});

test("outExpo is fast-in, slow-out (most of the travel happens early)", () => {
  assert.ok(core.outExpo(0.2) > 0.7);
  assert.ok(core.outExpo(0.2) > core.outCubic(0.2));
});

test("bezier matches known CSS curves", () => {
  const ease = core.bezier(0.25, 0.1, 0.25, 1); // CSS `ease`
  near(ease(0), 0); near(ease(1), 1); near(ease(0.5), 0.8024, 2e-3);
  const lin = core.bezier(0, 0, 1, 1);
  for (const x of [0.1, 0.4, 0.9]) near(lin(x), x, 2e-3);
  const expo = core.bezier(0.22, 1, 0.36, 1);
  let prev = 0;
  for (let i = 1; i <= 50; i++) { const v = expo(i / 50); assert.ok(v >= prev - 1e-9, "monotone"); prev = v; }
});

test("spring: starts at 0, settles at 1, and overshoots exactly as the oscillator says", () => {
  assert.equal(core.spring(0), 0);
  near(core.spring(3, 4, 0.55), 1, 1e-3);
  for (const zeta of [0.25, 0.4, 0.55, 0.8]) {
    let peak = 0;
    for (let i = 0; i < 4000; i++) peak = Math.max(peak, core.spring(i / 1000, 4, zeta));
    near(peak - 1, core.springOvershoot(zeta), 2e-3, `zeta ${zeta}`);
  }
  let peak = 0;
  for (let i = 0; i < 4000; i++) peak = Math.max(peak, core.spring(i / 1000, 4, 1));
  assert.ok(peak <= 1 + 1e-9, "critically damped never overshoots");
  near(core.spring(5, 4, 1.4), 1, 1e-3);
});

test("beat clock: 120 BPM @ 60 fps is exactly 30 frames per beat", () => {
  const c = core.createBeatClock({ bpm: 120, fps: 60 });
  assert.equal(c.framesPerBeat, 30);
  assert.equal(c.frame(4), 120);
  assert.equal(c.duration(30), 900);
  near(c.seconds(30), 15, 1e-9);
  near(c.beats(75), 2.5, 1e-9);
});

test("beat clock: a beat's own frame is always '0 seconds since the beat' (128 BPM @ 60 fps)", () => {
  const c = core.createBeatClock({ bpm: 128, fps: 60 });
  near(c.framesPerBeat, 28.125, 1e-9);
  assert.equal(c.frame(8), 225);
  for (let n = 0; n < 64; n++) assert.equal(c.sinceBeat(c.frame(n)), 0, `beat ${n} must land on a zero`);
  assert.ok(c.sinceBeat(c.frame(3) + 14) > 0.2);
  for (let n = 0; n < 64; n += 4) assert.equal(c.sinceBar(c.frame(n)), 0, `bar downbeat ${n}`);
});

test("beat punch is 1 on the beat and decays", () => {
  const c = core.createBeatClock({ bpm: 120, fps: 60 });
  near(core.beatPunch(c, 60), 1, 1e-9);
  assert.ok(core.beatPunch(c, 66) < core.beatPunch(c, 61));
  assert.ok(core.beatPunch(c, 89) < 0.05);
});

test("shake only exists after a hit and fades away", () => {
  const hits = [{ frame: 100 }];
  const before = core.shake(90, 60, hits);
  assert.deepEqual([before.x, before.y, before.rotate], [0, 0, 0]);
  const early = Math.hypot(core.shake(102, 60, hits).x, core.shake(102, 60, hits).y);
  const late = Math.hypot(core.shake(190, 60, hits).x, core.shake(190, 60, hits).y);
  assert.ok(early > 1, "visible right after the hit");
  assert.ok(late < 0.05, "gone a second and a half later");
  assert.deepEqual(core.shake(105, 60, hits), core.shake(105, 60, hits), "deterministic");
});
