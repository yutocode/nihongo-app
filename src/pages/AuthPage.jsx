// src/pages/AuthPage.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { auth } from "../firebase/firebase-config";
import { useAppStore } from "../store/useAppStore";

import "../styles/AuthPage.css";

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
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);
}

/**
 * REST API のエラーメッセージ → i18n キーに変換
 */
function mapRestErrorToKey(message) {
  switch (message) {
    case "INVALID_EMAIL":
      return "auth.errors.invalid_email";
    case "EMAIL_NOT_FOUND":
      return "auth.errors.user_not_found";
    case "INVALID_PASSWORD":
      return "auth.errors.wrong_password";
    case "USER_DISABLED":
      return "auth.errors.user_disabled";
    case "EMAIL_EXISTS":
      return "auth.errors.email_in_use";
    case "OPERATION_NOT_ALLOWED":
      return "auth.errors.operation_not_allowed";
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
      return "auth.errors.too_many_requests";
    case "WEAK_PASSWORD":
    case "PASSWORD_LOGIN_DISABLED":
      return "auth.errors.weak_password";
    default:
      return "auth.errors.generic";
  }
}

/**
 * Firebase Identity Toolkit: signInWithPassword (REST)
 */
async function restSignInWithPassword(email, password) {
  const apiKey = auth.app?.options?.apiKey;
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = data?.error?.message || "REST_LOGIN_FAIL";
    const err = new Error(msg);
    err.code = `REST/${msg}`;
    throw err;
  }

  return data;
}

/**
 * Firebase Identity Toolkit: signUp (REST)
 */
async function restSignUp(email, password) {
  const apiKey = auth.app?.options?.apiKey;
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = data?.error?.message || "REST_SIGNUP_FAIL";
    const err = new Error(msg);
    err.code = `REST/${msg}`;
    throw err;
  }

  return data;
}

const AuthPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const setUser = useAppStore((s) => s.setUser);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [mode, setMode] = useState("login");

  const [showPassLogin, setShowPassLogin] = useState(false);
  const [showPassRegister, setShowPassRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorKey, setErrorKey] = useState("");

  const isLoginEmailValid = useEmailValidation(loginEmail);
  const isRegisterEmailValid = useEmailValidation(registerEmail);

  const mapErrorKey = (code) => FB_ERROR_I18N[code] || "auth.errors.generic";

  // ====== WKWebView から Google API に届くかテスト（デバッグ用） ======
  useEffect(() => {
    console.log("[FETCH TEST] start");

    const apiKey = auth.app?.options?.apiKey;
    if (!apiKey) {
      console.log("[FETCH TEST] no apiKey");
      return;
    }

    fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "dummy@example.com",
          password: "wrong-pass",
          returnSecureToken: true,
        }),
      },
    )
      .then(async (res) => {
        const text = await res.text();
        console.log("[FETCH TEST] status =", res.status, "body =", text);
      })
      .catch((e) => {
        console.log("[FETCH TEST ERROR]", e?.name, e?.message || e);
      });
  }, []);

  /* ========= メール/パスワード：ログイン（REST版） ========= */

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
      const data = await restSignInWithPassword(loginEmail, loginPassword);

      console.log("[REST LOGIN OK]", data.localId);

      setUser?.({
        uid: data.localId,
        email: data.email,
        displayName: data.displayName || "",
        idToken: data.idToken,
        refreshToken: data.refreshToken,
        providerId: "password",
      });

      // ログイン時はオンボーディング不要
      try {
        window.localStorage.removeItem("needsOnboarding");
      } catch (e) {
        console.warn("needsOnboarding 削除失敗:", e);
      }

      navigate("/home", { replace: true });
    } catch (err) {
      console.log("[REST LOGIN ERROR]", err?.code, err?.message);

      if (err.message === "NO_API_KEY") {
        setErrorKey("auth.errors.generic");
      } else if (err.code && err.code.startsWith("REST/")) {
        const message = err.code.replace("REST/", "");
        const key = mapRestErrorToKey(message);
        setErrorKey(key);
      } else if (err.code && typeof err.code === "string") {
        setErrorKey(mapErrorKey(err.code));
      } else {
        setErrorKey("auth.errors.network");
      }
    } finally {
      setBusy(false);
    }
  }, [loginEmail, loginPassword, isLoginEmailValid, navigate, setUser]);

  /* ========= メール/パスワード：新規登録（REST版） ========= */

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
      const data = await restSignUp(registerEmail, registerPassword);

      console.log("[REST REGISTER OK]", data.localId);

      setUser?.({
        uid: data.localId,
        email: data.email,
        displayName: data.displayName || "",
        idToken: data.idToken,
        refreshToken: data.refreshToken,
        providerId: "password",
      });

      // 新規アカウント作成時だけオンボーディングを強制
      try {
        window.localStorage.setItem("needsOnboarding", "1");
      } catch (e) {
        console.warn("needsOnboarding 保存失敗:", e);
      }

      // ここで必ずオンボーディングへ
      navigate("/onboarding", { replace: true });
    } catch (err) {
      console.log("[REST REGISTER ERROR]", err?.code, err?.message);

      if (err.message === "NO_API_KEY") {
        setErrorKey("auth.errors.generic");
      } else if (err.code && err.code.startsWith("REST/")) {
        const message = err.code.replace("REST/", "");
        const key = mapRestErrorToKey(message);
        setErrorKey(key);
      } else if (err.code && typeof err.code === "string") {
        setErrorKey(mapErrorKey(err.code));
      } else {
        setErrorKey("auth.errors.network");
      }
    } finally {
      setBusy(false);
    }
  }, [registerEmail, registerPassword, isRegisterEmailValid, navigate, setUser]);

  /* ========= キーボード Enter ========= */

  const onKeyDownLogin = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const onKeyDownRegister = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-card">
          {/* タブ */}
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

          {/* メールログインのみ */}
          <div className="auth-divider">
            <span>{t("auth.or_email", "Use email")}</span>
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
                >
                  {showPassLogin ? "🙈" : "👁️"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleLogin}
                disabled={busy || !loginEmail || !loginPassword}
              >
                {busy ? t("common.loading", "Loading…") : t("auth.login_button", "Log in")}
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
                  placeholder={t("auth.password_hint", "Password (6+ chars)")}
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

          {errorKey && (
            <div className="auth-error" role="alert" aria-live="assertive">
              {t(
                errorKey,
                t("auth.errors.generic", "Something went wrong. Please try again."),
              )}
            </div>
          )}
        </div>

        {/* ✅ guest mode は削除（表示もしない） */}
      </div>
    </div>
  );
};

export default AuthPage;