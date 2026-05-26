export interface PaintCalculationInput {
  roomAreaM2: number;
  coats: number;
  coverageM2perL: number;
  wastePercent: number;
}

export interface PaintCalculationResult {
  litersPerCoat: number;
  litersWithoutWaste: number;
  litersWithWaste: number;
}
