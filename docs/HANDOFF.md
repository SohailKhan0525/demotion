# demotion — handoff to the next agent

Owner: solo developer (npm user **qofeno-labs**, GitHub **SohailKhan0525**, Ko-fi https://ko-fi.com/qofenoai). No team, no lawyer. Goal: **a polished product-launch demo video** to announce the package, and a package real users can `npm i demotion` and use on their own laptop. **Quality matters far more than duration** (15 s or 2 min — irrelevant).

Repo: https://github.com/SohailKhan0525/demotion · package name **`demotion`** (unscoped, free on npm as of last check) · licence **PolyForm Noncommercial 1.0.0** + commercial licence (Solo/Team/Company, sold via Ko-fi).

## 1. Current state (verified: lint ✔, build ✔, 21 tests ✔, GitHub Actions green)
- `src/core` — `createBeatClock` (author in beats, rounds to landing frames), closed-form damped `spring(t,hz,zeta)`, `outExpo/inExpo/outBack/bezier…`, `decay`, `shake` (hit-driven, decaying), `noise1`. Tested.
- `src/engine` — `MotionProject` + `<Shot beats bg wipe hit blurSamples>` (lays shots on the clock, camera rig, wipes, grain/vignette, **real shutter motion blur** via `@remotion/motion-blur`), `useShot()` → `{frame, at(beats), clock, theme}`, `CameraRig` (beat/bar punch, drift, decaying shake), `Look` (grain + vignette), `Wipe` (slide | slats | iris | diagonal; covers exactly on the beat the next shot lands), `theme.ts` (ink `#0D0E12`, chalk `#F2F0EA`, field `#2B3CFF`, accent `#D4FF3A`, spark `#FF4B1F`).
- `src/type` — `KineticHeadline` (spring letter drop, stretch/squash, shockwave, underline), `WideStack` (Archivo **variable width axis** rows fitted to one column).
- `src/audio` — **pure-TypeScript soundtrack engine** (no Python): music bed (pad/bass/pluck/kick/hat/clap, sidechain, reverb) + 15 cue kinds on the beat clock, **BS.1770 LUFS mastering** (default −14, ceiling ≈ −1 dBFS), WAV writer. CLI: `npx demotion audio cues.json out.wav`. Tests prove: cue onset within 1 ms, whoosh crest on the beat, loudness, determinism, tempo, WAV validity.
- `src/three` — `Stack3D` (real three.js panels + **true depth-of-field/bokeh**, rack focus), `panels.ts` (canvas painters: window, terminal, code), `RubiksCube`. Needs optional peer installs (see README).
- `bin/demotion.js` — `init`, `audio`, `license`. `template/` = starter project (copies fonts incl. licences).
- Fonts bundled (OFL, texts in `public/fonts/licenses`): Archivo (wght+wdth), Abril Fatface, Barlow Semi Condensed, JetBrains Mono.
- CI (`.github/workflows/ci.yml`) and Release (`release.yml`, semantic-release; the release step is **skipped until the repo secret `NPM_TOKEN` exists**). Tag `v0.0.0` exists so the first release is **0.1.0**.
- `src/lab/Lab.tsx` (composition id `Lab`) = look-test: MOTION / CODE / demotion / RENDER shots. Looked good.

## 2. Known problems / cleanup
1. **Older components violate the quality rubric** (`src/components/*`, `src/components/reel/*`: linear `interpolate`, pure black/white, old purple/pink look, 30-fps assumptions). Run the audit tool from the owner's guide (`05_tools/audit.mjs src`) and fix or delete. Candidates to **delete**: `src/reel/DemoReel.tsx` (a rejected copy of the reference reel), anything under `src/v2` that is not `Blobs`/`primitives` still used by `lib.ts`.
2. `Terminal` / `CodePanel` UI components, the launch demo and its tests were **lost in a sandbox reset before being pushed** → recreate (specs in §4/§5).
3. `ParticleText` and 3D panels still use the old purple palette/“Inter” font in canvas strings → switch to theme colours and `"Archivo"`.
4. `remotion.config.ts` reads `DEMOTION_BROWSER` / `DEMOTION_CONCURRENCY` env vars (only needed in containers).
5. README/Docs: add a short “Quick tour of components”, `demotion audio` docs, `cues.json` example. Add `CHANGELOG`-free (semantic-release writes it).
6. Template `package.json` pins `@remotion/*` to `config.remotionVersion` (4.0.528). Consider bumping Remotion to the latest 4.0.x (all `@remotion/*` must match `remotion` exactly) and re-run everything.

## 3. Task list (do in order, push after each)
T1 Recreate `src/ui/Terminal.tsx` + `src/ui/CodePanel.tsx` (flat window, typed lines on beats, caret; spring pop-in) and export from `src/lib.ts`.
T2 Recreate `src/launch/{timeline.ts,code.ts,shots.tsx}`, `scripts/launch-audio.mjs`, `test/launch.test.mjs` (§5).
T3 Port the 3D shot (`src/launch/StackShot.tsx`) using `Stack3D` + `panels.ts` (§5, shot 8).
T4 `src/launch/LaunchDemo.tsx` (MotionProject over `SHOTS`, wipes per §5), register composition **`Launch`** (1920×1080, **60 fps**, `durationInFrames = launchClock.duration(LAUNCH_BEATS)`), add `<Audio src={staticFile("launch-soundtrack.wav")}/>`.
T5 **QA loop:** render stills for every shot (+ mid-wipe frames) → contact sheet → fix; then whole-timeline overview; check rhythm of colours (no two adjacent shots with the same background), every hero different. Then render: `node scripts/launch-audio.mjs && npx remotion render src/index.ts Launch out/demotion-launch.mp4` (H.264, CRF ≤ 18). Measure: picture-cut vs audio-hit offsets (<1 frame), LUFS ≈ −14, peak ≤ −1 dBFS.
T6 Run the audit tool; fix/delete old components; keep tests green.
T7 README polish (honest status, quick start, licence table, Ko-fi). Keep `npx demotion init` flow tested (`test/cli.test.mjs`).
T8 Optional: a 9:16 and a 1:1 cut; a `demotion doctor` command (Node ≥ 18, browser available, fonts present).
T9 Owner publishes: see §8.

## 4. Component specs to recreate
- **Terminal** `<Terminal lines title width height fontSize/>`; line = `{at(beats), text, type?(beats), color?, prompt?}`; window `#14161C`, 2 px chalk/20 % border, radius 26; title bar; JetBrains Mono; accent-coloured `$`; caret blinks (accent); spring pop-in (`spring(t,4.5,0.62)`).
- **CodePanel** `<CodePanel file lines at over colors/>`; lines slide in across `over` beats (`outExpo`), newest line highlighted with accent left border; line numbers dim.
- `src/launch/code.ts` exports `MYVIDEO` (tokenised) = **byte-identical** to `template/src/MyVideo.tsx` (test it), plus `INIT_CMD = "npx demotion init my-video"`, `RENDER_CMD = "npm run render:4k"`.

## 5. Launch demo — storyboard (120 BPM, 60 fps, 1 beat = 30 frames; 52 beats ≈ 26 s)
Single source of truth: `src/launch/timeline.ts` (`SHOTS` with beats + cues; `launchSpec()` builds the soundtrack: whoosh + hit on every cut, `flashHit` on `cut:"flash"`, music: kick beats 12→end-6, hat 16→end-6, clap 20→end-8, arp+bass throughout, −14 LUFS, tail 2 s, fade 1.4 s).

| # | beats | shot | bg | wipe into it | content (all must be TRUE) |
|---|---|---|---|---|---|
| 1 | 2 | motion | field | — | `KineticHeadline "MOTION"` (accent letter I) |
| 2 | 2 | code | chalk | slide, accent lime | `WideStack "CODE"` rows wdth 62/100/125 |
| 3 | 3 | meet | ink | slats, accent field | `KineticHeadline "demotion"` + typed subline “MOTION GRAPHICS, WRITTEN IN CODE” (Barlow, 9 px tracking) |
| 4 | 4 | nolist | chalk | diagonal, accent spark | lines slam in on beats: “NO TIMELINE.” “NO SCREEN RECORDINGS.” (struck through by next beat) → “JUST CODE.” on an accent highlight block |
| 5 | 4 | terminal | ink | slide, accent lime | typed `npx demotion init my-video`, then the **real CLI output**: `✔ Created my-video/` · `✔ Copied fonts to public/fonts` · `Next: cd my-video && npm install && npm start` · licence + Ko-fi lines |
| 6 | 4 | codepanel | field | iris, accent ink | `CodePanel` file `src/MyVideo.tsx`, the 14 real lines revealed over 2.6 beats |
| 7 | 3 | number | chalk | slats, accent field | `NumberRoll "3840"` caption “× 2160 · 4K · ON YOUR LAPTOP” (true: `--scale=2`) |
| 8 | 10 | stack | ink | diagonal, accent lime | **3D stack, lens blur** (`blurSamples={1}` — heavy). 3 panels: code → live preview (timeline 60f+90f=150f, playhead) → render terminal (`npm run render:4k`, progress bar, `Rendered 150/150`, `Encoded 150/150`, `+ out/video-4k.mp4 (3840×2160)`). Panels at `[4k, −0.55k, −2.6k]`; camera sits 6.6 units in front of the focused panel; keys: overview `[8.2,3.2,16.5]→look[6.2,−0.9,−4.2]`, arrive P0 @1.4b, go1 2.8b, P1 @3.8b, go2 5.4b, P2 @6.4b; focus = camera distance + focus-pull dip mid-move; bokeh 8→11. |
| 9 | 4 | bands | field | slide, accent spark | `MarqueeBands` (directional blur) with only real features: BEAT-SYNCED MOTION • SPRING PHYSICS • EXPO EASING / REAL MOTION BLUR • CAMERA RIG • BEAT-LANDED WIPES / LENS BLUR • 3D PANELS • VARIABLE-WIDTH TYPE / SOUND ENGINE • LUFS MASTERING • 4K RENDERS |
| 10 | 4 | sound | ink | slats, accent lime | “SOUND, BUILT IN.” + 56 bars that jump on every beat (`decay(clock.sinceBeat(globalFrame),0.13)`), caption “120 BPM · −14 LUFS · CUES LAND WITHIN 1 MS OF THE BEAT” (true: audio tests) |
| 11 | 4 | license | chalk | iris, accent ink | “FREE TO START.” + two cards: PERSONAL & NON-COMMERCIAL → FREE · TEAMS & COMPANIES → COMMERCIAL LICENSE (Solo · Team · Company) + `ko-fi.com/qofenoai`. **Re-render this shot if the licence changes (§7).** |
| 12 | 2 | ptext | ink | slide, accent spark | `ParticleText "demotion"` (cut:"flash") |
| 13 | 6 | final | field | diagonal, accent lime | asterisk mark, “demotion” (glow), tagline, typed pill `npm i demotion`, `github.com/SohailKhan0525/demotion · ko-fi.com/qofenoai`, “FREE FOR PERSONAL USE · COMMERCIAL LICENSES FOR TEAMS & COMPANIES” |

Cue timing per shot is in `timeline.ts` (typing steps = real character counts: 32, 26, 14, 14). Hit-camera shake is automatic at every shot landing.

## 6. Pitfalls already hit (save yourself the time)
- `CameraMotionBlur` renders children at **fractional frames** → every component must be a pure function of `useCurrentFrame()`; `Sequence` is fine, `Series` is not needed.
- Rounding: at 128 BPM/60 fps a beat lands on a non-integer frame → `clock.sinceBeat` is measured from the **rounded landing frame** (tested). Don’t reintroduce `frame % framesPerBeat`.
- Software-GL 3D costs ~4 s/frame on one core: render the stack shot with `blurSamples={1}`, in chunks of ≤ 50 frames if the machine is slow; real GPUs are far faster.
- Remotion `Audio` + chunked renders → use `--muted` for chunks and mux one soundtrack with ffmpeg, or render the whole film in one go with `<Audio>`.
- `npm ci` needs a lockfile that matches `package.json`; CI currently uses `npm install` (the lockfile could not be refreshed through the GitHub API). Regenerate and commit `package-lock.json`, then switch CI back to `npm ci`.
- All `@remotion/*` versions must equal `remotion` exactly. `@remotion/motion-blur`, `layout-utils`, `fonts`, `noise`, `transitions` are **peer deps** (starter template installs them).
- Sandboxes get wiped: **push after every batch.**

## 7. Decisions pending with the owner (ask, don’t assume)
1. **Licence strategy vs “Claude for Open Source”.** Anthropic’s programme (https://www.anthropic.com/claude-for-oss-terms — re-read before applying) requires, among other things, a project under an **OSI-approved licence**, real public contribution activity, and for the maintainer track substantial usage metrics (dependents/downloads/contributors) or an ecosystem-impact case; it rejects inflated/gamed metrics and ignores duplicate applications. **PolyForm Noncommercial is not OSI-approved**, and a brand-new package has no usage, so demotion does **not** qualify today on two independent grounds; switching to MIT alone would not fix the second. Options: (A) keep PolyForm (monetise via commercial licences; no programme), (B) MIT/Apache-2.0 core + paid templates/support/Ko-fi (programme possible once there is traction), (C) open-core. The owner’s GitHub account is >2 years old (created 2024-05-12). Do **not** apply or change licence until the owner decides.
2. Ko-fi shop items for Solo/Team/Company + prices (`COMMERCIAL-LICENSE.md` currently says “pick the tier on Ko-fi”; Team = up to 10 people is a proposal).
3. Governing law/country for the commercial terms (omitted on purpose); the text is plain-language and **not lawyer-reviewed**.
4. When to publish 0.1.0 (see §8). Recommended: after the launch video is done and README polished.

## 8. Release & publish (owner actions)

**Updated owner decision:** first version is `0.1.0`, published manually by the
owner, without provenance. Follow [PUBLISHING.md](PUBLISHING.md). The earlier
token/automatic-first-release instructions below are historical and superseded.
Future GitHub releases are manually dispatched and also have provenance disabled.

### Historical plan (superseded)
1. npm: log in as **qofeno-labs**; create a token that can publish a **new unscoped package** (granular token with access to “all packages” read+write, or a classic *Automation* token); 2FA must not block automation.
2. GitHub → repo Settings → Secrets and variables → Actions → new secret **`NPM_TOKEN`**.
3. Re-run the latest “Release” workflow (or push a `feat:`/`fix:` commit). semantic-release then tags, writes `CHANGELOG.md`, publishes `demotion@0.1.0` with provenance, creates the GitHub release. `npm i demotion` / `npx demotion init my-video` then work from the registry (**verify from a clean folder**; until then the README says “pre-release”).
4. Revoke any tokens that were pasted into chats.

## 9. Reference material the owner must attach to your task
- `motionkit_knowledge_pack.zip` and `ALL_IN_ONE_core_docs.md` (written by another Claude chat that made a 15 s showreel; contains the craft rules, audit tool and reference source) and `claude_motion_reel.mp4` — **learn the method, do not copy the video**. Key lessons: one beat clock; springs/expo, never linear; stagger 2–4 frames; anticipation + overshoot; camera punch per beat/bar + decaying shake; real motion blur; five colours, no pure black/white; grain; transitions = flat colour shapes landing on the beat in the next shot’s colour; frame 0 is a composed poster; every shot has a different hero treatment; **always look at frames**.
