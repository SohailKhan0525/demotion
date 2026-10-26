# demotion

**Motion graphics, written in code.** A React toolkit and CLI for making polished videos on your own computer — beat-synced motion, camera, type, transitions and sound — rendered locally with [Remotion](https://www.remotion.dev). No screen recordings. No screenshots. Every frame is code.

> **Status: unpublished.** npm has blocked the requested unscoped name `demotion` as too similar to existing packages. The source works, but `npx demotion` is not yet available. See [publishing steps](https://github.com/SohailKhan0525/demotion/blob/main/docs/PUBLISHING.md).

[Download the 1080p launch video (MP4, 26 MB)](https://github.com/SohailKhan0525/demotion/raw/refs/heads/main/media/demotion-launch.mp4) · [Rendered QA](https://github.com/SohailKhan0525/demotion/blob/main/docs/qa/launch.md)

## Run from source (pre-release)

Node 22.14 or newer a Chromium browser, and FFmpeg (including ffprobe) are required. The package has not been
released to npm; use the checkout today:

```bash
git clone https://github.com/SohailKhan0525/demotion.git
cd demotion
npm ci
npm run dev          # builds the toolkit, generates audio, opens Studio
```

Select **Launch** for the original 26-second, 1080p60 product film, **Lab** for
motion/type studies, or **UI** for the terminal and code-panel study.

```bash
npm run lint && npm run build && npm test
npm run render       # out/demotion-launch.mp4, H.264 / CRF 18
npm run render:4k    # out/demotion-launch-4k.mp4 (expensive)
npm run qa:launch    # shot, cut and transition stills in out/launch-qa/
```

In a container, use the supported browser and concurrency overrides:

```bash
DEMOTION_BROWSER=/usr/bin/chromium DEMOTION_CONCURRENCY=2 npm run dev
DEMOTION_BROWSER=/usr/bin/chromium DEMOTION_CONCURRENCY=2 npm run render
```

`npm run render` regenerates the soundtrack before rendering and remuxes the
original WAV afterward to preserve cue synchronization. The three.js shot
uses real depth of field and can be slow on software graphics. No recording or
remote rendering service is required. The 3D preview and progress panels are
labeled workflow illustrations; the code and scaffold output come from this repo.

To try the actual starter before the npm release, build a local package and
install that tarball into the generated project:

```bash
npm run build
npm pack --pack-destination out
node bin/demotion.js init out/my-video
cd out/my-video
npm install ../demotion-0.1.0.tgz
npm start
npm run render:4k
```

The tarball filename follows the package version. Once the owner publishes the
first release, the registry-based `npx demotion init my-video` flow will become
available. A local tarball smoke check does not establish registry availability.

## Components

- `createBeatClock`, `spring`, `outExpo`: shared timing and motion vocabulary.
- `MotionProject`, `Shot`: beat-sized scenes with camera, wipes, grain and real
  render-time motion blur. Author animations with `useShot()`.
- `KineticHeadline`, `WideStack`: letter springs and variable-width Archivo type.
- `Terminal`, `CodePanel`: timed typing and staggered source-code reveals.
  See [UI panel props](https://github.com/SohailKhan0525/demotion/blob/main/docs/ui.md).
- `Stack3D` from `demotion/three`: textured panels and genuine lens blur. Requires
  `three`, `@remotion/three`, `@react-three/fiber` (React 18: v8),
  `@react-three/postprocessing` (v2), and `postprocessing` in the consuming project;
  those are already installed in this checkout.

For the tested React 18 / Remotion 4.0.528 starter, enable the optional 3D entry with:

```bash
npm install three@0.160.1 postprocessing@6.36.4 @react-three/fiber@8.17.10 @react-three/postprocessing@2.16.3 @remotion/three@4.0.528
```

Keep all Remotion packages on the same version. The basic starter does not need
these optional peers.

The older exported UI components remain available for compatibility. Their
palette/timing audit is recorded in [the QA notes](https://github.com/SohailKhan0525/demotion/blob/main/docs/qa/continuation.md); they
are not a claim that every historical component meets the new launch quality bar.

## Soundtracks

Generate original music and cues locally, or use your own audio in Remotion.

```bash
npm run build
node bin/demotion.js audio examples/cues.json out/example.wav
```

The cue file declares BPM, duration in beats, music ranges, and events such as
`hit`, `whoosh`, `typing`, or `chime`. The engine targets −14 LUFS by default;
measure the delivered media for integrated loudness and true peak. The launch
picture and audio use the same timeline in `src/launch/timeline.ts`.

## License — free for personal use, paid for business

Demotion uses the [PolyForm Noncommercial License 1.0.0](./LICENSE). It is **source-available**, not OSI "open source".

| You are… | License |
|---|---|
| An individual: personal projects, hobby, research, study | **Free** |
| A school, charity, public-research or government body | **Free** |
| A freelancer, a team, or a company — any paid, client or product-promoting work | **[Commercial license](./COMMERCIAL-LICENSE.md)** — Solo / Team / Company |

Get a commercial license or support the project on Ko-fi: **https://ko-fi.com/qofenoai**

Demotion is built on Remotion, which has its **own** license (it may require a company license for larger teams): https://www.remotion.dev/docs/terms

## Support the project

Demotion is built and maintained by one person. If it saves you time, please support it: **https://ko-fi.com/qofenoai** ☕

## Contributing

Bug reports and ideas are very welcome in [Issues](https://github.com/SohailKhan0525/demotion/issues). I'm not accepting code pull requests yet, because contributions to a dual-licensed project need a contributor agreement that isn't set up.

## Development

See [the handoff](https://github.com/SohailKhan0525/demotion/blob/main/docs/HANDOFF.md) and [continuation notes](https://github.com/SohailKhan0525/demotion/blob/main/docs/qa/continuation.md)
for the remaining work and validation evidence. Use `npm ci` with the committed
lockfile, then `npm run lint && npm run build && npm test`.

Releases use semantic-release. Conventional Commits: `feat:` for a minor version,
`fix:` for a patch; documentation and test commits do not release. The owner has authorized the first `0.1.0` publication through GitHub Actions using [the release guide](https://github.com/SohailKhan0525/demotion/blob/main/docs/PUBLISHING.md),
with `NPM_SECRET` for the individual npm account `qofeno-labs`, without provenance.
After that baseline is tagged, future releases can use
the manually dispatched **Release** workflow. Ordinary pushes run CI and do not
publish. Keep provenance disabled in both paths.
