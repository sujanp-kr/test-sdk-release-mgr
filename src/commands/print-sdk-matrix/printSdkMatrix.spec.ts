import { getSdkMatrix } from "./printSdkMatrix";
import { KatSDKMap } from "../../sdk-matrix/sdks";

describe("getSdkMatrix", () => {
  it("should returns sdk names", () => {
    const mockSDK: KatSDKMap = {
      banner: {
        sshURL: "sshURL",
        htmlURL: "htmlURL",
        repo: "brepo",
        weeklyUpdates: {
          outputDest: "behavioral-analytics-banner/src",
          schemaRoot: "banner",
        },
      },
      demeter: {
        sshURL: "sshURL",
        htmlURL: "htmlURL",
        repo: "brepo",
        weeklyUpdates: {
          outputDest: "behavioral-analytics-demeter/src",
          schemaRoot: "demeter",
        },
      },
      devmarketplace: {
        sshURL: "sshURL",
        htmlURL: "htmlURL",
        repo: "brepo",
        weeklyUpdates: {
          outputDest: "behavioral-analytics-devmarketplace/src",
          schemaRoot: "devmarketplace",
        },
      },
    };

    expect(getSdkMatrix(mockSDK)).toMatchSnapshot();
  });
});
