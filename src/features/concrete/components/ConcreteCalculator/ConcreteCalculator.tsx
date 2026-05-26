import { useEffect, useMemo, useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { calculateConcrete } from "../../utils/calculateConcrete";
import { saveCalculation } from "../../../history/services/historyService";
import { useAuth } from "../../../../app/hooks/useAuth";
import styles from "./ConcreteCalculator.module.css";

const CONCRETE_CALCULATOR_STORAGE_KEY = "concrete-calculator:v1";

interface ConcreteFormValues {
  lengthM: number;
  widthM: number;
  thicknessM: number;
  wastePercent: number;
}

const DEFAULT_FORM_VALUES: ConcreteFormValues = {
  lengthM: 10,
  widthM: 6,
  thicknessM: 0.1,
  wastePercent: 5,
};

function toFiniteNumber(value: unknown, fallback: number, min = 0): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, parsed);
}

function readStoredValues(): ConcreteFormValues {
  if (typeof window === "undefined") return DEFAULT_FORM_VALUES;
  try {
    const raw = window.localStorage.getItem(CONCRETE_CALCULATOR_STORAGE_KEY);
    if (!raw) return DEFAULT_FORM_VALUES;
    const parsed = JSON.parse(raw) as Partial<ConcreteFormValues>;
    return {
      lengthM: toFiniteNumber(
        parsed.lengthM,
        DEFAULT_FORM_VALUES.lengthM,
        0.01,
      ),
      widthM: toFiniteNumber(parsed.widthM, DEFAULT_FORM_VALUES.widthM, 0.01),
      thicknessM: toFiniteNumber(
        parsed.thicknessM,
        DEFAULT_FORM_VALUES.thicknessM,
        0.01,
      ),
      wastePercent: toFiniteNumber(
        parsed.wastePercent,
        DEFAULT_FORM_VALUES.wastePercent,
      ),
    };
  } catch {
    return DEFAULT_FORM_VALUES;
  }
}

export function ConcreteCalculator() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [initialValues] = useState(readStoredValues);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">(
    "idle",
  );

  const [lengthM, setLengthM] = useState(initialValues.lengthM);
  const [widthM, setWidthM] = useState(initialValues.widthM);
  const [thicknessM, setThicknessM] = useState(initialValues.thicknessM);
  const [wastePercent, setWastePercent] = useState(initialValues.wastePercent);

  const result = useMemo(
    () => calculateConcrete({ lengthM, widthM, thicknessM, wastePercent }),
    [lengthM, widthM, thicknessM, wastePercent],
  );

  const decimalFormat = useMemo(
    () => new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }),
    [i18n.language],
  );
  const integerFormat = useMemo(
    () => new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }),
    [i18n.language],
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        CONCRETE_CALCULATOR_STORAGE_KEY,
        JSON.stringify({ lengthM, widthM, thicknessM, wastePercent }),
      );
    } catch {
      // Ignore storage errors
    }
  }, [lengthM, widthM, thicknessM, wastePercent]);

  const handleSave = useCallback(async () => {
    if (!user) return;
    try {
      await saveCalculation(user.uid, {
        type: "concrete",
        input: { lengthM, widthM, thicknessM, wastePercent },
        result,
      });
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    } finally {
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  }, [user, lengthM, widthM, thicknessM, wastePercent, result]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/")}
            aria-label={t("concreteCalculator.back")}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className={styles.title}>{t("concreteCalculator.title")}</h1>
        </div>
      </header>

      <main className={styles.main}>
        <p className={styles.subtitle}>{t("concreteCalculator.subtitle")}</p>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>
              {t("concreteCalculator.inputs")}
            </h2>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("concreteCalculator.fields.length")}
              </span>
              <input
                className={styles.input}
                type="number"
                min={0.01}
                step="0.1"
                value={lengthM}
                onChange={(e) => setLengthM(Number(e.target.value))}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("concreteCalculator.fields.width")}
              </span>
              <input
                className={styles.input}
                type="number"
                min={0.01}
                step="0.1"
                value={widthM}
                onChange={(e) => setWidthM(Number(e.target.value))}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("concreteCalculator.fields.thickness")}
              </span>
              <input
                className={styles.input}
                type="number"
                min={0.01}
                step="0.01"
                value={thicknessM}
                onChange={(e) => setThicknessM(Number(e.target.value))}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("concreteCalculator.fields.waste")}
              </span>
              <input
                className={styles.input}
                type="number"
                min={0}
                step="0.5"
                value={wastePercent}
                onChange={(e) => setWastePercent(Number(e.target.value))}
              />
            </label>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>
              {t("concreteCalculator.result.title")}
            </h2>

            <p className={styles.resultValue}>
              {decimalFormat.format(result.volumeWithWasteM3)}
            </p>
            <p className={styles.resultHint}>
              {t("concreteCalculator.result.volumeWithWaste")}
            </p>

            <p className={styles.resultValue}>
              {decimalFormat.format(result.volumeM3)}
            </p>
            <p className={styles.resultHint}>
              {t("concreteCalculator.result.volumeWithoutWaste")}
            </p>

            <p className={styles.resultValue}>
              {integerFormat.format(result.bags50kg)}
            </p>
            <p className={styles.resultHint}>
              {t("concreteCalculator.result.bags50kg")}
            </p>

            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSave}
              disabled={saveStatus !== "idle"}
            >
              {saveStatus === "saved"
                ? t("history.saved")
                : saveStatus === "error"
                  ? t("history.saveError")
                  : t("history.save")}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
