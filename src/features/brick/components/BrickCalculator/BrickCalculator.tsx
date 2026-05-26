import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { calculateBricks } from "../../utils/calculateBricks";
import styles from "./BrickCalculator.module.css";

const THICKNESS_OPTIONS = [
  { value: 0.5, labelKey: "brickCalculator.thickness.half" },
  { value: 1, labelKey: "brickCalculator.thickness.one" },
  { value: 1.5, labelKey: "brickCalculator.thickness.oneAndHalf" },
  { value: 2, labelKey: "brickCalculator.thickness.two" },
];

const BRICK_CALCULATOR_STORAGE_KEY = "brick-calculator:v1";

interface BrickFormValues {
  wallAreaM2: number;
  brickLengthMm: number;
  brickHeightMm: number;
  mortarJointMm: number;
  wallThicknessFactor: number;
  wastePercent: number;
}

const DEFAULT_FORM_VALUES: BrickFormValues = {
  wallAreaM2: 100,
  brickLengthMm: 250,
  brickHeightMm: 65,
  mortarJointMm: 10,
  wallThicknessFactor: 1,
  wastePercent: 5,
};

function toFiniteNumber(value: unknown, fallback: number, min = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(min, parsed);
}

function readStoredValues(): BrickFormValues {
  if (typeof window === "undefined") {
    return DEFAULT_FORM_VALUES;
  }

  try {
    const raw = window.localStorage.getItem(BRICK_CALCULATOR_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_FORM_VALUES;
    }

    const parsed = JSON.parse(raw) as Partial<BrickFormValues>;

    return {
      wallAreaM2: toFiniteNumber(
        parsed.wallAreaM2,
        DEFAULT_FORM_VALUES.wallAreaM2,
      ),
      brickLengthMm: toFiniteNumber(
        parsed.brickLengthMm,
        DEFAULT_FORM_VALUES.brickLengthMm,
        1,
      ),
      brickHeightMm: toFiniteNumber(
        parsed.brickHeightMm,
        DEFAULT_FORM_VALUES.brickHeightMm,
        1,
      ),
      mortarJointMm: toFiniteNumber(
        parsed.mortarJointMm,
        DEFAULT_FORM_VALUES.mortarJointMm,
      ),
      wallThicknessFactor: toFiniteNumber(
        parsed.wallThicknessFactor,
        DEFAULT_FORM_VALUES.wallThicknessFactor,
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

export function BrickCalculator() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [initialValues] = useState(readStoredValues);

  const [wallAreaM2, setWallAreaM2] = useState(initialValues.wallAreaM2);
  const [brickLengthMm, setBrickLengthMm] = useState(
    initialValues.brickLengthMm,
  );
  const [brickHeightMm, setBrickHeightMm] = useState(
    initialValues.brickHeightMm,
  );
  const [mortarJointMm, setMortarJointMm] = useState(
    initialValues.mortarJointMm,
  );
  const [wallThicknessFactor, setWallThicknessFactor] = useState(
    initialValues.wallThicknessFactor,
  );
  const [wastePercent, setWastePercent] = useState(initialValues.wastePercent);

  const result = useMemo(
    () =>
      calculateBricks({
        wallAreaM2,
        brickLengthMm,
        brickHeightMm,
        mortarJointMm,
        wallThicknessFactor,
        wastePercent,
      }),
    [
      wallAreaM2,
      brickLengthMm,
      brickHeightMm,
      mortarJointMm,
      wallThicknessFactor,
      wastePercent,
    ],
  );

  const integerFormat = useMemo(
    () => new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }),
    [i18n.language],
  );
  const decimalFormat = useMemo(
    () => new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1 }),
    [i18n.language],
  );

  useEffect(() => {
    try {
      const payload: BrickFormValues = {
        wallAreaM2,
        brickLengthMm,
        brickHeightMm,
        mortarJointMm,
        wallThicknessFactor,
        wastePercent,
      };

      window.localStorage.setItem(
        BRICK_CALCULATOR_STORAGE_KEY,
        JSON.stringify(payload),
      );
    } catch {
      // Ignore storage errors (private mode, quota limits, etc.)
    }
  }, [
    wallAreaM2,
    brickLengthMm,
    brickHeightMm,
    mortarJointMm,
    wallThicknessFactor,
    wastePercent,
  ]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/")}
            aria-label={t("brickCalculator.back")}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className={styles.title}>{t("brickCalculator.title")}</h1>
        </div>
      </header>

      <main className={styles.main}>
        <p className={styles.subtitle}>{t("brickCalculator.subtitle")}</p>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>{t("brickCalculator.inputs")}</h2>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("brickCalculator.fields.wallArea")}
              </span>
              <input
                className={styles.input}
                type="number"
                min={0}
                step="0.1"
                value={wallAreaM2}
                onChange={(event) => setWallAreaM2(Number(event.target.value))}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("brickCalculator.fields.brickLength")}
              </span>
              <input
                className={styles.input}
                type="number"
                min={1}
                value={brickLengthMm}
                onChange={(event) =>
                  setBrickLengthMm(Number(event.target.value))
                }
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("brickCalculator.fields.brickHeight")}
              </span>
              <input
                className={styles.input}
                type="number"
                min={1}
                value={brickHeightMm}
                onChange={(event) =>
                  setBrickHeightMm(Number(event.target.value))
                }
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("brickCalculator.fields.mortar")}
              </span>
              <input
                className={styles.input}
                type="number"
                min={0}
                value={mortarJointMm}
                onChange={(event) =>
                  setMortarJointMm(Number(event.target.value))
                }
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("brickCalculator.fields.thickness")}
              </span>
              <select
                className={styles.select}
                value={wallThicknessFactor}
                onChange={(event) =>
                  setWallThicknessFactor(Number(event.target.value))
                }
              >
                {THICKNESS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("brickCalculator.fields.waste")}
              </span>
              <input
                className={styles.input}
                type="number"
                min={0}
                step="0.5"
                value={wastePercent}
                onChange={(event) =>
                  setWastePercent(Number(event.target.value))
                }
              />
            </label>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>
              {t("brickCalculator.result.title")}
            </h2>
            <p className={styles.resultValue}>
              {integerFormat.format(result.bricksWithWaste)}
            </p>
            <p className={styles.resultHint}>
              {t("brickCalculator.result.withWaste")}
            </p>

            <p className={styles.resultValue}>
              {integerFormat.format(result.bricksWithoutWaste)}
            </p>
            <p className={styles.resultHint}>
              {t("brickCalculator.result.withoutWaste")}
            </p>

            <p className={styles.resultValue}>
              {decimalFormat.format(result.bricksPerSquareMeter)}
            </p>
            <p className={styles.resultHint}>
              {t("brickCalculator.result.perSquareMeter")}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
