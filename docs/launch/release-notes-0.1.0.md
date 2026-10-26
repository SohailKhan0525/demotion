# demotion 0.1.0

Motion graphics, written in code. The first public release of the React toolkit
and CLI for making videos locally with Remotion.

- Beat clock, springs and expo easing for timed motion.
- Kinetic typography, scene camera, grain, motion blur and beat-landed wipes.
- Terminal and code-panel reveals.
- Optional 3D panels with real depth of field.
- A procedural audio engine with beat-driven cues and LUFS mastering.
- A CLI starter with bundled, licensed fonts and 1080p/4K render commands.

```bash
npx demotion init my-video
cd my-video
npm install
npm start
```

Edit `src/MyVideo.tsx`, then `npm run render`.
Requires Node 22.14+ and a Chromium browser for rendering.

The original launch film and rendered QA are available in the repository.
This is a first 0.x release; some older exported components retain legacy styles,
and historical component cleanup is still documented in the handoff.

Personal and non-commercial use follows the existing PolyForm Noncommercial
license. Business use requires a commercial license. Remotion has its own terms;
see the repository's existing license documents. No license terms were changed
for this release. No provenance attestation is requested.
