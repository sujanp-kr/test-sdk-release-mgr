import { KatSDK, KatSDKMap, getKatSdks } from "./sdks";

describe("sdks.json", () => {
  let sdks: KatSDKMap;

  beforeEach(() => {
    sdks = getKatSdks();
  });

  it("Should be valid JSON", () => {
    expect(sdks).toBeTruthy();
    expect(Object.values(sdks).length).toBeTruthy();
  });

  it("Should have all props for all sdks", () => {
    const props = Object.keys(Object.values(sdks)[0]);
    Object.values(sdks).forEach((sdk) => {
      console.log("Checking:", sdk);
      props.forEach((prop) => {
        expect(sdk[prop as keyof KatSDK]).toBeTruthy();
      });
    });
  });
});
