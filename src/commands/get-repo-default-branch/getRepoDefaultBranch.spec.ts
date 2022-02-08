import { getRepoDefaultBranch } from "./getRepoDefaultBranch";
import type { Octokit } from "octokit";

const octokitMock = jest.fn().mockImplementation(
  (default_branch: string) =>
    ({
      rest: {
        repos: {
          get: () =>
            new Promise((resolve) => {
              resolve({ status: 200, data: { default_branch } });
            }),
        },
      },
    } as unknown as Octokit)
);

describe("getRepoDefaultBranch", () => {
  const sdk = "banner";
  it("should retrieve repository's default branch", async () => {
    const defaultBranch = await getRepoDefaultBranch(sdk, octokitMock("main"));

    expect(defaultBranch).toEqual("main");
  });
});
