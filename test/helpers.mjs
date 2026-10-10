import { build } from "esbuild";

/** Bundle a TypeScript entry in memory and import it, so tests run against the real source. */
export const loadTs = async (entry) => {
  const out = await build({ entryPoints: [entry], bundle: true, format: "esm", platform: "node", write: false, external: ["react", "remotion", "@remotion/*"] });
  const code = out.outputFiles[0].text;
  return import("data:text/javascript;base64," + Buffer.from(code).toString("base64"));
};
