# Draw it. Give it depth.

A 40-second film for the illustration update: **1920×1080 · 60 fps · 120 BPM**.
`UpdateFilm` demonstrates original 2D artwork, real extruded 3D geometry and a
shared React timeline. Its 80 beats produce 2,400 frames.

The package edition is `@demotion/cli@0.3.0`; the separate immutable film tag is
`update-030`. The render and asset workflow below reproduces the film from that
source snapshot.

[Download the MP4](https://github.com/SohailKhan0525/demotion/releases/download/update-030/demotion-update-030.mp4)
· [Film release, poster and checksums](https://github.com/SohailKhan0525/demotion/releases/tag/update-030)
· [Animation and reference research](../research-next.md)
· [Verified public downloads and media checks](verification.md)

## Storyboard and text equivalent

| Time | Message | Demonstration |
| --- | --- | --- |
| 0–4 s | Draw it. Give it depth. | Original layered D/play sculpture; animated SVG and sculpted 3D on one React timeline. |
| 4–10 s | Start with a line. | `DrawPath` traces the original mark and play shape, then their fills resolve. |
| 10–16 s | A path. A point of view. | `FollowPath` moves three objects along a curved SVG route and rotates them with its tangent. |
| 16–22 s | Your SVG. In 3D. | `ExtrudedSvg` creates actual geometry; `Scene3D` supplies lighting and camera movement. |
| 22–26 s | Built in layers. | Separate extruded surfaces assemble into the recurring sculpture. |
| 26–30 s | Make the idea visible. | `WorkflowIllustration` combines paths, objects and timing as reusable React components. |
| 30–34 s | Small API. Room to play. | A short `DrawPath` / `FollowPath` JSX example shows composition inside a `Shot`. |
| 34–40 s | Make it yours. | The actual CLI initialization command, project commands and repository address. |

The 2D components use `@remotion/paths` geometry. The optional `/three` entry uses
Three.js and React Three Fiber for real meshes, materials and lighting. Camera
poses and illustration progress derive from the beat clock rather than elapsed
browser time. These are toolkit components, not claims of a hosted editing app.
See the [2D guide](../illustration.md) and [3D guide](../three-illustration.md).

## Reproduce or edit the film

Use Node.js 22.14+, FFmpeg and ffprobe. The repository's development dependencies
include the optional 3D stack used by this film. An ordinary 2D package consumer
does not need to install it. Remotion downloads a supported browser on first use.

Start from the film tag’s exact source snapshot:

```bash
git clone --branch update-030 --depth 1 https://github.com/SohailKhan0525/demotion.git demotion-update-030
cd demotion-update-030
npm ci
npm run lint
npm run build
npm test
npm run qa:update
npm run render:update
npm run check:update
```

From the current repository root, the same npm commands review and render the
working source. `npm run dev` opens Studio; select `UpdateFilm`. The composition
and art live in [`src/update-film/UpdateFilm.tsx`](../../src/update-film/UpdateFilm.tsx).
[`timeline.ts`](../../src/update-film/timeline.ts) owns the scene lengths,
displayed code, package version, CLI command and soundtrack arrangement.

Outputs are written under ignored `out/update-film/`:

- `qa/`, `contact-sheet.jpg` and `poster.png` support the source-render review.
- `demotion-update-030.mp4` is the full film.
- `encoded-contact-sheet.jpg` samples the encoded timeline once per second.
- `metadata.json` records the delivery check; `SHA256SUMS` covers MP4 and poster.

The render script uses two independent browser workers by default, with one tab
per worker. It selects Chromium's `swangle` software WebGL renderer so the 3D
shots also work on machines without a GPU. To use an existing Chromium and
reduce memory use:

```bash
DEMOTION_BROWSER=/usr/bin/chromium DEMOTION_WORKERS=1 DEMOTION_CONCURRENCY=1 npm run render:update
```

`check:update` verifies the expected frame count, duration, stream timing, H.264
video, BT.709 limited-range `yuv420p`, stereo AAC and faststart layout. It does
not substitute for inspecting stills and the encoded timeline. Source tests
also need to establish the API and command claims shown on screen.

## Score, references and delivery

The original score is synthesized by Demotion on the film's beat clock. The
script combines the generated WAV with the picture, encodes AAC once and applies
a two-second ending fade. The film uses original artwork and layouts. Reference
footage, product interfaces, mascots, logos and soundtracks are not embedded.
[The research record](../research-next.md) distinguishes material actually
inspected from official company pages or videos that the proxy blocked.

The `Update film` workflow checks out `update-030` and publishes the MP4, poster
and checksums as a separate GitHub film prerelease. It does not publish npm;
the package uses the repository's semantic-release workflow. Verify the final
package version against the registry before treating on-screen availability as
a completed release.

Download `SHA256SUMS` with the MP4 and poster, then run
`sha256sum --check SHA256SUMS` in that download directory. On-screen copy and the
storyboard above convey the film without audio. Viewers can pause the film to
read the code. Demotion's [license](../../LICENSE) and
[commercial-license information](../../COMMERCIAL-LICENSE.md) remain applicable;
Remotion has separate terms.
