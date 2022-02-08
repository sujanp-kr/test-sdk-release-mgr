import { Octokit } from "octokit";
// eslint-disable-next-line no-duplicate-imports
import type { Octokit as _OctokitInstance } from "octokit";
import { default as ProxyAgent } from "proxy-agent";
import { getAccessToken } from "./accessToken";

export type OctokitInstance = _OctokitInstance;

export type GithubPullRequest = Awaited<
  ReturnType<OctokitInstance["rest"]["pulls"]["get"]>
>["data"];

export function getOctokitInstance(
  accessToken: string = getAccessToken()
): OctokitInstance {
  return new Octokit({
    auth: accessToken,
    request: {
      // The Kroger space needs this proxy util
      agent: new ProxyAgent(),
    },
  });
}
