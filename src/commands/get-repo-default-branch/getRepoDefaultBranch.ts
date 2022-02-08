import yargs from "yargs";
import { getKatSdks } from "../../sdk-matrix/sdks";
import { getOctokitInstance } from "../../utilities";

/**
 * Retrieves default branch from a specific repo
 *
 * @example 'main'
 */
export async function getRepoDefaultBranch(
  repo: string,
  _octokit = getOctokitInstance()
): Promise<string> {
  try {
    const {
      data: { default_branch },
    } = await _octokit.rest.repos.get({
      owner: "krogertechnology",
      repo,
    });
    return default_branch;
  } catch (error) {
    console.log("🚀 ~ file: getRepoDefaultBranch.ts ~ line 14 ~ error", error);
    process.exit(1);
  }
}

export async function printRepoDefaultBranch(): Promise<void> {
  const sdkMap = getKatSdks();
  const { sdk } = yargs(process.argv)
    .options({
      sdk: {
        demandOption: true,
        choices: Object.keys(sdkMap),
      },
    })
    .parseSync();

  const repo = sdkMap[sdk].repo;
  const output = await getRepoDefaultBranch(repo);
  console.log(output);
}
