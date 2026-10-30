import test from "node:test";
import assert from "node:assert/strict";
import { releaseWithGuard, expectedReleaseVersion } from "../scripts/release.mjs";

test("release checks the candidate version before making a publish call", async () => {
  const calls = [];
  const result = await releaseWithGuard(async options => { calls.push(options.dryRun); return { nextRelease: { version: "0.2.0" } }; }, "0.2.0");
  assert.deepEqual(calls, [true, false]);
  assert.equal(result.nextRelease.version, "0.2.0");
});

test("wrong-version and empty dry runs never call the publisher", async () => {
  for (const preview of [false, { nextRelease: { version: "0.3.0" } }]) {
    const calls = [];
    await assert.rejects(releaseWithGuard(async options => { calls.push(options.dryRun); return preview; }, "0.2.0"), /nothing published/);
    assert.deepEqual(calls, [true]);
  }
});

test("a skipped publication cannot be reported as a successful release", async () => {
  await assert.rejects(releaseWithGuard(async options => options.dryRun ? { nextRelease: { version: "0.2.0" } } : false, "0.2.0"), /did not match/);
});

test("push releases require a version request; manual releases accept an optional version", () => {
  assert.equal(expectedReleaseVersion("push", "0.9.0", { version: "0.2.0" }), "0.2.0");
  assert.throws(() => expectedReleaseVersion("push", "", undefined), /must specify/);
  assert.throws(() => expectedReleaseVersion("push", "", { version: "latest" }), /Invalid/);
  assert.equal(expectedReleaseVersion("workflow_dispatch", "0.2.0-beta.1"), "0.2.0-beta.1");
  assert.equal(expectedReleaseVersion("workflow_dispatch", ""), undefined);
});
