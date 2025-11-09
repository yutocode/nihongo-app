// src/pages/AuthPage.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "react-i18next";
import "../styles/AuthPage.css";

/** Firebase エラーコード → i18n キー（なければ汎用にフォールバック） */
const FB_ERROR_I18N = {
  "auth/invalid-email": "auth.errors.invalid_email",
  "auth/user-not-found": "auth.errors.user_not_found",
  "auth/wrong-password": "auth.errors.wrong_password",
  "auth/too-many-requests": "auth.errors.too_many_requests",
  "auth/email-already-in-use": "auth.errors.email_in_use",
  "auth/weak-password": "auth.errors.weak_password",
  "auth/network-request-failed": "auth.errors.network",
};

function useEmailValidation(email) {
  return useMemo(() => {
    if (!email) return true; // 空は許容（requiredで最終防御）
    // 簡易バリデーション（HTML5のtype="email"と二重防御）
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);
}

const AuthPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const setUser = useAppStore((s) => s.setUser);
  const selectedLanguage = useAppStore((s) => s.selectedLanguage);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const userInStore = useAppStore((s) => s.user);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showPassLogin, setShowPassLogin] = useState(false);
  const [showPassRegister, setShowPassRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorKey, setErrorKey] = useState(""); // i18nキーを保持

  const isLoginEmailValid = useEmailValidation(loginEmail);
  const isRegisterEmailValid = useEmailValidation(registerEmail);

  // すでにログイン済みならホームへ
  useEffect(() => {
    if (auth.currentUser || userInStore) {
      navigate("/home", { replace: true });
    }
  }, [userInStore, navigate]);

  // 言語ドロップダウン
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage?.(lang);
    i18n.changeLanguage(lang);
  };

  const mapErrorKey = (code) => FB_ERROR_I18N[code] || "auth.errors.generic";

  const handleLogin = useCallback(async () => {
    setErrorKey("");
    if (!loginEmail || !loginPassword) {
      setErrorKey("auth.errors.required");
      return;
    }
    if (!isLoginEmailValid) {
      setErrorKey("auth.errors.invalid_email");
      return;
    }
    setBusy(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setUser?.(user);
      navigate("/home", { replace: true });
    } catch (err) {
      setErrorKey(mapErrorKey(err?.code));
    } finally {
      setBusy(false);
    }
  }, [loginEmail, loginPassword, isLoginEmailValid, navigate, setUser]);

  const handleRegister = useCallback(async () => {
    setErrorKey("");
    if (!registerEmail || !registerPassword) {
      setErrorKey("auth.errors.required");
      return;
    }
    if (!isRegisterEmailValid) {
      setErrorKey("auth.errors.invalid_email");
      return;
    }
    if (registerPassword.length < 6) {
      setErrorKey("auth.errors.weak_password");
      return;
    }
    setBusy(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      setUser?.(user);
      // t("auth.register_success") があればトースト/アラートを出す場合はここで
      navigate("/home", { replace: true });
    } catch (err) {
      setErrorKey(mapErrorKey(err?.code));
    } finally {
      setBusy(false);
    }
  }, [registerEmail, registerPassword, isRegisterEmailValid, navigate, setUser]);

  // Enterで送信（ログイン側を優先）
  const onKeyDownLogin = (e) => {
    if (e.key === "Enter") handleLogin();
  };
  const onKeyDownRegister = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  // ゲストとして続行（ログイン不要）
  const continueAsGuest = () => {
    // 必要なら localStorage フラグ等をセットしてもOK
    // localStorage.setItem("guest", "1");
    navigate("/home", { replace: true });
  };

  return (
    <div className="auth-page">
      {/* 言語選択 */}
      <div className="language-selector" role="group" aria-label={t("language.select")}>
        <label htmlFor="auth-lang">{t("language.select")}:</label>
        <select id="auth-lang" value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="id">Bahasa Indonesia</option>
          <option value="zh">简体中文</option>
          <option value="tw">繁體中文</option>
        </select>
      </div>

      <div className="auth-container">
        {/* ログイン */}
        <div className="auth-box login-box">
          <h2>{t("auth.login", "Log in")}</h2>

          <input
            type="email"
            placeholder={t("auth.email", "Email")}
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            onKeyDown={onKeyDownLogin}
            required
            aria-invalid={!isLoginEmailValid}
          />

          <div className="password-field">
            <input
              type={showPassLogin ? "text" : "password"}
              placeholder={t("auth.password", "Password")}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onKeyDown={onKeyDownLogin}
              required
              aria-label={t("auth.password", "Password")}
            />
            <button
              type="button"
              className="toggle-pass"
              onClick={() => setShowPassLogin((v) => !v)}
              aria-label={showPassLogin ? t("auth.hide_password", "Hide password") : t("auth.show_password", "Show password")}
              title={showPassLogin ? t("auth.hide_password", "Hide password") : t("auth.show_password", "Show password")}
            >
              {showPassLogin ? "🙈" : "👁️"}
            </button>
          </div>

          <button onClick={handleLogin} disabled={busy || !loginEmail || !loginPassword}>
            {busy ? t("common.loading", "Loading…") : t("auth.login_button", "Log in")}
          </button>
        </div>

        {/* 新規登録 */}
        <div className="auth-box register-box">
          <h2>{t("auth.register", "Create account")}</h2>

          <input
            type="email"
            placeholder={t("auth.email", "Email")}
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            onKeyDown={onKeyDownRegister}
            required
            aria-invalid={!isRegisterEmailValid}
          />

          <div className="password-field">
            <input
              type={showPassRegister ? "text" : "password"}
              placeholder={t("auth.password", "Password (6+ chars)")}
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              onKeyDown={onKeyDownRegister}
              required
              aria-label={t("auth.password", "Password")}
              minLength={6}
            />
            <button
              type="button"
              className="toggle-pass"
              onClick={() => setShowPassRegister((v) => !v)}
              aria-label={showPassRegister ? t("auth.hide_password", "Hide password") : t("auth.show_password", "Show password")}
              title={showPassRegister ? t("auth.hide_password", "Hide password") : t("auth.show_password", "Show password")}
            >
              {showPassRegister ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            onClick={handleRegister}
            disabled={busy || !registerEmail || !registerPassword || registerPassword.length < 6}
          >
            {busy ? t("common.loading", "Loading…") : t("auth.register_button", "Create account")}
          </button>
        </div>
      </div>

      {/* ゲストで続行 */}
      <div className="auth-guest">
        <button className="guest-btn" onClick={continueAsGuest} disabled={busy}>
          {t("auth.continue_guest", "Continue as guest")}
        </button>
      </div>

      {/* エラー表示（i18nに無ければ控えめ英語） */}
      {errorKey && (
        <div className="auth-error" role="alert" aria-live="assertive">
          {t(errorKey, t("auth.errors.generic", "Something went wrong. Please try again."))}
        </div>
      )}
    </div>
  );
};

export default AuthPage;
