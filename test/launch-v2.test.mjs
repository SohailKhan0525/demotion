import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { build } from "esbuild";
import { loadTs } from "./helpers.mjs";

const timeline = await loadTs("src/launch-v2/timeline.ts");

test("V2 picture cuts and soundtrack impacts share the 30-second clock", () => {
  const { V2_SHOTS, V2_BEATS, v2Clock, v2Start, v2Soundtrack } = timeline;
  assert.equal(V2_BEATS, 64);
  assert.equal(v2Clock.duration(V2_BEATS), 1800);
  assert.equal(v2Clock.seconds(V2_BEATS), 30);
  const spec = v2Soundtrack();
  assert.equal(spec.bpm, v2Clock.bpm);
  for (const shot of V2_SHOTS) assert.ok(spec.cues.some(cue => cue.kind === "hit" && cue.at === v2Start(shot.id)), `Missing impact for ${shot.id}`);
  assert.equal(V2_SHOTS.at(-1).beats, 8, "CTA holds for 3.75 seconds");
});

test("V2 advertises exported APIs and its code snippet compiles against the built package", async () => {
  const api = await import("../dist/index.js");
  for (const name of timeline.V2_API_NAMES) assert.equal(typeof api[name], "function", `${name} missing from public package`);
  const [imports, ...body] = timeline.V2_CODE;
  await build({ stdin: { contents: `${imports}\nexport const Example = () => (<>\n${body.filter(line => !line.trimStart().startsWith("//")).join("\n")}\n</>);`, loader: "tsx", resolveDir: process.cwd() }, bundle: true, platform: "browser", write: false, logLevel: "silent" });
  assert.equal(timeline.V2_INSTALL, `npx --yes ${JSON.parse(fs.readFileSync("package.json")).name}@latest init my-video`);
});

test("the complete documented data-story example bundles against the public entrypoint", async () => {
  await build({ entryPoints: ["examples/data-story.tsx"], bundle: true, platform: "browser", write: false, logLevel: "silent" });
  const docs = fs.readFileSync("docs/components.md", "utf8");
  assert.ok(docs.includes("examples/data-story.tsx"));
  for (const name of timeline.V2_API_NAMES) assert.ok(docs.includes(name));
});


test("the DEV tutorial contains the exact example and a compilable registration", async () => {
  const article = fs.readFileSync("docs/launch-v2/devto.md", "utf8");
  const example = fs.readFileSync("examples/data-story.tsx", "utf8").trimEnd();
  const snippets = [...article.matchAll(/```tsx\n([\s\S]*?)\n```/g)].map(match => match[1]);
  assert.equal(snippets[0], example);
  await build({ stdin: { contents: snippets[1].replace('"./DataStory"', '"./examples/data-story"'), loader: "tsx", resolveDir: process.cwd() }, bundle: true, platform: "browser", write: false, logLevel: "silent" });
  assert.match(article, /published: false/);
  assert.match(article, /not in the\s+published/);
});
