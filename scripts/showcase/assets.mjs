import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";

const directory = "public/showcase";
const hash = file => createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const assetUrl = "https://github.com/SohailKhan0525/demotion/releases/download/v0.4.0/demotion-canvas-launch.mp4";
const expectedHash = "6f6233c6a293f847ce7e155025550191486c5f7e65e7107709c7b3d00ddf758a";

export async function prepareAssets(common, workers, temporary) {
  fs.mkdirSync(directory, { recursive: true });
  const canvas = path.join(directory, "canvas-launch.mp4");
  if (!fs.existsSync(canvas) || hash(canvas) !== expectedHash) {
    const download = path.join(temporary, "canvas.mp4");
    execFileSync("curl", ["-fsSL", "--retry", "2", "--max-time", "150", assetUrl, "-o", download], { stdio: "inherit" });
    if (hash(download) !== expectedHash) throw new Error("Canvas release download failed its SHA-256 check");
    fs.renameSync(download, canvas);
  }
  // Render both independent examples using their original entry point, fps and clock.
  const examples = [
    { id: "MyVideo", entry: "template/src/index.ts", name: "starter", files: ["template/src/index.ts", "template/src/MyVideo.tsx", "template/src/Root.tsx"] },
    { id: "IllustrationStory", entry: "examples/illustration.tsx", name: "illustration", files: ["examples/illustration.tsx"] },
  ];
  const commonFiles = ["package-lock.json", "dist/index.js", ...fs.readdirSync("public/fonts").filter(f => f.endsWith(".woff2")).sort().map(f => path.join("public/fonts", f))];
  for (const example of examples) {
    const movie = path.join(directory, example.name + ".mp4");
    const proofPath = path.join("out/showcase", example.name + "-cache.json");
    const source = createHash("sha256").update([...commonFiles, ...example.files, "scripts/showcase/assets.mjs"].map(hash).join("")).digest("hex");
    const proof = fs.existsSync(proofPath) ? JSON.parse(fs.readFileSync(proofPath, "utf8")) : null;
    if (proof?.source === source && fs.existsSync(movie) && hash(movie) === proof.movie) continue;
    // These examples only use fonts. Omit the already prepared movies from their bundles.
    const fontAssets = path.join(temporary, "example-public");
    if (!fs.existsSync(fontAssets)) {
      fs.mkdirSync(fontAssets);
      fs.cpSync("public/fonts", path.join(fontAssets, "fonts"), { recursive: true });
    }
    const serveUrl = await bundle({ entryPoint: example.entry, rootDir: process.cwd(), publicDir: fontAssets,
      webpackOverride: config => ({ ...config, resolve: { ...config.resolve, alias: { ...config.resolve?.alias, "@demotion/cli$": path.resolve("dist/index.js") } } }),
    });
    const composition = await selectComposition({ ...common, serveUrl, id: example.id });
    const rendered = path.join(temporary, example.name + ".mp4");
    console.log(`Rendering source example ${example.id} (${composition.durationInFrames} frames)`);
    await renderMedia({ ...common, serveUrl, composition, codec: "h264", crf: 16, jpegQuality: 95, muted: true,
      concurrency: workers, colorSpace: "bt709", outputLocation: rendered });
    fs.renameSync(rendered, movie);
    fs.writeFileSync(proofPath, JSON.stringify({ source, movie: hash(movie) }) + "\n");
  }
}
