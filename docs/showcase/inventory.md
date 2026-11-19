# Source inventory for the Demotion showcase

Use this index to find the code behind a shot, the example you can edit or the check that protects it. The baseline is **@demotion/cli 0.4.0**, commit `c9ff499311f6e891d009b7b8561093567cd14b21`. Baseline links open that exact revision. The [0.5.0 supplement](#files-added-for-the-050-showcase) lists the new and revised paths. The [showcase guide](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/docs/showcase/README.md) covers the new edit and its playback and render commands. The [chapter timeline](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/showcase/timeline.ts), [component gallery](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/showcase/Gallery.tsx) and [specimen scenes](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/showcase/Specimens.tsx) show how the showcase uses the baseline.

There are **204 tracked files in 37 subdirectories**, plus the repository root. This includes 193 text files, five decoded preview images and six inspected WOFF2 fonts. The command-line executable is the one file tracked with an executable bit. The role column describes the baseline contents. The last column names a chapter that uses the code, an original film whose source is excerpted, or a supporting task. The original film labels refer to their own compositions and production files, which can extend beyond the excerpt.

| Area | Files |
| --- | ---: |
| Repository root | 14 |
| `.github/` | 9 |
| `bin/` | 1 |
| `docs/` | 33 |
| `examples/` | 6 |
| `public/` | 10 |
| `scripts/` | 16 |
| `src/` | 91 |
| `template/` | 8 |
| `test/` | 16 |
| **Total** | **204** |

From a clone, reproduce the baseline and compare it with the inventory. The last command lists every distinct pathname touched through the release.

```sh
git ls-tree -r --name-only v0.4.0
git ls-tree -d -r --name-only v0.4.0
git log --reverse --format='%h %as %s' v0.4.0
git log --format= --no-renames --name-only v0.4.0 | sed '/^$/d' | sort -u
```

To check the file rows directly, run this in Bash from the repository root. A matching inventory produces an empty diff. Repeated or missing rows produce a difference.

```bash
git ls-tree -r --name-only v0.4.0 | sort | diff - <(
  sed -nE 's@^\| \[([^]]+)\]\(https://github.com/[^)]+/blob/c9ff499[0-9a-f]+/[^)]+\).*@\1@p' docs/showcase/inventory.md | sort
)
```

## Package and repository root

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [.gitignore](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/.gitignore) | Keeps generated movies, score WAVs, package tarballs, dependencies and build directories out of the source tree. | Packaging and contributor setup |
| [.npmrc](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/.npmrc) | Sets npm’s peer-dependency resolution mode used by local installs and Actions. | Packaging and contributor setup |
| [.releaserc.json](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/.releaserc.json) | Configures the release branches, changelog, npm and GitHub publishing, and the version commit. | Packaging and contributor setup |
| [AGENTS.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/AGENTS.md) | Records maintainer requirements for beat timing, palette, honest film claims, local validation and releases. | Packaging and contributor setup |
| [CHANGELOG.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/CHANGELOG.md) | Dates the public features and fixes that a release announcement can attribute to each package version. | Packaging and contributor setup |
| [CONTRIBUTING.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/CONTRIBUTING.md) | Gives contributors the install, check and pull request commands for changes to the project. | Packaging and contributor setup |
| [LICENSE](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/LICENSE) | Contains the MIT grant and copyright notice for Demotion-owned work in this revision. | Packaging and contributor setup |
| [README.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/README.md) | Introduces the product, gives the first runnable commands and links the editor, example pictures, films and source. | Packaging and contributor setup |
| [THIRD_PARTY_NOTICES.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/THIRD_PARTY_NOTICES.md) | Identifies upstream software and bundled font terms that accompany the toolkit and generated projects. | Packaging and contributor setup |
| [package-lock.json](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/package-lock.json) | Records the resolved installation used by the release runner. Lockfile v3 has 844 package records including the root, with integrity values on 648. | Packaging and contributor setup |
| [package.json](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/package.json) | Declares v0.4.0, the executable, the main, audio and optional Three entries, published files, peer versions and film commands. | Packaging and contributor setup |
| [remotion.config.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/remotion.config.ts) | Sets JPEG intermediates, output overwrite behavior and optional browser and concurrency overrides for local film renders. | Packaging and contributor setup |
| [tsconfig.build.json](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/tsconfig.build.json) | Emits declarations for the three package entry points under dist/types so consumer scenes type-check. | Packaging and contributor setup |
| [tsconfig.json](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/tsconfig.json) | Applies strict TypeScript checking to the toolkit and its repository Remotion configuration. | Packaging and contributor setup |

## GitHub operations

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [.github/FUNDING.yml](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/.github/FUNDING.yml) | Supplies the repository’s Ko-fi sponsor link, also covered by the package tests. | Hosting and release automation |
| [.github/ISSUE_TEMPLATE/bug_report.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/.github/ISSUE_TEMPLATE/bug_report.md) | Prompts users for reproduction steps and their environment when a project or render fails. | Hosting and release automation |
| [.github/npm-release-request.json](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/.github/npm-release-request.json) | Requests the specific 0.4.0 version and its canvas-launch film in the guarded release workflow. | Hosting and release automation |
| [.github/workflows/ci.yml](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/.github/workflows/ci.yml) | Checks dependencies, TypeScript, bundles, tests and pack contents on Node 22 and 24. | Hosting and release automation |
| [.github/workflows/launch-video.yml](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/.github/workflows/launch-video.yml) | Builds and verifies the Second Take film from its tagged source and delivers the launch-v2 assets. | Hosting and release automation |
| [.github/workflows/preview.yml](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/.github/workflows/preview.yml) | Renders sample shots and license cards from four Remotion films, exercises real Canvas downloads and uploads previews. | Hosting and release automation |
| [.github/workflows/promo-video.yml](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/.github/workflows/promo-video.yml) | Renders the tagged Ideas deserve motion film, validates it and attaches its poster and checksums. | Hosting and release automation |
| [.github/workflows/release.yml](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/.github/workflows/release.yml) | Publishes the requested package, then builds the Canvas film from the release tag and attaches its assets and frame-review archive. | Hosting and release automation |
| [.github/workflows/update-film.yml](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/.github/workflows/update-film.yml) | Builds, verifies and attaches the illustration-update movie and poster to the update-030 film release. | Hosting and release automation |

## Command line

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [bin/demotion.js](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/bin/demotion.js) | Implements init, demo, audio, license, help and version. It copies the editable HTML or builds a starter from the template and fonts. | Starter, Canvas and audio commands |

## Examples

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [examples/canvas-launch.html](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/examples/canvas-launch.html) | Standalone twelve-beat editor. Change the title and tempo, seek or play, save a 960 × 540 PNG, or record a WebM clip in a supporting browser. | Edit, play, save |
| [examples/cues.json](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/examples/cues.json) | Eight-beat soundtrack example at 120 BPM with a kick, hats, arpeggio, bass, hits, whoosh and chime for the audio command. | Score the edit |
| [examples/data-story.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/examples/data-story.tsx) | Two shots compose a tempo counter, three bars, a 75% ring, lower third and timed captions from the public package. | Data on a beat clock |
| [examples/illustration-three.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/examples/illustration-three.tsx) | Places three beveled layers of a D mark and a play triangle in a moving camera shot using the optional Three entry. | Give a flat mark depth |
| [examples/illustration.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/examples/illustration.tsx) | Registers the 2D workflow and curve-following example with a marker and timed path reveal. | Draw a path, then follow it |
| [examples/promo-scene.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/examples/promo-scene.tsx) | The eight-beat “Make it move.” headline is the runnable source of the code shown in PromoLaunch. | Behind the promo |

## Getting started and reference

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [docs/DEVELOPMENT.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/DEVELOPMENT.md) | Collects development commands, package candidate checks and version-specific example/film validation. | Documentation |
| [docs/HANDOFF.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/HANDOFF.md) | Records package names, version and film delivery history, with links to the original runs and media. | Documentation |
| [docs/PUBLISHING.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/PUBLISHING.md) | Explains the release request, version guard, npm organization and workflow used to publish package editions. | Documentation |
| [docs/components.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/components.md) | Documents the five data and caption components, with props and the complete DataStory composition. | Data on a beat clock |
| [docs/illustration.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/illustration.md) | Shows how to draw and follow SVG paths and combine them in WorkflowIllustration. | Draw a path, then follow it |
| [docs/product-launch.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/product-launch.md) | Works through a GitHub launch from the reader’s first edit to a reproducible film, release files and checksums. | Documentation |
| [docs/research-next.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/research-next.md) | Records sources and visual references behind the 2D/3D illustration direction, including limits of the research. | Documentation |
| [docs/three-illustration.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/three-illustration.md) | Shows the camera and extruded artwork, explains supported SVG inputs and gives the optional dependencies. | Give a flat mark depth |
| [docs/ui.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/ui.md) | Describes how to build beat-timed terminal and code panels from lines and colored tokens. | A terminal you can direct |
| [docs/x-launch.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/x-launch.md) | Points to the three original launch-thread drafts at the v0.1.0 tag. | Documentation |

## Preview images

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [docs/assets/canvas-launch-poster.webp](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/assets/canvas-launch-poster.webp) | 1280 × 720 RGB. The Canvas film opener pairs the folded ring with “Type in motion.” | Canvas film opener |
| [docs/assets/data-story-preview.png](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/assets/data-story-preview.png) | 1920 × 1080 RGB. A rendered DataStory frame shows 128 BPM, the three labeled bars and the 75% ring. | DataStory still |
| [docs/assets/promo-poster.webp](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/assets/promo-poster.webp) | 1280 × 720 RGB. “Ideas deserve motion.” sits above a layered play icon, type specimen and chart. | PromoLaunch poster |
| [docs/assets/starter-preview.png](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/assets/starter-preview.png) | 960 × 540 RGB. The starter’s “Every frame is code.” title appears on its lavender cloud gradient. | Starter still |
| [docs/assets/update-poster.webp](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/assets/update-poster.webp) | 1920 × 1080 RGB. The illustration release pairs “Draw it. Give it depth.” with its layered extruded D mark. | UpdateFilm poster |

## Canvas film

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [docs/canvas-film/README.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/canvas-film/README.md) | Gives the editor actions shown in Type in motion, the six-chapter story and commands to reproduce the movie. | Canvas release evidence |
| [docs/canvas-film/references.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/canvas-film/references.md) | Documents the launch films studied for the pacing, control close-ups and transition into the result. | Canvas release evidence |
| [docs/canvas-film/verification.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/canvas-film/verification.md) | Records the candidate hash, picture and sound measurements, 720-frame inspection and fixes to the opening and tempo crop. | Canvas release evidence |

## Second Take campaign

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [docs/launch-v2/README.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/launch-v2/README.md) | Indexes the 30-second second film, its media, data tutorial and dated campaign archive. | Second Take archive |
| [docs/launch-v2/devto.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/launch-v2/devto.md) | Preserves the tutorial that builds and registers the complete DataStory scene at 128 BPM. | Second Take archive |
| [docs/launch-v2/other-platforms.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/launch-v2/other-platforms.md) | Locates the archived LinkedIn, Bluesky, Mastodon, YouTube and Hacker News drafts at the immutable film tag. | Second Take archive |
| [docs/launch-v2/reddit.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/launch-v2/reddit.md) | Locates the two unpublished Reddit drafts and explains the limits of the earlier community research. | Second Take archive |
| [docs/launch-v2/release-notes.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/launch-v2/release-notes.md) | Gives readers the Second Take downloads and the package/source status of the data APIs at the time of filming. | Second Take archive |
| [docs/launch-v2/research.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/launch-v2/research.md) | Records the product, distribution and research decisions behind the second edition and its proposed acquisition experiment. | Second Take archive |
| [docs/launch-v2/verification.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/launch-v2/verification.md) | Records public media checks, data-example verification and publication status of the original copy. | Second Take archive |
| [docs/launch-v2/x.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/launch-v2/x.md) | Locates the October thread about the second film and the source-preview data components. | Second Take archive |

## Illustrated promo

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [docs/promo/README.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/promo/README.md) | Gives the reproduction and delivery steps for the 56-second film and its editable typography scene. | PromoLaunch archive |
| [docs/promo/direction.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/promo/direction.md) | Documents the reference study, visual direction and chapter-by-chapter text equivalent for Ideas deserve motion. | PromoLaunch archive |
| [docs/promo/release-notes.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/promo/release-notes.md) | Introduces the promo’s illustrated React-to-video workflow and links its viewing and source materials. | PromoLaunch archive |
| [docs/promo/verification.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/promo/verification.md) | Records encoded media, public downloads, checksums and verification of the actual example shown on screen. | PromoLaunch archive |

## Illustration update

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [docs/update-film/README.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/update-film/README.md) | Indexes the 40-second illustration film, storyboard, audio and reproduction commands. | UpdateFilm archive |
| [docs/update-film/release-notes.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/update-film/release-notes.md) | Explains the drawn-path and extruded-SVG features introduced in the 0.3.0 illustration film. | UpdateFilm archive |
| [docs/update-film/verification.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/docs/update-film/verification.md) | Records public delivery and decoded film inspection alongside verification of the editable 2D and 3D examples. | UpdateFilm archive |

## Bundled fonts

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [public/fonts/AbrilFatface.woff2](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/public/fonts/AbrilFatface.woff2) | Abril Fatface Regular, static weight 400. Supplies the high-contrast serif display face for typography. | Light, material and type |
| [public/fonts/ArchivoVariable.woff2](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/public/fonts/ArchivoVariable.woff2) | Archivo variable sans. Its font tables contain weight 100–900 and width 62–125 for measured headlines and stacked type. | Type in motion and headlines |
| [public/fonts/BarlowSemiCondensed-500.woff2](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/public/fonts/BarlowSemiCondensed-500.woff2) | Barlow Semi Condensed Medium, static weight 500. Supplies medium-weight labels from the local font loader. | Typeface and redistribution |
| [public/fonts/BarlowSemiCondensed-600.woff2](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/public/fonts/BarlowSemiCondensed-600.woff2) | Barlow Semi Condensed SemiBold, static weight 600. Supplies semibold labels and captions. | Typeface and redistribution |
| [public/fonts/BarlowSemiCondensed-700.woff2](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/public/fonts/BarlowSemiCondensed-700.woff2) | Barlow Semi Condensed Bold, static weight 700. Supplies bold label and caption emphasis. | Typeface and redistribution |
| [public/fonts/JetBrainsMonoVariable.woff2](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/public/fonts/JetBrainsMonoVariable.woff2) | JetBrains Mono variable, weight 100–800. Supplies monospace commands, code listings and film annotations. | A terminal you can direct |
| [public/fonts/licenses/OFL-abril-fatface.txt](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/public/fonts/licenses/OFL-abril-fatface.txt) | Carries the reserved font names, copyright notice and SIL Open Font License for the Abril display face. | Typeface and redistribution |
| [public/fonts/licenses/OFL-archivo.txt](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/public/fonts/licenses/OFL-archivo.txt) | Carries the Archivo copyright and SIL Open Font License for the variable sans used in the headlines. | Typeface and redistribution |
| [public/fonts/licenses/OFL-barlow-semi-condensed.txt](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/public/fonts/licenses/OFL-barlow-semi-condensed.txt) | Carries the font notice, SIL Open Font License and accompanying material for all three Barlow weights. | Typeface and redistribution |
| [public/fonts/licenses/OFL-jetbrains-mono.txt](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/public/fonts/licenses/OFL-jetbrains-mono.txt) | Carries the JetBrains Mono copyright and SIL Open Font License copied with the code face. | Typeface and redistribution |

## Build, render and delivery

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [scripts/build.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/build.mjs) | Bundles main, audio and optional Three entries, shares ShotContext across bundles and emits consumer types. | Build or delivery |
| [scripts/canvas-film/check.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/canvas-film/check.mjs) | Checks frame timestamps, decodes 720 images, measures sound and emits numbered sheets, cut stills and a digest-bound report. | Canvas release QA |
| [scripts/canvas-film/render.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/canvas-film/render.mjs) | Draws the real standalone editor renderer into each frame, generates the score, encodes the MP4 and writes its poster. | Canvas source film |
| [scripts/canvas-film/visuals.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/canvas-film/visuals.mjs) | Defines the six Canvas chapters and composes the title edit, tempo change, playback, saved frame and closing command. | Edit, play, save |
| [scripts/check-canvas-browser.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/check-canvas-browser.mjs) | Drives Chromium through the controls, compares the downloaded PNG to the pictured frame and decodes the custom WebM. | Canvas interaction tests |
| [scripts/check-launch-media.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/check-launch-media.mjs) | Checks the original Launch master’s 1,560 decoded frames, dimensions, stream format and opening/closing image variation. | Build or delivery |
| [scripts/finalize-launch-audio.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/finalize-launch-audio.mjs) | Remuxes the original Launch picture with audio from the source WAV, trimmed and faded to the exact film length. | Build or delivery |
| [scripts/launch-audio.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/launch-audio.mjs) | Turns the original launch score into its local playback WAV using the built audio entry. | Build or delivery |
| [scripts/launch-qa.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/launch-qa.mjs) | Renders requested or automatically selected frames from Launch with muted audio and builds its HTML inspection sheet. | Build or delivery |
| [scripts/launch-v2.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/launch-v2.mjs) | Generates the 128 BPM score, stills, movie and media checks for Second Take. | Build or delivery |
| [scripts/preview-films.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/preview-films.ts) | Selects first, last and per-shot frames for Launch, LaunchV2, PromoLaunch and UpdateFilm and writes sheets with frame indices. | Build or delivery |
| [scripts/promo-media.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/promo-media.mjs) | Validates H.264/AAC streams, timing, range, color and MP4 faststart box order for the newer film encoders. | Build or delivery |
| [scripts/promo-ranges.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/promo-ranges.mjs) | Partitions a film into inclusive worker frame ranges so concatenated renders cover every frame once. | Build or delivery |
| [scripts/promo.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/promo.mjs) | Runs the PromoLaunch score, parallel rendering, stills and encoded-delivery checks. | Build or delivery |
| [scripts/release.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/release.mjs) | Checks the package name and expected semantic-release version before allowing a real publish pass. | Build or delivery |
| [scripts/update-film.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/scripts/update-film.mjs) | Renders and checks the 0.3.0 illustration-update film, its soundtrack and its inspection stills. | Build or delivery |

## Toolkit and Studio entry points

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/Root.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/Root.tsx) | Registers six 1080p Remotion compositions and loads fonts for Studio and the repository’s renders. | Public API and Studio |
| [src/font.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/font.ts) | Loads six offline font files and exports families and Archivo variation settings for displays, labels and code. | Public API and Studio |
| [src/index.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/index.ts) | Registers the development Remotion root that Studio and the movie-render commands open. | Public API and Studio |
| [src/lib-audio.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/lib-audio.ts) | Exposes the standalone, non-React soundtrack API at the package’s audio subpath. | Public API and Studio |
| [src/lib-three.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/lib-three.ts) | Exposes Stack3D, panel painters, RubiksCube, Scene3D, ExtrudedSvg and the optional Fiber JSX types. | Public API and Studio |
| [src/lib.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/lib.ts) | Defines the public React entry for composition, timing, UI, illustration, effects and type. | Public API and Studio |
| [src/theme.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/theme.ts) | Supplies the original gradient-based component theme with type weights, radius and light/dark colors. | Public API and Studio |

