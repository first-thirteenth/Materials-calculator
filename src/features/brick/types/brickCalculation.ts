export interface BrickCalculationInput {
  wallAreaM2: number;
  brickLengthMm: number;
  brickHeightMm: number;
  mortarJointMm: number;
  wallThicknessFactor: number;
  wastePercent: number;
}

export interface BrickCalculationResult {
  bricksPerSquareMeter: number;
  bricksWithoutWaste: number;
  bricksWithWaste: number;
}
