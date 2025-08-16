// src/components/LanguageSelector.jsx
import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import i18n from '../i18n/i18n';
import '../styles/LanguageSelector.css';

const LanguageSelector = () => {
  const [menuOpen, setMenuOpen] = useState(false); // ✅ メニューの表示状態
  const currentLanguage = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const handleChange = (lang) => {
    localStorage.setItem("appLang", lang);       // ✅ 保存
    i18n.changeLanguage(lang);                   // ✅ 言語切替
    setLanguage(lang);                           // ✅ Zustand更新
    setMenuOpen(false);                          // ✅ メニュー閉じる
  };

  const languages = [
    { code: 'id', label: '🇮🇩 Bahasa' },
    { code: 'zh', label: '🇨🇳 简体中文' },
    { code: 'tw', label: '🇹🇼 繁體中文' },
    { code: 'en', label: '🇺🇸 English' },
    { code: 'ja', label: '🇯🇵 日本語' }
  ];

  return (
    <div className="lang-selector-wrapper">
      <button className="lang-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        🌐 {currentLanguage.toUpperCase()}
      </button>

      {menuOpen && (
        <div className="lang-dropdown">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => handleChange(l.code)}
              className={currentLanguage === l.code ? 'active' : ''}
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
