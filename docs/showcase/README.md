# The source reel

Watch the starter grow from two title cards into a scored motion-graphics film. The 1:44 cut brings together Demotion’s six earlier Studio compositions, the published examples, and the JavaScript Canvas editor. Pause on any chapter, find its source below, and change the same scene in your checkout.

[Download the 1080p film](https://github.com/SohailKhan0525/demotion/releases/download/v0.5.0/demotion-showcase.mp4) · [Chapter list](https://github.com/SohailKhan0525/demotion/releases/download/v0.5.0/chapters.json) · [Numbered frame sheets](https://github.com/SohailKhan0525/demotion/releases/download/v0.5.0/frame-review.zip) · [File-by-file inventory](inventory.md)

## Find a shot

Times are elapsed minutes and seconds. The releases preserve the earlier films, and the tagged source links below open the editions used in this cut.

| Start | What to look for | Source to edit |
| --- | --- | --- |
| 0:00 | Opening titles introduce the reel. | [Showcase composition](https://github.com/SohailKhan0525/demotion/tree/v0.5.0/src/showcase) |
| 0:04 | Both title cards from the five-second project that the CLI actually creates. | [Starter](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/template/src/MyVideo.tsx) |
| 0:09 | A camera travels through three textured panels showing source, a timeline and the 4K render command. The panel sequence is a workflow illustration. | [Original Launch stack shot](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/launch/StackShot.tsx) |
| 0:15 | A count and bar chart from LaunchV2 lead into the example’s caption and lower third. All values are sample data. | [LaunchV2](https://github.com/SohailKhan0525/demotion/tree/v0.5.0/src/launch-v2) · [DataStory](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/examples/data-story.tsx) |
| 0:21 | Watch the glow control beside its source, then see an iris reveal, drawn annotations, a floating card and a progress badge. | [Interface and annotation studies](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/showcase/Specimens.tsx) |
| 0:29 | The illustrated promo and its editable headline example. | [PromoLaunch](https://github.com/SohailKhan0525/demotion/tree/v0.5.0/src/promo) · [PromoScene](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/examples/promo-scene.tsx) |
| 0:35 | Kinetic lettering, variable-width type, and three beat-timed wipes from the Lab. | [Lab](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/lab/Lab.tsx) |
| 0:39 | A terminal prints the package version. A code panel shows how beat four maps to frame 120. | [UI composition](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/lab/UI.tsx) |
| 0:43 | A cursor selects a swatch, a radial dial gives way to a marquee, and a 3D cube turns its layers. | [Component gallery](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/showcase/Gallery.tsx) |
| 0:55 | Metaballs, light beams and particle text give way to serif, stacked and rolling type. | [Light and type studies](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/showcase/Specimens.tsx) |
| 1:03 | An animated workflow diagram gives way to a marker following a drawn SVG path. | [2D illustration](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/examples/illustration.tsx) |
| 1:09 | The illustration update cuts to an extruded SVG with real depth, materials and camera motion. | [UpdateFilm](https://github.com/SohailKhan0525/demotion/tree/v0.5.0/src/update-film) · [3D illustration](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/examples/illustration-three.tsx) |
| 1:15 | Halftone dots, a perspective grid, a rectangular tunnel and a starburst lead into easing, shape morphs and a particle sphere. | [Geometry and motion studies](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/showcase/Specimens.tsx) |
| 1:23 | Two original sound-design sequences play against a new soundtrack synthesized by the toolkit. | [Audio engine](https://github.com/SohailKhan0525/demotion/tree/v0.5.0/src/audio) · [Example cue sheet](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/examples/cues.json) |
| 1:29 | The Canvas editor changes a title and tempo, then saves a frame. The excerpt comes from the released 0.4.0 film. | [Editable offline HTML](https://github.com/SohailKhan0525/demotion/releases/download/v0.4.0/canvas-launch.html) · [Canvas film source](https://github.com/SohailKhan0525/demotion/tree/v0.5.0/scripts/canvas-film) |
| 1:39 | The closing card gives the npm command for this film. | [CLI](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/bin/demotion.js) |

## Watch or edit it

From an installed copy, `demotion showcase` prints the stable film, chapter and guide links. For a fresh installation:

```sh
npx --yes @demotion/cli@0.5.1 showcase
```

To edit the film itself, use Node.js 22.14+ and a checkout of the release. Have FFmpeg, ffprobe, curl, and a Chromium browser available. The setup fetches the Canvas film and verifies its SHA-256. It also renders the starter and the standalone 2D example at their original frame rates.

```sh
git clone --branch v0.5.0 https://github.com/SohailKhan0525/demotion.git
cd demotion
npm ci
npm run studio:showcase
```

For your own multicore renders, use `--branch v0.5.1` in the clone command. That revision waits for Archivo before fitting the kinetic headlines and stacked type.

In Studio, select **Showcase**. Edit the source of a shot using the table above. To change when the shot appears, edit its `startFrame` or duration in the [timeline](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/showcase/timeline.ts). The cut uses 208 beats at 120 BPM. Source offsets in this timeline use 60 frames per second, including for the staged video clips.

```sh
npm run render:showcase
npm run check:showcase
```

The movie is written to `out/showcase/demotion-showcase.mp4`. The `qa` directory holds the frame-by-frame checks and contact sheets. Most of the picture comes from rendering scene code. The Canvas excerpt is the checksum-verified download from v0.4.0. See the [release checksums](https://github.com/SohailKhan0525/demotion/releases/download/v0.5.0/SHA256SUMS) to verify a downloaded copy.

## Review the rest of the project

The [inventory](inventory.md) identifies the job of each tracked file at the starting revision, including the lockfile, workflows, tests, font licenses and launch drafts. It distinguishes files that produce footage from the tooling and records behind it. The [launch film references](../canvas-film/references.md) include time-coded examples of how other teams introduce an edit, hold on its result and show an export.
