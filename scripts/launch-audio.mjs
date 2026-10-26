import fs from "node:fs";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";

// Always resolve from this script, so invocation from another directory is safe.
const root = fileURLToPath(new URL("../", import.meta.url));
const result = await build({ entryPoints: [root + "src/launch/timeline.ts"], bundle: true, platform: "node", format: "esm", write: false });
const { launchSpec } = await import("data:text/javascript;base64," + Buffer.from(result.outputFiles[0].text).toString("base64"));
const { renderSoundtrack, encodeWav } = await import("../dist/audio.js");
const track = renderSoundtrack(launchSpec());
fs.writeFileSync(root + "public/launch-soundtrack.wav", encodeWav(track));
console.log(`launch-soundtrack.wav: ${track.seconds}s, ${track.lufs.toFixed(2)} LUFS, ${(20 * Math.log10(track.peak)).toFixed(2)} dBFS sample peak`);
