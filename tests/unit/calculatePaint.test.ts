import { describe, it, expect } from "vitest";
import { calculatePaint } from "../../src/features/paint/utils/calculatePaint";

describe("calculatePaint", () => {
  it("calculates paint amount for default scenario", () => {
    const result = calculatePaint({
      roomAreaM2: 50,
      coats: 2,
      coverageM2perL: 10,
      wastePercent: 5,
    });
    expect(result.litersPerCoat).toBeCloseTo(5);
    expect(result.litersWithoutWaste).toBeCloseTo(10);
    expect(result.litersWithWaste).toBeCloseTo(10.5);
  });

  it("returns zeros when required dimensions are invalid", () => {
    const result = calculatePaint({
      roomAreaM2: 0,
      coats: 2,
      coverageM2perL: 10,
      wastePercent: 5,
    });
    expect(result.litersPerCoat).toBe(0);
    expect(result.litersWithoutWaste).toBe(0);
    expect(result.litersWithWaste).toBe(0);
  });

  it("returns zeros when coverage is zero", () => {
    const result = calculatePaint({
      roomAreaM2: 50,
      coats: 2,
      coverageM2perL: 0,
      wastePercent: 0,
    });
    expect(result.litersPerCoat).toBe(0);
  });

  it("ignores negative and non-finite values", () => {
    const result = calculatePaint({
      roomAreaM2: -10,
      coats: Infinity,
      coverageM2perL: NaN,
      wastePercent: -5,
    });
    expect(result.litersPerCoat).toBe(0);
    expect(result.litersWithWaste).toBe(0);
  });

  it("calculates without waste when wastePercent is 0", () => {
    const result = calculatePaint({
      roomAreaM2: 20,
      coats: 1,
      coverageM2perL: 10,
      wastePercent: 0,
    });
    expect(result.litersPerCoat).toBeCloseTo(2);
    expect(result.litersWithoutWaste).toBeCloseTo(2);
    expect(result.litersWithWaste).toBeCloseTo(2);
  });
});
