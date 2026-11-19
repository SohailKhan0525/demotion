# Contributing to Demotion

If a scene renders differently from its Studio preview, a starter fails to install,
or an example leaves out a step, we'd like to hear about it. Search the
[issue tracker](https://github.com/SohailKhan0525/demotion/issues) for an existing
report, or open one with the smallest example that shows what happened. For
animation issues, include the composition, frame number and expected result.

## Set up a checkout

Fork the repository, clone your fork, and open a terminal in the checkout. Use
Node.js 22.14 or newer and npm. These commands install the versions in the
lockfile and run the same checks as CI.

```sh
npm ci
npm run lint
npm run build
npm test
npm pack --dry-run
```

The build creates the package entry points used by the tests. After changing
the toolkit, rebuild before rerunning a single test file, for example
`node --test test/core.test.mjs`.

To preview a visual change, run `npm run dev` and choose a composition in
Remotion Studio. `UpdateFilm` shows the illustration APIs, while `Lab` and `UI`
let you inspect shorter studies. The [development guide](docs/DEVELOPMENT.md)
covers browser setup, film renders and testing a packed copy in a fresh project.

## Send a pull request

Work in your fork and target this repository's `main` branch. Explain which
user-facing behavior changes, how to try it and which checks you ran. Include
a regression test for a bug fix where practical. For a visual change, attach
a still or contact sheet to the pull request and identify the composition and
frame so reviewers can reproduce it. Generated videos belong in the ignored
`out/` directory.

Submit code and documentation you have the right to contribute under Demotion's
[MIT License](LICENSE). The MIT grant covers Demotion-owned work in this
revision. Earlier releases carry the terms shipped with them. For third-party
assets, identify their source and license, and include the required notices.
See the [existing notices](THIRD_PARTY_NOTICES.md) for the bundled fonts.

Use a Conventional Commit title such as `fix: preserve the last caption` or
`docs: clarify the browser setup`. The maintainer handles version
numbers, release tags and npm publication.
