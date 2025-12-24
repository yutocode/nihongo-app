// src/pages/Settings.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, deleteUser } from "firebase/auth";
import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "react-i18next";
import { auth, db } from "../firebase/firebase-config";
import { doc, deleteDoc } from "firebase/firestore";
import "../styles/Settings.css";

/* ---------- UI helpers ---------- */
function SettingSection({ title, children }) {
  return (
    <section className="settings__section" aria-label={title}>
      <h3 className="settings__sectionTitle">{title}</h3>
      <div className="settings__group">{children}</div>
    </section>
  );
}

function isExternalUrl(to) {
  return typeof to === "string" && /^https?:\/\//i.test(to);
}

function RowButton({ icon, label, onClick, to, trailing, disabled = false }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;

    if (onClick) {
      onClick();
      return;
    }

    if (to) {
      if (isExternalUrl(to)) {
        window.open(to, "_blank", "noopener,noreferrer");
      } else {
        navigate(to);
      }
    }
  };

  return (
    <button
      type="button"
      className="settings__row"
      onClick={handleClick}
      aria-label={typeof label === "string" ? label : undefined}
      aria-disabled={disabled ? "true" : undefined}
      disabled={disabled}
      style={disabled ? { opacity: 0.5, pointerEvents: "none" } : undefined}
    >
      <span className="settings__rowLeft">
        <span className="settings__icon" aria-hidden>
          {icon}
        </span>
        <span className="settings__label">{label}</span>
      </span>
      <span className="settings__rowRight">
        {trailing ?? (
          <span className="settings__chevron" aria-hidden>
            ›
          </span>
        )}
      </span>
    </button>
  );
}

function RowToggle({ icon, label, checked, onChange, description }) {
  return (
    <div className="settings__row" role="group" aria-label={label}>
      <span className="settings__rowLeft">
        <span className="settings__icon" aria-hidden>
          {icon}
        </span>
        <span className="settings__labelBlock">
          <span className="settings__label">{label}</span>
          {description && <span className="settings__desc">{description}</span>}
        </span>
      </span>

      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-checked={checked}
          aria-label={typeof label === "string" ? label : undefined}
        />
        <span className="slider" />
      </label>
    </div>
  );
}

