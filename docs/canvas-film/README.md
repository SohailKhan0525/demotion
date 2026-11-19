# Type in motion

[Watch the film (MP4)](https://github.com/SohailKhan0525/demotion/releases/download/v0.4.0/demotion-canvas-launch.mp4) · [Download the editable title card](https://github.com/SohailKhan0525/demotion/releases/download/v0.4.0/canvas-launch.html) · [YouTube reference notes](references.md) · [Frame review](verification.md)

## Try the edit shown in the film

Open the downloaded HTML in a browser, or use Node.js 22.14+ to save the same file from npm.

```sh
npx --yes @demotion/cli@0.4.0 demo
```

1. Open `canvas-launch.html`. Replace **On cue** with **Daybreak**.
2. Choose **96 BPM**, then **Play**. Twelve beats take 7.5 seconds at this tempo.
3. Scrub to a frame you like. **Save frame** downloads the current 960 × 540 canvas as `demotion-launch-frame.png`.

To make your own animated clip, choose **Export clip**. Keep the tab visible while it records. In Chrome, the download is a silent WebM at 960 × 540. A browser with supported MP4 recording can produce an MP4 instead. The exported clip lasts twelve beats at the selected tempo.

The editor is a single HTML file with an inline JavaScript drawing function and native browser controls. It works offline after download. You can change its colors, typography, or folded shape in a text editor.

## How the film works

| Film time | Picture |
| --- | --- |
| 0–4 s | The folded shape and opening title establish the design. |
| 4–8 s | The edit from “On cue” to “Daybreak” appears in the field and on the card. |
| 8–12 s | The tempo changes from 120 to 96 BPM and playback starts. |
| 12–18 s | The canvas fills the screen as the playhead moves through the title animation. |
| 18–21 s | Save frame reveals the finished card with its PNG filename. |
| 21–24 s | The npm command stays on screen so the viewer can make their own copy. |

The film calls the same `drawTitleCard` function as the [editable example](../../examples/canvas-launch.html). The film illustrates the editor controls and pointer around that live drawing. The [film drawing code](https://github.com/SohailKhan0525/demotion/blob/v0.4.0/scripts/canvas-film/visuals.mjs) adds the camera framing, chapter titles, and transitions. The [renderer](https://github.com/SohailKhan0525/demotion/blob/v0.4.0/scripts/canvas-film/render.mjs) registers the bundled fonts and uses Demotion’s beat clock and audio engine for the score. The film stays at 120 BPM as the title editor demonstrates its independent 96 BPM setting.

## Render and review from source

Use Node.js 22.14+ and FFmpeg with ffprobe, H.264 encoding, and the drawtext filter. From the repository root:

```sh
npm ci
npm run render:canvas
npm run check:canvas
```

The render writes a 24-second 1920 × 1080 H.264 MP4 with stereo AAC and a full-size poster to `out/canvas-film/`. For quick art changes, run `npm run build` once and then `node scripts/canvas-film/render.mjs --stills`.

The check decodes the video and audio, checks each of the 720 frame timestamps, measures loudness and flags runs of low contrast or little motion. It saves 24 numbered contact sheets in `out/canvas-film/qa/`, one for each second, plus full-size frames around cuts. Use the sheets to check continuity and the full-size frames to check text and framing. The JSON report includes the reviewed file’s SHA-256.

[Download all 720 numbered frames as contact sheets](https://github.com/SohailKhan0525/demotion/releases/download/v0.4.0/frame-review.zip). The ZIP also includes the per-frame measurements and audio report for the published MP4.

To verify the downloads, put the MP4, HTML, poster, frame-review.zip, and SHA256SUMS from the same [release](https://github.com/SohailKhan0525/demotion/releases/tag/v0.4.0) in one directory and run `sha256sum -c SHA256SUMS`.
