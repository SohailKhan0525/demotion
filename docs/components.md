# Data, captions and identity components

These five APIs require **`@demotion/cli@0.2.0` or later**. They are absent from
0.1.0. In an existing project, upgrade with `npm install @demotion/cli@latest`.

All five components mount inside a `MotionProject` `Shot`, use its theme, and
take **local shot beats**, not seconds or global frame numbers. Load bundled
fonts with `ensureFontsLoaded()` as the starter does. No CSS animations, browser
timers, speech service or network access is involved in their motion.

![Rendered data-story example](https://raw.githubusercontent.com/SohailKhan0525/demotion/main/docs/assets/data-story-preview.png)

This frame comes from the external consumer render of the complete example.
Values are demonstration data.

## Run the complete example

[examples/data-story.tsx](../examples/data-story.tsx) is the complete, tested
composition. It demonstrates every component in two shots, each eight beats.
At 128 BPM and 60 fps it is 450 frames / 7.5 seconds.

Create a project with the release that includes these components:

```bash
npx --yes @demotion/cli@latest init my-story
cd my-story
npm install
```

Copy `node_modules/@demotion/cli/examples/data-story.tsx` to `src/DataStory.tsx`.
The example is included in the npm package. Replace `src/Root.tsx` with:

```tsx
import { Composition } from "remotion";
import { ensureFontsLoaded } from "@demotion/cli";
import { DataStory, STORY_BEATS, storyClock } from "./DataStory";

ensureFontsLoaded();

export const RemotionRoot = () => (
  <Composition
    id="DataStory"
    component={DataStory}
    durationInFrames={storyClock.duration(STORY_BEATS)}
    fps={storyClock.fps}
    width={1920}
    height={1080}
  />
);
```

```bash
npm exec -- remotion render src/index.ts DataStory out/data-story.mp4
```

Keep all Remotion packages at the starter's matching version. The launch films
were recorded before 0.2.0 and label these components as source previews.

## CountUp

```tsx
<CountUp value={1234.5} prefix="$" decimals={1} at={0.5} over={2}
  label="Example amount" />
```

`value` is required. `from=0`, `at=0`, `over=2` control the numeric animation.
Values use an exponential ease and reach the exact endpoint; the container's
spring does not make your data overshoot. `over=0` changes the number immediately.
`decimals=0` accepts 0–10; `locale="en-US"` is explicit for repeatable formatting.
`prefix`, `suffix`, `label`, `fontSize=144`, `color` and `style` customize display.
Negative and descending values are supported. Non-finite values are rejected.

## BarChart

```tsx
<BarChart at={0.5} over={1.5} stagger={0.18} max={100} suffix="%" data={[
  { label: "Example A", value: 42 },
  { label: "Example B", value: 73 },
]} />
```

Rows share one zero baseline. Signed values extend in the correct direction;
empty/all-zero datasets remain finite. The domain is derived from data unless
`max` is supplied. `max` must be positive and cover every absolute value, so the
chart never silently clips an outlier. `width=1000`, `rowHeight=94`, `decimals=0`
and `suffix=""` control layout and values. Each datum can supply `color`.
The chart includes a text description in `aria-label`.

## CaptionTrack

```tsx
<CaptionTrack cues={[
  { at: 0.5, beats: 2, text: "Write the message." },
  { at: 2.5, beats: 3, text: "Choose the beat." },
]} />
```

Cues must be sorted, non-overlapping and have positive durations. Intervals are
half-open: the next caption replaces the previous one exactly on their shared
boundary, including at fractional frames-per-beat. Gaps show no caption.
`fontSize=52`, `bottom=96`, `maxWidth=1400`, `color` and `background` control the
card. Unicode and explicit line breaks are preserved. It renders authored text;
it does **not** transcribe audio, infer word timestamps or export subtitle files.

## LowerThird

```tsx
<LowerThird title="Alex Chen" subtitle="Example presenter"
  at={0.25} beats={6} />
```

`title` is required. `subtitle` enters after the title. `at=0`, `beats=6` define
the entire visibility window, including a short exit before the end.
`left=100`, `bottom=120`, `width=760` control placement. Use it for presenters,
chapter labels and product context. Avoid overlapping it with the caption card.

## ProgressRing

```tsx
<ProgressRing value={0.75} label="Example progress" at={0.5} over={2} />
```

`value` is a **0–1 fraction**, clamped to that range. `at=0`, `over=2`,
`size=300`, `strokeWidth=18` and `color` control motion and layout. Stroke width
must be positive and smaller than size. A progressbar role exposes the current
percentage. The ring displays supplied data; it does not monitor render jobs.

## Choosing the right timing

At 128 BPM / 60 fps, one beat is 28.125 frames. The clock rounds **global landing
frames** first; the components derive local boundaries from those frames. Do not
replace that with `Math.round(localBeat * framesPerBeat)` inside later shots:
the result can differ by one frame. Numeric and caption boundary tests cover this.

Use honest labels for sample values. These components do not measure audience
growth, performance, revenue or conversions for you.
