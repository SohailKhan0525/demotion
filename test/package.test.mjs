import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

test("the package carries the MIT grant and bundled third-party notices", () => {
  const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
  assert.equal(pkg.license, "MIT");
  assert.equal(lock.packages[""].license, pkg.license);
  const license = fs.readFileSync("LICENSE", "utf8");
  assert.match(license, /MIT License/);
  assert.match(license, /Copyright \(c\) 2026 Qofeno Labs/);
  assert.match(license, /Permission is hereby granted/);
  const notices = fs.readFileSync("THIRD_PARTY_NOTICES.md", "utf8");
  assert.match(notices, /Copyright \(c\) Magic UI/);
  assert.match(notices, /SIL Open Font License/);
  assert.ok(pkg.files.includes("THIRD_PARTY_NOTICES.md"));
  assert.ok(!fs.existsSync("COMMERCIAL-LICENSE.md"));
});

test("Ko-fi funding is wired everywhere", () => {
  assert.equal(pkg.funding.url, "https://ko-fi.com/qofenoai");
  assert.match(fs.readFileSync(".github/FUNDING.yml", "utf8"), /ko_fi: qofenoai/);
  assert.match(fs.readFileSync("README.md", "utf8"), /ko-fi\.com\/qofenoai/);
});

test("published files exist", () => {
  for (const f of pkg.files) assert.ok(fs.existsSync(f), `${f} is listed in package.json files but missing`);
});

test("every bundled font has its license text", () => {
  const fonts = fs.readdirSync("public/fonts").filter((f) => f.endsWith(".woff2"));
  assert.ok(fonts.length >= 5);
  assert.ok(fs.readdirSync("public/fonts/licenses").length >= 4);
});

test("CLI prints version and mentions the license", () => {
  const v = execFileSync("node", ["bin/demotion.js", "--version"]).toString().trim();
  assert.equal(v, pkg.version);
  const help = execFileSync("node", ["bin/demotion.js", "--help"]).toString();
  assert.match(help, /MIT License/);
  const output = execFileSync("node", ["bin/demotion.js", "license"], { encoding: "utf8" });
  assert.ok(output.includes(fs.readFileSync("LICENSE", "utf8").trim()));
});

test("Remotion runtime and development packages stay on the same exact version as the CLI", () => {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
  const version = pkg.config.remotionVersion;
  assert.equal(pkg.devDependencies.remotion, version);
  for (const section of ["dependencies", "devDependencies"]) {
    for (const [name, value] of Object.entries(pkg[section] ?? {})) {
      if (!name.startsWith("@remotion/")) continue;
      assert.equal(value, version, name);
      assert.equal(lock.packages[""][section][name], value, `lock metadata: ${name}`);
      assert.equal(lock.packages[`node_modules/${name}`].version, version, `locked package: ${name}`);
    }
  }
});
