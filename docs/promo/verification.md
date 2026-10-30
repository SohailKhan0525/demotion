# Promo verification

Recorded 30 October 2026. Film and package versions are independent.

## Source and examples

- All 47 source tests pass, including scene/audio timing, displayed-code parity,
  documentation registration, worker frame ranges and media validation failures.
- TypeScript checking and the package build pass. `actionlint` accepts the new
  film workflow; `git diff --check` reports no whitespace errors.
- A fresh external project was created with the exact published `npx --yes
  @demotion/cli@latest init demotion-promo-consumer` command. Normal installation
  resolved `@demotion/cli@0.1.0` from npm.
- The exact `examples/promo-scene.tsx` plus the registration from the promo guide
  passed TypeScript in that external project and rendered a full H.264 MP4:
  1920×1080, 60 fps, 240 frames, 4 seconds. Its settled headline was inspected.
- The 38-frame promo storyboard and full-resolution opening poster were visually
  inspected. The gallery progress number's contrast was corrected afterward.
- The original score was analyzed with FFmpeg: approximately −16.14 LUFS
  integrated, −3.66 dBTP before the final MP4's trim/fade/AAC encoding. These are
  input-analysis measurements, not a claim of a listening review.

## Local full film

The full export passed its delivery checker and decoded through all 3,360 frames
without FFmpeg errors. The 56-frame encoded contact sheet (one frame per second)
and full-resolution code, data, gallery, setup and ending frames were inspected.
The two worker joins at frames 1,120 and 2,240 were compared with independent
global-frame renders (SSIM approximately 0.977 and 0.965 after video compression
and color conversion).

| Check | Result |
| --- | --- |
| Picture | H.264, 1920×1080, 60 fps, 3,360 frames, 56 seconds |
| Color | BT.709, limited-range yuv420p |
| Audio | AAC, stereo, 48 kHz; starts at zero, 56 seconds |
| Web playback | `moov` precedes `mdat` (faststart) |
| Final audio analysis | −16.14 LUFS integrated, −3.53 dBTP, 4.90 LU loudness range |
| Local MP4 SHA-256 | `b010c022b090c0699c39e2b10a70f68f18e67e8b67617dca6a2c99793ada304b` |

## Verified public download

The [film release](https://github.com/SohailKhan0525/demotion/releases/tag/promo-launch)
is live. The MP4, poster and SHA256SUMS were downloaded from their public GitHub
URLs; both asset hashes match the release manifest. The downloaded MP4 passed
the same stream/faststart checker, decoded all 3,360 frames without errors, and
its whole-timeline contact sheet and full-resolution poster were inspected.

| Public asset | Bytes | SHA-256 |
| --- | --- | --- |
| `demotion-promo-launch.mp4` | 19,300,354 | `071b90dcdadcb5bf5b5f54fa79d2bc4d4b9436ba490faf1ff3877604ae159e2f` |
| `poster.png` | 1,747,646 | `7a21b5c97e56798ac74fd6e78a340c4734244ebdbdcf6f457539a413a3e1cc42` |

Public picture/audio dimensions, duration, frame rate and stream start times
match the table above. Audio measured −16.14 LUFS integrated, −3.39 dBTP and
4.90 LU loudness range. The public encoding differs from the local file because
the runner's browser, encoder and worker split differ.

[Direct MP4 download](https://github.com/SohailKhan0525/demotion/releases/download/promo-launch/demotion-promo-launch.mp4).

Source commit: `a4d2f9670c44c052ebb4c1c13ed7be7bbf1208b4`, immutable tag
`promo-launch`. [Main CI](https://github.com/SohailKhan0525/demotion/actions/runs/41090742754)
and [tag CI](https://github.com/SohailKhan0525/demotion/actions/runs/41090773768)
passed. The [film publishing workflow](https://github.com/SohailKhan0525/demotion/actions/runs/41090773843)
succeeded in 18m 58s.

The published package remains 0.1.0. This work does not publish a new npm version
or make a social-media post. The input reference is not included in the outputs.
