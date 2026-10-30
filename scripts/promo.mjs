import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { build } from "esbuild";
import { bundle } from "@remotion/bundler";
import { openBrowser, selectComposition, renderMedia, renderStill } from "@remotion/renderer";
import { checkPromoMedia } from "./promo-media.mjs";
import { splitFrames } from "./promo-ranges.mjs";

process.chdir(fileURLToPath(new URL("../", import.meta.url)));
const mode = process.argv[2] ?? "render";
if (!["audio", "qa", "render", "check"].includes(mode)) throw new Error("Usage: node scripts/promo.mjs [audio|qa|render|check]");
const out = "out/promo";
fs.mkdirSync(out, { recursive: true });
const compiled = await build({ entryPoints: ["src/promo/timeline.ts"], bundle: true, platform: "node", format: "esm", write: false });
const { PROMO_SHOTS, PROMO_BEATS, promoClock, promoStart, promoSoundtrack } = await import("data:text/javascript;base64," + Buffer.from(compiled.outputFiles[0].text).toString("base64"));
const seconds = promoClock.seconds(PROMO_BEATS), frames = promoClock.duration(PROMO_BEATS);
const video = `${out}/demotion-promo-launch.mp4`;
const check = () => {
  const metadata = checkPromoMedia(video, { seconds, frames, fps: promoClock.fps });
  fs.writeFileSync(`${out}/metadata.json`, JSON.stringify(metadata, null, 2));
  console.log(`Verified: H.264 / BT.709 / limited yuv420p, stereo AAC, faststart, ${frames} frames / ${seconds}s`);
};
if (mode === "check") { check(); process.exit(0); }
const { renderSoundtrack, encodeWav } = await import("../dist/audio.js");
const track = renderSoundtrack(promoSoundtrack());
const wav = "public/promo-soundtrack.wav";
fs.writeFileSync(wav, encodeWav(track));
console.log(`Original promo score: ${track.seconds}s with tail, ${track.lufs.toFixed(2)} LUFS (engine estimate)`);
if (mode === "audio") process.exit(0);

const serveUrl = await bundle({ entryPoint: "src/index.ts" });
const browser = await openBrowser("chrome", { browserExecutable: process.env.DEMOTION_BROWSER || undefined });
try {
  const inputProps = { muted: true };
  const composition = await selectComposition({ serveUrl, id: "PromoLaunch", puppeteerInstance: browser, inputProps });
  const common = { serveUrl, composition, puppeteerInstance: browser, inputProps };
  if (mode === "qa") {
    const dir = `${out}/qa`;
    fs.mkdirSync(dir, { recursive: true });
    const samples = [...new Set([0, ...PROMO_SHOTS.flatMap(s => {
      const start = promoClock.frame(promoStart(s.id)), end = promoClock.frame(promoStart(s.id) + s.beats);
      return [start + 16, Math.round(start + (end - start) * 0.6), end - 12];
    }), frames - 1])].sort((a, b) => a - b);
    for (let i = 0; i < samples.length; i++) {
      await renderStill({ ...common, frame: samples[i], scale: 0.5, imageFormat: "png", output: `${dir}/${String(i).padStart(3, "0")}.png` });
      console.log(`Promo QA ${i + 1}/${samples.length}: frame ${samples[i]}`);
    }
    fs.writeFileSync(`${dir}/frames.json`, JSON.stringify(samples));
    const figures = samples.map((f, i) => `<figure><img src="${String(i).padStart(3, "0")}.png"><figcaption>Frame ${f} · ${(f / promoClock.fps).toFixed(2)}s</figcaption></figure>`).join("");
    fs.writeFileSync(`${dir}/index.html`, `<!doctype html><meta charset="utf-8"><title>Demotion promo QA</title><style>body{background:#F2F0EA;color:#0D0E12;font:16px sans-serif}main{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}figure{margin:0}img{width:100%}</style><h1>Whole-timeline review</h1><main>${figures}</main>`);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", `${dir}/%03d.png`, "-vf", `scale=480:270,tile=4x${Math.ceil(samples.length / 4)}`, "-frames:v", "1", `${out}/contact-sheet.jpg`]);
  } else {
    const picture = `${out}/picture.mp4`;
    const ranges = splitFrames(frames, Number(process.env.DEMOTION_WORKERS || 2));
    const progressByWorker = ranges.map(() => 0);
    let last = -2;
    // Independent browsers avoid a single software GPU compositor becoming the bottleneck.
    // Each range is rendered at its original global frames, then joined without re-encoding.
    const results = await Promise.allSettled(ranges.map(async (frameRange, index) => {
      const worker = await openBrowser("chrome", { browserExecutable: process.env.DEMOTION_BROWSER || undefined });
      try {
        console.log(`Worker ${index + 1}: frames ${frameRange[0]}–${frameRange[1]}`);
        await renderMedia({ ...common, puppeteerInstance: worker, frameRange, codec: "h264", crf: 18, pixelFormat: "yuv420p", colorSpace: "bt709", outputLocation: `${out}/part-${index}.mp4`, concurrency: Number(process.env.DEMOTION_CONCURRENCY || 1),
          onProgress: ({ progress }) => {
            progressByWorker[index] = progress;
            const n = Math.floor(progressByWorker.reduce((sum, p, i) => sum + p * (ranges[i][1] - ranges[i][0] + 1), 0) / frames * 100);
            if (n >= last + 2) { console.log(`Promo render: ${n}%`); last = n; }
          },
        });
      } finally { await worker.close({ silent: true }); }
    }));
    for (const result of results) if (result.status === "rejected") throw result.reason;
    const partsList = `${out}/parts.txt`;
    fs.writeFileSync(partsList, ranges.map((_, i) => `file 'part-${i}.mp4'\n`).join(""));
    execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "1", "-i", partsList, "-c", "copy", picture]);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", picture, "-i", wav, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-af", `atrim=duration=${seconds},afade=t=out:st=${seconds - 2}:d=2`, "-t", String(seconds), "-movflags", "+faststart", video]);
    check();
    fs.rmSync(picture);
    for (let i = 0; i < ranges.length; i++) fs.rmSync(`${out}/part-${i}.mp4`);
    fs.rmSync(partsList);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", video, "-vf", "fps=1,scale=384:216,tile=7x8", "-frames:v", "1", `${out}/encoded-contact-sheet.jpg`]);
  }
  await renderStill({ ...common, frame: 120, imageFormat: "png", output: `${out}/poster.png` });
  if (mode === "render") {
    const assets = ["demotion-promo-launch.mp4", "poster.png"];
    fs.writeFileSync(`${out}/SHA256SUMS`, assets.map(f => `${createHash("sha256").update(fs.readFileSync(`${out}/${f}`)).digest("hex")}  ${f}\n`).join(""));
  }
} finally { await browser.close({ silent: true }); }
