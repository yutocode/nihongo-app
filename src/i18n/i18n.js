// src/i18n/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// base locales
import translation_ja from "./locales/ja.json";
import translation_en from "./locales/en.json";
import translation_zh from "./locales/zh.json";
import translation_tw from "./locales/tw.json";
import translation_id from "./locales/id.json";

// extra locales (10言語フル対応前提)
import translation_ko from "./locales/ko.json";
import translation_vi from "./locales/vi.json";
import translation_th from "./locales/th.json";
import translation_my from "./locales/my.json";
import translation_km from "./locales/km.json";

// ===== 共通設定 =====
const DEFAULT_LANG = "en";
const SUPPORTED_LANGS = [
  "ja",
  "en",
  "zh",
  "tw",
  "id",
  "ko",
  "vi",
  "th",
  "my",
  "km",
];

// 全言語リソース
const resources = {
  ja: { translation: translation_ja },
  en: { translation: translation_en },
  zh: { translation: translation_zh },
  tw: { translation: translation_tw },
  id: { translation: translation_id },
  ko: { translation: translation_ko },
  vi: { translation: translation_vi },
  th: { translation: translation_th },
  my: { translation: translation_my },
  km: { translation: translation_km },
};

// ===== 初期言語決定（localStorage優先＋バリデーション） =====
let initialLang = DEFAULT_LANG;

try {
  const stored = typeof window !== "undefined"
    ? window.localStorage.getItem("appLang")
    : null;

  if (stored && SUPPORTED_LANGS.includes(stored)) {
    initialLang = stored;
  }
} catch {
  // localStorage 不可の場合は既定値を使用
  initialLang = DEFAULT_LANG;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: [DEFAULT_LANG, "ja"],

    supportedLngs: SUPPORTED_LANGS,

    debug: false,

    detection: {
      order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
      lookupLocalStorage: "appLang",
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    returnObjects: false,
  });

export default i18n;
