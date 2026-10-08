import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

test("license is PolyForm Noncommercial and the files agree", () => {
  assert.equal(pkg.license, "PolyForm-Noncommercial-1.0.0");
  const lic = fs.readFileSync("LICENSE", "utf8");
  assert.match(lic, /Required Notice: Copyright/);
  assert.match(lic, /PolyForm Noncommercial License 1\.0\.0/);
  assert.match(fs.readFileSync("COMMERCIAL-LICENSE.md", "utf8"), /ko-fi\.com\/qofenoai/);
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
  assert.ok(fonts.length >= 3);
  assert.ok(fs.readdirSync("public/fonts/licenses").length >= 3);
});

test("CLI prints version and mentions the license", () => {
  const v = execFileSync("node", ["bin/demotion.js", "--version"]).toString().trim();
  assert.equal(v, pkg.version);
  const help = execFileSync("node", ["bin/demotion.js", "--help"]).toString();
  assert.match(help, /ko-fi\.com\/qofenoai/);
  assert.match(help, /commercial/i);
});
