import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { encodeWav, renderSoundtrack } from "../../dist/audio.js";
import { createBeatClock } from "../../dist/index.js";
import { checkPromoMedia } from "../promo-media.mjs";
import { CHAPTERS, drawFilmFrame } from "./visuals.mjs";

const width = 1920, height = 1080;
const clock = createBeatClock({ bpm: 120, fps: 30 });
const beats = 48;
const frameCount = clock.duration(beats);
const root = fileURLToPath(new URL("../../", import.meta.url));
const output = join(root, "out", "canvas-film");
const posterFrame = clock.frame(3.2);
const args = process.argv.slice(2);
if (args.length > 1 || (args.length === 1 && args[0] !== "--stills")) {
  throw new Error("Usage: node scripts/canvas-film/render.mjs [--stills]");
}

for (const [filename, family] of [["ArchivoVariable.woff2", "Archivo"], ["JetBrainsMonoVariable.woff2", "JetBrains Mono"]]) {
  if (!GlobalFonts.registerFromPath(join(root, "public/fonts", filename), family)) {
    throw new Error(`Could not register the bundled ${family} font`);
  }
}
const editor = readFileSync(join(root, "examples/canvas-launch.html"), "utf8");
const script = editor.match(/<script id="title-card-renderer">([\s\S]*?)<\/script>/);
if (!script) throw new Error("The example is missing its title-card-renderer script");
const drawTitleCard = runInNewContext(script[1] + "\ndrawTitleCard;", {}, { filename: "canvas-launch.html" });
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");
const draw = frame => {
  ctx.save();
  drawFilmFrame(ctx, frame, { drawTitleCard });
  ctx.restore();
};

function writeScore(path) {
  const track = renderSoundtrack({
    bpm: clock.bpm, beats, seed: 228, targetLUFS: -15, tail: 0, fadeOut: 1.5,
    music: {
      // The same motif thins under the edit, then gains percussion during playback.
      pad: false, level: 0.82,
      chords: [
        { bass: 38, notes: [50, 57, 64, 65] }, { bass: 41, notes: [53, 60, 64, 67] },
        { bass: 36, notes: [52, 55, 60, 62] }, { bass: 43, notes: [50, 57, 62, 65] },
      ],
      arp: [[1, 7], [11, 15], [16, 21], [22, 35], [38, 42]],
      bass: [[4, 7], [12, 16], [16, 35], [37, 42]],
      kick: [[4, 8], [16, 35], [36, 41]], hat: [[20, 35]], clap: [[24, 35]],
    },
    cues: [
      { at: 0, kind: "hit", gain: 0.48 }, { at: 0.35, kind: "chime", gain: 0.55 },
      { at: 8, kind: "pop", gain: 0.75 }, { at: 9.8, kind: "click", gain: 0.45 },
      { at: 10.5, kind: "typing", dur: 2.16, steps: 8, gain: 0.6 },
      { at: 16, kind: "whoosh", gain: 0.3 }, { at: 17.3, kind: "click", gain: 0.6 }, { at: 19, kind: "click", gain: 0.72 },
      { at: 21, kind: "click", gain: 0.8 }, { at: 24, kind: "hit", gain: 0.45 },
      { at: 30, kind: "swell", dur: 4, gain: 0.3 },
      { at: 36, kind: "pop", gain: 0.65 }, { at: 37, kind: "click", gain: 0.8 }, { at: 37.5, kind: "shimmer", dur: 2, gain: 0.55 },
      { at: 42, kind: "hit", gain: 0.35 }, { at: 42, kind: "chime", gain: 0.75 },
    ],
  });
  // A short rest before Save gives the next click space after the densest phrase.
  const down = Math.round(clock.seconds(35.25) * track.sampleRate);
  const up = Math.round(clock.seconds(36) * track.sampleRate);
  const release = Math.round(0.09 * track.sampleRate), attack = Math.round(0.004 * track.sampleRate);
  for (const channel of [track.left, track.right]) {
    for (let i = down; i < up; i++) channel[i] *= Math.max(0, 1 - (i - down) / release);
    for (let i = 0; i < attack; i++) channel[up + i] *= i / attack;
  }
  writeFileSync(path, encodeWav(track));
}

mkdirSync(output, { recursive: true });
if (args[0] === "--stills") {
  const dir = join(output, "stills");
  mkdirSync(dir, { recursive: true });
  const samples = new Set([0, posterFrame, ...CHAPTERS.map(c => clock.frame((c.startBeat + c.endBeat) / 2)), frameCount - 1]);
  for (const frame of [...samples].sort((a, b) => a - b)) {
    draw(frame);
    writeFileSync(join(dir, `${String(frame).padStart(4, "0")}.png`), canvas.toBuffer("image/png"));
  }
  console.log(`Wrote ${samples.size} full-size stills to ${dir}`);
} else {
  const temp = mkdtempSync(join(output, ".render-"));
  const filename = "demotion-canvas-launch.mp4";
  const video = join(temp, filename), wav = join(temp, "score.wav");
  try {
    writeScore(wav);
    const encoder = spawn("ffmpeg", [
      "-hide_banner", "-loglevel", "warning", "-y",
      "-f", "rawvideo", "-pixel_format", "rgba", "-video_size", `${width}x${height}`,
      "-framerate", String(clock.fps), "-i", "pipe:0", "-i", wav,
      "-map", "0:v:0", "-map", "1:a:0", "-c:v", "libx264", "-threads", "2", "-preset", "fast",
      "-b:v", "6M", "-minrate", "6M", "-maxrate", "6M", "-bufsize", "3M", "-x264-params", "nal-hrd=cbr:force-cfr=1",
      "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,setparams=range=limited:color_primaries=bt709:color_trc=bt709:colorspace=bt709",
      "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
      "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", "-movflags", "+faststart", video,
    ], { stdio: ["pipe", "ignore", "inherit"] });
    const complete = new Promise((resolve, reject) => {
      encoder.once("error", reject);
      encoder.once("close", (code, signal) => code === 0 ? resolve() : reject(new Error(`FFmpeg stopped (${signal ?? code})`)));
    });
    function* frames() {
      for (let frame = 0; frame < frameCount; frame++) {
        draw(frame);
        if (frame === posterFrame) writeFileSync(join(temp, "poster.png"), canvas.toBuffer("image/png"));
        if (frame % clock.duration(8) === 0) console.log(`Rendering frame ${frame + 1}/${frameCount}`);
        yield canvas.data();
      }
    }
    try {
      await Promise.all([pipeline(Readable.from(frames(), { objectMode: false, highWaterMark: 1 }), encoder.stdin), complete]);
    } finally {
      if (encoder.exitCode === null && encoder.signalCode === null) encoder.kill();
      await Promise.allSettled([complete]);
    }
    checkPromoMedia(video, { seconds: clock.seconds(beats), frames: frameCount, fps: clock.fps });
    renameSync(join(temp, "poster.png"), join(output, "poster.png"));
    renameSync(video, join(output, filename));
    console.log(`Wrote ${output}/${filename} and poster.png`);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}
