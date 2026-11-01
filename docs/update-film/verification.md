# Verified illustration-update delivery

Checked on 2026-11-01 against the actual public downloads. The
[film workflow](https://github.com/SohailKhan0525/demotion/actions/runs/41328162078)
succeeded in 28 minutes 40 seconds. Its immutable `update-030` tag identifies
`cc1d0d7b0c406541e9204280de037221eeb6a8eb`, also the npm 0.3.0 release source.

## Downloads

- [MP4](https://github.com/SohailKhan0525/demotion/releases/download/update-030/demotion-update-030.mp4)
- [Poster](https://github.com/SohailKhan0525/demotion/releases/download/update-030/poster.png)
- [SHA256SUMS](https://github.com/SohailKhan0525/demotion/releases/download/update-030/SHA256SUMS)

The complete MP4 and poster were downloaded and both match the published
checksums. MP4 size: **11,208,203 bytes**. Poster size: **1,190,611 bytes**.

```text
77ea52a1811719f004971b7dd9c99e073a385c4ed176d7ea62dcd821ea12b49e  demotion-update-030.mp4
9bba1f1305840c2ee549d468221a6f0e74281c9d906c61e773473132dd1b434c  poster.png
```

## Media and visual checks

| Check | Public file result |
| --- | --- |
| Picture | H.264, 1920×1080, 60 fps, 2,400 frames |
| Duration | 40 seconds; both streams start at zero and last 40 seconds |
| Color | Limited-range yuv420p; BT.709 matrix, transfer and primaries |
| Audio | Stereo AAC, 48 kHz |
| Loudness | −15.24 LUFS integrated; −3.39 dBTP true peak; 7.1 LU loudness range |
| Streaming layout | Faststart: moov precedes mdat |
| Integrity | Full FFmpeg video/audio decode completed without errors |

Loudness values are the input statistics from FFmpeg's loudnorm analysis; that
analysis did not rewrite the delivered file. The score is original and follows
the same 120 BPM clock as the 80-beat picture.

Visual review covered 26 source stills and a whole-timeline sheet, full-resolution
art/code frames and poster, the local encoded timeline and a dense 2D-to-3D
transition strip. The downloaded public MP4 was then reviewed through a
40-sample whole-timeline sheet and its exact first and last frames. The opening
is composed at frame zero; the final command remains visible for the closing
six-second scene. SVG paths, actual extruded geometry and readable code appear
in the intended sequence. Motion blur uses two sub-frame samples in 3D shots and
four elsewhere, with a 160-degree shutter.

The local and GitHub render bytes differ across browser/encoder builds; the
checksums above identify the public delivery. Generated videos remain outside
Git. The [reproduction guide](README.md) regenerates the source composition.

## Package claims

`@demotion/cli@0.3.0` is public with latest=0.3.0, publisher qofeno-labs and no
provenance attestation. Its gitHead agrees with v0.3.0 and the film source.
The [semantic-release run](https://github.com/SohailKhan0525/demotion/actions/runs/41327785431)+completed successfully.

Install, lint, build and 68 tests pass, with Node 22/24 CI. The candidate's
complete 450-frame 2D and 240-frame 3D examples were rendered in an external
project and inspected. All three published runtime bundles and 74 declaration
files match that tested candidate. A separate project created by the public CLI
installed 0.3.0, compiled both examples and rendered inspected 2D/3D stills. The
core installation was verified without Three.js; optional peers were then added
using the documented versions. See [development evidence](../DEVELOPMENT.md).
