import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Render the real components at controlled local shot frames without a browser.
const result = await build({
  stdin: { contents: `
    import React from 'react';
    import {renderToStaticMarkup} from 'react-dom/server';
    import {Terminal} from './src/ui/Terminal';
    import {CodePanel} from './src/ui/CodePanel';
    import {CountUp} from './src/ui/CountUp';
    import {BarChart} from './src/ui/BarChart';
    import {CaptionTrack} from './src/ui/CaptionTrack';
    import {LowerThird} from './src/ui/LowerThird';
    import {ProgressRing} from './src/ui/ProgressRing';
    export const terminal = (props) => renderToStaticMarkup(React.createElement(Terminal, props));
    export const code = (props) => renderToStaticMarkup(React.createElement(CodePanel, props));
    export const counter = (props) => renderToStaticMarkup(React.createElement(CountUp, props));
    export const bars = (props) => renderToStaticMarkup(React.createElement(BarChart, props));
    export const captions = (props) => renderToStaticMarkup(React.createElement(CaptionTrack, props));
    export const lower = (props) => renderToStaticMarkup(React.createElement(LowerThird, props));
    export const ring = (props) => renderToStaticMarkup(React.createElement(ProgressRing, props));
  `, resolveDir: process.cwd(), loader: "tsx" },
  bundle: true, platform: "node", format: "esm", write: false,
  // Browser SSR avoids Node stream builtins inside the data URL bundle.
  alias: { "react-dom/server": "react-dom/server.browser" },
  plugins: [{ name: "shot-clock", setup(b) {
    b.onLoad({ filter: /engine\/context\.tsx$/ }, () => ({ contents: `
      import {createBeatClock} from '../core/clock';
      import {demotionTheme} from './theme';
      export const useShot = () => {
        const {frame, bpm = 120, fps = 60, startBeat = 0} = globalThis.__uiShot;
        const clock = createBeatClock({bpm, fps});
        return { frame, clock, theme: demotionTheme,
          at: b => clock.frame(startBeat + b) - clock.frame(startBeat) };
      };
    `, loader: "ts", resolveDir: `${process.cwd()}/src/engine` }));
  } }],
});
const bundleDir = fs.mkdtempSync(path.join(os.tmpdir(), "demotion-ui-test-"));
let ui;
try {
  const bundlePath = path.join(bundleDir, "ui.mjs");
  fs.writeFileSync(bundlePath, result.outputFiles[0].text);
  ui = await import(pathToFileURL(bundlePath).href);
} finally { fs.rmSync(bundleDir, { recursive: true, force: true }); }
const at = (frame, extra = {}) => { globalThis.__uiShot = { frame, ...extra }; };

test("terminal reveals Unicode characters on beats, hides future lines and supports reverse seeking", () => {
  const props = { lines: [{ at: 1, type: 1, text: "A🚀BC", prompt: true }, { at: 3, text: "future" }] };
  at(29); assert.ok(!ui.terminal(props).includes("$ "));
  at(45); const middle = ui.terminal(props);
  assert.ok(middle.includes("A🚀")); assert.ok(!middle.includes("BC")); assert.ok(!middle.includes("future"));
  at(60); assert.ok(ui.terminal(props).includes("A🚀BC"));
  at(45); assert.equal(ui.terminal(props), middle);
});

test("terminal uses rounded shot-local timing at fractional beat positions", () => {
  const props = { lines: [{ at: 0.5, text: "landed" }] };
  // 128 BPM: global beat 2.5 rounds to 70, beat 2 rounds to 56.
  at(13, { bpm: 128, startBeat: 2 }); assert.ok(!ui.terminal(props).includes("landed"));
  at(14, { bpm: 128, startBeat: 2 }); assert.ok(ui.terminal(props).includes("landed"));
});

