import yargs from "yargs";

/**
 * Returns the PR number supplied by --pullRequest from the command line
 * @param commandLineArgs
 */
export function getPullRequest(
  commandLineArgs: string[] = process.argv
): number {
  const cliInput = yargs(commandLineArgs)
    .option({
      pullRequest: {
        demandOption: true,
        type: "number",
      },
    })
    .parseSync();

  return cliInput.pullRequest;
}
