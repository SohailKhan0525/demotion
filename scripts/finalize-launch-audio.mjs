import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { build } from "esbuild";

// Remux from the original WAV: the renderer's AAC path can introduce priming delay.
// Keep the rendered picture byte-for-byte; encode audio once from the source.
const root = fileURLToPath(new URL("../", import.meta.url));
const target = path.resolve(process.argv[2] ?? "out/demotion-launch.mp4");
const result = await build({ entryPoints: [root + "src/launch/timeline.ts"], bundle: true, platform: "node", format: "esm", write: false });
const { launchClock, LAUNCH_BEATS } = await import("data:text/javascript;base64," + Buffer.from(result.outputFiles[0].text).toString("base64"));
const seconds = launchClock.seconds(LAUNCH_BEATS);
const pictureDuration = Number(execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=duration", "-of", "csv=p=0", target], { encoding: "utf8" }).trim());
if (!Number.isFinite(pictureDuration) || Math.abs(pictureDuration - seconds) > 1 / launchClock.fps) {
  throw new Error("Audio finalization requires the full Launch film; use Remotion directly for partial renders");
}
const temp = fs.mkdtempSync(path.join(path.dirname(target), ".launch-audio-"));
try {
  const output = path.join(temp, "final.mp4");
  execFileSync("ffmpeg", ["-v", "error", "-i", target, "-i", root + "public/launch-soundtrack.wav",
    "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
    "-af", `atrim=duration=${seconds},afade=t=out:st=${seconds - 1.4}:d=1.4`,
    "-t", String(seconds), "-movflags", "+faststart", output], { stdio: "inherit" });
  fs.renameSync(output, target);
  console.log(`Finalized ${target}: source WAV, ${seconds}s, 1.4s end fade, picture stream copied`);
} finally { fs.rmSync(temp, { recursive: true, force: true }); }
