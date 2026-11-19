import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { checkPromoMedia } from "../promo-media.mjs";
import { CHAPTERS } from "./visuals.mjs";

const fps = 30;
const seconds = 24;
const frames = fps * seconds;
const frameAtBeat = beat => Math.round(beat * fps * 60 / 120);
const defaultFilm = fileURLToPath(new URL("../../out/canvas-film/demotion-canvas-launch.mp4", import.meta.url));
const film = path.resolve(process.argv[2] || defaultFilm);
const originalFile = fs.statSync(film);
const output = path.join(path.dirname(film), "qa");
fs.mkdirSync(output, { recursive: true });
const ffmpeg = ["-hide_banner", "-nostdin", "-v", "error", "-xerror", "-threads", "2", "-i", film];
const media = checkPromoMedia(film, { seconds, frames, fps });
const video = media.streams.find(stream => stream.codec_type === "video");
const audio = media.streams.find(stream => stream.codec_type === "audio");
if (video.color_primaries !== "bt709" || video.color_transfer !== "bt709") {
  throw new Error("Expected BT.709 primaries and transfer characteristics");
}

// Check the actual display timestamps as well as the declared frame rate.
const probe = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_frames",
  "-show_entries", "frame=best_effort_timestamp_time", "-of", "json", film], { encoding: "utf8" });
const timestamps = JSON.parse(probe).frames.map(frame => Number(frame.best_effort_timestamp_time));
if (timestamps.length !== frames || timestamps.some((pts, i) => !Number.isFinite(pts) || Math.abs(pts - i / fps) > 0.0001)) {
  throw new Error("Decoded timestamps differ from the expected 720-frame, 30 fps timeline");
}

const width = 160;
const height = 90;
const pixelsPerFrame = width * height;
const pixels = execFileSync("ffmpeg", [...ffmpeg, "-map", "0:v:0", "-an", "-vf", `scale=${width}:${height}:flags=area`,
  "-pix_fmt", "gray", "-fps_mode", "passthrough", "-f", "rawvideo", "-"], { maxBuffer: (frames + 1) * pixelsPerFrame });
if (pixels.length !== frames * pixelsPerFrame) throw new Error("Full video decode returned incomplete frames");

const perFrame = [];
for (let frame = 0; frame < frames; frame++) {
  let sum = 0, squareSum = 0, difference = 0;
  const offset = frame * pixelsPerFrame;
  for (let i = 0; i < pixelsPerFrame; i++) {
    const value = pixels[offset + i];
    sum += value;
    squareSum += value * value;
    if (frame > 0) difference += Math.abs(value - pixels[offset - pixelsPerFrame + i]);
  }
  const mean = sum / pixelsPerFrame;
  perFrame.push({ frame, mean, deviation: Math.sqrt(Math.max(0, squareSum / pixelsPerFrame - mean * mean)),
    difference: frame === 0 ? null : difference / pixelsPerFrame });
}
const ranges = indexes => {
  const result = [];
  for (const frame of indexes) {
    const previous = result.at(-1);
    if (previous && previous[1] + 1 === frame) previous[1] = frame;
    else result.push([frame, frame]);
  }
  return result;
};
const nearUniform = ranges(perFrame.filter(f => f.deviation < 2).map(f => f.frame));
// The difference is an average of absolute changes on the 0–255 luma scale.
// Static title cards can trigger this watchlist. Decide intent from the stills.
const nearStatic = ranges(perFrame.filter(f => f.difference !== null && f.difference < 0.20).map(f => f.frame))
  .map(([start, end]) => [start - 1, end]).filter(([start, end]) => end - start + 1 >= fps / 2);

const loudness = spawnSync("ffmpeg", ["-hide_banner", "-nostdin", "-nostats", "-xerror", "-i", film,
  "-map", "0:a:0", "-af", "loudnorm=print_format=json", "-f", "null", "-"], { encoding: "utf8" });
if (loudness.error) throw loudness.error;
if (loudness.status !== 0) throw new Error(loudness.stderr);
const loudnorm = JSON.parse(loudness.stderr.slice(loudness.stderr.lastIndexOf("{"), loudness.stderr.lastIndexOf("}") + 1));
const levels = { integratedLUFS: Number(loudnorm.input_i), truePeakDbTP: Number(loudnorm.input_tp), rangeLU: Number(loudnorm.input_lra) };
if (!Object.values(levels).every(Number.isFinite)) throw new Error("Encoded audio has no measurable loudness");

