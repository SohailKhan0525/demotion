// Builds dist/ : two ESM bundles (webpack-safe, no extensionless imports) + .d.ts files.
import { build } from "esbuild";
import { execSync } from "node:child_process";
import fs from "node:fs";

fs.rmSync("dist", { recursive: true, force: true });
const common = {
  bundle: true,
  format: "esm",
  jsx: "automatic",
  target: "es2020",
  sourcemap: false,
  logLevel: "info",
};
await build({
  ...common,
  entryPoints: ["src/lib.ts"],
  outfile: "dist/index.js",
  external: ["react", "react-dom", "react/jsx-runtime", "remotion", "@remotion/*"],
});
await build({
  ...common,
  entryPoints: ["src/lib-three.ts"],
  outfile: "dist/three.js",
  external: ["react", "react-dom", "react/jsx-runtime", "remotion", "@remotion/*", "three", "@react-three/*", "postprocessing"],
});
await build({
  ...common,
  platform: "node",
  entryPoints: ["src/lib-audio.ts"],
  outfile: "dist/audio.js",
});
execSync("npx tsc -p tsconfig.build.json", { stdio: "inherit" });
console.log("built dist/index.js, dist/three.js, dist/audio.js and dist/types/");
