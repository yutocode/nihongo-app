// src/i18n/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translation_en from "./locales/en.json";
import translation_id from "./locales/id.json";
import translation_zh from "./locales/zh.json";
import translation_tw from "./locales/tw.json";
import translation_ja from "./locales/ja.json"; // ← 日本語追加

// 全言語リソース
const resources = {
  en: { translation: translation_en },
  id: { translation: translation_id },
  zh: { translation: translation_zh },
  tw: { translation: translation_tw },
  ja: { translation: translation_ja },
};

// ✅ localStorageから選択言語を取得（なければ英語）
let savedLang = "en";
try {
  savedLang = localStorage.getItem("appLang") || "en";
} catch (e) {
  console.warn("localStorage not available, fallback to 'en'");
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,          // ✅ 初期言語を強制設定
    fallbackLng: "en",       // ✅ 見つからない時は英語
    debug: false,

    detection: {
      order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"], // ✅ localStorageにキャッシュ
      lookupLocalStorage: "appLang", // ✅ カスタムキーを指定
    },

    interpolation: {
      escapeValue: false, // ✅ ReactはXSS対策済みなのでfalse
    },

    react: {
      useSuspense: false, // ✅ ローディング待ちを無効化
    },

    returnObjects: false, // ✅ `t("lesson")`でオブジェクト返さない
  });

export default i18n;
