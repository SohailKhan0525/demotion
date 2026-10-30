# Ideas deserve motion

A 56-second product film made with Demotion: 1920×1080, 60 fps, 120 BPM.
`PromoLaunch` is a film composition, not an npm version.

[Download the MP4](https://github.com/SohailKhan0525/demotion/releases/download/promo-launch/demotion-promo-launch.mp4)
· [Film release, poster and checksums](https://github.com/SohailKhan0525/demotion/releases/tag/promo-launch)
· [Storyboard and reference study](direction.md)

## Run or edit the film

From the repository with Node.js 22.14+:

```bash
npm install
npm run dev                  # choose PromoLaunch in Studio
npm run qa:promo             # 38 sampled stills, contact sheet, opening poster
npm run render:promo         # full MP4, poster, SHA256SUMS
npm run check:promo          # stream timing, format, frame count, faststart
```

Rendering and delivery checks need FFmpeg and ffprobe. Remotion downloads a
supported browser on first use. For an existing Chromium installation:

```bash
DEMOTION_BROWSER=/usr/bin/chromium DEMOTION_WORKERS=2 DEMOTION_CONCURRENCY=1 npm run render:promo
```

Files are written under ignored `out/promo/`. `src/promo/timeline.ts` owns the
scene lengths, displayed code, CLI commands and soundtrack. `PromoLaunch.tsx`
composes the scenes; `art.tsx` contains the original frame sculpture and layout
primitives. They are film source, not new public package exports. Change a scene
length in the timeline and the composition duration follows automatically.

Full renders use two independent browser workers by default, one tab per worker.
`DEMOTION_WORKERS=1` uses less memory; a four-core machine can try three workers.
Frame ranges retain their global timing and are joined without re-encoding.
The checker verifies the final frame count, duration, color format and audio.

The score is synthesized by Demotion, using its beat clock. FFmpeg combines the
original WAV with the final picture, encodes AAC once, and applies a two-second
ending fade. The input reference's images, branding and soundtrack are not part
of the repository or deliverables.

## Try the code shown on screen

[`examples/promo-scene.tsx`](../../examples/promo-scene.tsx) is a complete four-second
composition using the APIs available in npm 0.1.0. Create a starter with the README
quick start, copy the file to `src/PromoScene.tsx`, and register it in `src/Root.tsx`:

```tsx
import { Composition } from "remotion";
import { ensureFontsLoaded } from "@demotion/cli";
import { PromoScene, promoExampleClock, PROMO_EXAMPLE_FRAMES } from "./PromoScene";

ensureFontsLoaded();

export const RemotionRoot = () => (
  <Composition
    id="PromoScene"
    component={PromoScene}
    durationInFrames={PROMO_EXAMPLE_FRAMES}
    fps={promoExampleClock.fps}
    width={1920}
    height={1080}
  />
);
```

Render this composition from the starter:

```bash
npx remotion render src/index.ts PromoScene out/promo-scene.mp4
```

The on-screen code is tested against this example. `CountUp`, `BarChart`,
`ProgressRing`, `CaptionTrack` and `LowerThird`, shown later in the film, are
source additions on `main` and are **not included in npm 0.1.0**. See the
[component guide](../components.md) for running those additions from source.

## Delivery and access

The `Promo film` GitHub workflow checks out the immutable `promo-launch` tag,
runs the checks, renders and publishes MP4/poster/checksums as a film prerelease.
It does not publish an npm package. Existing release tags remain unchanged.

Use the direct GitHub MP4 link above when an in-chat artifact download fails.
Download `SHA256SUMS` alongside the MP4 and poster to verify both locally with
`sha256sum --check SHA256SUMS`.

The film communicates through on-screen text; no narration is required to
understand it. [The storyboard](direction.md#storyboard-and-text-equivalent)
provides a text equivalent. Viewers can pause the MP4 or read that document.
Do not embed the film as an autoplaying page background.
