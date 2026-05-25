import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ru from "./locales/ru/translation.json";
import en from "./locales/en/translation.json";
import pl from "./locales/pl/translation.json";
import uk from "./locales/uk/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      pl: { translation: pl },
      uk: { translation: uk },
    },
    fallbackLng: "ru",
    supportedLngs: ["ru", "en", "pl", "uk"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "language",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
