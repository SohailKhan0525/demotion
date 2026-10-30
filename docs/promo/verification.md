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

## Full film delivery

The full export and public download are pending at this source checkpoint. A
passing source test suite is not evidence that an MP4 has been delivered. The
delivery workflow validates each output before publishing; public URL, checksum,
encoded timeline and final audio measurements must be checked after it finishes.

The published package remains 0.1.0. This work does not publish a new npm version
or make a social-media post. The input reference is not included in the outputs.