## Soundtrack

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/audio/dsp.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/audio/dsp.ts) | Implements seeded noise, stereo placement, filters, reverb and integrated loudness at a 48 kHz sample rate. | Score the edit |
| [src/audio/index.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/audio/index.ts) | Collects the cue types, mixer, WAV encoder, loudness measurement and sample rate for audio consumers. | Score the edit |
| [src/audio/mix.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/audio/mix.ts) | Schedules instruments and cues against the beat grid, mixes stereo samples and masters the result. | Score the edit |
| [src/audio/synth.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/audio/synth.ts) | Generates the actual kick, hat, bass, pluck, typing, impact, whoosh and other voices heard in the scores. | Score the edit |
| [src/audio/types.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/audio/types.ts) | Defines the beat-based cue and music language, including arrangement ranges, levels, seed and requested loudness. | Score the edit |
| [src/audio/wav.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/audio/wav.ts) | Serializes the mixed left and right channels to a 16-bit stereo RIFF/WAV file for the CLI and films. | Score the edit |

## Motion components

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/components/CardFan.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/CardFan.tsx) | Springs a stack of cards into a fan and pulls the selected card forward while its neighbors dim. | From interface to object |
| [src/components/CloudGradient.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/CloudGradient.tsx) | Samples seeded noise into a moving multicolor canvas backdrop, including the generated starter’s title background. | Starter and component gallery |
| [src/components/CodeTabs.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/CodeTabs.tsx) | Draws file tabs and token-colored code lines as an animated editor mockup. | Interfaces and reveals |
| [src/components/CursorActor.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/CursorActor.tsx) | Moves a cursor through supplied frame coordinates and draws a ripple on authored clicks. | Interfaces and reveals |
| [src/components/DashboardChrome.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/DashboardChrome.tsx) | Builds a dashboard sidebar with active navigation and icons, plus a pill-shaped action button. | Interfaces and reveals |
| [src/components/FloatingCard.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/FloatingCard.tsx) | Provides floating content cards and an animated score badge with a numerical value and progress bar. | Interfaces and reveals |
| [src/components/GlowBeams.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/GlowBeams.tsx) | Paints seeded, drifting light beams and a vignette on a canvas for an illuminated background. | Light, material and type |
| [src/components/GlowToggle.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/GlowToggle.tsx) | Draws an animated switch with a rotating glow and a pulsing highlight. | Interfaces and reveals |
| [src/components/LiquidBlob.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/LiquidBlob.tsx) | Combines drifting circles with an SVG filter to form merging metaball shapes. | Light, material and type |
| [src/components/LoadingButton.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/LoadingButton.tsx) | Cycles through timed status messages with a spinner and an optional final check mark. | From interface to object |
| [src/components/MaskReveal.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/MaskReveal.tsx) | Reveals child content with a growing circular aperture or a left-to-right soft mask. | Interfaces and reveals |
| [src/components/ParallaxBackdrop.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/ParallaxBackdrop.tsx) | Layers a cloud gradient and differently blurred moving shapes to make a depth-changing backdrop. | Interfaces and reveals |
| [src/components/ParticleText.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/ParticleText.tsx) | Samples a text mask and animates seeded canvas particles into and out of the word. Launch uses it for its particle-text shot. | Light, material and type |
| [src/components/Safari.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/Safari.tsx) | Frames child content in an SVG browser window with an editable address, dark mode and optional tilt. | From interface to object |
| [src/components/ShapeAccent.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/ShapeAccent.tsx) | Draws a line and a hand-drawn highlight circle by animating the stroke dash. | Interfaces and reveals |
| [src/components/TitleCard.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/TitleCard.tsx) | Renders plain or highlighted text over the cloud backdrop. The generated MyVideo uses both forms. | A project in two scenes |
| [src/components/TypingText.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/TypingText.tsx) | Reveals a string over authored frames with a blinking caret for a typing shot. | Interfaces and reveals |
| [src/components/icons.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/icons.tsx) | Provides the reusable SVG home, layers, palette, toggle, lock, chevron, spark and check glyphs. | Interfaces and component gallery |

