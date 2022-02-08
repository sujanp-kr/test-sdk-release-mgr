import yargs from "yargs/yargs";
import { printSdkMatrix } from "./commands";
import { createBetaRelease } from "./commands/create-beta-release/create-beta-release";
import { printRepoDefaultBranch } from "./commands/get-repo-default-branch/getRepoDefaultBranch";

// More info: https://github.com/yargs/yargs/blob/HEAD/docs/typescript.md
const cliInput = yargs(process.argv)
  .options({
    command: {
      demandOption: true,
      choices: [
        "create-new-sdk",
        "print-sdk-matrix",
        "create-beta-release",
        "get-repo-default-branch",
      ] as const,
    },
  })
  .parseSync();

const commandMapping: {
  [command in typeof cliInput["command"]]: () => void | never;
} = {
  "create-new-sdk": () => {
    console.log("Would create new SDK");
  },
  "print-sdk-matrix": printSdkMatrix,
  "create-beta-release": createBetaRelease,
  "get-repo-default-branch": printRepoDefaultBranch,
};

commandMapping[cliInput.command]();
