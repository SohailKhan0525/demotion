# demotion

**Motion graphics, written in code.** Create videos with React and render them on your own computer using [Remotion](https://www.remotion.dev).

[![CI](https://github.com/SohailKhan0525/demotion/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/SohailKhan0525/demotion/actions/workflows/ci.yml)
[Package](https://www.npmjs.com/package/@demotion/cli) · [Examples](#edit-your-video) · [UI reference](docs/ui.md) · [Issues](https://github.com/SohailKhan0525/demotion/issues)

`@demotion/cli` includes the `demotion` command, React components, beat-based timing,
procedural audio, bundled fonts, and optional 3D panels. Videos render locally;
there is no hosted rendering service to configure.

## Quick start

Use **Node.js 22.14+** and npm. Node 22 and 24 are tested in CI. Rendering needs a
Chromium browser; Remotion can download a supported browser on first use. Package
installation and that browser download require Internet access. Fonts are bundled.

```bash
npx --yes @demotion/cli@latest init my-video
cd my-video
npm install
npm start
```

Remotion Studio opens a preview. Edit `src/MyVideo.tsx`. Open a second terminal
in `my-video` (or stop Studio with Ctrl+C), then render:

```bash
npm run render       # out/video.mp4 — 1920×1080
npm run render:4k    # out/video-4k.mp4 — 3840×2160
```

The starter contains two scenes totaling **150 frames at 30 fps: five seconds**.
These are starter settings, not a limit on your own video's duration.

## Edit your video

This is the actual starter source in `src/MyVideo.tsx`:

<!-- starter-example -->
```tsx
import { Series } from "remotion";
import { TitleCard, highlight } from "@demotion/cli";

export const MyVideo = () => (
  <Series>
    <Series.Sequence durationInFrames={60}>
      <TitleCard text={[highlight("Hello, ", "#14121f"),
        highlight("demotion", "#a21caf")]} />
    </Series.Sequence>
    <Series.Sequence durationInFrames={90}>
      <TitleCard text="Every frame is code." />
    </Series.Sequence>
  </Series>
);
```
<!-- /starter-example -->

![A frame rendered from the starter example](https://raw.githubusercontent.com/SohailKhan0525/demotion/main/docs/assets/starter-preview.png)

A frame rendered from the starter above.

Change the text and colors here. Change the composition settings in
`src/Root.tsx` for a different duration, frame rate or canvas size. Keep the scene
lengths and composition duration consistent. `ensureFontsLoaded()` is already
called by the starter, using files copied into `public/fonts`.

## New on main: data stories and captions

Five new components are available in the source: `CountUp`, `BarChart`,
`CaptionTrack`, `LowerThird` and `ProgressRing`. They share the scene engine's beat
clock and support deterministic seeking. **Published npm 0.1.0 does not include
these additions yet.** [Run the complete example and read the API guide](docs/components.md).

The [second launch film](https://github.com/SohailKhan0525/demotion/releases/tag/launch-v2)
shows the new source components; “V2” is the film edition, not an npm 2.0 release.

## Components and timing

For an existing Remotion project:

```bash
npm install @demotion/cli
```

Import from `@demotion/cli`:

| Export | Use |
| --- | --- |
| `TitleCard`, `highlight` | Starter titles and highlighted text |
| `createBeatClock`, `spring`, `outExpo` | Beat timing and easing |
| `MotionProject`, `Shot`, `useShot` | Scenes with camera motion, wipes, grain and render-time motion blur |
| `KineticHeadline`, `WideStack` | Animated letters and variable-width type |
| `Terminal`, `CodePanel` | Timed typing and source-code reveals |

`Terminal` and `CodePanel` use the clock and theme of their containing `Shot`.
See [their props and examples](docs/ui.md). The toolkit also retains its earlier
UI components; their styling varies. The newer scene engine is the recommended
starting point for beat-driven work.

The starter pins all Remotion packages to `4.0.528`. Keep Remotion and its
`@remotion/*` packages on matching versions when extending the project.

## Generate a soundtrack

Save this as `cues.json`:

```json
{
  "bpm": 120,
  "beats": 8,
  "music": { "kick": [[0, 8]], "arp": [[0, 8]], "bass": [[0, 8]] },
  "cues": [
    { "at": 0, "kind": "hit" },
    { "at": 4, "kind": "whoosh" },
    { "at": 4, "kind": "hit" },
    { "at": 6, "kind": "chime" }
  ]
}
```

```bash
npx @demotion/cli audio cues.json out/soundtrack.wav
```

Times and durations in the cue file are beats. The generated WAV includes a
reverb tail. The engine targets −14 LUFS by default; measure the finished video
for delivery. To use the file, copy it into your project's `public` directory and
add Remotion's `<Audio src={staticFile("soundtrack.wav")} />` to your composition.
The audio API is also available from `@demotion/cli/audio`.

## Optional 3D

`Stack3D` and related exports live at `@demotion/cli/three`. For the **React 18 /
Remotion 4.0.528 starter**, install the tested optional dependencies:

```bash
npm install three@0.160.1 postprocessing@6.36.4 @react-three/fiber@8.17.10 @react-three/postprocessing@2.16.3 @remotion/three@4.0.528
```

```tsx
import { Stack3D } from "@demotion/cli/three";
```

The basic starter does not need these peers. Real depth of field can be expensive
on software graphics, so use a small test render before rendering a long scene.

## Troubleshooting

- **Browser download unavailable:** install Chromium and pass
  `--browser-executable=/path/to/chromium` to the generated project's Remotion
  command, for example `npm run render -- --browser-executable=/usr/bin/chromium`.
- **Remotion version mismatch:** align `remotion` and all installed `@remotion/*`
  versions. Avoid forcing an incompatible dependency tree.
- **Slow rendering:** reduce Remotion's concurrency on a small machine, for example
  `npm run render -- --concurrency=2`. 4K and 3D need more time and memory.
- **Blank text or missing fonts:** keep `public/fonts` and the starter's font-loading
  call. The CLI copies the font license files with the fonts.

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

```bash
git clone https://github.com/SohailKhan0525/demotion.git
cd demotion
npm ci
npm run dev
```

Select **LaunchV2**, **Launch**, **Lab**, or **UI** in Studio. Generated media stays in ignored
`out/`; the launch MP4 is intentionally not checked in. The source remains available
to regenerate it.

```bash
npm run lint
npm run build
npm test
```

Generate the second launch film and its visual checks:

```bash
npm run qa:v2          # out/launch-v2/contact-sheet.jpg + stills
npm run render:v2      # out/launch-v2/demotion-v2-launch.mp4
npm run check:v2       # verify codecs, dimensions, frames and duration
```

See [development notes](docs/DEVELOPMENT.md) for source rendering and verification,
and [release instructions](docs/PUBLISHING.md) for publishing. npm releases are
public, use the organization package `@demotion/cli`, and have provenance disabled.
