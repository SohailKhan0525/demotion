# Verification: Second Take

Verified 27 October 2026. Film source is the immutable `launch-v2` tag at
`a007531`; main also contains the runner's explicit FFmpeg installation fix.

## Public delivery

The [public MP4](https://github.com/SohailKhan0525/demotion/releases/download/launch-v2/demotion-v2-launch.mp4)
and poster were downloaded from GitHub after the workflow completed. Both
matched the release's SHA256SUMS. The downloaded MP4 was decoded for a
whole-timeline contact sheet and visually inspected, rather than assuming the
remote render matched the local file.

| Property | Downloaded MP4 |
| --- | --- |
| Bytes | 19,663,535 |
| Duration | 30.000 seconds |
| Picture | H.264, 1920×1080, 60 fps, 1800 frames |
| Color | yuv420p, limited range, BT.709 |
| Audio | AAC, stereo, 48 kHz |
| Integrated loudness | −14.19 LUFS, measured with FFmpeg loudnorm analysis |
| True peak | −0.40 dBTP, measured after AAC encoding |
| Web playback | moov precedes mdat (faststart) |
| SHA-256 | a66a97e676c83495dc1534594dfb0ec63987abe4828f3fcfcee357349645c719 |

The local QA pass inspected the full-resolution first frame and 32 stills
covering all ten shots, early entrances, settled states, transitions and the
closing hold. The encoded local and public files were also sampled across the
full timeline. The film writes essential information on screen; it contains
music/effects and no spoken narration.

The first GitHub video run failed during encoder/browser preparation. The
workflow now provisions missing FFmpeg/ffprobe explicitly; the corrected
[Launch video run](https://github.com/SohailKhan0525/demotion/actions/runs/40467684279)
succeeded and published the checked assets. The film source tag was not moved.

## Components and consumer example

Installation, lint, build and all **40 tests** passed. The
[CI run on Node 22 and 24](https://github.com/SohailKhan0525/demotion/actions/runs/40467684214)
succeeded. Workflow syntax also passed actionlint.

The actual npm tarball was installed with a normal npm install into a separate
generated project outside the checkout. Its imports resolved through the package
entrypoint. TypeScript passed, and the exact tutorial example rendered fully:
1920×1080, 450 frames at 60 fps, 7.5 seconds. Its data and caption frames were
inspected; the README preview comes from that consumer render.

Tests cover signed/all-zero/empty charts, clipping maxima, non-finite values,
exact counter endpoints, decimal formatting, bounded progress, caption overlap,
half-open boundaries at fractional beat positions and reverse seeking. The
article's example equals the source file byte for byte, and its registration
snippet bundles against the public entrypoint.

The packed file set includes the new declarations, guide and complete example;
generated MP4s are excluded. No new runtime dependency was added.

## Launch copy and publication status

X posts passed twitter-text at **240 / 188 / 232 / 200 weighted characters**.
Bluesky drafts contain **242 / 214 graphemes**. The Mastodon draft contains
**415 characters**; actual account/instance limits must still be checked.

Current npm latest was checked as **0.1.0**. The new components are on main and
in the locally tested candidate, not that registry release. The film, README and
posts disclose this. The normal manual npm Release workflow remains separate.
No social post was published on the owner's behalf.

Live Reddit/DEV/X Help/HN rules could not be fetched through the environment
proxy. [Research notes](research.md) distinguish verified primary-source code
and Forem defaults from unverified live site/community policies.
