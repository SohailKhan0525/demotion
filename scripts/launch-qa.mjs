import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { openBrowser, selectComposition, renderStill } from "@remotion/renderer";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
const result = await build({ entryPoints: ["src/launch/timeline.ts"], bundle: true, platform: "node", format: "esm", write: false });
const { SHOTS, launchClock } = await import("data:text/javascript;base64," + Buffer.from(result.outputFiles[0].text).toString("base64"));
let beat = 0;
const shots = SHOTS.map((shot) => { const start = launchClock.frame(beat); beat += shot.beats; return { ...shot, start, end: launchClock.frame(beat) }; });
const frames = process.argv.slice(2).length ? process.argv.slice(2).map(Number) : [...new Set([
  0, ...shots.flatMap((s) => [s.start, Math.min(s.end - 1, s.start + 35), Math.min(s.end - 1, s.start + Math.round((s.end - s.start) * 0.75)), s.end - 7]), 1559,
])].sort((a, b) => a - b);
fs.mkdirSync("out/launch-qa", { recursive: true });
fs.writeFileSync("out/launch-qa/shots.json", JSON.stringify(shots, null, 2));
const serveUrl = await bundle({ entryPoint: "src/index.ts" });
const browser = await openBrowser("chrome", { browserExecutable: process.env.DEMOTION_BROWSER || "/usr/bin/chromium" });
try {
  const composition = await selectComposition({ serveUrl, id: "Launch", puppeteerInstance: browser });
  // Two workers keep software GL and temporal blur within the cloud CPU budget.
  let next = 0;
  await Promise.all(Array.from({ length: 2 }, async () => {
    while (next < frames.length) {
      const frame = frames[next++];
      await renderStill({ serveUrl, composition, puppeteerInstance: browser, frame, scale: 0.5, imageFormat: "png", output: `out/launch-qa/${String(frame).padStart(4, "0")}.png` });
      console.log(`Rendered QA frame ${frame}`);
    }
  }));
} finally { await browser.close({ silent: true }); }
// Self-contained local index: no remote assets or extra image-processing dependency.
const cards = frames.map((frame) => `<figure><img src="${String(frame).padStart(4, "0")}.png" alt="Launch frame ${frame}"><figcaption>frame ${frame} · ${(frame / launchClock.fps).toFixed(2)}s</figcaption></figure>`).join("\n");
fs.writeFileSync("out/launch-qa/index.html", `<!doctype html><meta charset="utf-8"><title>Launch QA</title><style>body{margin:24px;background:#0D0E12;color:#F2F0EA;font:16px monospace}main{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}figure{margin:0}img{display:block;width:100%}figcaption{padding:8px}</style><h1>Launch: rendered frame checks</h1><main>${cards}</main>`);
console.log("Wrote out/launch-qa/index.html");
