# Publishing @demotion/cli

The package belongs to the owner's npm organization **demotion**. NPM_SECRET is
a GitHub Actions repository secret for the publishing user qofeno-labs, who must
have permission to create/publish packages in that organization. Never put its
value in source, logs or chat.

Publishing is public and provenance is disabled in package.json, CLI flags and
workflow environment. No OIDC provenance permission is requested. The package
name must remain @demotion/cli; the executable name is demotion.

## First release

The temporary First npm release workflow prepares and checks the exact 0.1.0
package, authenticates the requested user, and publishes it using NPM_SECRET.
Its push bootstrap is authorized for this organization's first release. It is
idempotent: a matching existing version is verified, not published again.

Verification reads the registry's version endpoint, checks the publisher and
absence of provenance, and tags the published gitHead as v0.1.0. A command returning
success is not sufficient evidence of a usable release. Test a registry consumer:

```bash
npx --yes @demotion/cli@0.1.0 init my-video
cd my-video
npm install
npm run render
```

Run this outside the source checkout. Check installed types and exports, generated
fonts, video dimensions/frame count and the audio CLI. Keep the README's commands
aligned with the actual release. Do not announce availability until these succeed.
The temporary workflow can be removed once publication, source tag and consumer
checks have completed.

## Later releases

Use Conventional Commits. Dispatch Release on main (or beta for a prerelease) and
explicitly enable its publish input. The workflow validates the first-release
baseline and registry entry before semantic-release determines the next version,
publishes it, writes release notes and records its source tag.

Do not bump a version repeatedly to work around authentication or organization
permission failures. Check the Actions annotation and token's package/scope
permissions. Keep npm account protection enabled and use credentials permitted
by npm's current publishing/2FA policy. Never rename the package to bypass a
registry or access failure without the owner's explicit decision.
