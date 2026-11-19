import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { SHOTS, launchClock } from "../src/launch/timeline";
import { V2_SHOTS, v2Clock } from "../src/launch-v2/timeline";
import { PROMO_SHOTS, promoClock } from "../src/promo/timeline";
import { UPDATE_SHOTS, updateClock } from "../src/update-film/timeline";

const films = [
  { id: "Launch", shots: SHOTS, clock: launchClock, notice: "license" },
  { id: "LaunchV2", shots: V2_SHOTS, clock: v2Clock, notice: "license" },
  { id: "PromoLaunch", shots: PROMO_SHOTS, clock: promoClock, notice: "close" },
  { id: "UpdateFilm", shots: UPDATE_SHOTS, clock: updateClock, notice: "close" },
];
const serveUrl = await bundle({ entryPoint: "src/index.ts" });
const chromiumOptions = { gl: "swangle" as const };
const browser = await openBrowser("chrome", { chromiumOptions, browserExecutable: process.env.DEMOTION_BROWSER });
const common = { serveUrl, puppeteerInstance: browser, inputProps: { muted: true }, chromiumOptions };
const scratch = mkdtempSync(join(tmpdir(), "demotion-preview-"));

try {
  for (const { id, shots, clock, notice } of films) {
    const composition = await selectComposition({ ...common, id });
    let beat = 0;
    const samples = shots.map(shot => {
      const first = clock.frame(beat);
      beat += shot.beats;
      const end = clock.frame(beat);
      // Read text after its entrance and before the following shot's wipe.
      return { shot: shot.id, frame: Math.min(end - 1, first + Math.floor((end - first) * 0.75)) };
    });
    const license = samples.find(sample => sample.shot === notice);
    if (!license || clock.frame(beat) !== composition.durationInFrames) throw new Error(`Check the ${id} shot list`);
    const frames = [{ shot: "first frame", frame: 0 }, ...samples, { shot: "last frame", frame: composition.durationInFrames - 1 }];
    const output = join("out", "film-previews", id);
    const thumbnails = join(scratch, id);
    mkdirSync(output, { recursive: true });
    mkdirSync(thumbnails);
    for (const [i, sample] of frames.entries()) {
      console.log(`${id} · ${sample.shot} · frame ${sample.frame}`);
      await renderStill({ ...common, composition, frame: sample.frame, scale: 0.25, imageFormat: "png",
        output: join(thumbnails, `${String(i).padStart(3, "0")}.png`) });
    }
    await renderStill({ ...common, composition, frame: license.frame, imageFormat: "png", output: join(output, "license.png") });
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", join(thumbnails, "%03d.png"),
      "-vf", `tile=4x${Math.ceil(frames.length / 4)}`, "-frames:v", "1", "-q:v", "2", join(output, "contact-sheet.jpg")]);
    writeFileSync(join(output, "frames.json"), JSON.stringify(frames, null, 2) + "\n");
  }
} finally {
  await browser.close({ silent: true });
  rmSync(scratch, { recursive: true, force: true });
}