## Reel effects

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/components/reel/geometry.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/reel/geometry.tsx) | Implements halftone dots, radial ticks, wire terrain, a rectangular tunnel and starburst graphics. | Gallery and geometry studies |
| [src/components/reel/motion.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/reel/motion.tsx) | Provides traveling text bands, a plotted easing curve, a shape morph and a 2,400-particle sphere. | Gallery and motion studies |
| [src/components/reel/palette.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/reel/palette.ts) | Defines the shared reel swatches used by its geometric effects, typography and cube. | Gallery and specimen palette |
| [src/components/reel/typography.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/components/reel/typography.tsx) | Implements kinetic, stacked and serif type treatments plus rolling numbers for reel scenes. | Gallery and display type |

## Time and motion

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/core/clock.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/core/clock.ts) | Converts beats, bars, seconds and frames with shared rounding, and samples beat and bar punches. | All sixteen chapters |
| [src/core/index.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/core/index.ts) | Exports the beat clock, motion math and shake helpers through the main entry. | Shared beat clock and motion |
| [src/core/math.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/core/math.ts) | Supplies interpolation, eased curves, spring response and continuous noise used to evaluate a shot at any frame. | Shared beat clock and motion |
| [src/core/shake.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/core/shake.ts) | Computes position and rotation after timed hits with decaying oscillations for the camera. | Shared beat clock and motion |

