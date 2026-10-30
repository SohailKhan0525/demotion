# Current handoff

The owner authorized the npm organization package **@demotion/cli**, using
GitHub Actions secret **NPM_SECRET**. The authenticating npm account is
qofeno-labs. Do not use demotion (npm rejected its unscoped name), the deleted
@qofeno-labs/demotion, or any other namespace. Provenance must stay disabled.

The CLI executable remains demotion. Generated projects depend on and import
@demotion/cli directly. The package includes the main React toolkit, /audio and
optional /three exports. Verify publication against the public registry; a
successful dry run or source push alone does not publish a package.

## Current npm release

**@demotion/cli@0.2.0 is published**, with latest=0.2.0, publisher qofeno-labs
and no provenance attestation. The npm gitHead and source tag v0.2.0 both identify
361560ded0cbb9721b2df333d2da317c5beb7cd4. The
[Release workflow](https://github.com/SohailKhan0525/demotion/actions/runs/41098657398)
and its source CI passed on 2026-10-30.

This release includes CountUp, BarChart, CaptionTrack, LowerThird and ProgressRing,
plus CLI fixes for spaces, quotes, Unicode, reserved npm names and existing files.
See docs/components.md and the packaged examples/data-story.tsx. Existing users
can upgrade with `npm install @demotion/cli@latest`.

The registry release was verified in a fresh external project: all five exports,
CLI folder-name normalization, TypeScript, the complete 450-frame / 7.5-second
DataStory render at 1920×1080 / 60 fps, and the README's 5.5-second audio example.
The encoded timeline and full-resolution data/caption frames were inspected.
Installation, lint, build and all 51 source tests pass.

Release automation is separate from ordinary source pushes. It runs through a
manual Release dispatch or an explicitly authorized change to
.github/npm-release-request.json. That file currently records the completed
0.2.0 request; do not edit it during routine work. A semantic-release dry run
checks the intended version before publication. Automatic issue/PR comments and
failure issues are disabled. See docs/PUBLISHING.md.

Read README.md for supported commands and docs/DEVELOPMENT.md for verification.
Preserve the license files and terms. Older exported components remain for
compatibility; do not delete public APIs as part of styling work.

## Films and examples

The source supports Launch, Lab, UI, LaunchV2 and PromoLaunch development
compositions. The owner downloaded the original launch MP4. Keep generated
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

## Promotion

docs/launch-v2 contains research and drafts for X, Reddit, DEV and other
platforms. Older copy refers to npm 0.1.0 and source-preview components; update
those claims to 0.2.0 before reusing it. Live Reddit/DEV/X Help/HN pages were
blocked by the network proxy during research; do not claim their current rules
were verified. Forem's default policy source was inspected and is distinguished
from DEV rules. No social post is sent automatically.
