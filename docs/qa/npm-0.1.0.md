# Manual 0.1.0 release preparation

Prepared at the owner's request for a manual first npm publication, without
provenance. No actual npm publication or v0.1.0 tag was created by the agent.

- package.json and package-lock.json now say 0.1.0.
- publishConfig.provenance is false, the future Release workflow sets
  NPM_CONFIG_PROVENANCE=false, and its OIDC write permission was removed.
- The future workflow requires the manual v0.1.0 source tag and public registry
  baseline before semantic-release can run. It remains manual-only.
- Node >=22.14 is declared, matching the documented development requirement.
- Optional 3D peer metadata uses the exact versions tested by the existing 3D
  scene. An initial broad-range candidate produced a real fresh-install ERESOLVE;
  pinning this optional set fixed it. The basic starter still installed only
  its normal dependencies; no --force/--legacy-peer-deps workaround was used.
- Frozen installation, TypeScript checks, build and all 29 tests passed.
- npm publish --dry-run --access public --provenance=false succeeded; the
  unauthenticated dry-run warning is expected and does not mean it was published.
- The tarball contains main/three/audio bundles, types, CLI, starter, licensed
  fonts and consumer UI documentation. The launch MP4 is excluded from npm.
- A freshly scaffolded project installed the packed demotion@0.1.0, its CLI
  reported 0.1.0, main exports imported, and its audio entry rendered a sound.
- That consumer rendered an actual 1920×1080 MP4, 150 frames at 30fps, 5 seconds.
  This proves a local package consumer, not yet a registry-backed consumer.
- Public registry lookup before preparation returned E404. That does not prove
  the owner's account can claim the name; actual authorization remains npm's check.

Owner instructions: [PUBLISHING.md](../PUBLISHING.md).
Prepared release notes and X copy: [release notes](../launch/release-notes-0.1.0.md),
[X launch](../launch/x-launch.md). The social copy is conditional on successful
publication and was checked against the official standard text-length rules.
Existing LICENSE and COMMERCIAL-LICENSE.md are unchanged.
