import { describe, it, expect } from "vitest";
import { calculateConcrete } from "../../src/features/concrete/utils/calculateConcrete";

describe("calculateConcrete", () => {
  it("calculates concrete volume for default scenario", () => {
    const result = calculateConcrete({
      lengthM: 10,
      widthM: 5,
      thicknessM: 0.1,
      wastePercent: 5,
    });
    expect(result.volumeM3).toBeCloseTo(5);
    expect(result.volumeWithWasteM3).toBeCloseTo(5.25);
    expect(result.bags50kg).toBe(210); // ceil(5.25 / 0.025)
  });

  it("returns zeros when required dimensions are invalid", () => {
    const result = calculateConcrete({
      lengthM: 0,
      widthM: 5,
      thicknessM: 0.1,
      wastePercent: 5,
    });
    expect(result.volumeM3).toBe(0);
    expect(result.volumeWithWasteM3).toBe(0);
    expect(result.bags50kg).toBe(0);
  });

  it("ignores negative and non-finite values", () => {
    const result = calculateConcrete({
      lengthM: -5,
      widthM: Infinity,
      thicknessM: NaN,
      wastePercent: -10,
    });
    expect(result.volumeM3).toBe(0);
    expect(result.bags50kg).toBe(0);
  });

  it("calculates without waste when wastePercent is 0", () => {
    const result = calculateConcrete({
      lengthM: 4,
      widthM: 4,
      thicknessM: 0.2,
      wastePercent: 0,
    });
    expect(result.volumeM3).toBeCloseTo(3.2);
    expect(result.volumeWithWasteM3).toBeCloseTo(3.2);
    expect(result.bags50kg).toBe(128); // ceil(3.2 / 0.025)
  });

  it("rounds bags up to nearest whole bag", () => {
    const result = calculateConcrete({
      lengthM: 1,
      widthM: 1,
      thicknessM: 0.03,
      wastePercent: 0,
    });
    // volume = 0.03, bags = ceil(0.03 / 0.025) = ceil(1.2) = 2
    expect(result.bags50kg).toBe(2);
  });
});
