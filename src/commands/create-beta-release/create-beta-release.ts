import { getOctokitInstance, getPullRequest } from "../../utilities";
import { getCurrentRepo } from "../../utilities/githubRepository";
import {
  calculateReleaseCandidateVersion,
  findNewestVersionFromGitTags,
} from "./semver-tools";

export async function createBetaRelease(
  { octokit, repo, pullRequest } = {
    octokit: getOctokitInstance(),
    repo: getCurrentRepo(),
    pullRequest: getPullRequest(),
  }
): Promise<string> {
  const tagRequestFromGithub = await octokit.rest.repos.listTags(repo);

  const newestTag = findNewestVersionFromGitTags(
    tagRequestFromGithub.data.map((github_tag) => github_tag.name)
  );
  console.log("Found newest tag:", newestTag);

  const rcTag = `v${calculateReleaseCandidateVersion(newestTag)}`;

  const prFromGithub = await octokit.rest.pulls.get({
    ...repo,
    pull_number: pullRequest,
  });

  console.log("Got PR:", `#${pullRequest}`, prFromGithub.data?.title);

  // In Github, you must create a tag reference and then release that tag
  const tagRef = await octokit.rest.git.createRef({
    ...repo,
    sha: prFromGithub.data.head.sha,
    ref: `refs/tags/${rcTag}`,
  });

  console.log("Tag ref created:", tagRef?.data?.ref);

  const release = await octokit.rest.repos.createRelease({
    ...repo,
    prerelease: true,
    tag_name: rcTag,
    // Gives the release a title in Github
    name: rcTag,
  });

  console.log("Release created:", release?.data?.html_url);

  await octokit.rest.issues.createComment({
    ...repo,
    // In Github, pull requests are just issues with code
    issue_number: pullRequest,
    body: `Beta release ${rcTag} has been created :tada:\n${release?.data?.html_url}`,
  });

  console.log("Commented on PR");

  return rcTag;
}
