import yargs from "yargs";
import { KatSDK, KatSDKMap, getKatSdks } from "../../sdk-matrix/sdks";

interface GET_SDK_MATRIX extends KatSDK {
  name: string;
}

export function getSdkMatrix(
  sdkMap: KatSDKMap = getKatSdks()
): GET_SDK_MATRIX[] {
  return Object.entries(sdkMap).map(([name, details]) => ({
    name,
    ...details,
  }));
}

/**
 * Used to provide a matrix to pass back to Github actions
 *
 * https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix
 */
export function printSdkMatrix(): void {
  const sdkMatrix = getSdkMatrix();
  const sdkOptions = sdkMatrix.map(({ name }) => name);

  const { sdk } = yargs(process.argv)
    .options({
      sdk: {
        demandOption: false,
        choices: [...sdkOptions, "all"],
      },
    })
    .parseSync();
  console.log(
    JSON.stringify(
      sdk !== "all" ? sdkMatrix.filter(({ name }) => name === sdk) : sdkMatrix
    )
  );
}
