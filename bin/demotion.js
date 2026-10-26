#!/usr/bin/env node
// demotion CLI — `npx ${pkg.name} init my-video`
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(pkgRoot, "package.json"), "utf8"));

const HELP = `demotion ${pkg.version}
Motion graphics, written in code.

Usage:
  npx ${pkg.name} init <folder>    create a new video project in <folder>
  npx ${pkg.name} --help           show this help
  npx ${pkg.name} audio <cues.json> [out.wav]
                                render a beat-synced soundtrack (music + sound effects)
  npx ${pkg.name} license          explain the license (free vs commercial)
  npx ${pkg.name} --version        print the version

License: free for personal / non-commercial use. Companies, teams and any
commercial use need a commercial license: https://ko-fi.com/qofenoai
Support Demotion: https://ko-fi.com/qofenoai
`;

const copyDir = (from, to, vars) => {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name.replace(/^_dot_/, "."));
    if (entry.isDirectory()) copyDir(src, dst, vars);
    else {
      let text = fs.readFileSync(src);
      if (/\.(json|ts|tsx|md|gitignore)$/.test(entry.name) || entry.name.startsWith("_dot_")) {
        let s = text.toString("utf8");
        for (const [k, v] of Object.entries(vars)) s = s.split(k).join(v);
        text = Buffer.from(s);
      }
      fs.writeFileSync(dst, text);
    }
  }
};

const [cmd, arg] = process.argv.slice(2);

if (!cmd || cmd === "--help" || cmd === "-h") {
  console.log(HELP);
} else if (cmd === "--version" || cmd === "-v") {
  console.log(pkg.version);
} else if (cmd === "audio") {
  const specPath = arg;
  const outPath = process.argv[4] || "public/soundtrack.wav";
  if (!specPath || !fs.existsSync(specPath)) {
    console.error(`Usage: npx ${pkg.name} audio <cues.json> [out.wav]`);
    process.exit(1);
  }
  const { renderSoundtrack, encodeWav } = await import("../dist/audio.js");
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const t0 = Date.now();
  const s = renderSoundtrack(spec);
  fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
  fs.writeFileSync(outPath, encodeWav(s));
  console.log(`✔ ${outPath}  ${s.seconds.toFixed(1)}s  ${s.lufs.toFixed(1)} LUFS  peak ${(20 * Math.log10(s.peak)).toFixed(1)} dBFS  (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
} else if (cmd === "license") {
  console.log(`Demotion is licensed under the PolyForm Noncommercial License 1.0.0.

  Free ........ personal projects, hobby, research, education, charities, schools, governments
  Commercial .. companies, teams, freelancers and any paid or product-promoting work

Commercial licenses (Solo / Team / Company): https://ko-fi.com/qofenoai
Full terms: LICENSE and COMMERCIAL-LICENSE.md in the package.
Demotion is built on Remotion, which has its own license: https://www.remotion.dev/docs/terms`);
} else if (cmd === "init") {
  if (!arg) {
    console.error(`Please give a folder name:  npx ${pkg.name} init my-video`);
    process.exit(1);
  }
  const target = path.resolve(process.cwd(), arg);
  if (fs.existsSync(target) && fs.readdirSync(target).length > 0) {
    console.error(`${arg} already exists and is not empty.`);
    process.exit(1);
  }
  const name = path.basename(target);
  copyDir(path.join(pkgRoot, "template"), target, {
    __NAME__: name,
    __DEMOTION_VERSION__: pkg.version,
    __REMOTION_VERSION__: pkg.config.remotionVersion,
  });
  fs.cpSync(path.join(pkgRoot, "public", "fonts"), path.join(target, "public", "fonts"), { recursive: true });
  console.log(`✔ Created ${arg}/`);
  console.log("✔ Copied fonts to public/fonts");
  console.log(`Next: cd ${arg} && npm install && npm start`);
  console.log("");
  console.log("Demotion is free for personal & non-commercial use. Business use needs a commercial license.");
  console.log("Get one or support the project: https://ko-fi.com/qofenoai");
} else {
  console.error(`Unknown command: ${cmd}\n`);
  console.log(HELP);
  process.exit(1);
}
