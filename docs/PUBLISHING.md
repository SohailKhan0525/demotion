# Publishing @demotion/cli

The package belongs to the owner's npm organization **demotion**. NPM_SECRET is
a GitHub Actions repository secret for the publishing user qofeno-labs, who must
have permission to create/publish packages in that organization. Never put its
value in source, logs or chat.

Publishing is public and provenance is disabled in package.json, CLI flags and
workflow environment. No OIDC provenance permission is requested. The package
name must remain @demotion/cli; the executable name is demotion.

## Current release

`@demotion/cli@0.2.0` is published, with `latest` pointing to 0.2.0. The public
registry identifies qofeno-labs as its publisher and has no provenance attestation.
The source tag v0.2.0 identifies npm's gitHead. The
[0.2.0 Release run](https://github.com/SohailKhan0525/demotion/actions/runs/41098657398)
completed successfully. The initial v0.1.0 tag remains the baseline checked by
the workflow. The temporary first-publication
workflow has been retired; ordinary source pushes run CI. Only an explicit
release request or a manual Release dispatch can publish packages.

Registry consumer verification uses the documented npx command outside the
source checkout and installs from registry.npmjs.org. Version-specific results
are recorded in DEVELOPMENT.md.

```bash
npx --yes @demotion/cli@latest init my-video
cd my-video
npm install
npm start
```

Use another terminal in my-video for npm run render. Do not republish 0.1.0 or 0.2.0;
published name/version pairs are immutable.

## Later releases

Use Conventional Commits. Dispatch Release on main (or beta for a prerelease) and
explicitly enable its publish input. The workflow validates the first-release
baseline and registry entry before semantic-release determines the next version,
publishes it, writes release notes and records its source tag. The optional
`expected_version` input checks the computed version before any publication.

When credentials are available only in GitHub Actions, an owner-authorized
change to `.github/npm-release-request.json` on main can request the same Release
job without retrieving the npm secret into a local environment:

```json
{
  "version": "0.2.0"
}
```

The example above is the completed 0.2.0 request. For a later release, use the
intended next version. This file is a publication request, not general
configuration: editing it and pushing main starts the publisher. Other paths
do not trigger publication. The workflow runs install, lint, build and tests,
then a semantic-release dry run; if its calculated version differs from the
request, it stops before publication. It never changes versions to work around
an authentication failure. The normal manual dispatch remains available.

Release automation writes npm metadata, the changelog, source tag and GitHub
release. Automatic issue/PR comments and failure issues are disabled.

Do not bump a version repeatedly to work around authentication or organization
permission failures. Check the Actions annotation and token's package/scope
permissions. Keep npm account protection enabled and use credentials permitted
by npm's current publishing/2FA policy. Never rename the package to bypass a
registry or access failure without the owner's explicit decision.
