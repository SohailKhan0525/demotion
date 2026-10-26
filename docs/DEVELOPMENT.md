# Development

Use the existing checkout. Node 22.14+ is required; CI checks Node 22 and 24.

```bash
npm ci
npm run dev
npm run lint && npm run build && npm test
```

The source checkout's `dev` task builds the toolkit and generates the launch
soundtrack before starting Remotion Studio. Studio offers Launch (the original
52-beat film), Lab (motion/type studies) and UI (terminal/code panels).

For a container with an installed Chromium browser:

```bash
DEMOTION_BROWSER=/usr/bin/chromium DEMOTION_CONCURRENCY=2 npm run dev
DEMOTION_BROWSER=/usr/bin/chromium DEMOTION_CONCURRENCY=2 npm run render
```

Source rendering and audio finalization require FFmpeg/ffprobe. `npm run render`
builds the package, generates the soundtrack, renders the Launch composition and
remuxes the original WAV with the picture. The remux preserves picture encoding
and avoids the AAC transport offset found during initial QA. `npm run render:4k`
requests twice the source dimensions. For partial renders, invoke Remotion
directly; the audio finalizer requires the full 26-second Launch composition.

```bash
npm run qa:launch
node scripts/check-launch-media.mjs out/demotion-launch.mp4
```

The QA script creates stills and an HTML index under out/launch-qa. Open them and
inspect the whole sequence and transitions; passing numeric checks alone does
not establish visual quality. The media checker verifies the expected full
1080p Launch dimensions/frame count and reports image statistics.

## Layout

- src/core, engine, type, ui: beat timing, scene engine, typography, UI panels.
- src/audio: deterministic sound synthesis and mastering.
- src/three: optional 3D exports.
- src/components, v2, transitions: retained public component API.
- src/launch and lab: development compositions, not prebuilt media.
- bin and template: the published CLI and generated starter.
- test: source, CLI, packaging and content checks.

The old Python soundtrack implementation and its unused timeline files were
removed. The active soundtrack engine is TypeScript. Do not remove exported
legacy components merely because their styles differ; that changes the public API.

## Validate an npm package candidate

```bash
npm run build
npm pack --pack-destination out
node bin/demotion.js init /tmp/demotion-candidate
```

In the generated project, install the actual tarball before its registry release:

```bash
npm install /absolute/path/to/demotion/out/demotion-cli-0.1.0.tgz
npm run render -- --browser-executable=/usr/bin/chromium --concurrency=2
```

Tarball names follow the package version. After publishing, verify the documented
npx command and npm install in a fresh directory outside the source checkout.
Check types, a complete starter video, audio output and optional 3D dependency
installation. Never substitute a source-tree import for a registry consumer test.
