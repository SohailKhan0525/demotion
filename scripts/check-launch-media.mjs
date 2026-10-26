import fs from "node:fs";
import { execFileSync } from "node:child_process";

const file = process.argv[2] ?? "out/demotion-launch.mp4";
const probe = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-count_frames", "-show_streams", "-show_format", "-of", "json", file], { encoding: "utf8" }));
const video = probe.streams.find((s) => s.codec_type === "video");
const audio = probe.streams.find((s) => s.codec_type === "audio");
if (!video || !audio) throw new Error("The launch needs both video and audio streams");
const count = Number(video.nb_read_frames);
if (count !== 1560 || video.width !== 1920 || video.height !== 1080 || video.r_frame_rate !== "60/1") throw new Error("Unexpected picture dimensions, frame count or frame rate");
if (video.codec_name !== "h264" || video.pix_fmt !== "yuv420p" || video.color_space !== "bt709") throw new Error("Unexpected delivery encoding");
const pixels = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-vf", "scale=80:45", "-pix_fmt", "gray", "-f", "rawvideo", "-an", "-"], { maxBuffer: 16 * 1024 * 1024 });
const size = 80 * 45;
if (pixels.length !== count * size) throw new Error("Decoded picture count differs from ffprobe");
const deviation = (frame) => {
  let sum = 0;
  for (let i = 0; i < size; i++) sum += pixels[frame * size + i];
  const mean = sum / size;
  let variance = 0;
  for (let i = 0; i < size; i++) variance += (pixels[frame * size + i] - mean) ** 2;
  return Math.sqrt(variance / size);
};
if (deviation(0) < 10 || deviation(count - 1) < 10) throw new Error("Opening or final frame appears blank");
const energy = [];
for (let f = 1; f < count; f++) {
  let sum = 0;
  for (let i = 0; i < size; i++) sum += Math.abs(pixels[f * size + i] - pixels[(f - 1) * size + i]);
  energy.push(sum / size);
}
const result = { file, frames: count, duration: Number(probe.format.duration), width: video.width, height: video.height,
  fps: video.r_frame_rate, codec: video.codec_name, pixelFormat: video.pix_fmt, colorSpace: video.color_space,
  audioCodec: audio.codec_name, firstFrameDeviation: deviation(0), lastFrameDeviation: deviation(count - 1),
  meanFrameDifference: energy.reduce((a, b) => a + b, 0) / energy.length,
  note: "Frame difference is descriptive, not a motion-quality or beat-sync certificate. Cut/cue timing is checked by tests; inspect transitions visually." };
fs.writeFileSync("out/launch-media-check.json", JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
