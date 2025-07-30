// src/i18n/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translation_en from "./locales/en.json";
import translation_id from "./locales/id.json";
import translation_zh from "./locales/zh.json";
import translation_tw from "./locales/tw.json";

const resources = {
  en: { translation: translation_en },
  id: { translation: translation_id },
  zh: { translation: translation_zh },
  tw: { translation: translation_tw },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
