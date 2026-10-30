import fs from "node:fs";
import { pathToFileURL } from "node:url";

/** Validate the actual semantic-release dry run before allowing its publish pass. */
export const releaseWithGuard = async (release, expectedVersion) => {
  const preview = await release({ dryRun: true });
  if (!preview?.nextRelease?.version) throw new Error("No release candidate found; nothing published");
  const version = preview.nextRelease.version;
  if (expectedVersion && version !== expectedVersion) {
    throw new Error(`Expected release ${expectedVersion}, but semantic-release selected ${version}; nothing published`);
  }
  const published = await release({ dryRun: false });
  if (published?.nextRelease?.version !== version) throw new Error("Publication result did not match the reviewed release candidate");
  return published;
};

export const expectedReleaseVersion = (eventName, input, request) => {
  const version = eventName === "push" ? request?.version : input;
  if (eventName === "push" && !version) throw new Error("A release-request push must specify its expected version");
  if (version && !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) throw new Error("Invalid expected release version");
  return version || undefined;
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  if (pkg.name !== "@demotion/cli" || pkg.publishConfig?.provenance !== false || process.env.NPM_CONFIG_PROVENANCE !== "false") {
    throw new Error("Release must target @demotion/cli with provenance disabled");
  }
  const request = process.env.GITHUB_EVENT_NAME === "push"
    ? JSON.parse(fs.readFileSync(".github/npm-release-request.json", "utf8")) : undefined;
  const expected = expectedReleaseVersion(process.env.GITHUB_EVENT_NAME, process.env.EXPECTED_RELEASE_VERSION, request);
  const { default: semanticRelease } = await import("semantic-release");
  await releaseWithGuard(semanticRelease, expected);
}
