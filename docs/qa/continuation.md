# Continuation: reference review and T1

Reviewed the uploaded core guide (also included in the knowledge-pack zip), the
pack's folder/readme inventory, the reference overview, reference source excerpts
(core timing/math, timeline, kinetic typography), and a 15-frame contact sheet
extracted from the uploaded 15-second 1920x1080/60fps MP4. The video was inspected
through decoded frames, not played with sound. The Python implementation remains
reference material; it was not installed or executed.

The older reference brief describes rebuilding MotionKit and changing licenses.
The existing demotion handoff takes precedence for this continuation: keep the
current package, palette, license and engine, and build an original launch demo.
No publication, license change, or remote push was performed.

## Diagnosis

The supplied audit ran before implementation; see `audit.md`. It reports 45
linear-interpolation candidates, 28 pure-color candidates and 6 default-font
candidates in the original 60 source files. These are heuristic findings, not a
reviewed defect count: font fallbacks and opacity-only interpolation can be
legitimate. The main legacy problems are repeated generic motion in components
such as CardFan, inconsistent neutrals in DashboardChrome/CodeTabs, and older
canvas typography in ParticleText. Those are deferred to handoff T6; the missing
launch UI takes priority under T1. No full baseline rubric score is claimed.

## T1 implementation and visual checks

- Added public Terminal and CodePanel components, using useShot timing and themes.
- Added a UI composition with camera, grain and render-time motion blur enabled.
- Added three behavioral tests; lint, build and all 24 tests pass.
- First sheet: `out/ui-qa/before.jpg`, frames 0, 30, 60, 112, 120, 150, 190, 239.
  Problems observed: empty opening frame, code too small for comfortable video
  reading, and excess empty space in the terminal. Increased code/terminal size
  and added a persistent, contrasting gallery title to make the opening legible.
- Second sheet: `out/ui-qa/after.jpg`, same frames. Generated outputs are ignored.
  The study checks panel behavior, timing and fitting; the eventual flagship
  launch still needs shot-by-shot and encoded-video QA. No audio or overall
  launch quality score is asserted for this silent component study.

Next handoff task: T2, launch timeline and truthful code/CLI content with tests,
then the 3D shot and Launch composition. Preserve the pre-release status: the
registry install commands must not be presented as already working until tested
following the owner's release.

## Continued implementation

T2–T4 are now implemented: launch timeline, original shot sequence, shared audio,
3D panel/camera shot, Launch registration, and content tests. T5 rendering and
encoded-output verification are recorded in [launch QA](launch.md). README and
soundtrack examples cover the tested source workflow. T6 has targeted fixes and
removal of the rejected reel; legacy public-component cleanup remains explicitly
tracked rather than treated as complete. The earlier “Next handoff task: T2”
paragraph above is historical.
