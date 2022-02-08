import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { Octokit } from "octokit";
import { GithubPullRequest } from "../../utilities";
import { createBetaRelease as sut } from "./create-beta-release";

describe("createBetaRelease", () => {
  const mocktokit: DeepMockProxy<Octokit> = mockDeep<Octokit>();

  function buildGithubResponse<T>(data: T): {
    data: T;
    headers: { [k: string]: string };
    status: 200;
    url: string;
  } {
    return {
      data,
      headers: {},
      status: 200,
      url: "you wish",
    };
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Should return the correct tag", async () => {
    mocktokit.rest.repos.listTags.mockResolvedValueOnce(
      buildGithubResponse([
        {
          name: "v1.0.0",
          commit: {
            sha: "example",
            url: "blah.com/example",
          },
          node_id: "blah-blah",
          tarball_url: "blah",
          zipball_url: "blah",
        },
      ])
    );

    mocktokit.rest.pulls.get.mockResolvedValueOnce(
      buildGithubResponse({
        head: {
          sha: "git-sha-781290389381",
        },
      } as unknown as GithubPullRequest)
    );

    const result = await sut({
      octokit: mocktokit,
      repo: {
        repo: "typescript",
        owner: "Microsoft",
      },
      pullRequest: 7,
    });

    expect(result).toEqual("v1.0.1-rc.0");
  });

  it("Should throw an error if a valid tag is not found", async () => {
    mocktokit.rest.repos.listTags.mockResolvedValueOnce(
      buildGithubResponse([
        {
          name: "invalid-semver-tag",
          commit: {
            sha: "example",
            url: "blah.com/example",
          },
          node_id: "blah-blah",
          tarball_url: "blah",
          zipball_url: "blah",
        },
      ])
    );

    try {
      await sut({
        octokit: mocktokit,
        repo: {
          repo: "MacOS",
          owner: "Apple",
        },
        pullRequest: 15,
      });
    } catch (e: Error | unknown) {
      if (e instanceof Error) {
        expect(e.message).toContain("tag");
        expect(e).toMatchSnapshot();
      } else {
        fail("Should be a real error");
      }
    }
  });

  it("Should make correct calls out to Github", async () => {
    mocktokit.rest.repos.listTags.mockResolvedValueOnce(
      buildGithubResponse([
        {
          name: "v1.0.0",
          commit: {
            sha: "example",
            url: "blah.com/example",
          },
          node_id: "blah-blah",
          tarball_url: "blah",
          zipball_url: "blah",
        },
      ])
    );

    mocktokit.rest.pulls.get.mockResolvedValueOnce(
      buildGithubResponse({
        head: {
          sha: "git-sha-781290389381",
        },
      } as unknown as GithubPullRequest)
    );

    mocktokit.rest.repos.createRelease.mockResolvedValueOnce(
      buildGithubResponse({
        html_url: "github.com/repo/pulls/n",
      }) as never
    );

    await sut({
      octokit: mocktokit,
      repo: {
        repo: "typescript",
        owner: "Microsoft",
      },
      pullRequest: 7,
    });

    expect(mocktokit.rest.git.createRef).toHaveBeenCalledWith({
      repo: "typescript",
      owner: "Microsoft",
      sha: "git-sha-781290389381",
      ref: `refs/tags/v1.0.1-rc.0`,
    });

    expect(mocktokit.rest.repos.createRelease).toHaveBeenCalledWith({
      repo: "typescript",
      owner: "Microsoft",
      prerelease: true,
      tag_name: "v1.0.1-rc.0",
      name: "v1.0.1-rc.0",
    });

    // The release should be created after the ref
    expect(
      mocktokit.rest.repos.createRelease.mock.invocationCallOrder[0]
    ).toBeGreaterThan(mocktokit.rest.git.createRef.mock.invocationCallOrder[0]);

    expect(mocktokit.rest.issues.createComment).toHaveBeenCalledTimes(1);

    expect(mocktokit.rest.issues.createComment.mock.calls[0]).toMatchSnapshot(
      "Comment created"
    );
  });
});
