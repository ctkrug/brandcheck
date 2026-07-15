import { describe, expect, it } from "vitest";
import { analyzeBrandName } from "../src/scorer";
import { INVENTED_NAMES, REAL_NAMES } from "./fixtures/brandNames";

const MIN_ACCURACY = 0.8;

describe("reference name fixture accuracy", () => {
  it("has at least 15 names in each reference group", () => {
    expect(REAL_NAMES.length).toBeGreaterThanOrEqual(15);
    expect(INVENTED_NAMES.length).toBeGreaterThanOrEqual(15);
  });

  it("verdicts at least 80% of real names as green", () => {
    const correct = REAL_NAMES.filter(
      (name) => analyzeBrandName(name).verdict === "green",
    ).length;
    expect(correct / REAL_NAMES.length).toBeGreaterThanOrEqual(MIN_ACCURACY);
  });

  it("verdicts at least 80% of invented names as yellow or red", () => {
    const correct = INVENTED_NAMES.filter((name) =>
      ["yellow", "red"].includes(analyzeBrandName(name).verdict),
    ).length;
    expect(correct / INVENTED_NAMES.length).toBeGreaterThanOrEqual(
      MIN_ACCURACY,
    );
  });
});
