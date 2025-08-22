// src/components/LanguageSelector.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAppStore } from "../store/useAppStore";
import i18n from "../i18n/i18n";
import "../styles/LanguageSelector.css";

const STORAGE_KEY = "appLang";

const LANGS = [
  { code: "id", label: "🇮🇩 Bahasa" },
  { code: "zh", label: "🇨🇳 简体中文" },
  { code: "tw", label: "🇹🇼 繁體中文" },
  { code: "en", label: "🇺🇸 English" },
  { code: "ja", label: "🇯🇵 日本語" },
];

const LanguageSelector = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  /** 初期化：localStorage → i18nの順で復元 */
  useEffect(() => {
    const stored =
      (typeof window !== "undefined" &&
        window.localStorage?.getItem(STORAGE_KEY)) ||
      "";
    const initial = stored || i18n.resolvedLanguage || i18n.language || "en";

    if (initial !== currentLanguage) {
      setLanguage(initial);
    }
    if (i18n.language !== initial) {
      i18n.changeLanguage(initial);
    }
  }, [currentLanguage, setLanguage]);

  /** 外側クリックでメニューを閉じる */
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleChange = useCallback(
    (lang) => {
      try {
        window.localStorage?.setItem(STORAGE_KEY, lang);
      } catch {}
      if (i18n.language !== lang) i18n.changeLanguage(lang);
      if (currentLanguage !== lang) setLanguage(lang);
      setMenuOpen(false);
    },
    [currentLanguage, setLanguage]
  );

  const currentLabel =
    LANGS.find((l) => l.code === currentLanguage)?.label ??
    currentLanguage.toUpperCase();

  return (
    <div className="lang-selector-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="lang-toggle"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="lang-dropdown"
        onClick={() => setMenuOpen((v) => !v)}
      >
        🌐 {currentLabel}
      </button>

      {menuOpen && (
        <div id="lang-dropdown" role="menu" className="lang-dropdown">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              role="menuitemradio"
              aria-checked={currentLanguage === l.code}
              onClick={() => handleChange(l.code)}
              className={currentLanguage === l.code ? "active" : ""}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
