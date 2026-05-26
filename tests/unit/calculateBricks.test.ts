import { describe, expect, it } from "vitest";
import { calculateBricks } from "../../src/features/brick/utils/calculateBricks";

describe("calculateBricks", () => {
  it("calculates brick amount for default scenario", () => {
    const result = calculateBricks({
      wallAreaM2: 100,
      brickLengthMm: 250,
      brickHeightMm: 65,
      mortarJointMm: 10,
      wallThicknessFactor: 1,
      wastePercent: 5,
    });

    expect(result.bricksPerSquareMeter).toBeCloseTo(51.282, 3);
    expect(result.bricksWithoutWaste).toBe(5129);
    expect(result.bricksWithWaste).toBe(5386);
  });

  it("returns zeros when required dimensions are invalid", () => {
    const result = calculateBricks({
      wallAreaM2: 120,
      brickLengthMm: 0,
      brickHeightMm: 65,
      mortarJointMm: 10,
      wallThicknessFactor: 1,
      wastePercent: 5,
    });

    expect(result).toEqual({
      bricksPerSquareMeter: 0,
      bricksWithoutWaste: 0,
      bricksWithWaste: 0,
    });
  });

  it("scales result by wall thickness factor", () => {
    const singleBrick = calculateBricks({
      wallAreaM2: 20,
      brickLengthMm: 250,
      brickHeightMm: 65,
      mortarJointMm: 10,
      wallThicknessFactor: 1,
      wastePercent: 0,
    });

    const doubleBrick = calculateBricks({
      wallAreaM2: 20,
      brickLengthMm: 250,
      brickHeightMm: 65,
      mortarJointMm: 10,
      wallThicknessFactor: 2,
      wastePercent: 0,
    });

    expect(doubleBrick.bricksPerSquareMeter).toBeCloseTo(
      singleBrick.bricksPerSquareMeter * 2,
      6,
    );
    expect(doubleBrick.bricksWithoutWaste).toBe(
      singleBrick.bricksWithoutWaste * 2,
    );
  });

  it("ignores negative and non-finite values", () => {
    const result = calculateBricks({
      wallAreaM2: Number.NaN,
      brickLengthMm: 250,
      brickHeightMm: 65,
      mortarJointMm: -10,
      wallThicknessFactor: -1,
      wastePercent: Number.POSITIVE_INFINITY,
    });

    expect(result).toEqual({
      bricksPerSquareMeter: 0,
      bricksWithoutWaste: 0,
      bricksWithWaste: 0,
    });
  });
});
