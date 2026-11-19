import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { checkPromoMedia } from "../promo-media.mjs";
import { clock, frames, marks, seconds } from "./timeline.mjs";

const film = path.resolve(process.argv[2] || "out/showcase/demotion-showcase.mp4");
const dest = path.join(path.dirname(film), "qa");
const original = fs.statSync(film);
const metadata = checkPromoMedia(film, { seconds, frames, fps: clock.fps });
const picture = metadata.streams.find(s => s.codec_type === "video"), audio = metadata.streams.find(s => s.codec_type === "audio");
if (picture.color_primaries !== "bt709" || picture.color_transfer !== "bt709") throw new Error("Expected BT.709 primaries and transfer");
const chapters = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_chapters", "-of", "json", film])).chapters;
if (chapters.length !== marks.length || marks.some((m, i) => chapters[i].tags?.title !== m.title ||
  Math.abs(Number(chapters[i].start_time) - m.startSeconds) > .002 || Math.abs(Number(chapters[i].end_time) - m.endSeconds) > .002)) {
  throw new Error("Embedded MP4 chapters differ from the authored timeline");
}
const times = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_frames", "-show_entries", "frame=best_effort_timestamp_time",
  "-of", "json", film], { maxBuffer: 4 * 1024 * 1024 })).frames;
if (times.length !== frames || times.some((t, i) => !Number.isFinite(Number(t.best_effort_timestamp_time)) || Math.abs(Number(t.best_effort_timestamp_time) - i / clock.fps) > .0001)) {
  throw new Error("Video timestamps do not match the frame clock");
}
const input = ["-v", "error", "-nostdin", "-xerror", "-threads", "2", "-i", film];
const width = 96, height = 54, count = width * height;
const pixels = execFileSync("ffmpeg", [...input, "-an", "-vf", `scale=${width}:${height}:flags=area`, "-pix_fmt", "gray", "-fps_mode", "passthrough", "-f", "rawvideo", "-"], { maxBuffer: (frames + 1) * count });
if (pixels.length !== frames * count) throw new Error("Incomplete picture decode");
const perFrame = [];
for (let frame = 0; frame < frames; frame++) {
  let sum = 0, square = 0, delta = 0;
  for (let n = frame * count, end = n + count; n < end; n++) {
    const value = pixels[n];
    sum += value; square += value * value;
    if (frame) delta += Math.abs(value - pixels[n - count]);
  }
  const mean = sum / count;
  perFrame.push({ frame, mean, deviation: Math.sqrt(Math.max(0, square / count - mean * mean)), difference: frame ? delta / count : null });
}
const levels = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-nostdin", "-xerror", "-i", film, "-map", "0:a:0", "-af", "loudnorm=print_format=json", "-f", "null", "-"], { encoding: "utf8" });
if (levels.error || levels.status !== 0) throw levels.error || new Error(levels.stderr);
const measure = JSON.parse(levels.stderr.slice(levels.stderr.lastIndexOf("{"), levels.stderr.lastIndexOf("}") + 1));
const loudness = { integratedLUFS: Number(measure.input_i), truePeakDbTP: Number(measure.input_tp), loudnessRange: Number(measure.input_lra) };
if (!Object.values(loudness).every(Number.isFinite) || loudness.truePeakDbTP >= 0) throw new Error("Check encoded soundtrack levels");
fs.mkdirSync(dest, { recursive: true });
const filter = `scale=240:135:flags=lanczos,pad=240:156:0:0:color=0x222222,drawtext=text='Frame %{n}':fontcolor=white:fontsize=14:x=8:y=138,tile=10x${clock.fps / 10}`;
execFileSync("ffmpeg", [...input, "-an", "-vf", filter, "-fps_mode", "passthrough", "-start_number", "0", "-q:v", "3", "-y", path.join(dest, "second-%03d.jpg")]);
for (let s = 0; s < seconds; s++) fs.accessSync(path.join(dest, `second-${String(s).padStart(3, "0")}.jpg`));
const representativeFrames = marks.map(m => Math.round((m.startFrame + m.endFrame) / 2));
const selection = representativeFrames.map(n => `eq(n\\,${n})`).join("+");
execFileSync("ffmpeg", [...input, "-an", "-vf", `select='${selection}',scale=480:270,tile=4x${Math.ceil(marks.length/4)}`, "-frames:v", "1", "-q:v", "2", "-y", path.join(dest, "chapters.jpg")]);
const sha256 = createHash("sha256").update(fs.readFileSync(film)).digest("hex");
const latest = fs.statSync(film);
if (original.ino !== latest.ino || original.size !== latest.size || original.mtimeMs !== latest.mtimeMs) throw new Error("Film changed during review");
const report = { film: path.basename(film), bytes: latest.size, sha256, seconds, fps: clock.fps, framesDecoded: frames,
  faststart: true, video: { codec: picture.codec_name, width: picture.width, height: picture.height, format: picture.pix_fmt, colorSpace: picture.color_space },
  audio: { codec: audio.codec_name, sampleRate: Number(audio.sample_rate), channels: audio.channels, ...loudness },
  chapters: marks, representativeFrames, numberedSheets: seconds, framesPerSheet: clock.fps,
  nearUniformFrames: perFrame.filter(f => f.deviation < 2).map(f => f.frame), lumaSampleSize: [width,height] };
fs.writeFileSync(path.join(dest, "per-frame.json"), JSON.stringify(perFrame) + "\n");
fs.writeFileSync(path.join(dest, "report.json"), JSON.stringify(report, null, 2) + "\n");
console.log(`Verified ${frames} frames, ${marks.length} embedded chapters, ${seconds}s, ${loudness.integratedLUFS} LUFS. SHA-256 ${sha256}`);
