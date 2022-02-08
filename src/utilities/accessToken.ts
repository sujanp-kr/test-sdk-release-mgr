import yargs from "yargs";

/**
 * Loads the github access token from the command line --accessToken option
 * @param commandLineArgs
 */
export function getAccessToken(
  commandLineArgs: string[] = process.argv
): string {
  const cliInput = yargs(commandLineArgs)
    .option({
      accessToken: {
        demandOption: true,
        type: "string",
      },
    })
    .parseSync();

  return cliInput.accessToken;
}
