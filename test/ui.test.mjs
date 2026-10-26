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
    export const terminal = (props) => renderToStaticMarkup(React.createElement(Terminal, props));
    export const code = (props) => renderToStaticMarkup(React.createElement(CodePanel, props));
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
