# Next-release animation research

Research date: 2026-11-01. This is an engineering and visual-direction study,
not a claim that every referenced library is integrated. Public upstream source
was read through the managed network proxy. No company artwork, recordings,
logos, fonts or music from this study are included in the package or film.

## Recommendation

Build original SVG/DOM illustrations with Remotion's current-frame clock and
the existing beat/easing helpers. Use the existing optional Three/R3F entry for
real depth, geometry and lighting. This fits reproducible video rendering and
preserves the small 2D installation. Adding another playback engine does not by
itself improve illustration quality.

Give the next film a concrete visual progression: a purposeful illustrated
object; its parts assembling in 2D; the same object gaining real 3D depth; a
legible source-to-render example; a settled final command. Keep a recurring
shape and material vocabulary across these scenes. Animate cause and effect:
a moving point draws a path, an arriving layer reveals a surface, a rotation
explains depth. Reserve long holds for the product and code.

## Library findings from primary sources

These are widely used candidates, not a measured popularity ranking. Upstream
`main`/`master`/`dev` URLs are mutable; findings describe source inspected on the
research date, not compatibility guarantees for every historical release.

| Library | Inspected evidence | Fit for Demotion |
| --- | --- | --- |
| [Motion](https://github.com/motiondivision/motion/blob/main/README.md) | React/JS/Vue animation, springs, layout and gestures. Its [JS animation implementation](https://github.com/motiondivision/motion/blob/main/packages/motion-dom/src/animation/JSAnimation.ts) provides `pause()` and a time setter in seconds. | Good reference for coordinated entrances and responsive interaction. Automatic playback is a separate clock; a film adapter would need to pause and explicitly seek every rendered frame. Keep current pure easing helpers for this release. |
| [GSAP](https://github.com/greensock/GSAP/blob/master/README.md) | Timelines, SVG paths/morphs and property animation. [Core source](https://github.com/greensock/GSAP/blob/master/src/gsap-core.js) implements `seek()` and `pause()`. | Strong when adapting an existing authored GSAP scene. It requires controlled seeking, initialization and cleanup for frame rendering. Its sequencing concepts are useful without adding a second runtime here. |
| [Lottie Web](https://github.com/airbnb/lottie-web/blob/master/README.md) | After Effects JSON playback; documented `goToAndStop(value, isFrame)`. Remotion's [Lottie component](https://github.com/remotion-dev/remotion/blob/main/packages/lottie/src/Lottie.tsx) disables autoplay and seeks from `useCurrentFrame()`. | Best optional import path when a designer supplies a suitable authored animation. Original SVG is easier to parameterize, recolor and ship without an external animation file for the proposed illustrations. |
| [Rive Web](https://github.com/rive-app/rive-wasm/blob/master/README.md) | High-level interactions/state machines and a low-level API for a custom render loop; WASM runtime. | Strong for interactive illustrated characters and stateful UI. Arbitrary video seeks require a defined reset/replay policy for state, asset readiness and deterministic input history. Defer a general adapter until that behavior is tested. |
| [Three.js](https://github.com/mrdoob/three.js/blob/dev/README.md) | Scene/geometry/material rendering; [`AnimationMixer.setTime()`](https://github.com/mrdoob/three.js/blob/dev/src/animation/AnimationMixer.js) evaluates an animation at a specified time in seconds. | Appropriate for true lighting, occlusion and depth. Prefer directly computed transforms for procedural geometry; use absolute-time evaluation for imported clips instead of accumulating deltas. |
| [React Three Fiber](https://github.com/pmndrs/react-three-fiber/blob/master/readme.md) | Declarative Three scene composition. [Hook documentation](https://github.com/pmndrs/react-three-fiber/blob/master/docs/API/hooks.mdx) describes automatic/demand/manual frame loops. README explicitly pairs R3F 8 with React 18 and R3F 9 with React 19. | Keep this repository's React 18/R3F 8 pairing. Use `ThreeCanvas`; calculate transforms from Remotion frames instead of the README's interactive `useFrame` delta example. |
| [Remotion](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/animating-properties.mdx) | Explicit instruction to animate using `useCurrentFrame()` to avoid render flicker. Its [Three integration documentation](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/three.mdx) puts animations directly in scene markup rather than `useFrame()`. | Remains the composition and rendering authority. Preserve fractional frames for motion-blur samples, preload assets/fonts, and drive picture and soundtrack from the shared beat clock. |

This study does not call for upgrading the repository's pinned Remotion or 3D
peer versions. Newer upstream examples can expose APIs absent from those pins.

## Visual material actually inspected

The following entries were downloaded or read from an existing user attachment,
decoded with FFmpeg, sampled across their full duration and visually inspected
as contact sheets. These observations concern composition and visible motion;
they are not a complete audio or frame-by-frame timing analysis.

| Reference and provenance | Inspection | What to apply |
| --- | --- | --- |
| User-supplied OpenDuet / CopilotKit film, `x-downloader.com_gJonJ7.mp4`; visible branding, original authorship not independently established | 1920×1080, 30 fps, 69.589 s; whole-timeline sheet at four-second intervals | A small central character grows into a relationship diagram; a stable left headline/right phone layout follows; selected UI surfaces enlarge; the ending returns to a simple centered CTA. Reuse the readable pacing and persistent object relationships in original Demotion artwork. |
| [Anthropic Claude Code official README](https://github.com/anthropics/claude-code/blob/main/README.md), embedded [`demo.gif`](https://raw.githubusercontent.com/anthropics/claude-code/main/demo.gif) | 1552×992, 42.4 s; whole-timeline sheet at three-second intervals | The actual terminal remains stable while commands, reasoning/status text and results change. A truthful product demonstration can carry the middle of a film. This is a product demo, not an independently verified launch film. |
| [Remotion official Three template](https://github.com/remotion-dev/template-three), embedded [`demo.gif`](https://raw.githubusercontent.com/remotion-dev/template-three/main/demo.gif) | 800×620, 7.95 s; whole-timeline sheet at one-second intervals | A simple rounded phone turns to reveal its thin side and returns toward the viewer, with generous negative space. Use rotation to demonstrate physical depth, then settle faces toward the camera for readable content. This is a template demonstration. |
| Airbnb Lottie Web official [`Example1.gif`](https://raw.githubusercontent.com/airbnb/lottie-web/master/gifs/Example1.gif) | 800×400, 3.11 s; quarter-second samples through three seconds | Pin squash/stretch and travel, hamburger-to-arrow transformation, and heart activation with particles. Give each small illustration a recognizable state change and follow-through. |
| Airbnb Lottie Web official [`Example2.gif`](https://raw.githubusercontent.com/airbnb/lottie-web/master/gifs/Example2.gif) | 800×400, 18.56 s; 1.5-second samples through the final portion | Three stable mobile panels show changing line icons, a typographic mark assembling, and a watermelon empty-state illustration. The content area stays anchored while the illustration changes. |
| Airbnb Lottie Web official [`Example3.gif`](https://raw.githubusercontent.com/airbnb/lottie-web/master/gifs/Example3.gif) | 800×400, 14.11 s; 1.2-second samples through the final portion | A line-drawn phone/person tutorial and changing star ratings make the intended action legible. Motion communicates progress and feedback inside a stable layout. |

The supplied OpenDuet film was also studied for the earlier promo; its existing
[reference notes](promo/direction.md) provide historical context. This study
re-inspected the actual attachment rather than treating those notes as new
visual evidence. Borrow pacing and staging, not another product's claims,
mascot, interface, color system or soundtrack.

## Company launch sources and access limits

The requested broader company survey was attempted, but these official pages
returned proxy CONNECT `403 Forbidden`: [Linear launch](https://linear.app/launch),
[Figma Slides announcement](https://www.figma.com/blog/introducing-figma-slides/),
[Apple Intelligence](https://www.apple.com/apple-intelligence/),
[Stripe Sessions](https://stripe.com/sessions), and
[Vercel Ship](https://vercel.com/ship). Their films were not viewed, and no
observations above are attributed to them. A blocked response also does not
establish that a proposed page currently exists or contains a video.

The official [OpenDuet README](https://github.com/CopilotKit/OpenDuet/blob/main/README.md)
and [CopilotKit README](https://github.com/CopilotKit/CopilotKit/blob/main/README.md)
were accessible. They link actual video assets, including
[OpenDuet's overview](https://github.com/user-attachments/assets/f3439f74-855e-4d95-bb5c-713fded3c66e)
and [CopilotKit's product demonstration](https://github.com/user-attachments/assets/4af4c22a-1638-4328-add7-ede088afea64).
Their redirected downloads were denied by the proxy. They were not decoded or
visually inspected, and the supplied OpenDuet attachment has not been asserted
to be byte-identical to the linked official video. No alternate proxy or
network-policy bypass was used.

## Inspection evidence and reproduction

The current workspace's research downloads, fetch-status JSON records and
contact sheets are in `/tmp/demotion-research-next/`; this temporary cache is
not a committed dependency. Sheets inspected: `openduet-sheet.jpg`,
`claude-code-sheet.jpg`, `remotion-three-sheet.jpg`, `lottie-1-sheet.jpg`,
`lottie-2-sheet.jpg`, `lottie-3-sheet.jpg`. The supplied file remains under
`/workspace/attachments/925242ac-22bd-4c7c-9947-41f32412c2b1/`.

SHA-256 identifies the exact inspected source bytes:

```text
f2b61b94fabfa384ee4d681e7600a0e9ba07d266d6ea65479e1f6f44f7cfa6fe  x-downloader.com_gJonJ7.mp4
461cf109f52648929acd9959a87e5673541f8249497512b8e4f1d32d10f0fd57  claude-code-demo.gif
63e992abc56d966019600cf4dee8ebcc71bae464dc07879fac81a03d06ff5d1e  remotion-three-demo.gif
dcc92053434e5a5a9a68f47aa80e1278c1e081b750c7d990147401c42066e404  lottie-example1.gif
2097019b51807ca8e09dc6ea7131c6fa176ce85da6702b3cf1602e80e3b35239  lottie-example2.gif
ca0e244e6b495a2db7603284aa41b8062298a0f3d70c500c9a04a6fe36ddfce9  lottie-example3.gif
```

For example, after downloading the linked official Claude Code GIF as
`claude-code-demo.gif`, reproduce the metadata and sheet with:

```sh
ffprobe -v error -show_entries format=duration:stream=width,height,avg_frame_rate,nb_frames -of json claude-code-demo.gif
ffmpeg -i claude-code-demo.gif -vf 'fps=1/3,scale=388:-1,tile=4x4:padding=12:margin=12:color=0x202225' -frames:v 1 claude-code-sheet.jpg
```

Before delivery, inspect the new film's full timeline, full-resolution text and
illustration stills, and motion around transitions. Check direct seeks to late
frames against sequential rendering; frame-history-dependent animation can
look correct in a preview and still fail during parallel export. Product
commands and export claims must be supported by this repository's real APIs
and verified consumer renders.
