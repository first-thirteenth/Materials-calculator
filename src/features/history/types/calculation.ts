import type { Timestamp } from "firebase/firestore";
import type {
  BrickCalculationInput,
  BrickCalculationResult,
} from "../../brick/types/brickCalculation";
import type {
  PaintCalculationInput,
  PaintCalculationResult,
} from "../../paint/types/paintCalculation";
import type {
  ConcreteCalculationInput,
  ConcreteCalculationResult,
} from "../../concrete/types/concreteCalculation";

export type CalculationType = "brick" | "paint" | "concrete";

export interface BrickCalculationRecord {
  type: "brick";
  input: BrickCalculationInput;
  result: BrickCalculationResult;
}

export interface PaintCalculationRecord {
  type: "paint";
  input: PaintCalculationInput;
  result: PaintCalculationResult;
}

export interface ConcreteCalculationRecord {
  type: "concrete";
  input: ConcreteCalculationInput;
  result: ConcreteCalculationResult;
}

export type CalculationData =
  | BrickCalculationRecord
  | PaintCalculationRecord
  | ConcreteCalculationRecord;

export interface CalculationRecord extends CalculationData {
  id: string;
  createdAt: Timestamp;
}
