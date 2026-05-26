export interface ConcreteCalculationInput {
  lengthM: number;
  widthM: number;
  thicknessM: number;
  wastePercent: number;
}

export interface ConcreteCalculationResult {
  volumeM3: number;
  volumeWithWasteM3: number;
  bags50kg: number;
}
