# Current handoff

Demotion-owned code in this checkout is MIT-licensed. Use the source quick start
in the [README](../README.md), or open the [standalone Canvas example](../examples/canvas-launch.html)
in a browser. For contributor setup see [CONTRIBUTING](../CONTRIBUTING.md).
For a GitHub launch see the [product launch guide](product-launch.md).

The owner authorized the npm organization package **@demotion/cli**, using
GitHub Actions secret **NPM_SECRET**. The authenticating npm account is
qofeno-labs. Do not use demotion (npm rejected its unscoped name), the deleted
@qofeno-labs/demotion, or any other namespace. Provenance must stay disabled.

The CLI executable remains demotion. Generated projects depend on and import
@demotion/cli directly. The package includes the main React toolkit, /audio and
optional /three exports. Verify publication against the public registry; a
successful dry run or source push alone does not publish a package.

## Canvas launch and npm 0.4.0

The 0.4.0 release is the first MIT npm edition. `demotion demo` writes the
editable standalone Canvas title editor. The new film renders its actual
JavaScript drawing function and uses the toolkit's audio engine. See the
[film guide](canvas-film/README.md) for the render and frame checks and the
[release](https://github.com/SohailKhan0525/demotion/releases/tag/v0.4.0)
for the MP4, HTML, poster, and checksums.

## Historical 0.3.0 release

At release, **@demotion/cli@0.3.0** carried the latest tag, was published by
qofeno-labs, and had no provenance attestation. The npm gitHead and source tag v0.3.0 both identify
cc1d0d7b0c406541e9204280de037221eeb6a8eb. The
[Release workflow](https://github.com/SohailKhan0525/demotion/actions/runs/41327785431)
and its source CI passed on 2026-11-01.

The illustration update adds DrawPath, FollowPath, usePathMotion and
WorkflowIllustration to the main entry, plus Scene3D and ExtrudedSvg to optional
/three. The 2D tools use @remotion/paths; the 3D tools use actual Three.js meshes,
SVG holes, materials, smooth normals and a frame-driven camera. See
[2D examples](illustration.md), [3D examples](three-illustration.md) and
[research](research-next.md). Existing data, typography, audio and CLI APIs remain.

The built entries share ShotContext so clocks and themes survive the package
boundary. The optional entry exports Fiber's ThreeElements type so consumer JSX
works. SVG artwork has documented input limits and unsupported-feature errors.

Validation: install, lint, build and 68 tests pass; CI covers Node 22 and 24.
A fresh packed consumer rendered the complete 450-frame 2D and 240-frame 3D
examples at 1920×1080 / 60 fps. The published runtime bundles and all 74 type
declarations match the tested candidate byte-for-byte. A separate registry CLI
project installed 0.3.0, compiled both examples, and rendered inspected 2D/3D
stills. The 2D package was also verified without the optional Three dependencies.

Release automation is separate from ordinary source pushes. It runs through a
manual Release dispatch or an explicitly authorized change to
.github/npm-release-request.json. The 0.4.0 request includes the Canvas launch film. A semantic-release dry run checks the
intended version before publication. Automatic issue/PR comments and failure
issues remain disabled. Provenance remains disabled. See docs/PUBLISHING.md.

Tagged releases through v0.3.0 and their published packages retain the terms
shipped with those artifacts. Preserve third-party notices in current builds.

## Films and examples

UpdateFilm is the 40-second / 120 BPM / 60 fps illustration-update promo. The
immutable update-030 tag points to the 0.3.0 release source. Its local render
passed format and full-decode checks, and the whole encoded timeline and first/
last frames were inspected. Public delivery is complete: the
[film run](https://github.com/SohailKhan0525/demotion/actions/runs/41328162078)
succeeded, and the 11.2 MB public MP4/poster downloads, hashes, full decode,
metadata, loudness and encoded timeline were verified. See
[delivery evidence](update-film/verification.md).
Use qa:update / render:update / check:update; see docs/update-film/README.md.
The workflow has an explicit path trigger for retries because semantic-release's
[skip ci] commit marker also suppressed the original tag-triggered run.

The source supports Launch, Lab, UI, LaunchV2, PromoLaunch and UpdateFilm
development compositions. The owner downloaded the original launch MP4. Keep generated
videos out of Git; the source and film workflows can regenerate them. Obsolete
publishing journals, old QA sheets and the unused Python pipeline were removed.

LaunchV2 is a separate 30-second / 128 BPM / 60 fps film; V2 is the film edition,
not an npm major version. Its immutable launch-v2 tag and GitHub film prerelease
contain the MP4, poster and checksums. The film was recorded before 0.2.0 and
labels the five new APIs as source previews; they are now available on npm.
Use npm run qa:v2 / render:v2 / check:v2. See docs/launch-v2/verification.md for
the verified public download, media checks and whole-timeline inspection.

PromoLaunch follows the calmer product-demo direction of the owner's uploaded
69.6-second OpenDuet/CopilotKit reference. It is an original 56-second / 120 BPM /
60 fps film with floating frame illustrations, readable code-to-video scenes
and synthesized music. src/promo owns the art and timeline. The reference
footage, UI, branding and audio are not redistributed. examples/promo-scene.tsx
uses APIs available since 0.1.0; its typography example was verified with a
fresh registry consumer and a complete 240-frame render.

Promo delivery is complete: immutable promo-launch points to
a4d2f9670c44c052ebb4c1c13ed7be7bbf1208b4. Its separate GitHub film prerelease
contains the 19.3 MB MP4, poster and checksums. Public downloads, hashes, full
decoding, frame count, stream starts, color, audio loudness and the encoded
timeline were verified. Use npm run qa:promo / render:promo / check:promo;
docs/promo/verification.md records the evidence. Do not move either film tag.
Film workflows publish media assets, not npm packages.

## Historical promotion drafts

The 27 October 2026 campaign drafts describe the package, terms and source
previews available when the second film was recorded. The immutable tag
preserves that copy and the original research limits. Use the current guide for
a GitHub release of the MIT checkout.
[October campaign archive](https://github.com/SohailKhan0525/demotion/tree/launch-v2/docs/launch-v2) · [Current launch guide](product-launch.md)
