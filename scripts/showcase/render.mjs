import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { openBrowser, selectComposition, renderMedia, renderStill } from "@remotion/renderer";
import { prepareAssets } from "./assets.mjs";
import { writeScore } from "./score.mjs";
import { clock, marks, seconds, frames } from "./timeline.mjs";
import { checkPromoMedia } from "../promo-media.mjs";

process.chdir(fileURLToPath(new URL("../../", import.meta.url)));
const mode = process.argv[2] || "--render";
if (process.argv.length > 3 || !["--prepare", "--render", "--stills"].includes(mode)) throw new Error("Usage: node scripts/showcase/render.mjs [--prepare|--stills]");
const out = path.resolve("out/showcase");
fs.mkdirSync(out, { recursive: true });
const temp = fs.mkdtempSync(path.join(out, ".showcase-"));
const config = { chromiumOptions: { gl: "swangle" }, browserExecutable: process.env.DEMOTION_BROWSER || null };
const concurrency = Number(process.env.DEMOTION_CONCURRENCY || 2), workers = Number(process.env.DEMOTION_WORKERS || 2);
if (![concurrency, workers].every(n => Number.isInteger(n) && n >= 1 && n <= 8)) throw new Error("DEMOTION_CONCURRENCY and DEMOTION_WORKERS must be integers between 1 and 8");
const digest = data => createHash("sha256").update(data).digest("hex");
const fileHash = file => digest(fs.readFileSync(file));
const score = path.resolve("public/showcase/score.wav");

try {
  const browser = await openBrowser("chrome", config);
  try {
    await prepareAssets({ ...config, puppeteerInstance: browser }, concurrency, temp);
    writeScore(score);
  } finally { await browser.close({ silent: true }); }
  if (mode !== "--prepare") await exportFilm();
} finally { fs.rmSync(temp, { recursive: true, force: true }); }

async function exportFilm() {
  const serveUrl = await bundle({ entryPoint: "src/index.ts" });
  const base = { ...config, serveUrl, inputProps: { muted: true }, offthreadVideoThreads: 1 };
  const sourceFiles = [...fs.readdirSync(serveUrl).filter(f => f.endsWith(".js")).sort().map(f => path.join(serveUrl, f)),
    ...fs.readdirSync("public/showcase").filter(f => f.endsWith(".mp4")).sort().map(f => path.join("public/showcase", f)),
    ...fs.readdirSync("public/fonts").filter(f => f.endsWith(".woff2")).sort().map(f => path.join("public/fonts", f)),
    "scripts/showcase/render.mjs", "package-lock.json"];
  const fingerprint = digest(sourceFiles.map(fileHash).join(""));
  const cache = path.join(out, "segments", fingerprint);
  fs.mkdirSync(cache, { recursive: true });
  const preview = path.join(out, "stills");
  if (mode === "--stills") fs.mkdirSync(preview, { recursive: true });
  let next = 0;
  async function work(worker) {
    const browser = await openBrowser("chrome", config);
    try {
      const common = { ...base, puppeteerInstance: browser };
      const composition = await selectComposition({ ...common, id: "Showcase" });
      if (composition.durationInFrames !== frames || composition.fps !== clock.fps) throw new Error("Showcase registration differs from the edit");
      if (worker === 0) {
        await renderStill({ ...common, composition, frame: clock.frame(2.75), imageFormat: "png", output: path.join(temp, "poster.png") });
      }
      while (next < marks.length) {
        const chapter = marks[next++];
        if (mode === "--stills") {
          await renderStill({ ...common, composition, frame: Math.floor((chapter.startFrame + chapter.endFrame) / 2), imageFormat: "png", output: path.join(preview, chapter.id + ".png") });
          continue;
        }
        const segment = path.join(cache, chapter.id + ".mp4");
        if (fs.existsSync(segment)) continue;
        console.log(`Rendering ${chapter.title} (frames ${chapter.startFrame}–${chapter.endFrame - 1})`);
        const tmp = path.join(temp, chapter.id + ".mp4");
        const started = Date.now();
        await renderMedia({ ...common, composition, frameRange: [chapter.startFrame, chapter.endFrame - 1],
          muted: true, concurrency, codec: "h264", crf: 18, jpegQuality: 93, pixelFormat: "yuv420p", colorSpace: "bt709", outputLocation: tmp });
        fs.renameSync(tmp, segment);
        console.log(`Completed ${chapter.id} in ${Math.round((Date.now() - started) / 1000)}s`);
      }
    } finally { await browser.close({ silent: true }); }
  }
  const jobs = await Promise.allSettled(Array.from({ length: Math.min(workers, marks.length) }, (_, i) => work(i)));
  for (const job of jobs) if (job.status === "rejected") throw job.reason;
  if (mode === "--render") {
    const list = path.join(cache, "order.txt");
    fs.writeFileSync(list, marks.map(m => `file '${m.id}.mp4'`).join("\n") + "\n");
    const metadata = [";FFMETADATA1", "title=Demotion: The source reel",
      ...marks.flatMap(m => ["[CHAPTER]", `TIMEBASE=1/${clock.fps}`, `START=${m.startFrame}`, `END=${m.endFrame}`, `title=${m.title.replace(/[\\;=#]/g, "\\$&")}`])];
    const chaptersFile = path.join(temp, "chapters.ffmeta");
    fs.writeFileSync(chaptersFile, metadata.join("\n") + "\n");
    const film = "demotion-showcase.mp4";
    execFileSync("ffmpeg", ["-v", "error", "-nostdin", "-y", "-f", "concat", "-safe", "1", "-i", list, "-i", score,
      "-f", "ffmetadata", "-i", chaptersFile, "-map", "0:v:0", "-map", "1:a:0", "-map_metadata", "2", "-map_chapters", "2",
      "-c:v", "copy", "-bsf:v", "h264_metadata=video_full_range_flag=0:colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1",
      "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-af", "volume=-0.7dB", "-movflags", "+faststart", path.join(temp, film)], { stdio: "inherit" });
    checkPromoMedia(path.join(temp, film), { seconds, frames, fps: clock.fps });
    fs.renameSync(path.join(temp, film), path.join(out, film));
  }
  fs.renameSync(path.join(temp, "poster.png"), path.join(out, "poster.png"));
  fs.writeFileSync(path.join(out, "chapters.json"), JSON.stringify(marks, null, 2) + "\n");
}
