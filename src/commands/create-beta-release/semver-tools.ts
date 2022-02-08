import { clean, inc, rcompare as sortSemverNewestToOldest } from "semver";

/**
 * [ v1.0.0, v2.0.1, v2.0.0 ] ==> 2.0.1
 * @param gitTags
 */
export function findNewestVersionFromGitTags(gitTags: string[]): string {
  gitTags = gitTags
    .map((tag) => clean(tag) || "")
    .filter((tagIsNotBlank) => tagIsNotBlank)
    .sort(sortSemverNewestToOldest);

  const newestTag = gitTags[0];
  if (newestTag) {
    return newestTag;
  }

  throw new Error("Unable to find valid semver tag");
}

/**
 * Given newestVersion, returns the next RC version
 *
 * 1.0.0 ==> 1.0.1-rc.0
 *
 * @param newestVersion
 */
export function calculateReleaseCandidateVersion(
  newestVersion: string
): string | null {
  return inc(newestVersion, "prerelease", "rc");
}