// One numbered sheet for every second. Put labels below the image to leave every pixel visible.
const sheetFilter = "scale=320:180:flags=lanczos,pad=320:200:0:0:color=0x222222,"
  + "drawtext=text='Frame %{n}':fontcolor=white:fontsize=15:x=8:y=182,tile=5x6";
execFileSync("ffmpeg", [...ffmpeg, "-map", "0:v:0", "-an", "-vf", sheetFilter, "-fps_mode", "passthrough",
  "-start_number", "0", "-q:v", "2", "-y", path.join(output, "second-%02d.jpg")]);

const cutCandidates = [];
for (const { frame } of perFrame.slice(1).sort((a, b) => b.difference - a.difference)) {
  if (cutCandidates.every(previous => Math.abs(frame - previous) >= 10)) cutCandidates.push(frame);
  if (cutCandidates.length === 8) break;
}
const chapterCuts = CHAPTERS.map(chapter => frameAtBeat(chapter.startBeat));
const keyFrames = new Set([0, frameAtBeat(3.2), frames - 1, ...Array.from({ length: seconds }, (_, i) => i * fps + 15)]);
for (const frame of chapterCuts) {
  keyFrames.add(frame);
  if (frame > 0) keyFrames.add(frame - 1);
}
for (const frame of cutCandidates) { keyFrames.add(frame - 1); keyFrames.add(frame); }
const selected = [...keyFrames].sort((a, b) => a - b);
const select = selected.map(frame => `eq(n\\,${frame})`).join("+");
execFileSync("ffmpeg", [...ffmpeg, "-map", "0:v:0", "-an", "-vf", `select=${select}`,
  "-fps_mode", "passthrough", "-enc_time_base", "1:30", "-frame_pts", "1", "-threads", "2",
  "-y", path.join(output, "frame-%03d.png")]);
const stillNames = new Set(selected.map(frame => `frame-${String(frame).padStart(3, "0")}.png`));
for (const name of stillNames) fs.accessSync(path.join(output, name));
for (let second = 0; second < seconds; second++) fs.accessSync(path.join(output, `second-${String(second).padStart(2, "0")}.jpg`));

const sha256 = createHash("sha256").update(fs.readFileSync(film)).digest("hex");
const checkedFile = fs.statSync(film);
if (["dev", "ino", "size", "mtimeMs"].some(key => originalFile[key] !== checkedFile[key])) {
  throw new Error("The film changed during verification. Run the check again on the completed export.");
}
// Different edits can move the strongest cuts. Retire stills from earlier
// checks only after the replacement images have been verified.
for (const name of fs.readdirSync(output)) {
  if (/^frame-\d{3}\.png$/.test(name) && !stillNames.has(name)) fs.unlinkSync(path.join(output, name));
}
const report = {
  film: path.basename(film), bytes: checkedFile.size, sha256,
  framesDecoded: timestamps.length, fps, seconds, faststart: true,
  video: { codec: video.codec_name, width: video.width, height: video.height, pixels: video.pix_fmt, range: video.color_range,
    matrix: video.color_space, transfer: video.color_transfer, primaries: video.color_primaries, duration: Number(video.duration) },
  audio: { codec: audio.codec_name, channels: audio.channels, sampleRate: Number(audio.sample_rate), duration: Number(audio.duration), ...levels },
  lumaSampleSize: [width, height], minDeviation: Math.min(...perFrame.map(frame => frame.deviation)), nearUniform, nearStatic,
  chapterCuts, strongestChanges: cutCandidates, numberedSheets: seconds, framesPerSheet: fps, fullSizeFrames: selected,
};
fs.writeFileSync(path.join(output, "per-frame.json"), JSON.stringify(perFrame, null, 2) + "\n");
fs.writeFileSync(path.join(output, "report.json"), JSON.stringify(report, null, 2) + "\n");
console.log(`Decoded ${frames} frames at ${fps} fps. Audio: ${levels.integratedLUFS} LUFS, ${levels.truePeakDbTP} dBTP. SHA-256: ${report.sha256}`);
console.log(`${nearUniform.length} near-uniform and ${nearStatic.length} near-static ranges. Review ${seconds} numbered sheets, ${selected.length} full-size stills, and report.json in ${output}.`);
