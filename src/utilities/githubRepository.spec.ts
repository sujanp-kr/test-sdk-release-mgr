import { getCurrentRepo as sut } from "./githubRepository";

describe("--currentRepo", () => {
  it("Should return correct values on good input", () => {
    const result = sut(["--currentRepo", "microsoft/typescript"]);

    expect(result).toEqual({
      repo: "typescript",
      owner: "microsoft",
    });
  });

  it("Should throw an error when current repo is in a bad format", () => {
    expect(() => {
      sut(["--currentRepo", "my-madeup-repo"]);
    }).toThrowError();
  });
});
