// src/pages/LanguageSettings.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import i18n from "../i18n/i18n";
import "../styles/LanguageSettings.css";

const languages = [
  { code: "en", label: "English" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "zh", label: "简体中文" },
  { code: "tw", label: "繁體中文" }
];

const LanguageSettings = () => {
  const navigate = useNavigate();
  const { selectedLanguage, setLanguage } = useAppStore();

  const handleChange = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
    navigate(-1); // 👈 戻る（設定画面に）
  };

  return (
    <div className="language-settings">
      <h2>🌐 言語設定</h2>
      <ul>
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              className={selectedLanguage === lang.code ? "active" : ""}
              onClick={() => handleChange(lang.code)}
            >
              {lang.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSettings;
