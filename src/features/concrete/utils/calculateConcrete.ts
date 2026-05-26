import type {
  ConcreteCalculationInput,
  ConcreteCalculationResult,
} from "../types/concreteCalculation";

function safePositive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/** One 50 kg bag of cement mix yields approximately 0.025 m³ of concrete */
const M3_PER_BAG = 0.025;

export function calculateConcrete(
  input: ConcreteCalculationInput,
): ConcreteCalculationResult {
  const lengthM = safePositive(input.lengthM);
  const widthM = safePositive(input.widthM);
  const thicknessM = safePositive(input.thicknessM);
  const wastePercent = safePositive(input.wastePercent);

  if (lengthM === 0 || widthM === 0 || thicknessM === 0) {
    return { volumeM3: 0, volumeWithWasteM3: 0, bags50kg: 0 };
  }

  const volumeM3 = lengthM * widthM * thicknessM;
  const volumeWithWasteM3 = volumeM3 * (1 + wastePercent / 100);
  const bags50kg = Math.ceil(volumeWithWasteM3 / M3_PER_BAG);

  return { volumeM3, volumeWithWasteM3, bags50kg };
}
