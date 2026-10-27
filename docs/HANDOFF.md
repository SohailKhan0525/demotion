# Current handoff

The owner authorized the npm organization package **@demotion/cli**, using
GitHub Actions secret **NPM_SECRET**. The authenticating npm account is
qofeno-labs. Do not use demotion (npm rejected its unscoped name), the deleted
@qofeno-labs/demotion, or any other namespace. Provenance must stay disabled.

The CLI executable remains demotion. Generated projects depend on and import
@demotion/cli directly. The package includes the main React toolkit, /audio and
optional /three exports. Version and public availability must be checked against
the registry; do not infer publication from a successful dry run or commit.

The source supports Launch, Lab and UI development compositions. The original
launch MP4 was downloaded by the owner and removed from the tracked tree, along
with obsolete publishing journals, old QA sheets and the unused Python pipeline.
Keep generated videos out of Git. The source can still regenerate the film.

Read README.md for supported user commands, docs/DEVELOPMENT.md for verification,
and docs/PUBLISHING.md for the release workflow. Preserve the license files and
terms. Older exported components remain for compatibility; future styling work
should be deliberate and tested, not implemented by deleting the public API.


Release status: @demotion/cli@0.1.0 is publicly available with latest=0.1.0,
publisher qofeno-labs and no provenance. Registry installation, types, Studio,
1080p rendering and the audio CLI were verified. The candidate also passed full
4K rendering and an optional 3D still. v0.1.0 matches npm's published gitHead.
The first-release bootstrap workflow is removed; only CI and manual Release remain.

Unreleased CLI fix: init now normalizes directory basenames into valid npm package
names, quotes the generated cd instruction and rejects an existing file cleanly.
Regression coverage includes spaces, quotes, Unicode and reserved npm names.
This change is on main; the published 0.1.0 package does not contain it yet.


Second-take work: five new public components (`CountUp`, `BarChart`, `CaptionTrack`,
`LowerThird`, `ProgressRing`) share Shot timing. See docs/components.md and the
complete examples/data-story.tsx. LaunchV2 is a separate 30-second / 128 BPM /
60 fps film; V2 is NOT the npm version. New APIs are source-preview additions,
not part of npm 0.1.0. The README, film and platform copy explicitly state this.

Commands: npm run qa:v2, npm run render:v2, npm run check:v2. Outputs are ignored
under out/launch-v2. A Launch video workflow renders the immutable launch-v2 tag
and publishes film assets to a GitHub prerelease; it never publishes npm.
Manual npm releases still use Release. docs/launch-v2 contains research, X,
Reddit, DEV and additional platform drafts. Live Reddit/DEV/X Help/HN pages were
blocked by the network proxy; do not claim their current rules were verified.
Forem's default policy source was inspected and is distinguished from DEV rules.

Delivery is complete: the public launch-v2 GitHub release contains the MP4,
poster and checksums. Both assets were downloaded and checksum-verified; the
public MP4's format, faststart, loudness and whole-timeline frames were checked.
See docs/launch-v2/verification.md for exact results and workflow links. All 40
tests pass on Node 22/24. The external candidate consumer passed types and a full
450-frame DataStory render. npm latest remains 0.1.0; no new npm release or social
post was made during this work. Keep provenance disabled for future npm releases.
