# Current blocker: unscoped demotion is not published

The requested npm name is **demotion**, published by the individual account
**qofeno-labs**. npm rejected that exact name with E403 because it is too similar
to the existing packages emotion and motion. A token or provenance setting cannot
resolve this registry naming restriction. The owner needs npm Support to approve
or release the unscoped name; no alternative package name is authorized.

A scoped publication was mistakenly made as @qofeno-labs/demotion@0.1.0. That is
not the requested package. It is not a substitute for publishing demotion.
The repository and starter have been restored to the unscoped name. The first
release workflow is now manual-only, with a required publish checkbox, so code
pushes cannot launch another publication. No new publish attempt should be made
until npm has resolved the name restriction. Provenance remains disabled.

Contact npm Support at https://www.npmjs.com/support and provide:

> I own the npm account qofeno-labs and want to publish the public unscoped package
> demotion. Publishing returns E403: "Package name too similar to existing packages
> emotion,motion". This is an independently developed React/Remotion video toolkit:
> https://github.com/SohailKhan0525/demotion. Please review whether the unscoped name
> demotion can be approved. I do not want to use an organization or scoped name.

The remaining instructions below are the prepared procedure **after npm approves
that name**, not a claim that demotion is currently available on the registry.

# Current publishing authorization

The owner has now authorized the agent to publish the first release using the
GitHub Actions repository secret `NPM_SECRET`. The **First npm release** workflow
checks `npm whoami` is `qofeno-labs`, publishes the unscoped `demotion@0.1.0` with
provenance disabled, verifies registry metadata, and records the v0.1.0 source tag.
Its push trigger is limited to changes to that first-release workflow; reruns
check for an existing matching version instead of republishing it. Later releases
use the manually dispatched Release workflow, which also accepts NPM_SECRET.

The earlier manual instructions below remain an alternative, not a second
publication to perform after the workflow succeeds. Do not republish 0.1.0.

# First npm release: owner publishes 0.1.0 manually

This checkout prepares `demotion@0.1.0`. Preparation and a successful dry run are
not publication. The owner performs the actual publish on their own computer.
Provenance is explicitly disabled in package.json and the release workflow.
No token needs to be pasted into chat or committed.

## 1. Get the prepared source

Use Node 22.14+ (Node 24 LTS is a suitable choice). In your existing checkout:

```bash
git switch main
git pull --ff-only
node --version
npm ci
npm run lint && npm run build && npm test
npm publish --dry-run --access public --provenance=false --registry=https://registry.npmjs.org/
```

If you do not have a checkout yet, clone
`https://github.com/SohailKhan0525/demotion.git` first. Confirm package.json says
`0.1.0`; do not run `npm version` again. The dry-run prints a publishing message
but does not upload anything. The package contains the built toolkit, CLI,
starter, fonts and license files; the large launch video stays on GitHub.

## 2. Sign in and publish

Run these in the repository on your own computer:

```bash
npm login --auth-type=web --registry=https://registry.npmjs.org/
npm whoami --registry=https://registry.npmjs.org/
```

Complete the browser sign-in and any npm account/2FA prompts. Check that whoami
shows the intended npm account (`qofeno-labs` according to the handoff).

Then perform the actual publication:

```bash
npm publish --access public --provenance=false --registry=https://registry.npmjs.org/
```

`publishConfig.provenance` is also false, so the package does not request a
provenance attestation. This retains normal tarball integrity verification.
A token can technically publish a first version when permissions allow it;
manual browser-authenticated publishing is the owner's chosen first-release path.

## 3. Verify the registry and a clean consumer

```bash
npm view demotion@0.1.0 version --registry=https://registry.npmjs.org/
npm view demotion dist-tags --registry=https://registry.npmjs.org/
```

Expected: version `0.1.0`, with `latest` pointing to `0.1.0`. Registry availability
is established only after these succeed. In a fresh folder outside the repo:

```bash
npx --yes demotion@0.1.0 init first-demotion-video
cd first-demotion-video
npm install
npm start
```

In another terminal in that generated project:

```bash
npm run render
```

Expected: `out/video.mp4`, 1920×1080, 150 frames at 30fps (5 seconds).
Edit `src/MyVideo.tsx` to make your own video. `npm run render:4k` is also provided.

For a normal React application, install `demotion` and import its components.
The `demotion/three` entry needs the separately installed, tested 3D peers listed
in the README; the basic starter does not require them. This is a React/TypeScript
video toolkit, not a standalone GUI or an unrestricted-use license. Existing
license terms remain in LICENSE and COMMERCIAL-LICENSE.md.

## 4. Record the manual release baseline

Only after the registry install and render work, return to the original repo:

```bash
git tag -a v0.1.0 -m "demotion 0.1.0"
git push origin v0.1.0
```

The tag must identify the exact source commit used to publish. Do not pull a
newer code revision between publishing and tagging. If that tag already exists,
inspect it rather than moving or force-pushing it. You may then create a GitHub
release from that tag using the prepared release notes in
[launch/release-notes-0.1.0.md](launch/release-notes-0.1.0.md).

The tag gives semantic-release a baseline, so it will not try to release the
same initial version again. Later releases use the manually dispatched Release
workflow on main (or beta), with its publish checkbox and an appropriately scoped
NPM_TOKEN stored securely in repository settings. Provenance remains disabled.
Do not run that workflow to perform the owner's first manual release.

After verification, update the README's release-candidate status to published and
post the launch copy in [launch/x-launch.md](launch/x-launch.md). That copy assumes
0.1.0 is actually available; do not announce registry availability before checking.

## If publication fails

- Login/2FA failures: complete npm's browser/account prompts on your computer.
  Do not send credentials in chat or disable account protection.
- `E403`: check the active account, package-name ownership/permissions and the
  exact npm error. A pre-publish 404 does not guarantee the name is available to
  that account. Do not repeatedly bump versions to work around an authorization error.
- Existing-version conflict: inspect `npm view demotion@0.1.0 version` before
  retrying. A published name/version cannot be reused, even if later unpublished.
- Consumer dependency failures: retain the exact error and npm/Node versions.
  Do not use `--force` or `--legacy-peer-deps` as the default starter workflow.

References: [npm publish source documentation](https://github.com/npm/cli/blob/v11.9.0/docs/lib/content/commands/npm-publish.md),
[npm login source documentation](https://github.com/npm/cli/blob/v11.9.0/docs/lib/content/commands/npm-login.md).
