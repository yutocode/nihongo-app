// src/pages/AuthPage.jsx
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { auth } from "../firebase/firebase-config";
import { useAppStore } from "../store/useAppStore";

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

/** 簡易メールバリデーション */
function useEmailValidation(email) {
  return useMemo(() => {
    if (!email) return true; // 空は許容（requiredで最終チェック）
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);
}

const AuthPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const setUser = useAppStore((s) => s.setUser);
  const userInStore = useAppStore((s) => s.user);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [mode, setMode] = useState("login"); // "login" | "register"

  const [showPassLogin, setShowPassLogin] = useState(false);
  const [showPassRegister, setShowPassRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorKey, setErrorKey] = useState(""); // i18n キーを保持

  const isLoginEmailValid = useEmailValidation(loginEmail);
  const isRegisterEmailValid = useEmailValidation(registerEmail);

  // すでにログイン済みならホームへ
  useEffect(() => {
    if (auth.currentUser || userInStore) {
      navigate("/home", { replace: true });
    }
  }, [userInStore, navigate]);

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
      const { user } = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword,
      );
      setUser?.(user);
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
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
        registerPassword,
      );
      setUser?.(user);
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Register error:", err);
      setErrorKey(mapErrorKey(err?.code));
    } finally {
      setBusy(false);
    }
  }, [registerEmail, registerPassword, isRegisterEmailValid, navigate, setUser]);

  // Enter キーで送信（ログイン側を優先）
  const onKeyDownLogin = (e) => {
    if (e.key === "Enter") handleLogin();
  };
  const onKeyDownRegister = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  // ゲストとして続行（ログイン不要）
  const continueAsGuest = () => {
    navigate("/home", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        {/* メインカード */}
        <div className="auth-card">
          {/* タブ（ログイン / 新規登録） */}
          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              className={`auth-tab ${mode === "login" ? "is-active" : ""}`}
              onClick={() => setMode("login")}
              role="tab"
              aria-selected={mode === "login"}
            >
              {t("auth.login", "Log in")}
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === "register" ? "is-active" : ""}`}
              onClick={() => setMode("register")}
              role="tab"
              aria-selected={mode === "register"}
            >
              {t("auth.register", "Create account")}
            </button>
          </div>

          {/* Appleボタンは一旦なし */}

          <div className="auth-divider">
            <span>{t("auth.or_email", "or use email")}</span>
          </div>

          {/* ログインフォーム */}
          {mode === "login" && (
            <div className="auth-form" aria-label="login form">
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
                  aria-label={
                    showPassLogin
                      ? t("auth.hide_password", "Hide password")
                      : t("auth.show_password", "Show password")
                  }
                  title={
                    showPassLogin
                      ? t("auth.hide_password", "Hide password")
                      : t("auth.show_password", "Show password")
                  }
                >
                  {showPassLogin ? "🙈" : "👁️"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleLogin}
                disabled={busy || !loginEmail || !loginPassword}
              >
                {busy
                  ? t("common.loading", "Loading…")
                  : t("auth.login_button", "Log in")}
              </button>
            </div>
          )}

          {/* 新規登録フォーム */}
          {mode === "register" && (
            <div className="auth-form" aria-label="register form">
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
                  placeholder={t(
                    "auth.password_with_hint",
                    "Password (6+ chars)",
                  )}
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
                  aria-label={
                    showPassRegister
                      ? t("auth.hide_password", "Hide password")
                      : t("auth.show_password", "Show password")
                  }
                  title={
                    showPassRegister
                      ? t("auth.hide_password", "Hide password")
                      : t("auth.show_password", "Show password")
                  }
                >
                  {showPassRegister ? "🙈" : "👁️"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleRegister}
                disabled={
                  busy ||
                  !registerEmail ||
                  !registerPassword ||
                  registerPassword.length < 6
                }
              >
                {busy
                  ? t("common.loading", "Loading…")
                  : t("auth.register_button", "Create account")}
              </button>
            </div>
          )}

          {/* エラー表示 */}
          {errorKey && (
            <div className="auth-error" role="alert" aria-live="assertive">
              {t(
                errorKey,
                t(
                  "auth.errors.generic",
                  "Something went wrong. Please try again.",
                ),
              )}
            </div>
          )}
        </div>

        {/* ゲストで続行 */}
        <div className="auth-guest">
          <button
            type="button"
            className="guest-btn"
            onClick={continueAsGuest}
            disabled={busy}
          >
            {t("auth.continue_guest", "Continue as guest")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;