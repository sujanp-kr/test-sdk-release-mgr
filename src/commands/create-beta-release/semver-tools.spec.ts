import {
  calculateReleaseCandidateVersion,
  findNewestVersionFromGitTags,
} from "./semver-tools";

describe("Semver tools", () => {
  describe("findNewestVersionFromGitTags", () => {
    it("Should not matter the order of tags", () => {
      const one = "1.0.0";
      const two = "2.0.0";
      const three = "3.0.0";
      expect(findNewestVersionFromGitTags([one, two, three])).toEqual(three);
      expect(findNewestVersionFromGitTags([three, two, one])).toEqual(three);
      expect(findNewestVersionFromGitTags([three, one, two])).toEqual(three);
    });

    it("Should handle junk tags", () => {
      expect(findNewestVersionFromGitTags(["1.0.0", "x.y.z"])).toEqual("1.0.0");
    });

    it("Should cleanup tags", () => {
      expect(findNewestVersionFromGitTags(["v1.0.0"])).toEqual("1.0.0");
    });
  });

  describe("calculateReleaseCandidateVersion", () => {
    it("Should find the RC from a normal release", () => {
      expect(calculateReleaseCandidateVersion("1.0.0")).toEqual("1.0.1-rc.0");
    });

    it("Should fine the RC from a previous RC", () => {
      expect(calculateReleaseCandidateVersion("2.0.0-rc.7")).toEqual(
        "2.0.0-rc.8"
      );
    });
  });
});
