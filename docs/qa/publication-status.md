# Publication correction

The requested npm package name is **demotion**, published by the individual
account **qofeno-labs**. npm refused that unscoped name with E403 because it was
too similar to emotion and motion. CI and account authentication passed; changing
the token or turning off provenance does not resolve that naming restriction.

The agent incorrectly proceeded with npm's suggested personal scope and
published **@qofeno-labs/demotion@0.1.0**. The owner then explicitly corrected that
choice: only demotion was requested. The scoped package is not the requested
release. It must not be advertised as one or used to justify another rename.

The registry's public scoped version endpoint confirmed the unintended package,
publisher qofeno-labs, no provenance attestation, and gitHead
90adcea9fb6c27ed6c0521b683f02ebc482fe46a. No unscoped demotion version was published.

The repository, CLI instructions, starter and launch copy have been restored to
demotion. The first-release workflow no longer runs on pushes; it requires manual
dispatch and an explicit publish checkbox. The future Release workflow also
checks that its baseline tag belongs to demotion, not the unintended scoped
package. Provenance remains disabled. Tests and workflow lint pass after restoring
the name. The owner reported deleting the scoped package. Its public 0.1.0 version
endpoint was then checked and returned HTTP 404. No further scoped publication
or recreation is authorized.

See [the current blocker and support-request draft](../PUBLISHING.md).
