import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { calculatePaint } from "../../utils/calculatePaint";
import styles from "./PaintCalculator.module.css";

const PAINT_CALCULATOR_STORAGE_KEY = "paint-calculator:v1";

interface PaintFormValues {
  roomAreaM2: number;
  coats: number;
  coverageM2perL: number;
  wastePercent: number;
}

const DEFAULT_FORM_VALUES: PaintFormValues = {
  roomAreaM2: 50,
  coats: 2,
  coverageM2perL: 10,
  wastePercent: 5,
};

function toFiniteNumber(value: unknown, fallback: number, min = 0): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, parsed);
}

function readStoredValues(): PaintFormValues {
  if (typeof window === "undefined") return DEFAULT_FORM_VALUES;
  try {
    const raw = window.localStorage.getItem(PAINT_CALCULATOR_STORAGE_KEY);
    if (!raw) return DEFAULT_FORM_VALUES;
    const parsed = JSON.parse(raw) as Partial<PaintFormValues>;
    return {
      roomAreaM2: toFiniteNumber(
        parsed.roomAreaM2,
        DEFAULT_FORM_VALUES.roomAreaM2,
      ),
      coats: toFiniteNumber(parsed.coats, DEFAULT_FORM_VALUES.coats, 1),
      coverageM2perL: toFiniteNumber(
        parsed.coverageM2perL,
        DEFAULT_FORM_VALUES.coverageM2perL,
        1,
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

export function PaintCalculator() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [initialValues] = useState(readStoredValues);

  const [roomAreaM2, setRoomAreaM2] = useState(initialValues.roomAreaM2);
  const [coats, setCoats] = useState(initialValues.coats);
  const [coverageM2perL, setCoverageM2perL] = useState(
    initialValues.coverageM2perL,
  );
  const [wastePercent, setWastePercent] = useState(initialValues.wastePercent);

  const result = useMemo(
    () => calculatePaint({ roomAreaM2, coats, coverageM2perL, wastePercent }),
    [roomAreaM2, coats, coverageM2perL, wastePercent],
  );

  const decimalFormat = useMemo(
    () => new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1 }),
    [i18n.language],
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        PAINT_CALCULATOR_STORAGE_KEY,
        JSON.stringify({ roomAreaM2, coats, coverageM2perL, wastePercent }),
      );
    } catch {
      // Ignore storage errors
    }
  }, [roomAreaM2, coats, coverageM2perL, wastePercent]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/")}
            aria-label={t("paintCalculator.back")}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className={styles.title}>{t("paintCalculator.title")}</h1>
        </div>
      </header>

      <main className={styles.main}>
        <p className={styles.subtitle}>{t("paintCalculator.subtitle")}</p>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>{t("paintCalculator.inputs")}</h2>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("paintCalculator.fields.roomArea")}
              </span>
              <input
                className={styles.input}
                type="number"
                min={0}
                step="0.1"
                value={roomAreaM2}
                onChange={(e) => setRoomAreaM2(Number(e.target.value))}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("paintCalculator.fields.coats")}
              </span>
              <input
                className={styles.input}
                type="number"
                min={1}
                step={1}
                value={coats}
                onChange={(e) => setCoats(Number(e.target.value))}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("paintCalculator.fields.coverage")}
              </span>
              <input
                className={styles.input}
                type="number"
                min={1}
                step="0.5"
                value={coverageM2perL}
                onChange={(e) => setCoverageM2perL(Number(e.target.value))}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("paintCalculator.fields.waste")}
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
              {t("paintCalculator.result.title")}
            </h2>

            <p className={styles.resultValue}>
              {decimalFormat.format(result.litersWithWaste)}
            </p>
            <p className={styles.resultHint}>
              {t("paintCalculator.result.withWaste")}
            </p>

            <p className={styles.resultValue}>
              {decimalFormat.format(result.litersWithoutWaste)}
            </p>
            <p className={styles.resultHint}>
              {t("paintCalculator.result.withoutWaste")}
            </p>

            <p className={styles.resultValue}>
              {decimalFormat.format(result.litersPerCoat)}
            </p>
            <p className={styles.resultHint}>
              {t("paintCalculator.result.perCoat")}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