## Shot engine

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/engine/CameraRig.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/engine/CameraRig.tsx) | Applies per-beat and per-bar camera punches, drift and hit shake to its children. | Camera, looks and timed cuts |
| [src/engine/Look.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/engine/Look.tsx) | Adds the final image treatment of procedural grain and a controllable vignette. | Camera, looks and timed cuts |
| [src/engine/MotionProject.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/engine/MotionProject.tsx) | Sequences Shot children, makes their clocks available and layers wipes, camera, blur and finishing effects. | Camera, looks and timed cuts |
| [src/engine/Wipe.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/engine/Wipe.tsx) | Draws slide, slat, iris and diagonal covers across the cut between two shots. | Camera, looks and timed cuts |
| [src/engine/context.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/engine/context.tsx) | Shares shot theme, start and local beat-to-frame mapping with UI, type, illustration and the optional 3D package. | Camera, looks and timed cuts |
| [src/engine/index.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/engine/index.ts) | Exposes the project/shot engine, camera, look, theme, context and wipes from the main package. | Camera, looks and timed cuts |
| [src/engine/theme.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/engine/theme.ts) | Defines the five project swatches ink, chalk, field, accent and spark used by the launch compositions. | Camera, looks and timed cuts |
| [src/engine/wipeTiming.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/engine/wipeTiming.ts) | Computes cover and reveal progress separately for delayed wipe layers around a cut. | Camera, looks and timed cuts |

## 2D illustration

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/illustration/DrawPath.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/illustration/DrawPath.tsx) | Animates the visible stroke length of a supplied SVG path on a shot’s clock. | Draw a path, then follow it |
| [src/illustration/FollowPath.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/illustration/FollowPath.tsx) | Places child SVG elements along a path and optionally rotates them to face the tangent. | Draw a path, then follow it |
| [src/illustration/WorkflowIllustration.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/illustration/WorkflowIllustration.tsx) | Assembles the layered workflow diagram with a traced route and moving markers. | Draw a path, then follow it |
| [src/illustration/index.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/illustration/index.ts) | Publishes the drawing, following, path-motion and workflow APIs and their prop types. | Draw a path, then follow it |
| [src/illustration/pathMotion.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/illustration/pathMotion.ts) | Validates and samples one continuous SVG path, converting beat progress into position and heading. | Draw a path, then follow it |

## Development compositions

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/lab/Lab.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/lab/Lab.tsx) | Exercises four short typography shots and the slide, slat and iris transitions under one 120 BPM clock. | Type in motion |
| [src/lab/UI.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/lab/UI.tsx) | Alternates a typed terminal and a code panel under a persistent “CODE, ON THE BEAT.” label. | A terminal you can direct |

