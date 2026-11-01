import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

const result = await build({
  stdin: { contents: `
    import React from 'react';
    import {renderToStaticMarkup} from 'react-dom/server';
    import {DrawPath} from './src/illustration/DrawPath';
    import {FollowPath} from './src/illustration/FollowPath';
    import {WorkflowIllustration} from './src/illustration/WorkflowIllustration';
    import {usePathMotion, preparePath} from './src/illustration/pathMotion';
    export {preparePath};
    export const draw = props => renderToStaticMarkup(<svg><DrawPath {...props}/></svg>);
    export const follow = props => renderToStaticMarkup(<svg><FollowPath {...props}><circle r="6"/></FollowPath></svg>);
    export const workflow = props => renderToStaticMarkup(<WorkflowIllustration {...props}/>);
    export const pair = () => renderToStaticMarkup(<><WorkflowIllustration/><WorkflowIllustration/></>);
    export const motion = props => {
      let value;
      const Probe = () => { value = usePathMotion(props); return null; };
      renderToStaticMarkup(<Probe/>);
      return value;
    };
  `, resolveDir: process.cwd(), loader: "tsx" },
  bundle: true, platform: "node", format: "esm", write: false,
  alias: { "react-dom/server": "react-dom/server.browser" },
  plugins: [{ name: "illustration-clock", setup(b) {
    b.onLoad({ filter: /engine\/context\.tsx$/ }, () => ({ contents: `
      import {createBeatClock} from '../core/clock';
      import {demotionTheme} from './theme';
      export const useShot = () => {
        const {frame, bpm = 120, fps = 60, startBeat = 0} = globalThis.__illustrationShot;
        const clock = createBeatClock({bpm, fps});
        return {frame, clock, theme: demotionTheme,
          at: b => clock.frame(startBeat + b) - clock.frame(startBeat)};
      };
    `, loader: "ts", resolveDir: `${process.cwd()}/src/engine` }));
  } }],
});
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "demotion-illustration-"));
let illustration;
try {
  const file = path.join(dir, "illustration.mjs");
  fs.writeFileSync(file, result.outputFiles[0].text);
  illustration = await import(pathToFileURL(file).href);
} finally { fs.rmSync(dir, { recursive: true, force: true }); }
const at = (frame, extra = {}) => { globalThis.__illustrationShot = { frame, ...extra }; };
const numberAttribute = (html, key) => Number(html.match(new RegExp(`${key}="([^"]+)"`))?.[1]);
const close = (actual, expected, epsilon = 1e-4) => assert.ok(Math.abs(actual - expected) < epsilon, `${actual} ≈ ${expected}`);
const line = "M0 0L100 0";

test("drawn paths use rounded shot-local beats, eased bounded dashes, and repeat after seeking", () => {
  const props = { d: line, at: 0.5, over: 2 };
  at(13, { bpm: 128, startBeat: 2 }); assert.match(illustration.draw(props), /opacity="0"/);
  at(14, { bpm: 128, startBeat: 2 }); assert.match(illustration.draw(props), /opacity="0"/);
  at(42.5, { bpm: 128, startBeat: 2 }); const middle = illustration.draw(props);
  close(numberAttribute(middle, "stroke-dashoffset"), 3.125);
  close(numberAttribute(illustration.draw({ ...props, reverse: true }), "stroke-dashoffset"), -3.125);
  at(71, { bpm: 128, startBeat: 2 }); close(numberAttribute(illustration.draw(props), "stroke-dashoffset"), 0);
  at(42.5, { bpm: 128, startBeat: 2 }); assert.equal(illustration.draw(props), middle);
});

test("path followers reach exact endpoints and support reverse travel and fixed orientation", () => {
  const props = { d: line, at: 1, over: 2 };
  at(-100); close(illustration.motion(props).x, 0);
  at(60); const middle = illustration.motion(props);
  close(middle.x, 50); close(middle.y, 0); close(middle.angle, 0);
  assert.match(illustration.follow(props), /translate\(50 0\) rotate\(0\)/);
  at(90); close(illustration.motion(props).x, 100);
  at(60); assert.deepEqual(illustration.motion(props), middle);
  const reverse = illustration.motion({ ...props, from: 0.8, to: 0.2 });
  close(reverse.x, 50); close(reverse.angle, 180);
  close(illustration.motion({ ...props, rotate: false, rotationOffset: -90 }).angle, 270);
  close(illustration.motion({ ...props, from: 0.25, to: 0.25, rotationOffset: 33 }).angle, 33);
});

