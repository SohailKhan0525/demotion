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
  // Both public entries must use the same React context instance. Bundling a
  // second ShotContext here silently loses a consumer's beat clock and theme.
  plugins: [{
    name: "shared-shot-context",
    setup(builder) {
      builder.onResolve({ filter: /(?:^|\/)engine\/context$/ }, () => ({ path: "./index.js", external: true }));
    },
  }],
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