## Original launch

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/launch/LaunchDemo.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/launch/LaunchDemo.tsx) | Assembles the original 26-second film from MotionProject shots and its optional soundtrack. | Launch source |
| [src/launch/StackShot.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/launch/StackShot.tsx) | Draws the original Launch film’s moving-camera stack of terminal, code and video panels. | From code to a 4K render |
| [src/launch/code.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/launch/code.ts) | Supplies the exact starter source, formatted tokens and init/render commands used by the on-screen demo. | Launch source |
| [src/launch/shots.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/launch/shots.tsx) | Draws the original launch sequence, including typography, terminal, code, numbers, sound, license and closing frames. | Launch source |
| [src/launch/sourceQuickStart.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/launch/sourceQuickStart.ts) | Keeps the short source-checkout command sequence in sync across multiple film editions. | Launch source |
| [src/launch/timeline.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/launch/timeline.ts) | Places 13 original launch shots, their cuts and score cues on a 52-beat, 120 BPM clock. | Launch source |

## Second Take composition

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/launch-v2/LaunchV2.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/launch-v2/LaunchV2.tsx) | Presents the Second Take scenes, including animated data, captions, source code, identity and sound. | Data on a beat clock |
| [src/launch-v2/timeline.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/launch-v2/timeline.ts) | Specifies 10 shot lengths, the five demonstrated API names, on-screen code and the 128 BPM score. | LaunchV2 picture and score |

## Illustrated promo composition

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/promo/PromoLaunch.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/promo/PromoLaunch.tsx) | Draws 12 chapters covering the editable scene, kinetic type, data, sound and local rendering. | Behind the promo and Score the edit |
| [src/promo/art.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/promo/art.tsx) | Provides its wordmark, paper surfaces, layered frame sculpture, code lines and type-specimen artwork. | PromoLaunch source |
| [src/promo/timeline.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/promo/timeline.ts) | Sets the 120 BPM shot and cue timing and defines the promo’s visible code, captions and API names. | PromoLaunch source |

## Optional 3D tools

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/three/ExtrudedSvg.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/three/ExtrudedSvg.tsx) | Turns filled SVG layers into lit, beveled meshes with face/side materials and optional staggered reveals. | Give a flat mark depth |
| [src/three/RubiksCube.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/three/RubiksCube.tsx) | Builds a cube of individual pieces and evaluates face-turn animation for the generated 3D scene. | From interface to object |
| [src/three/Scene3D.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/three/Scene3D.tsx) | Creates the Three canvas, lights and frame-driven camera and passes shot timing into nested illustration meshes. | Give a flat mark depth |
| [src/three/Stack3D.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/three/Stack3D.tsx) | Mounts canvas-textured panels in 3D with an animated camera, depth of field and bloom. | From code to a 4K render |
| [src/three/illustrationContext.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/three/illustrationContext.tsx) | Supplies the frame, beat function, theme and reduced-motion preference to children of Scene3D. | Give a flat mark depth |
| [src/three/illustrationMotion.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/three/illustrationMotion.ts) | Samples deterministic camera poses and per-layer extrusion entrances, including reduced-motion behavior. | Give a flat mark depth |
| [src/three/panels.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/three/panels.ts) | Paints window chrome, terminal prompts and colored code directly onto 3D panel textures. | From code to a 4K render |
| [src/three/svgGeometry.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/three/svgGeometry.ts) | Validates supported SVG artwork, preserves filled contours and holes, and builds scaled extrusion geometry. | Give a flat mark depth |

## Remotion transitions

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/transitions/scaleFadeBlur.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/transitions/scaleFadeBlur.tsx) | Combines scale, opacity and blur as a presentation for a transition between sequences. | From interface to object |
| [src/transitions/speedRampCut.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/transitions/speedRampCut.tsx) | Provides a directional accelerated slide with blur for a speed-ramped cut. | From interface to object |

## Kinetic typography

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/type/KineticHeadline.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/type/KineticHeadline.tsx) | Measures the actual Archivo headline, fits the width and staggers individual letters into a spring entrance. | Type in motion |
| [src/type/WideStack.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/type/WideStack.tsx) | Measures and stacks variable-width Archivo rows with solid and outline treatments. | Type in motion |
| [src/type/index.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/type/index.ts) | Exports both measured typography components for published consumer scenes. | Type in motion |

## Data, code and captions

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/ui/BarChart.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/ui/BarChart.tsx) | Animates labeled bars with a shared zero baseline, including signed and all-zero datasets. | Data on a beat clock |
| [src/ui/CaptionTrack.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/ui/CaptionTrack.tsx) | Schedules authored caption cues on half-open beat intervals and rejects overlaps. | Data on a beat clock |
| [src/ui/CodePanel.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/ui/CodePanel.tsx) | Preserves code indentation and reveals plain or token-colored lines on the shot clock. | A terminal you can direct |
| [src/ui/CountUp.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/ui/CountUp.tsx) | Animates to an exact numeric target with configurable decimals, prefix/suffix and optional label. | Data on a beat clock |
| [src/ui/LowerThird.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/ui/LowerThird.tsx) | Shows a title and subtitle within an authored beat window for speaker or project identification. | Data on a beat clock |
| [src/ui/ProgressRing.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/ui/ProgressRing.tsx) | Animates a bounded radial progress value with a percentage and optional label. | Data on a beat clock |
| [src/ui/Terminal.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/ui/Terminal.tsx) | Causes supplied prompt and output lines to appear or type in time with the beat clock. | A terminal you can direct |
| [src/ui/dataMotion.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/ui/dataMotion.ts) | Shares easing, bounded progress, option validation and numeric formatting between the data components. | Data on a beat clock |

## Illustration update composition

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/update-film/UpdateFilm.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/update-film/UpdateFilm.tsx) | Stages the eight Draw it. Give it depth. chapters showing the path, marker, 3D extrusion and rendered workflow. | Give a flat mark depth |
| [src/update-film/timeline.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/update-film/timeline.ts) | Holds the 0.3.0 code excerpt, eight shot boundaries and score for the 40-second film. | UpdateFilm source |

## Motion utility

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/utils/useMotionBlur.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/utils/useMotionBlur.ts) | Samples one frame of positional change to estimate pixel blur for fast-moving cards and browser chrome. | From interface to object |

## Gradient and interface primitives

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [src/v2/Blobs.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/v2/Blobs.tsx) | Builds drifting blurred backgrounds from named presets, including dark, warm and vivid palettes. | Interfaces and reveals |
| [src/v2/primitives.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/src/v2/primitives.tsx) | Provides gradient text, wipe, animated hand cursor, sparkle, glass surface and caret for interface scenes. | Interfaces and component gallery |

