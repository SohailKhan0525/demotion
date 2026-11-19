import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { openBrowser } from "@remotion/renderer";

// Use the same browser adapter as the film QA, pointed at the actual offline file.
const browser = await openBrowser("chrome", { browserExecutable: process.env.DEMOTION_BROWSER });
const downloads = await mkdtemp(join(tmpdir(), "demotion-canvas-download-"));
async function waitForDownload(name) {
  const file = join(downloads, name);
  const deadline = Date.now() + 20000;
  while (!await stat(file).catch(() => null)) {
    if (Date.now() > deadline) throw new Error(`Did not receive ${name}`);
    await delay(50);
  }
  return file;
}
try {
  const page = await browser.newPage({
    context: () => null, logLevel: "error", indent: false, pageIndex: 0, onBrowserLog: null, onLog: () => {},
  });
  await page.goto({ url: new URL("../examples/canvas-launch.html", import.meta.url).href, timeout: 15000 });
  await page.bringToFront();
  await browser.connection.send("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: downloads });

  const result = await page.evaluate(async () => {
    const canvas = document.querySelector("#screen");
    const play = document.querySelector("#play");
    const position = document.querySelector("#position");
    const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
    function change(id, value, event) {
      const control = document.getElementById(id);
      control.value = value;
      control.dispatchEvent(new Event(event, { bubbles: true }));
    }
    const initial = canvas.toDataURL();
    change("title", "Daybreak", "input");
    const titleChanged = initial !== canvas.toDataURL();
    change("tempo", "96", "change");
    change("position", "8.5", "input");
    const expected = canvas.toDataURL();
    const time = document.querySelector("#time").textContent;
    change("position", "2", "input");
    play.click();
    await nextFrame();
    await nextFrame();
    play.click();
    const pausedAt = Number(position.value);
    await nextFrame();
    const paused = play.textContent === "Play" && Number(position.value) === pausedAt;
    change("position", "8.5", "input");
    document.querySelector("#save").click();
    return { titleChanged, time, pausedAt, paused, sameFrame: expected === canvas.toDataURL(), expected };
  });
  assert.ok(result.titleChanged, "changing Title should change the rendered frame");
  assert.equal(result.time, "5.3 / 7.5 s");
  assert.ok(result.pausedAt > 2 && result.paused, "Play should advance and Pause should hold the playhead");
  assert.ok(result.sameFrame, "seeking back should reproduce the same pixels");
  const file = await waitForDownload("demotion-launch-frame.png");
  const png = await readFile(file);
  assert.equal(png.readUInt32BE(16), 960);
  assert.equal(png.readUInt32BE(20), 540);
  assert.equal(png.toString("base64"), result.expected.split(",")[1], "download must equal the displayed frame");
  const exportState = await page.evaluate(() => {
    const button = document.querySelector("#export-clip");
    if (button.disabled) throw new Error("Chrome did not offer clip export");
    button.click();
    button.click();
    const canceled = document.querySelector("#export-status").textContent === "Export canceled.";
    button.click(); // Snapshot Daybreak at 96 BPM.
    const title = document.querySelector("#title"), tempo = document.querySelector("#tempo");
    title.value = "Edited live";
    title.dispatchEvent(new Event("input"));
    tempo.value = "150";
    tempo.dispatchEvent(new Event("change"));
    return { canceled, at: document.querySelector("#position").value };
  });
  assert.ok(exportState.canceled);
  assert.equal(Number(exportState.at), 8.5);
  await page.evaluate(async () => {
    const link = document.querySelector("#clip-download");
    const deadline = performance.now() + 15000;
    while (link.hidden) {
      if (performance.now() >= deadline) throw new Error(document.querySelector("#export-status").textContent);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (link.download !== "demotion-title.webm") throw new Error("unexpected clip filename");
  });
  // Some browser profiles require a fresh click for a second download on the same page.
  if (!await stat(join(downloads, "demotion-title.webm")).catch(() => null)) {
    await page.evaluate(() => document.querySelector("#clip-download").click());
  }
  const video = await waitForDownload("demotion-title.webm");
  // MediaRecorder can omit WebM container duration. Inspect the actual packet timeline.
  const probe = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_packets", "-show_streams",
    "-show_entries", "packet=pts_time:stream=codec_type,codec_name,width,height", "-of", "json", video]));
  assert.equal(probe.streams.length, 1, "expected a single silent video stream");
  const [stream] = probe.streams;
  assert.equal(stream.codec_type, "video");
  assert.match(stream.codec_name, /^vp[89]$/);
  assert.deepEqual([stream.width, stream.height], [960, 540]);
  const times = probe.packets.map(packet => Number(packet.pts_time));
  const seconds = Math.max(...times) - Math.min(...times);
  assert.ok(Math.abs(seconds - 7.5) < .55, `expected 12 beats at 96 BPM, got ${seconds} seconds`);
  execFileSync("ffmpeg", ["-v", "error", "-xerror", "-i", video, "-f", "null", "-"]);
  // The final card holds its title still while the motif turns. Compare just
  // the lettering against the browser PNG to check the user's title survived encoding.
  function titlePixels(input, seek = []) {
    return execFileSync("ffmpeg", ["-v", "error", "-i", input, ...seek, "-frames:v", "1", "-vf",
      "crop=446:110:42:229,scale=112:28,format=gray", "-f", "rawvideo", "pipe:1"]);
  }
  const reference = titlePixels(file), recorded = titlePixels(video, ["-ss", "6.5"]);
  assert.equal(recorded.length, reference.length);
  let union = 0, intersection = 0;
  for (let i = 0; i < recorded.length; i++) {
    const a = reference[i] > 100, b = recorded[i] > 100;
    if (a || b) union++;
    if (a && b) intersection++;
  }
  assert.ok(union > 100 && intersection / union > .88, "the decoded clip should show the edited title");
  assert.equal(await page.evaluate(() => document.querySelector("#position").value), "8.5");
  console.log("Chrome verified editor controls, exact PNG download and a full, decodable custom WebM.");
} finally {
  await browser.close({ silent: true });
  await rm(downloads, { recursive: true, force: true });
}