/* ---------- Page ---------- */
export default function Settings() {
  const navigate = useNavigate();
  const { clearUser } = useAppStore();
  const { t, i18n } = useTranslation();

  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // App version (vite env)
  const appVersion = useMemo(
    () => import.meta?.env?.VITE_APP_VERSION || "1.0.0",
    [],
  );

  /* ===== Theme (OS設定は無視・ユーザー選択で固定) ===== */
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme"); // "light" | "dark"
    if (saved === "dark") return true;
    if (saved === "light") return false;
    const attr =
      typeof document !== "undefined"
        ? document.documentElement.getAttribute("data-theme")
        : null;
    return attr === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    const theme = darkMode ? "dark" : "light";
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", darkMode ? "#0b0f14" : "#f7f8fa");
  }, [darkMode]);

  /* ===== Notifications ===== */
  const [notifEnabled, setNotifEnabled] = useState(() => {
    const saved = localStorage.getItem("notificationsEnabled");
    return saved ? saved === "true" : false;
  });

  const requestNotification = async (enable) => {
    if (!("Notification" in window)) {
      alert(
        t(
          "settings.notificationsNotSupported",
          "この端末は通知に対応していません。",
        ),
      );
      setNotifEnabled(false);
      localStorage.setItem("notificationsEnabled", "false");
      return;
    }

    if (enable) {
      if (Notification.permission === "granted") {
        setNotifEnabled(true);
        localStorage.setItem("notificationsEnabled", "true");
      } else {
        const perm = await Notification.requestPermission();
        const ok = perm === "granted";
        setNotifEnabled(ok);
        localStorage.setItem("notificationsEnabled", ok ? "true" : "false");
        if (!ok) {
          alert(
            t(
              "settings.notificationsDenied",
              "通知が許可されませんでした。ブラウザ設定から変更できます。",
            ),
          );
        }
      }
    } else {
      setNotifEnabled(false);
      localStorage.setItem("notificationsEnabled", "false");
    }
  };

  /* ===== Logout（即時 UI リセット版） ===== */
  const handleLogout = () => {
    if (loggingOut) return;
    setLoggingOut(true);

    signOut(auth)
      .then(() => console.log("[LOGOUT] signOut resolved"))
      .catch((err) => console.warn("[LOGOUT] signOut error", err));

    clearUser();
    navigate("/", { replace: true });
    setLoggingOut(false);
  };

  /* ===== Account delete ===== */
  const handleDeleteAccount = async () => {
    if (deletingAccount) return;

    const confirmed = window.confirm(
      t(
        "settings.deleteAccountConfirm",
        "アカウントと学習データを完全に削除します。よろしいですか？",
      ),
    );
    if (!confirmed) return;

    try {
      setDeletingAccount(true);
      const user = auth.currentUser;
      if (!user) {
        setDeletingAccount(false);
        return;
      }

      try {
        await deleteDoc(doc(db, "users", user.uid));
      } catch (e) {
        console.warn("[DELETE ACCOUNT] deleteDoc error (ignored)", e);
      }

      await deleteUser(user);

      clearUser();
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("[DELETE ACCOUNT] error", error);
      if (error?.code === "auth/requires-recent-login") {
        alert(
          t(
            "settings.deleteAccountRequiresLogin",
            "セキュリティのため、もう一度ログインし直してから削除してください。",
          ),
        );
      } else {
        alert(
          t(
            "settings.deleteAccountFailed",
            "アカウントを削除できませんでした。時間をおいて、もう一度お試しください。",
          ),
        );
      }
      setDeletingAccount(false);
    }
  };

  /* ===== Language display ===== */
  const langName = useMemo(() => {
    const map = {
      ja: "日本語",
      en: "English",
      id: "Bahasa Indonesia",
      zh: "简体中文",
      tw: "繁體中文(台灣華語)",
    };
    return map[i18n.language] || i18n.language;
  }, [i18n.language]);

  return (
    <div className="settings-page" role="main">
      <header className="settings__header">
        <h2 className="settings__title">{t("settings.title", "設定")}</h2>
        <p className="settings__subtitle">
          {t("settings.subtitle", "アプリの設定を管理")}
        </p>
      </header>

      {/* Account */}
      <SettingSection title={t("settings.sections.account.title", "アカウント")}>
        {/* ✅ プロフィール開放 */}
        <RowButton
          icon="🙋‍♂️"
          label={t("settings.sections.account.profile", "プロフィール")}
          to="/profile"
        />
      </SettingSection>

      {/* Basic settings */}
      <SettingSection title={t("settings.sections.basic.title", "基本設定")}>
        <RowToggle
          icon="🔔"
          label={t("settings.sections.basic.notifications", "通知")}
          checked={notifEnabled}
          onChange={requestNotification}
          description={t(
            "settings.sections.basic.notifications_desc",
            "学習のリマインダーを受け取る",
          )}
        />

        <RowButton
          icon="🌐"
          label={t("settings.sections.basic.language", "言語設定")}
          trailing={<span className="settings__value">{langName}</span>}
          to="/language"
        />
      </SettingSection>

      {/* Support */}
      <SettingSection title={t("settings.sections.support.title", "サポート")}>
        <RowButton
          icon="❓"
          label={t("settings.sections.support.help", "ヘルプ・サポート")}
          to="/help"
        />
        <RowButton
          icon="📮"
          label={t("settings.sections.support.contact", "お問い合わせ")}
          to="/contact"
        />

        {/* ✅ Terms of use は削除 */}

        <RowButton
          icon="🛡️"
          label={t("settings.sections.support.privacy", "プライバシー")}
          to="https://yutocode.github.io/nihongo-app-support/privacy.html"
        />

        <RowButton
          icon="🗑️"
          label={
            deletingAccount
              ? t("settings.sections.support.deletingAccount", "アカウント削除中…")
              : t("settings.sections.support.deleteAccount", "アカウントを削除する")
          }
          onClick={handleDeleteAccount}
          disabled={deletingAccount}
        />
      </SettingSection>

      {/* Footer */}
      <footer className="settings__footer">
        <div className="settings__version">
          {t("settings.version", "バージョン")} {appVersion}
        </div>

        <button
          type="button"
          className="settings__logout"
          onClick={handleLogout}
          aria-label={t("settings.logout", "ログアウト")}
          disabled={loggingOut}
        >
          🔐{" "}
          {loggingOut
            ? t("settings.loggingOut", "ログアウト中…")
            : t("settings.logout", "ログアウト")}
        </button>
      </footer>
    </div>
  );
}