## Scaffolding

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [template/README.md](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/template/README.md) | Gives a newly generated project its own start and render commands. | A project in two scenes |
| [template/_dot_gitignore](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/template/_dot_gitignore) | Becomes the starter’s .gitignore, excluding its installed packages and render output. | A project in two scenes |
| [template/package.json](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/template/package.json) | Defines the generated project’s start, render and 4K scripts and inserts the package versions selected by init. | A project in two scenes |
| [template/remotion.config.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/template/remotion.config.ts) | Sets local JPEG intermediate frames and permits render outputs to be replaced in the generated project. | A project in two scenes |
| [template/src/MyVideo.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/template/src/MyVideo.tsx) | Builds the 60-frame highlighted title and 90-frame closing title copied by init and shown in Launch. | A project in two scenes |
| [template/src/Root.tsx](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/template/src/Root.tsx) | Loads the local fonts and registers the starter at 1920 × 1080, 30 fps and 150 frames. | A project in two scenes |
| [template/src/index.ts](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/template/src/index.ts) | Registers the starter root with Remotion so its preview and render commands can find MyVideo. | A project in two scenes |
| [template/tsconfig.json](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/template/tsconfig.json) | Sets the strict TypeScript and JSX options used by generated consumer scenes. | A project in two scenes |

## Tests and test helper

