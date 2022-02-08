import yargs from "yargs";

export type GithubRepo = {
  owner: string;
  repo: string;
};

/**
 * Take --currentRepo github/blah
 *
 * return owner = github ; repo = blah
 *
 * https://docs.github.com/en/actions/learn-github-actions/environment-variables
 *
 * You can pass us env.GITHUB_REPOSITORY
 *
 * @param commandLineArgs
 */
export function getCurrentRepo(
  commandLineArgs: string[] = process.argv
): GithubRepo {
  const cliInput = yargs(commandLineArgs)
    .option({
      currentRepo: {
        demandOption: true,
        type: "string",
      },
    })
    .parseSync();

  const [owner, repo] = cliInput.currentRepo.split("/");

  if (owner && repo) {
    return {
      repo,
      owner,
    };
  }

  throw new Error(
    `Invalid format for repo, expected <owner>/<repo>, got: ${cliInput.currentRepo}`
  );
}
