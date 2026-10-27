---
title: "Deterministic React video: counters, charts and captions on one beat clock"
published: false
description: "Build a local Remotion composition with reusable data components and exact beat timing."
tags: react, typescript, webdev, tutorial
ai_disclosure_level: fully_autonomous
---

A counter in a web dashboard can animate once when it mounts. A counter in a
rendered video has a harder job: it must produce the right value for frame 180
whether the renderer visits frame 179 first, starts at frame 180, or seeks
backward from frame 300.

This tutorial builds a two-scene data story with React and Remotion. It uses
five components from demotion, the toolkit I am building: `CountUp`, `BarChart`,
`CaptionTrack`, `LowerThird` and `ProgressRing`.

**Release status:** these five components are on GitHub main. They are not in the
published `@demotion/cli@0.1.0` package yet. The instructions below use a local
package built from source. The original starter is already on npm. “V2” in the
accompanying launch film means the second film, not an npm 2.0 release.

This draft was prepared with AI assistance from the implementation and its
verification results. The sample values are demonstration data, not adoption or
performance results.

## Why one clock matters

At 128 BPM, each beat lasts 60 / 128 seconds. At 60 frames per second, that is
28.125 frames. Video frames are discrete, so some beat boundaries must round up
and others down.

For a shot starting later in a composition, calculate the global landing frame
first and subtract the shot's rounded start:

```ts
const localLanding = clock.frame(shotStartBeat + localBeat)
  - clock.frame(shotStartBeat);
```

Rounding `localBeat * framesPerBeat` independently can differ by one frame.
This matters when a caption change should land on exactly the same frame as a
cut or sound cue. It is also why the components read the containing shot's
`at()` function instead of inventing individual clocks.

The clock handles timing. The easing function handles how values travel between
those boundaries. Neither requires a timeout, an animation loop or React state.

## Build the current source candidate

Use Node 22.14+ and npm. Remotion needs Chromium and can download a supported
browser on first use. Package installation and that browser download need an
Internet connection; the starter copies its fonts locally.

```bash
git clone https://github.com/SohailKhan0525/demotion.git
cd demotion
npm ci
npm run build
npm pack --pack-destination out
node bin/demotion.js init ../my-story
```

While the source is on the 0.1.0 release baseline, the generated tarball is
`out/demotion-cli-0.1.0.tgz`. It contains the new source additions. Install that
specific local file in the starter:

```bash
cd ../my-story
npm install /absolute/path/to/demotion/out/demotion-cli-0.1.0.tgz
```

Replace the absolute path with your actual checkout path. Installing registry
0.1.0 instead will not provide the five new components. After their registry
release, the usual `npm install @demotion/cli@latest` can replace this local step.

## Compose the story

