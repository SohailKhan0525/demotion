import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { build } from "esbuild";
import { bundle } from "@remotion/bundler";
import { openBrowser, selectComposition, renderMedia, renderStill } from "@remotion/renderer";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
const mode = process.argv[2] ?? "render";
if (!["audio", "qa", "render", "check"].includes(mode)) throw new Error("Usage: node scripts/launch-v2.mjs [audio|qa|render|check]");
const out = "out/launch-v2";
fs.mkdirSync(out, { recursive: true });
const compiled = await build({ entryPoints: ["src/launch-v2/timeline.ts"], bundle: true, platform: "node", format: "esm", write: false });
const { V2_SHOTS, V2_BEATS, v2Clock, v2Start, v2Soundtrack } = await import("data:text/javascript;base64," + Buffer.from(compiled.outputFiles[0].text).toString("base64"));
const seconds = v2Clock.seconds(V2_BEATS), frameCount = v2Clock.duration(V2_BEATS);
const video = `${out}/demotion-v2-launch.mp4`;
const probe = () => JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", video], { encoding: "utf8" }));
const check = () => {
  const metadata = probe();
  const picture = metadata.streams.find(s => s.codec_type === "video");
  const audio = metadata.streams.find(s => s.codec_type === "audio");
  if (picture?.codec_name !== "h264" || picture.width !== 1920 || picture.height !== 1080 || Number(picture.nb_frames) !== frameCount || picture.pix_fmt !== "yuv420p" || picture.color_range !== "tv" || picture.color_space !== "bt709" || picture.avg_frame_rate !== `${v2Clock.fps}/1`) throw new Error("Unexpected V2 picture format or frame count");
  if (audio?.codec_name !== "aac" || audio.channels !== 2 || Math.abs(Number(metadata.format.duration) - seconds) > 1 / v2Clock.fps) throw new Error("Unexpected V2 audio or duration");
  fs.writeFileSync(`${out}/metadata.json`, JSON.stringify(metadata, null, 2));
  console.log(`Verified: H.264/yuv420p + stereo AAC, 1920x1080, ${frameCount} frames, ${seconds}s`);
};
if (mode === "check") { check(); process.exit(0); }
const { renderSoundtrack, encodeWav } = await import("../dist/audio.js");
const track = renderSoundtrack(v2Soundtrack());
const wav = "public/launch-v2-soundtrack.wav";
fs.writeFileSync(wav, encodeWav(track));
console.log(`V2 audio: ${track.seconds}s including tail, ${track.lufs.toFixed(2)} LUFS (engine estimate)`);
if (mode === "audio") process.exit(0);

const serveUrl = await bundle({ entryPoint: "src/index.ts" });
const browserExecutable = process.env.DEMOTION_BROWSER || undefined;
const browser = await openBrowser("chrome", { browserExecutable });
try {
  const composition = await selectComposition({ serveUrl, id: "LaunchV2", puppeteerInstance: browser, inputProps: { muted: true } });
  if (mode === "qa") {
    const dir = `${out}/qa`;
    fs.mkdirSync(dir, { recursive: true });
    const frames = [...new Set([0, ...V2_SHOTS.flatMap(shot => {
      const start = v2Clock.frame(v2Start(shot.id)), end = v2Clock.frame(v2Start(shot.id) + shot.beats);
      return [Math.min(end - 1, start + 16), Math.round(start + (end - start) * 0.65), end - 5];
    }), frameCount - 1])].sort((a, b) => a - b);
    for (let i = 0; i < frames.length; i++) {
      await renderStill({ serveUrl, composition, puppeteerInstance: browser, frame: frames[i], scale: 0.5, inputProps: { muted: true }, imageFormat: "png", output: `${dir}/${String(i).padStart(3, "0")}.png` });
      console.log(`QA ${i + 1}/${frames.length}: frame ${frames[i]}`);
    }
    fs.writeFileSync(`${dir}/frames.json`, JSON.stringify(frames));
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", `${dir}/%03d.png`, "-vf", `scale=480:270,tile=4x${Math.ceil(frames.length / 4)}`, "-frames:v", "1", `${out}/contact-sheet.jpg`]);
    await renderStill({ serveUrl, composition, puppeteerInstance: browser, frame: 0, inputProps: { muted: true }, imageFormat: "png", output: `${out}/poster.png` });
    const cards = frames.map((frame, i) => `<figure><img src="${String(i).padStart(3, "0")}.png"><figcaption>${frame} / ${(frame / v2Clock.fps).toFixed(2)}s</figcaption></figure>`).join("");
    fs.writeFileSync(`${dir}/index.html`, `<!doctype html><meta charset="utf-8"><title>V2 QA</title><style>body{background:#0D0E12;color:#F2F0EA;font:16px monospace}main{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}img{width:100%}figure{margin:0}</style><h1>V2 whole-timeline QA</h1><main>${cards}</main>`);
  } else {
    const picture = `${out}/picture.mp4`;
    let lastPercent = -10;
    await renderMedia({ serveUrl, composition, puppeteerInstance: browser, inputProps: { muted: true }, codec: "h264", crf: 18, pixelFormat: "yuv420p", colorSpace: "bt709", outputLocation: picture, concurrency: Number(process.env.DEMOTION_CONCURRENCY || 2),
      onProgress: ({ progress }) => { const percent = Math.floor(progress * 100); if (percent >= lastPercent + 5) { console.log(`V2 render: ${percent}%`); lastPercent = percent; } },
    });
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", picture, "-i", wav, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-af", `atrim=duration=${seconds},afade=t=out:st=${seconds - 1.5}:d=1.5`, "-t", String(seconds), "-movflags", "+faststart", video]);
    fs.rmSync(picture);
    check();
    await renderStill({ serveUrl, composition, puppeteerInstance: browser, frame: 0, inputProps: { muted: true }, imageFormat: "png", output: `${out}/poster.png` });
  }
} finally { await browser.close({ silent: true }); }
