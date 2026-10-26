# Instructions for coding agents (Codex, Claude Code, …)

You are continuing **demotion**: a React toolkit + CLI for making polished, beat-synced motion-graphics videos locally with Remotion.
**Read `docs/HANDOFF.md` first** — it has the current state, the task list in order, the launch-video storyboard, and the pitfalls already hit.

## Rules (non-negotiable)
- `npm install && npm run lint && npm run build && npm test` must pass before every commit.
- Commit with **Conventional Commits**: `feat:` (minor) `fix:` (patch) `docs:`/`chore:`/`test:` (no release). **Never** use `!` or a `BREAKING CHANGE` footer — nothing is published yet and that would release 1.0.0 instead of 0.1.0.
- Work on **`main` only**. No other branches.
- **Never** commit tokens or secrets. The owner authorized publishing `@demotion/cli` publicly in their npm organization `demotion`, using GitHub Actions secret `NPM_SECRET`. The authenticating npm user is `qofeno-labs`. Keep provenance disabled. Later releases use the manual Release workflow. Never publish to another name or scope without explicit owner authorization.
- **Do not change `LICENSE`, `COMMERCIAL-LICENSE.md` or licence wording** without the owner's explicit decision (see HANDOFF §7).
- **Honesty:** every command, number, component name or code listing shown in a video or README must be true of this repo. Add or extend a test that proves it (see `test/launch.test.mjs`).
- **Quality bar (the owner's top priority — quality over duration):** all motion on the beat clock (`src/core/clock.ts`); no linear easing (use `outExpo`/`spring`/`bezier`); no pure `#000`/`#fff`; only the 5 theme colours in `src/engine/theme.ts`; only fonts from `src/font.ts`; every entrance staggered with overshoot; camera rig + real motion blur + grain on; look at **stills and a whole-timeline contact sheet** before calling anything done.
- Keep answers/PRs short. Prefer small commits.
