import type {
  PaintCalculationInput,
  PaintCalculationResult,
} from "../types/paintCalculation";

function safePositive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function calculatePaint(
  input: PaintCalculationInput,
): PaintCalculationResult {
  const roomAreaM2 = safePositive(input.roomAreaM2);
  const coats = safePositive(input.coats);
  const coverageM2perL = safePositive(input.coverageM2perL);
  const wastePercent = safePositive(input.wastePercent);

  if (roomAreaM2 === 0 || coats === 0 || coverageM2perL === 0) {
    return { litersPerCoat: 0, litersWithoutWaste: 0, litersWithWaste: 0 };
  }

  const litersPerCoat = roomAreaM2 / coverageM2perL;
  const litersWithoutWaste = litersPerCoat * coats;
  const litersWithWaste = litersWithoutWaste * (1 + wastePercent / 100);

  return { litersPerCoat, litersWithoutWaste, litersWithWaste };
}
