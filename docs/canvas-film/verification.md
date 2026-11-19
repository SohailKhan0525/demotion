# Canvas film review

On 19 November 2026 the local release candidate produced `demotion-canvas-launch.mp4` (18,581,263 bytes). Its SHA-256 was `be0d400863f12df1cc3b873f7f6c81e020a9363f57874641f81bfc9b818edfbe`. The public release carries its own `SHA256SUMS`; its [frame review archive](https://github.com/SohailKhan0525/demotion/releases/download/v0.4.0/frame-review.zip) contains the contact sheets and measurements from the hosted build.

| Check | Local result |
| --- | --- |
| Picture | 1920 × 1080 H.264, limited-range BT.709, 30 fps, 24.000 seconds, faststart |
| Frame timing | All 720 frames decoded with their expected presentation timestamps |
| Sound | Stereo AAC at 48 kHz, 24.000 seconds, −14.68 LUFS integrated, −0.50 dBTP true peak |
| Visual inspection | Frames 0–719 on 24 numbered sheets, with 46 full-resolution stills for text, cuts and holds |
| Source comparison | All 720 decoded frames matched their expected source index or tied with an adjacent held frame in a downsampled luma comparison |

The first cut crowded the opening title and clipped words in the tempo close-up. The final cut gives the folded ring its own space and keeps the whole title and tempo selector visible. Every low-motion span was checked against the edit, export, or end-card hold. The encoded soundtrack also leaves a short rest before the save accent.

Run `npm run render:canvas` and `npm run check:canvas` from the checkout to generate the MP4, numbered sheets, full-size stills, per-frame measurements, and report.
