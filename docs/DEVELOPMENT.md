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
npm install /absolute/path/to/demotion/out/demotion-cli-0.2.0.tgz
npm run render -- --browser-executable=/usr/bin/chromium --concurrency=2
```

Tarball names follow the package version. After publishing, verify the documented
npx command and npm install in a fresh directory outside the source checkout.
Check types, a complete starter video, audio output and optional 3D dependency
installation. Never substitute a source-tree import for a registry consumer test.


## Verified 0.2.0 checks — 2026-10-30

The public npm registry serves @demotion/cli@0.2.0 as latest, published by
qofeno-labs with provenance disabled and no attestation. Its gitHead equals the
v0.2.0 tag: 361560ded0cbb9721b2df333d2da317c5beb7cd4. Both the
[Release run](https://github.com/SohailKhan0525/demotion/actions/runs/41098657398)
and [source CI](https://github.com/SohailKhan0525/demotion/actions/runs/41098657273)
passed. Installation, lint, build and all 51 tests also passed locally.

A new project outside the source checkout used `npx --yes @demotion/cli@latest`
and ordinary registry installation. Its folder `Published Story` produced the
valid package name `published-story` and dependency `@demotion/cli: ^0.2.0`.
All five new component exports loaded from the installed package. The exact
packaged DataStory example and Root registration from docs/components.md passed
TypeScript and rendered a complete H.264 video: 450 frames, 1920×1080, 60 fps,
7.5 seconds. A whole-timeline contact sheet and full-resolution data/caption
frames were inspected. The README audio example also ran through the installed
CLI, producing a 5.5-second, 48 kHz, stereo PCM WAV.

This verification used the published registry package, not the local candidate
tarball. The older 4K, Studio and optional 3D checks below describe the initial
release and were not repeated for 0.2.0.

## Verified 0.1.0 checks

At the initial release, the public registry identified @demotion/cli@0.1.0 with
latest=0.1.0, publisher qofeno-labs and no provenance attestation. Its v0.1.0
source tag matches npm's
gitHead. A clean project outside the checkout used the normal npx command,
installed from registry.npmjs.org, passed TypeScript checking and rendered a
1920×1080 video: 150 frames at 30fps, 5 seconds. The same release candidate also
completed the full 3840×2160 starter render and an optional 3D still. The README's
cue example generated a valid 5.5-second WAV. CI checks 30 tests on Node 22/24.


## Second launch film and new components

`LaunchV2` is the second film, not an npm major version. `npm run dev` prepares
both soundtracks. The film runs for 64 beats at 128 BPM / 60 fps: 1800 frames,
30 seconds. Its chart uses timeline values and explicitly labeled sample progress.

```bash
npm run qa:v2
npm run render:v2
npm run check:v2
```

Set `DEMOTION_BROWSER=/usr/bin/chromium` and `DEMOTION_CONCURRENCY=2` in containers
with that browser installed. The scripts write `out/launch-v2`; all generated
media remains ignored. The final MP4 uses the original synthesized WAV, encoded
once to AAC with a 1.5-second end fade, and faststart for web playback. QA creates
a whole-timeline contact sheet and a full-resolution opening poster.

[Component documentation](components.md) describes the five components published
in npm 0.2.0 and the complete `examples/data-story.tsx`. The npm Release workflow remains
separate from the Launch video workflow. The latter checks out the immutable
`launch-v2` film tag, renders its source and attaches MP4/poster/checksums to a
GitHub prerelease; it does not publish npm packages. The film and posts distinguish
source-preview APIs from the original published npm 0.1.0 package.

[Launch research and posts](launch-v2/research.md) include the exact research
sources and blocked live-rule checks. No social post is sent automatically.

Verification at the LaunchV2 film release: installation, lint, build and all
40 tests passed.
The packed candidate installs in a clean external starter, passes TypeScript,
and renders the documented 450-frame / 7.5-second DataStory at 1920×1080 / 60 fps.
Its settled data and caption frames were inspected. All X posts are valid under
280 weighted characters; Bluesky drafts are 242 and 214 graphemes, and the
Mastodon draft is 415 characters (instance limits still need checking).

## Reference-directed promo film

`PromoLaunch` is a separate 56-second composition at 120 BPM / 60 fps. The source
is in `src/promo`; npm run dev generates its original score as well as the older
soundtracks. `npm run qa:promo`, `npm run render:promo`, and `npm run check:promo`
produce and validate the film under ignored `out/promo`. See the
[promo guide](promo/README.md) for the storyboard, executable example, delivery
workflow and verification. The uploaded reference is not redistributed.
