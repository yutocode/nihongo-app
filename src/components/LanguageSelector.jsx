// src/components/LanguageSelector.jsx
import React from 'react'
import { useAppStore } from '../store/useAppStore'
import i18n from '../i18n/i18n'
import '../styles/LanguageSelector.css'

const LanguageSelector = () => {
  const setLanguage = useAppStore((state) => state.setLanguage)
  const currentLanguage = useAppStore((state) => state.language)

  const handleChange = (lang) => {
    i18n.changeLanguage(lang)
    setLanguage(lang)
  }

  return (
    <div className="language-selector">
      <button onClick={() => handleChange('id')} className={currentLanguage === 'id' ? 'active' : ''}>🇮🇩 Bahasa</button>
      <button onClick={() => handleChange('zh')} className={currentLanguage === 'zh' ? 'active' : ''}>🇨🇳 简体中文</button>
      <button onClick={() => handleChange('tw')} className={currentLanguage === 'tw' ? 'active' : ''}>🇹🇼 繁體中文</button>
      <button onClick={() => handleChange('en')} className={currentLanguage === 'en' ? 'active' : ''}>🇺🇸 English</button>
    </div>
  )
}

export default LanguageSelector
