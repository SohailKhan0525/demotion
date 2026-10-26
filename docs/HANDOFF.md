# Current handoff

The owner authorized the npm organization package **@demotion/cli**, using
GitHub Actions secret **NPM_SECRET**. The authenticating npm account is
qofeno-labs. Do not use demotion (npm rejected its unscoped name), the deleted
@qofeno-labs/demotion, or any other namespace. Provenance must stay disabled.

The CLI executable remains demotion. Generated projects depend on and import
@demotion/cli directly. The package includes the main React toolkit, /audio and
optional /three exports. Version and public availability must be checked against
the registry; do not infer publication from a successful dry run or commit.

The source supports Launch, Lab and UI development compositions. The original
launch MP4 was downloaded by the owner and removed from the tracked tree, along
with obsolete publishing journals, old QA sheets and the unused Python pipeline.
Keep generated videos out of Git. The source can still regenerate the film.

Read README.md for supported user commands, docs/DEVELOPMENT.md for verification,
and docs/PUBLISHING.md for the release workflow. Preserve the license files and
terms. Older exported components remain for compatibility; future styling work
should be deliberate and tested, not implemented by deleting the public API.


Release status: @demotion/cli@0.1.0 is publicly available with latest=0.1.0,
publisher qofeno-labs and no provenance. Registry installation, types, Studio,
1080p rendering and the audio CLI were verified. The candidate also passed full
4K rendering and an optional 3D still. v0.1.0 matches npm's published gitHead.
The first-release bootstrap workflow is removed; only CI and manual Release remain.