test("curves, relative commands and zero-radius arcs yield finite geometry and correct headings", () => {
  at(30);
  const arc = illustration.motion({ d: "M0 0A50 50 0 0 1 50 50" });
  close(arc.x, Math.sqrt(1250), 0.01); close(arc.y, 50 - Math.sqrt(1250), 0.01); close(arc.angle, 45, 0.1);
  close(illustration.motion({ d: "M0 0A50 50 0 0 1 50 50", from: 1, to: 0 }).angle, 225, 0.1);
  const relative = illustration.motion({ d: "m10 20q0 0 50 50" });
  close(relative.x, 35, 0.02); close(relative.y, 45, 0.02);
  const degeneratePrefix = illustration.motion({ d: "M10 20C10 20 10 20 10 20L10 20L110 20" });
  close(degeneratePrefix.x, 60); close(degeneratePrefix.y, 20);
  close(illustration.motion({ d: "M10 20A0 20 0 0 1 110 20" }).x, 60);
  for (const frame of [-1, 0, 0.25, 12, 30, 59.75, 60, 10000]) {
    at(frame);
    const sample = illustration.motion({ d: "M0 0C0 0 100 100 100 100" });
    assert.ok(Object.values(sample).filter(v => typeof v === "number").every(Number.isFinite));
    assert.ok(sample.x >= 0 && sample.x <= 100 && sample.y >= 0 && sample.y <= 100);
  }
});

test("zero-duration windows land exactly and reduced motion is static at every frame", () => {
  const props = { d: line, at: 0.5, over: 0 };
  at(13, { bpm: 128, startBeat: 2 }); close(illustration.motion(props).x, 0);
  at(14, { bpm: 128, startBeat: 2 }); close(illustration.motion(props).x, 100);
  assert.equal(numberAttribute(illustration.draw(props), "stroke-dashoffset"), 0);
  at(-100);
  const draw = illustration.draw({ d: line, reducedMotion: true });
  const motion = illustration.motion({ d: line, reducedMotion: true });
  const art = illustration.workflow({ reducedMotion: true });
  at(9999);
  assert.equal(illustration.draw({ d: line, reducedMotion: true }), draw);
  assert.deepEqual(illustration.motion({ d: line, reducedMotion: true }), motion);
  assert.equal(illustration.workflow({ reducedMotion: true }), art);
});

test("path APIs reject invalid, non-finite, compound and excessive geometry", () => {
  at(30);
  for (const d of ["", "garbage", "M0 0X1 2L3 4", "M0 0LNaN 2", "M0 0L1e309 2", "M0 0L1000001 2", "M0 0M1 2L3 4", "M0 0L0 0", "M0 0C0 0 0 0 0 0"]) {
    assert.throws(() => illustration.motion({ d }), undefined, d);
    assert.throws(() => illustration.draw({ d }), undefined, d);
  }
  assert.throws(() => illustration.motion({ d: `M0 0${"L1 1".repeat(1024)}` }), /1024/);
  assert.throws(() => illustration.motion({ d: line, from: -1 }), /\[0, 1\]/);
  assert.throws(() => illustration.motion({ d: line, to: Infinity }), /finite/);
  assert.throws(() => illustration.motion({ d: line, over: -1 }), /non-negative/);
  assert.throws(() => illustration.draw({ d: line, at: NaN }), /finite/);
  assert.throws(() => illustration.draw({ d: line, strokeWidth: 0 }), /strokeWidth/);
});

test("workflow layers animate deterministically, use unique accessible IDs, and validate layout", () => {
  at(25); const early = illustration.workflow({});
  at(130); const late = illustration.workflow({});
  assert.notEqual(early, late);
  at(25); assert.equal(illustration.workflow({}), early);
  const ids = [...illustration.pair().matchAll(/<title id="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, 2); assert.equal(new Set(ids).size, 2);
  for (const frame of [-30, 0, 6, 15, 30, 45, 60, 90, 120, 150, 240]) {
    at(frame);
    assert.doesNotMatch(illustration.workflow({}), /NaN|Infinity/);
  }
  assert.match(late, /Source/); assert.match(late, /Compose/); assert.match(late, /Ready/);
  assert.throws(() => illustration.workflow({ width: 0 }), /dimensions/);
  assert.throws(() => illustration.workflow({ labels: ["One", "Two"] }), /three labels/);
});

test("complete illustration consumer example compiles against the public package declarations", () => {
  execFileSync(process.execPath, ["node_modules/typescript/bin/tsc", "--noEmit", "--strict", "--skipLibCheck", "--jsx", "react-jsx", "--target", "ES2020", "--module", "ESNext", "--moduleResolution", "Bundler", "--esModuleInterop", "examples/illustration.tsx"], { stdio: "pipe" });
});
