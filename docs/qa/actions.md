# GitHub Actions review

Reviewed both repository workflows and all six existing run summary pages before
pushing the launch work. All six historical runs were successful:

| Workflow | Run | Commit |
| --- | --- | --- |
| CI | [37739992032](https://github.com/SohailKhan0525/demotion/actions/runs/37739992032) | 35c4daa |
| CI | [37740029336](https://github.com/SohailKhan0525/demotion/actions/runs/37740029336) | 9a818dc |
| Release | [38034258196](https://github.com/SohailKhan0525/demotion/actions/runs/38034258196) | 86f92ad |
| Release | [38132205040](https://github.com/SohailKhan0525/demotion/actions/runs/38132205040) | 52c80bf |
| Release | [39381694987](https://github.com/SohailKhan0525/demotion/actions/runs/39381694987) | 5b46c03 |
| Release | [40339514601](https://github.com/SohailKhan0525/demotion/actions/runs/40339514601) | 876db10 |

Each summary reported the checkout/setup-node Node 20 runtime deprecation warning
and the impending ubuntu-latest image migration notice. Public pages expose
status and annotations; full logs require authentication. The GitHub API hostname
is denied by this cloud network policy, so API/log access is not claimed.

## Changes

- CI now runs for main/beta pushes as well as other pushes, pull requests and
  manual dispatch. Node 22 and 24 both install the frozen lockfile, check types,
  build, run tests and inspect package contents.
- Checkout and setup-node use verified v6 commit SHAs and the Node 24 action
  runtime. The project runtime is independently selected by the Node matrix.
- Both workflows use ubuntu-24.04, avoiding an unplanned runner image migration.
  CI has read-only repository permissions and cancels superseded runs.
- Release is an explicit workflow_dispatch action with a publish checkbox and
  main/beta branch restriction. Ordinary pushes cannot publish npm packages.
  The owner supplies NPM_TOKEN securely in repository settings; missing credentials
  produce a clear failure before release installation. Semantic-release still
  controls versions, release notes, provenance and GitHub releases.
- Local install, TypeScript checks, build and all 29 tests passed before commit.
  Package inspection confirmed dist and bundled fonts are included, while the
  26 MB video is excluded from the npm package. Workflow syntax is checked with
  the checksum-verified official actionlint v1.7.7 release binary.

The launch download is a normal repository asset at media/demotion-launch.mp4.
Its SHA-256 is recorded in media/SHA256SUMS; GitHub serves the raw download.
