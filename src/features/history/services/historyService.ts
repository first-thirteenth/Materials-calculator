import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../app/firebase/firebase";
import type { CalculationData, CalculationRecord } from "../types/calculation";

function getHistoryCollection(uid: string) {
  if (!db) throw new Error("Firestore is not configured");
  return collection(db, "users", uid, "calculations");
}

export async function saveCalculation(
  uid: string,
  data: CalculationData,
): Promise<string> {
  const col = getHistoryCollection(uid);
  const ref = await addDoc(col, { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function listCalculations(
  uid: string,
): Promise<CalculationRecord[]> {
  const col = getHistoryCollection(uid);
  const q = query(col, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CalculationRecord);
}

export async function deleteCalculation(
  uid: string,
  id: string,
): Promise<void> {
  if (!db) throw new Error("Firestore is not configured");
  await deleteDoc(doc(db, "users", uid, "calculations", id));
}