| File at v0.4.0 | What it contains | Where it contributes |
| --- | --- | --- |
| [test/audio.test.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/audio.test.mjs) | Checks cue position, musical tempo, seeded repeatability, loudness, peak limits and the resulting WAV header. | Regression checks |
| [test/canvas-demo.test.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/canvas-demo.test.mjs) | Seeks the embedded title renderer across three acts and checks that returning to a frame reproduces its PNG. | Regression checks |
| [test/cli.test.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/cli.test.mjs) | Runs the executable against temporary projects and checks safe demo copying, scaffold contents, paths and sound output. | Regression checks |
| [test/core.test.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/core.test.mjs) | Checks easing endpoints, Bézier and spring behavior, fractional-tempo rounding, beat punch and shake decay. | Regression checks |
| [test/helpers.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/helpers.mjs) | Uses esbuild to load TypeScript entry points into Node’s tests without a separate build per fixture. | Regression checks |
| [test/illustration-three.test.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/illustration-three.test.mjs) | Checks 3D holes, winding, size, bevel, SVG limits, camera/reveal timing, declaration compatibility and shared context. | Regression checks |
| [test/illustration.test.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/illustration.test.mjs) | Checks path geometry, reverse seeks, reduced motion, timing edges and accessible IDs in the workflow illustration. | Regression checks |
| [test/launch-v2.test.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/launch-v2.test.mjs) | Checks the 30-second clock, score alignment, advertised exports, bundled data example and tutorial registration. | Regression checks |
| [test/launch.test.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/launch.test.mjs) | Checks the original cut/score alignment, copied starter source, CLI text and shared checkout instructions. | Regression checks |
| [test/package.test.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/package.test.mjs) | Checks distributed files, MIT and font notices, funding metadata, executable version and Remotion version alignment. | Regression checks |
| [test/promo.test.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/promo.test.mjs) | Checks inclusive frame partitions, cue timing, code and starter commands, container metadata and faststart structure. | Regression checks |
| [test/readme.test.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/readme.test.mjs) | Checks the README’s editable example against the generated starter and its source checkout install instructions. | Regression checks |
| [test/release.test.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/release.test.mjs) | Checks that a wrong version, empty candidate or skipped publication cannot be reported as a successful guarded release. | Regression checks |
| [test/ui.test.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/ui.test.mjs) | Tests timing and Unicode typing, code indentation, reverse seeks, signed bars, caption boundaries, lower thirds and ring bounds. | Regression checks |
| [test/update-film.test.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/update-film.test.mjs) | Verifies the eight update chapters and soundtrack share their clock and the displayed code builds against the public package. | Regression checks |
| [test/wipes.test.mjs](https://github.com/SohailKhan0525/demotion/blob/c9ff499311f6e891d009b7b8561093567cd14b21/test/wipes.test.mjs) | Checks that every delayed and diagonal wipe covers the frame at the cut and clears it on time. | Regression checks |

## Files added for the 0.5.0 showcase

The showcase adds 14 files to the baseline, bringing the source tree to 218 paths across 40 tracked subdirectories, plus the repository root. The three new directories hold showcase documentation, production scripts and scenes. Each link in this section opens the 0.5.0 release edition.

| Added file | How the showcase uses it |
| --- | --- |
| [.github/workflows/showcase.yml](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/.github/workflows/showcase.yml) | Builds the tagged package edition, renders and checks the movie, packages the numbered sheets and publishes the release assets. |
| [docs/showcase/README.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/docs/showcase/README.md) | Gives chapter timecodes, links each excerpt to its editable source and explains how to run Studio, render and check the film. |
| [docs/showcase/inventory.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/docs/showcase/inventory.md) | Maps each baseline file to its role and records the new source files and the earlier release history. |
| [scripts/showcase/assets.mjs](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/scripts/showcase/assets.mjs) | Checks the released Canvas movie against its SHA-256 and renders the original starter and 2D illustration at their source frame rates. |
| [scripts/showcase/check.mjs](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/scripts/showcase/check.mjs) | Checks all 6,240 display timestamps, embedded chapter bounds, color and audio levels. It decodes every frame and generates a numbered contact sheet per second. |
| [scripts/showcase/render.mjs](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/scripts/showcase/render.mjs) | Prepares the source assets, renders individual chapter ranges, joins their picture streams and muxes the shared score and MP4 chapter metadata. |
| [scripts/showcase/score.mjs](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/scripts/showcase/score.mjs) | Synthesizes the full 208-beat score and places the published cue example’s hit, whoosh, hit and chime in the audio chapter. |
| [scripts/showcase/timeline.mjs](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/scripts/showcase/timeline.mjs) | Loads the TypeScript edit for Node and derives durations, frame boundaries and chapter timestamps for rendering and validation. |
| [src/showcase/Gallery.tsx](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/showcase/Gallery.tsx) | Mounts the actual Safari, card fan, kinetic type, radial ticks, marquee and 3D cube, joined by two library transitions. |
| [src/showcase/Showcase.tsx](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/showcase/Showcase.tsx) | Assembles the opening, sourced footage, live React scenes, chapter credits, audio and final CLI card into a Remotion composition. |
| [src/showcase/Specimens.tsx](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/showcase/Specimens.tsx) | Builds six paired showcases of interactive details, reveals, lighting, display type, geometric loops and motion studies from the original components. |
| [src/showcase/timeline.ts](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/showcase/timeline.ts) | Defines the 16 chapters, cut sources, frame offsets and credits at 120 BPM and 60 fps. |
| [test/showcase.test.mjs](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/test/showcase.test.mjs) | Checks chapter continuity, composition registration, public CLI text and whether the compiled scenes use every public legacy, reel and v2 component module. |
| [tsconfig.lint.json](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/tsconfig.lint.json) | Resolves the main and optional Three package entries to their local TypeScript sources so a clean checkout can type-check the examples before building bundles. |

### Existing paths changed for this edition

| Existing file | Release change |
| --- | --- |
| [.github/npm-release-request.json](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/.github/npm-release-request.json) | Selects version 0.5.0 and the showcase film for release. |
| [.github/workflows/preview.yml](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/.github/workflows/preview.yml) | Builds the package before rendering source previews that import the compiled package entry. |
| [.github/workflows/release.yml](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/.github/workflows/release.yml) | Passes the verified release tag and film selection to the appropriate media job. |
| [.gitignore](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/.gitignore) | Excludes staged showcase movies and score under public/showcase. |
| [README.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/README.md) | Introduces the showcase with playback, download, source and first-edit links. |
| [bin/demotion.js](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/bin/demotion.js) | Adds the showcase command with the film, chapter list, guide and matching source archive. |
| [docs/DEVELOPMENT.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/docs/DEVELOPMENT.md) | Lists the showcase alongside earlier Studio compositions. |
| [docs/HANDOFF.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/docs/HANDOFF.md) | Records the 0.5.0 showcase, its CLI entry, guide and source inventory. |
| [docs/PUBLISHING.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/docs/PUBLISHING.md) | Documents the showcase request and expected tagged media assets. |
| [docs/components.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/docs/components.md) | Updates the data walkthrough’s starter version. |
| [docs/illustration.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/docs/illustration.md) | Updates the 2D illustration walkthrough’s starter version. |
| [docs/three-illustration.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/docs/three-illustration.md) | Updates the optional 3D walkthrough’s starter version. |
| [package.json](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/package.json) | Adds the showcase tag, Studio/render/check commands and guide to the distributed package, and narrows what the starter packs. |
| [src/Root.tsx](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/Root.tsx) | Registers Showcase using the edit’s frame count and frame rate. |
| [src/components/DashboardChrome.tsx](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/components/DashboardChrome.tsx) | Gives the sidebar an optional brand label. The palette inspector uses “Demotion” and existing callers retain the original default. |
| [src/lab/UI.tsx](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/src/lab/UI.tsx) | Builds the visible import example from the real package name so the code panel shows @demotion/cli. |
| [test/cli.test.mjs](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/test/cli.test.mjs) | Checks the showcase URLs and unsupported arguments, and asserts that the starter excludes development caches. |

The generated package release also updates [CHANGELOG.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/CHANGELOG.md), [package-lock.json](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/package-lock.json) and the version field in [package.json](https://github.com/SohailKhan0525/demotion/blob/v0.5.0/package.json).

## Typography patch for npm 0.5.1

A parallel render exposed a width change in the settled “MOTION” headline at 0:35. The patch waits for the bundled Archivo font before measuring text. The v0.5.1 checkout contains 220 files in 40 subdirectories, including two additions to the 218-file film edition.

| Files at v0.5.1 | Patch change |
| --- | --- |
| [src/type/archivoReady.ts](https://github.com/SohailKhan0525/demotion/blob/v0.5.1/src/type/archivoReady.ts) · [test/font.test.mjs](https://github.com/SohailKhan0525/demotion/blob/v0.5.1/test/font.test.mjs) | New font-readiness helper and regression test. |
| [src/font.ts](https://github.com/SohailKhan0525/demotion/blob/v0.5.1/src/font.ts) · [src/type/KineticHeadline.tsx](https://github.com/SohailKhan0525/demotion/blob/v0.5.1/src/type/KineticHeadline.tsx) · [src/type/WideStack.tsx](https://github.com/SohailKhan0525/demotion/blob/v0.5.1/src/type/WideStack.tsx) | Track Archivo registration and fit the two typography components after the face is ready. |
| [.github/npm-release-request.json](https://github.com/SohailKhan0525/demotion/blob/v0.5.1/.github/npm-release-request.json) | Requests the 0.5.1 package release. |
| [README.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.1/README.md) · [docs/showcase/README.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.1/docs/showcase/README.md) | Update the npm examples and identify the fixed source for local renders. The movie and chapter downloads belong to the 0.5.0 film edition. |
| [docs/components.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.1/docs/components.md) · [docs/illustration.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.1/docs/illustration.md) · [docs/three-illustration.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.1/docs/three-illustration.md) | Refer readers to the starter installation instructions for its current version. |
| [docs/showcase/inventory.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.1/docs/showcase/inventory.md) | Records this patch against the film edition. |
| [CHANGELOG.md](https://github.com/SohailKhan0525/demotion/blob/v0.5.1/CHANGELOG.md) · [package.json](https://github.com/SohailKhan0525/demotion/blob/v0.5.1/package.json) · [package-lock.json](https://github.com/SohailKhan0525/demotion/blob/v0.5.1/package-lock.json) | The release workflow writes the package version, lockfile version and patch release notes. |

## Release history and workflow evidence

The 42 commits leading to v0.4.0 cover 227 distinct pathnames from 8 October to 19 November 2026. The 204 rows above describe the release tree. The other 23 names occur only in earlier revisions. The links below open each commit at the point where its change was made. [Full release history](https://github.com/SohailKhan0525/demotion/commits/v0.4.0/)

| 2026 date | What changed | Commits in order |
| --- | --- | --- |
| Oct 8 | Original terms and funding, first toolkit/3D stack and CLI, then repository URL correction. | [3cef5a9](https://github.com/SohailKhan0525/demotion/commit/3cef5a9) [35c4daa](https://github.com/SohailKhan0525/demotion/commit/35c4daa) [9a818dc](https://github.com/SohailKhan0525/demotion/commit/9a818dc) |
| Oct 10–18 | The clock, camera, type and shot engine arrived, followed by TypeScript audio, peer dependency fixes, the early package-name change and a starter font correction. | [86f92ad](https://github.com/SohailKhan0525/demotion/commit/86f92ad) [52c80bf](https://github.com/SohailKhan0525/demotion/commit/52c80bf) [e22ccbd](https://github.com/SohailKhan0525/demotion/commit/e22ccbd) [9d7f7a1](https://github.com/SohailKhan0525/demotion/commit/9d7f7a1) [4ff87e6](https://github.com/SohailKhan0525/demotion/commit/4ff87e6) [5b46c03](https://github.com/SohailKhan0525/demotion/commit/5b46c03) |
| Oct 26 | The handoff and original launch film preceded the manual npm bootstrap, which encountered publication refusal and package naming constraints. | [876db10](https://github.com/SohailKhan0525/demotion/commit/876db10) [dc92314](https://github.com/SohailKhan0525/demotion/commit/dc92314) [b485378](https://github.com/SohailKhan0525/demotion/commit/b485378) [9a6af15](https://github.com/SohailKhan0525/demotion/commit/9a6af15) [76710d8](https://github.com/SohailKhan0525/demotion/commit/76710d8) |
| Oct 26 | The team tried the personal scope, added direct version/tag checks, restored the requested name and documented the naming blocker. | [90adcea](https://github.com/SohailKhan0525/demotion/commit/90adcea) [77b4826](https://github.com/SohailKhan0525/demotion/commit/77b4826) [19244b6](https://github.com/SohailKhan0525/demotion/commit/19244b6) [72ff035](https://github.com/SohailKhan0525/demotion/commit/72ff035) |
| Oct 26 | The organization package became @demotion/cli. The team inspected registry state, published the verified tarball, recorded publication and removed the bootstrap. | [5afdbf2](https://github.com/SohailKhan0525/demotion/commit/5afdbf2) [6b7746d](https://github.com/SohailKhan0525/demotion/commit/6b7746d) [901ae68](https://github.com/SohailKhan0525/demotion/commit/901ae68) [eb2fcad](https://github.com/SohailKhan0525/demotion/commit/eb2fcad) [0e0a41a](https://github.com/SohailKhan0525/demotion/commit/0e0a41a) |
| Oct 27 | The CLI learned to handle human-readable paths. DataStory and the second film arrived, the film runner gained FFmpeg and the public downloads were verified. | [48342c5](https://github.com/SohailKhan0525/demotion/commit/48342c5) [a007531](https://github.com/SohailKhan0525/demotion/commit/a007531) [a3865db](https://github.com/SohailKhan0525/demotion/commit/a3865db) [72895bd](https://github.com/SohailKhan0525/demotion/commit/72895bd) |
| Oct 30 | The illustrated promo and its delivery record preceded the 0.2.0 request, package tag and publication verification. | [a4d2f96](https://github.com/SohailKhan0525/demotion/commit/a4d2f96) [d0b9257](https://github.com/SohailKhan0525/demotion/commit/d0b9257) [c7d42f9](https://github.com/SohailKhan0525/demotion/commit/c7d42f9) [361560d](https://github.com/SohailKhan0525/demotion/commit/361560d) [50d60e2](https://github.com/SohailKhan0525/demotion/commit/50d60e2) |
| Nov 1 | The SVG and Three illustration tools landed. The 0.3.0 request, release and tagged film delivery followed. | [b029eaa](https://github.com/SohailKhan0525/demotion/commit/b029eaa) [592caf8](https://github.com/SohailKhan0525/demotion/commit/592caf8) [cc1d0d7](https://github.com/SohailKhan0525/demotion/commit/cc1d0d7) [5ca13bc](https://github.com/SohailKhan0525/demotion/commit/5ca13bc) |
| Nov 1 | Registry and example verification and the public illustration-update film were documented, then the verification page formatting was corrected. | [0ba72b7](https://github.com/SohailKhan0525/demotion/commit/0ba72b7) [22e56ea](https://github.com/SohailKhan0525/demotion/commit/22e56ea) [e6e9a60](https://github.com/SohailKhan0525/demotion/commit/e6e9a60) |
| Nov 19 | PR #1 introduced the MIT grant and contributor/launch guide. PR #2 delivered the editable Canvas editor and film. The release commit recorded npm 0.4.0. | [31e6eaa](https://github.com/SohailKhan0525/demotion/commit/31e6eaa) [4e1b159](https://github.com/SohailKhan0525/demotion/commit/4e1b159) [c9ff499](https://github.com/SohailKhan0525/demotion/commit/c9ff499) |

At this cutoff the repository had three branches named `main`, `demotion-open-source-launch` and `canvas-launch-040`. The two feature branches contribute three commit IDs outside the 42-commit release ancestry, for 45 distinct public commits across all three branches. Their final trees match the two squash merges on main. The Canvas branch also preserves the intermediate version before the downloaded clip check and packaged film guide. [Open-source branch change](https://github.com/SohailKhan0525/demotion/commit/b2545cb) · [Canvas implementation](https://github.com/SohailKhan0525/demotion/commit/047d7f7) · [Canvas verification and packaging](https://github.com/SohailKhan0525/demotion/commit/30a0406)

**Earlier paths.** The retired publishing workflow was `.github/workflows/first-release.yml`. The original terms lived in `COMMERCIAL-LICENSE.md`. Early launch notes were `docs/launch/release-notes-0.1.0.md` and `docs/launch/x-launch.md`. Under `docs/qa/`, the historical files were `actions.md`, `audit-baseline.md`, `audit.md`, `continuation.md`, `launch-contact-sheet.jpg`, `launch-transitions.jpg`, `launch.md`, `npm-0.1.0.md` and `publication-status.md`.

The early binary release tracked `media/SHA256SUMS` and `media/demotion-launch.mp4`. Two font faces and their notices were retired from `public/fonts/`, namely `InterVariable.woff2`, `PlayfairDisplayVariable.woff2`, `licenses/OFL-inter.txt` and `licenses/OFL-playfair-display.txt`. The earlier pipeline and reel used `scripts/build_audio.py`, `src/beats.ts`, `src/reel/DemoReel.tsx` and `src/timeline.json`. Current release movies live with their GitHub releases.

### GitHub Actions through v0.4.0

Across all branches, the release-period Actions history contains 62 workflow runs and 100 jobs, each on its first attempt. There were 55 successful runs, 7 failed runs, 93 successful jobs and 7 failed jobs. CI passed all 39 times. The final 12 runs contributed 20 passing jobs, including publishing the package, rendering the tagged film and uploading its frame-review archive. The v0.4.0 release commit carried the generated skip-CI marker. [Source CI](https://github.com/SohailKhan0525/demotion/actions/runs/44463148211) · [Package log](https://github.com/SohailKhan0525/demotion/actions/runs/44463148307/job/135354501459) · [Film job](https://github.com/SohailKhan0525/demotion/actions/runs/44463148307/job/135355354103)

| Workflow | Runs | Failed |
| --- | ---: | ---: |
| CI | 39 | 0 |
| First npm release (retired) | 8 | 6 |
| Release | 7 | 0 |
| Film previews | 4 | 0 |
| Launch video | 2 | 1 |
| Promo film | 1 | 0 |
| Update film | 1 | 0 |

The six failed bootstrap runs on 26 October concerned npm authorization, package naming, immediate registry visibility, a registry rejection and tag permissions. The separate film failure on 27 October stopped at a missing FFmpeg executable. The next source change installed the encoder on the runner. [Authorization](https://github.com/SohailKhan0525/demotion/actions/runs/40362087651) · [Name rejection](https://github.com/SohailKhan0525/demotion/actions/runs/40362521056) · [Registry visibility](https://github.com/SohailKhan0525/demotion/actions/runs/40363543644) · [Registry rejection](https://github.com/SohailKhan0525/demotion/actions/runs/40364423588) · [Version lookup](https://github.com/SohailKhan0525/demotion/actions/runs/40369874900) · [Tag push](https://github.com/SohailKhan0525/demotion/actions/runs/40371478055) · [Missing encoder](https://github.com/SohailKhan0525/demotion/actions/runs/40467514444)

The two merged pull requests at this cutoff are [the open-source launch guide](https://github.com/SohailKhan0525/demotion/pull/1) and [the Canvas release](https://github.com/SohailKhan0525/demotion/pull/2). The repository also has separate film tags for launch-v2, promo-launch and update-030. [Release assets and tags](https://github.com/SohailKhan0525/demotion/releases)
