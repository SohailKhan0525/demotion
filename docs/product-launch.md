# Launch a Demotion project on GitHub

Give a React developer something they can change on their first visit. In the
illustration example, they can edit one SVG curve and watch a marker travel
along the new route. The README can show the result, link the source, and give
the command that recreates it. GitHub’s Open Source Guides
recommend a clear project home and examples that explain why someone would
use the project. [Finding Users for Your Project](https://opensource.guide/finding-users/)

See how this works in the [Canvas launch film](canvas-film/README.md) and its [annotated YouTube references](canvas-film/references.md).

## Give readers a first edit

For visitors without a Node.js setup, the downloadable HTML study is an
alternative first edit. Open the file in a browser, change the title or tempo,
then save a frame as a PNG. [Launch title study](../examples/canvas-launch.html)

From the repository root, with Node.js 22.14+ and npm, render the two-shot
example. Remotion downloads a supported browser on first use. If Chromium is
already installed, append `--browser-executable=/path/to/chromium` to the
render command using its actual path.

```sh
npm ci
npm run build
npm exec -- remotion render examples/illustration.tsx IllustrationStory out/illustration.mp4
```

Open `out/illustration.mp4`. The first shot assembles a workflow diagram. In
the second, a marker follows a curve. Change the second control point in
`route` from `620 660` to `620 240` and render again. The bend in the line and
the marker’s path change together because `DrawPath` and `FollowPath` read
the same value. Each video runs for 7.5 seconds (450 frames at 60 fps).
[Editable example](../examples/illustration.tsx) · [Path API](illustration.md)

## Plan a short launch film

Here is one possible **20-second cut** for that example. Product Hunt suggests
showing the core workflow in launch media. Apple’s preview guidance recommends
legible copy that carries the story when audio is muted.
[Product Hunt launch media](https://help.producthunt.com/en/articles/17834537-4-build-your-product-page) · [Apple app previews](https://developer.apple.com/app-store/app-previews/)

| Time | What the viewer sees |
| --- | --- |
| 0–4 s | Open on the marker moving along the original curve. The caption reads “Animate an SVG route in React.” |
| 4–9 s | Show the `route` line in the example. Highlight the control point being edited. |
| 9–15 s | Play the original and edited paths side by side. Freeze the same frame in each so the change is visible. |
| 15–20 s | Hold the filename and composition ID on screen. Point viewers to the README for the copyable command. |

For a finished reference, the 40-second *Draw it. Give it depth.* film follows
one shape from SVG to a lit 3D object. Its storyboard doubles as a text
description. The film and its tag record the 0.3.0 edition. The repository’s
current source checkout uses MIT.
[Film, storyboard and source](update-film/README.md) · [Current license](../LICENSE) · [License at the film tag](https://github.com/SohailKhan0525/demotion/blob/update-030/LICENSE)

## Deliver the film with its source

1. Render from a clean checkout of the revision named in the release notes.
   For the existing `UpdateFilm` composition, run `npm ci`, `npm run qa:update`,
   `npm run render:update` and `npm run check:update`. These tasks need FFmpeg,
   ffprobe and a supported browser. Inspect `out/update-film/contact-sheet.jpg`,
   then play the encoded MP4 with sound muted to check the cuts and text.
2. Draft a GitHub Release for the new film tag. Attach the MP4, poster and
   checksums. Link the source at that tag and the exact render command. Give
   the film its own tag so readers can distinguish the film edition from a
   package version. [GitHub release instructions](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
3. After publication, download all three assets into one directory, run
   `sha256sum --check SHA256SUMS` there, and open the downloaded film. Link
   the README poster to that release. [Example delivery record](update-film/verification.md)
4. Ask “Could you change the curve and render the new path?” If a reader
   gets stuck, ask which command they ran and what
   they saw. A reproducible report gives the next contributor a specific fix.
   [Demotion issues](https://github.com/SohailKhan0525/demotion/issues)
