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

// ✅ ローカルストレージから言語取得（なければ英語）
const savedLang = localStorage.getItem("appLang") || "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang, // ✅ ここで明示的に設定！
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
