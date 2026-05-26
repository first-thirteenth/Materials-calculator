import type {
  BrickCalculationInput,
  BrickCalculationResult,
} from "../types/brickCalculation";

function safePositive(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function calculateBricks(
  input: BrickCalculationInput,
): BrickCalculationResult {
  const wallAreaM2 = safePositive(input.wallAreaM2);
  const brickLengthMm = safePositive(input.brickLengthMm);
  const brickHeightMm = safePositive(input.brickHeightMm);
  const mortarJointMm = safePositive(input.mortarJointMm);
  const wallThicknessFactor = safePositive(input.wallThicknessFactor);
  const wastePercent = safePositive(input.wastePercent);

  if (
    wallAreaM2 === 0 ||
    brickLengthMm === 0 ||
    brickHeightMm === 0 ||
    wallThicknessFactor === 0
  ) {
    return {
      bricksPerSquareMeter: 0,
      bricksWithoutWaste: 0,
      bricksWithWaste: 0,
    };
  }

  const faceWidthM = (brickLengthMm + mortarJointMm) / 1000;
  const faceHeightM = (brickHeightMm + mortarJointMm) / 1000;
  const brickFaceAreaM2 = faceWidthM * faceHeightM;

  if (!Number.isFinite(brickFaceAreaM2) || brickFaceAreaM2 <= 0) {
    return {
      bricksPerSquareMeter: 0,
      bricksWithoutWaste: 0,
      bricksWithWaste: 0,
    };
  }

  const bricksPerSquareMeter = (1 / brickFaceAreaM2) * wallThicknessFactor;
  const bricksWithoutWaste = Math.ceil(wallAreaM2 * bricksPerSquareMeter);
  const bricksWithWaste = Math.ceil(
    bricksWithoutWaste * (1 + wastePercent / 100),
  );

  return {
    bricksPerSquareMeter,
    bricksWithoutWaste,
    bricksWithWaste,
  };
}
