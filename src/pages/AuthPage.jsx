// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase/firebase-config';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from 'react-i18next';
import '../styles/AuthPage.css';

const AuthPage = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const navigate = useNavigate();

  const setUser = useAppStore((state) => state.setUser);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const selectedLanguage = useAppStore((state) => state.selectedLanguage);

  const { t, i18n } = useTranslation();

  // 言語選択時に反映
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);        // Zustand
    i18n.changeLanguage(lang); // i18next
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      setUser(userCredential.user);
      navigate('/home');
    } catch (error) {
      alert(t("auth.login_failed") + ": " + error.message);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      setUser(userCredential.user);
      alert(t("auth.register_success"));
      navigate('/home');
    } catch (error) {
      alert(t("auth.register_failed") + ": " + error.message);
    }
  };

  return (
    <div className="auth-page">
      {/* 🌍 言語選択ドロップダウン */}
      <div className="language-selector">
        <label>{t("language.select")}:</label>
        <select value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="id">Bahasa Indonesia</option>
          <option value="zh">简体中文</option>
          <option value="tw">繁體中文</option>
        </select>
      </div>

      <div className="auth-container">
        {/* 🔐 ログインフォーム */}
        <div className="auth-box login-box">
          <h2>{t("auth.login")}</h2>
          <input
            type="email"
            placeholder={t("auth.email")}
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("auth.password")}
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <button onClick={handleLogin}>{t("auth.login_button")}</button>
        </div>

        {/* 📝 登録フォーム */}
        <div className="auth-box register-box">
          <h2>{t("auth.register")}</h2>
          <input
            type="email"
            placeholder={t("auth.email")}
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("auth.password")}
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
          />
          <button onClick={handleRegister}>{t("auth.register_button")}</button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