Save the following as `src/DataStory.tsx`. It is also available as the complete
[repository example](https://github.com/SohailKhan0525/demotion/blob/main/examples/data-story.tsx).

```tsx
import React from "react";
import {
  BarChart, CaptionTrack, CountUp, LowerThird, MotionProject,
  ProgressRing, Shot, createBeatClock, demotionTheme,
} from "@demotion/cli";

export const storyClock = createBeatClock({ bpm: 128, fps: 60 });
export const STORY_BEATS = 16;

export const DataStory = () => (
  <MotionProject clock={storyClock}>
    <Shot beats={8} bg={demotionTheme.ink}>
      <div style={{ position: "absolute", left: 120, top: 150 }}>
        <CountUp value={128} suffix=" BPM" label="Example tempo" over={2} />
        <div style={{ marginTop: 80 }}>
          <BarChart width={1050} at={0.5} max={8} suffix=" beats" data={[
            { label: "Opening", value: 4 },
            { label: "Story", value: 8 },
            { label: "Close", value: 6 },
          ]} />
        </div>
      </div>
      <div style={{ position: "absolute", right: 150, top: 310 }}>
        <ProgressRing value={0.75} at={0.5} label="Example progress" />
      </div>
    </Shot>
    <Shot beats={8} bg={demotionTheme.field} wipe={{ kind: "slats" }}>
      <LowerThird title="A story you can edit" subtitle="Example author · example project" at={0.25} beats={5} bottom={420} width={1050} />
      <CaptionTrack cues={[
        { at: 0.5, beats: 3, text: "Write the message. Choose the beat." },
        { at: 3.5, beats: 4, text: "Every frame is a function of time." },
      ]} />
    </Shot>
  </MotionProject>
);
```

The first shot gives a number, chart and progress ring separate places in the
frame. The counter and chart animate independently, but both use local shot
beats. The second shot presents context and captions without overlapping them.

`value={0.75}` is a fraction, not 75. It is supplied example progress, not a
connection to a live render job. The chart values are also supplied data. A
component should not imply that it has measured anything by itself.

## Register and render it

Replace the generated `src/Root.tsx` with:

```tsx
import React from "react";
import { Composition } from "remotion";
import { ensureFontsLoaded } from "@demotion/cli";
import { DataStory, STORY_BEATS, storyClock } from "./DataStory";

ensureFontsLoaded();

export const RemotionRoot: React.FC = () => (
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

Keep the generated `src/index.ts`, which registers `RemotionRoot`. Preview it
with `npm start`, then render the composition explicitly:

```bash
npm exec -- remotion render src/index.ts DataStory out/data-story.mp4
```

The example has 16 beats. At 128 BPM and 60 fps, that is 450 frames and 7.5
seconds. It is a silent example; a soundtrack can be added separately. The
composition duration and the sum of the shot durations must agree.

## Keep numeric truth separate from visual overshoot

A spring entrance makes a card feel physical, but a spring applied directly to
a data value can briefly exceed its target. For a percentage or amount, that
would be misleading.

`CountUp` uses a bounded exponential ease for the displayed number, and a spring
for its container. The number reaches the exact target at the end of the
specified window. The card can overshoot its position without inventing a
larger amount. Explicit locale and decimal settings also avoid depending on the
machine's default number format.

`BarChart` derives one domain containing zero, so positive and negative values
share a baseline. If you supply `max`, it must cover every absolute value. A
bad maximum raises an error instead of quietly clipping data. Empty and
all-zero datasets also remain finite.

## Make caption boundaries unambiguous

Each caption covers `[at, at + beats)`: inclusive at the start, exclusive at the
end. Two adjacent cues can share a boundary without displaying both at once.
A gap displays no caption. Unsorted or overlapping cues raise an error.

These are authored captions. The component does not recognize speech, infer
word timing or export subtitles. If you already have a transcript, you still
need to supply its timing in the composition's beat units.

## Verify behaviors that a still image cannot prove

Useful regression checks include seeking backward to a previously rendered
frame, checking a caption immediately before and after its boundary, and
crossing zero in a chart. Invalid numeric values should fail clearly instead of
producing SVG geometry containing `NaN`.

The repository tests those behaviors, including fractional beat boundaries.
The full example is also bundled against the public package entrypoint and
checked in a separate consumer project. Visual inspection is still necessary:
a timing test cannot tell you whether text is readable or a label overlaps.

For your own composition, inspect the first frame, the settled state of each
shot and the transitions. Use a complete render before sharing the result; a
successful still does not establish that the full timeline works.

## Where this fits

This approach suits repeatable explainers, product stories and data-driven
videos where React components are useful building blocks. It is not a hosted
editor or a replacement for understanding Remotion. More complex 3D and
render-time blur can increase rendering cost.

The [repository](https://github.com/SohailKhan0525/demotion) includes the component
guide and the second launch film. demotion is source-available and free for
personal/non-commercial use. Business, client or product work needs a commercial
license; Remotion has its own terms. Read those terms before using it for work.

If you adapt the example, which part needs the most help: layout, timing,
caption authoring or the rendering setup?
