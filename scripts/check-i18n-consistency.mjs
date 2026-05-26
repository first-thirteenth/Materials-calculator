import fs from "node:fs";
import path from "node:path";

const localesDir = path.resolve("src/app/i18n/locales");
const baseLocale = "en";
const files = ["translation.json"];

function flattenKeys(obj, prefix = "") {
  const keys = [];

  for (const [key, value] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, next));
      continue;
    }

    keys.push(next);
  }

  return keys;
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function diffKeys(baseSet, targetSet) {
  const missing = [...baseSet].filter((k) => !targetSet.has(k));
  const extra = [...targetSet].filter((k) => !baseSet.has(k));
  return { missing, extra };
}

let hasErrors = false;

for (const file of files) {
  const basePath = path.join(localesDir, baseLocale, file);
  const baseJson = readJson(basePath);
  const baseKeys = new Set(flattenKeys(baseJson));

  const localeNames = fs
    .readdirSync(localesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => name !== baseLocale);

  for (const locale of localeNames) {
    const localePath = path.join(localesDir, locale, file);

    if (!fs.existsSync(localePath)) {
      console.error(`[i18n] Missing file for locale '${locale}': ${file}`);
      hasErrors = true;
      continue;
    }

    const localeJson = readJson(localePath);
    const localeKeys = new Set(flattenKeys(localeJson));
    const { missing, extra } = diffKeys(baseKeys, localeKeys);

    if (missing.length || extra.length) {
      hasErrors = true;
      console.error(`\n[i18n] Key mismatch in locale '${locale}' (${file})`);

      if (missing.length) {
        console.error("  Missing keys:");
        for (const key of missing) {
          console.error(`    - ${key}`);
        }
      }

      if (extra.length) {
        console.error("  Extra keys:");
        for (const key of extra) {
          console.error(`    - ${key}`);
        }
      }
    }
  }
}

if (hasErrors) {
  process.exitCode = 1;
} else {
  console.log("[i18n] Locale keys are consistent.");
}
