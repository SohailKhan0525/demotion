import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("README shows the actual generated starter and installs the current checkout", () => {
  const readme = fs.readFileSync("README.md", "utf8");
  const source = readme.match(/<!-- starter-example -->\s*```tsx\n([\s\S]*?)\n```/);
  assert.ok(source, "missing runnable starter example");
  assert.equal(source[1] + "\n", fs.readFileSync("template/src/MyVideo.tsx", "utf8"));
  assert.ok(readme.includes("TARBALL=$(npm pack --silent)"));
  assert.ok(readme.includes("node bin/demotion.js init ../my-video"));
  assert.ok(readme.includes('npm install "../demotion/$TARBALL"'));
  assert.ok(!readme.includes("media/demotion-launch.mp4"));
});
