import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("README shows the actual generated starter source and published CLI name", () => {
  const readme = fs.readFileSync("README.md", "utf8");
  const source = readme.match(/<!-- starter-example -->\s*```tsx\n([\s\S]*?)\n```/);
  assert.ok(source, "missing runnable starter example");
  assert.equal(source[1] + "\n", fs.readFileSync("template/src/MyVideo.tsx", "utf8"));
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  assert.ok(readme.includes(`npx --yes ${pkg.name}@latest init my-video`));
  assert.ok(!readme.includes("media/demotion-launch.mp4"));
});
