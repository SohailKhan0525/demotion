#!/usr/bin/env node
// demotion CLI — create a video project, an offline demo or a soundtrack.
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
  npx ${pkg.name} demo [file.html] copy the editable, offline Canvas launch demo
  npx ${pkg.name} --help           show this help
  npx ${pkg.name} audio <cues.json> [out.wav]
                                render a beat-synced soundtrack (music + sound effects)
  npx ${pkg.name} license          print the Demotion license
  npx ${pkg.name} --version        print the version

Demotion uses the MIT License. Remotion and the bundled fonts have their own terms.
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

const [cmd, ...args] = process.argv.slice(2);

if (!cmd || cmd === "--help" || cmd === "-h") {
  console.log(HELP);
} else if (cmd === "--version" || cmd === "-v") {
  console.log(pkg.version);
} else if (cmd === "demo") {
  const usage = `Usage: npx ${pkg.name} demo [file.html]
Copies the offline title editor. The default filename is canvas-launch.html.`;
  if (args.length === 1 && ["--help", "-h"].includes(args[0])) {
    console.log(usage);
    process.exit(0);
  }
  const files = args[0] === "--" ? args.slice(1) : args;
  if (files.length > 1 || files[0] === "" || (args[0] !== "--" && files[0]?.startsWith("-"))) {
    console.error(usage);
    process.exit(1);
  }
  const target = files[0] ?? "canvas-launch.html";
  try {
    fs.copyFileSync(path.join(pkgRoot, "examples", "canvas-launch.html"), target, fs.constants.COPYFILE_EXCL);
  } catch (error) {
    console.error(error.code === "EEXIST" ? `${target} already exists. Choose a new filename.` : error.message);
    process.exit(1);
  }
  console.log(`Created ${target}. Open it in a browser to edit, play or save a frame.`);
} else if (cmd === "audio") {
  const specPath = args[0];
  const outPath = args[1] || "public/soundtrack.wav";
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
  console.log(fs.readFileSync(path.join(pkgRoot, "LICENSE"), "utf8").trimEnd());
  console.log("\nFor bundled font notices and dependency terms, see THIRD_PARTY_NOTICES.md.");
} else if (cmd === "init") {
  const usage = `Usage: npx ${pkg.name} init <folder>
Quote a folder name containing spaces, for example: npx ${pkg.name} init "My Video"`;
  if (args.length === 1 && ["--help", "-h"].includes(args[0])) {
    console.log(usage);
    process.exit(0);
  }
  const folders = args[0] === "--" ? args.slice(1) : args;
  if (folders.length !== 1 || !folders[0]) {
    console.error(usage);
    process.exit(1);
  }
  const [arg] = folders;
  const target = path.resolve(process.cwd(), arg);
  if (fs.existsSync(target) && (!fs.statSync(target).isDirectory() || fs.readdirSync(target).length > 0)) {
    console.error(`${arg} already exists and is not an empty directory.`);
    process.exit(1);
  }
  // The directory may contain spaces, Unicode or punctuation; npm names cannot.
  const normalizedName = path.basename(target).toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[._-]+|[._-]+$/g, "")
    .slice(0, 214);
  const name = !normalizedName || ["node_modules", "favicon.ico"].includes(normalizedName)
    ? "my-video"
    : normalizedName;
  copyDir(path.join(pkgRoot, "template"), target, {
    __NAME__: name,
    __DEMOTION_VERSION__: pkg.version,
    __REMOTION_VERSION__: pkg.config.remotionVersion,
  });
  fs.cpSync(path.join(pkgRoot, "public", "fonts"), path.join(target, "public", "fonts"), { recursive: true });
  fs.copyFileSync(path.join(pkgRoot, "LICENSE"), path.join(target, "DEMOTION-LICENSE.txt"));
  console.log(`✔ Created ${arg}/`);
  console.log("✔ Copied fonts to public/fonts");
  // Quote paths for the shell instructions, including leading dashes and apostrophes.
  const shellPath = arg.startsWith("-") ? target : arg;
  const cdPath = /^[a-zA-Z0-9_./-]+$/.test(shellPath)
    ? shellPath
    : "'" + shellPath.replaceAll("'", "'\\''") + "'";
  console.log(`Next: cd ${cdPath} && npm install && npm start`);
  console.log("");
  console.log("Starter code: MIT License (DEMOTION-LICENSE.txt).");
} else {
  console.error(`Unknown command: ${cmd}\n`);
  console.log(HELP);
  process.exit(1);
}