test("code panel preserves indentation, escapes tokens, and highlights newest revealed line", () => {
  const props = { file: "example.tsx", at: 1, over: 2, lines: ["first", [{text: "  <Shot>", color: "#D4FF3A"}], "last"] };
  at(29); assert.equal((ui.code(props).match(/border-left:3px solid #D4FF3A/g) ?? []).length, 0);
  at(60); const html = ui.code(props);
  assert.ok(html.includes("  &lt;Shot&gt;"));
  assert.equal((html.match(/border-left:3px solid #D4FF3A/g) ?? []).length, 1);
  assert.ok(html.includes('opacity:0;transform:translateX(24px)'));
  at(120); assert.ok(!ui.code(props).includes('opacity:0;transform:translateX(24px)'));
  at(60); assert.equal(ui.code(props), html);
});


test("counter reaches its exact target, formats decimals and is repeatable after reverse seeking", () => {
  const props = { value: 1234.5, from: -10, at: 0.5, over: 2, decimals: 1, prefix: "$", label: "Example" };
  at(14, { bpm: 128, startBeat: 2 }); const start = ui.counter(props);
  assert.match(start, /-10.0/);
  at(71, { bpm: 128, startBeat: 2 }); assert.match(ui.counter(props), /1,234.5/);
  at(14, { bpm: 128, startBeat: 2 }); assert.equal(ui.counter(props), start);
  assert.throws(() => ui.counter({ value: Infinity }), /finite/);
  assert.throws(() => ui.counter({ value: 1, decimals: -1 }), /decimals/);
  assert.throws(() => ui.counter({ value: 1, over: -1 }), /non-negative/);
});

test("bar charts keep a shared zero baseline for signed values and handle all-zero or empty data", () => {
  at(200);
  const html = ui.bars({ data: [{ label: "Loss", value: -20 }, { label: "Gain", value: 40 }], max: 40 });
  assert.match(html, /left:50%/);
  assert.match(html, /left:25%;width:25%/);
  assert.match(html, /left:50%;width:50%/);
  assert.doesNotMatch(ui.bars({ data: [{ label: "Zero", value: 0 }] }), /NaN|Infinity/);
  assert.doesNotMatch(ui.bars({ data: [] }), /NaN|Infinity/);
  assert.throws(() => ui.bars({ data: [{ label: "Too large", value: 60 }], max: 50 }), /cover every/);
  assert.throws(() => ui.bars({ data: [{ label: "Invalid", value: NaN }] }), /finite/);
});

test("captions use exact half-open beat intervals, preserve Unicode and reject overlapping cues", () => {
  const props = { cues: [{ at: 0.5, beats: 1, text: "Hello 🎬" }, { at: 1.5, beats: 1, text: "Next line" }] };
  at(13, { bpm: 128, startBeat: 2 }); assert.equal(ui.captions(props), "");
  at(15, { bpm: 128, startBeat: 2 }); const first = ui.captions(props); assert.match(first, /Hello 🎬/);
  at(42, { bpm: 128, startBeat: 2 }); assert.doesNotMatch(ui.captions(props), /Hello/);
  at(43, { bpm: 128, startBeat: 2 }); assert.match(ui.captions(props), /Next line/);
  at(71, { bpm: 128, startBeat: 2 }); assert.equal(ui.captions(props), "");
  at(15, { bpm: 128, startBeat: 2 }); assert.equal(ui.captions(props), first);
  assert.throws(() => ui.captions({ cues: [{ at: 0, beats: 2, text: "a" }, { at: 1, beats: 1, text: "b" }] }), /non-overlapping/);
});

test("lower thirds appear and clear on their scheduled beats; progress rings remain bounded", () => {
  const props = { title: "Alex", subtitle: "Developer", at: 1, beats: 2 };
  at(29); assert.equal(ui.lower(props), "");
  at(45); assert.match(ui.lower(props), /Alex/); const first = ui.lower(props);
  at(90); assert.equal(ui.lower(props), "");
  at(45); assert.equal(ui.lower(props), first);
  at(120); assert.match(ui.ring({ value: 1.5 }), /aria-valuenow="100"/);
  assert.match(ui.ring({ value: -1 }), /aria-valuenow="0"/);
  assert.throws(() => ui.ring({ value: 0.5, size: 20, strokeWidth: 30 }), /strokeWidth/);
});
