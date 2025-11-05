// src/pages/Settings.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";
import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "react-i18next";
import "../styles/Settings.css";

function SettingSection({ title, children }) {
  return (
    <section className="settings__section" aria-label={title}>
      <h3 className="settings__sectionTitle">{title}</h3>
      <div className="settings__group">{children}</div>
    </section>
  );
}

function RowButton({ icon, label, onClick, to, trailing }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="settings__row"
      onClick={() => (onClick ? onClick() : to ? navigate(to) : null)}
      aria-label={typeof label === "string" ? label : undefined}
    >
      <span className="settings__rowLeft">
        <span className="settings__icon" aria-hidden>{icon}</span>
        <span className="settings__label">{label}</span>
      </span>
      <span className="settings__rowRight">
        {trailing ?? <span className="settings__chevron" aria-hidden>›</span>}
      </span>
    </button>
  );
}

function RowToggle({ icon, label, checked, onChange, description }) {
  return (
    <div className="settings__row" role="group" aria-label={label}>
      <span className="settings__rowLeft">
        <span className="settings__icon" aria-hidden>{icon}</span>
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

const Settings = () => {
  const navigate = useNavigate();
  const { clearUser } = useAppStore();
  const { t, i18n } = useTranslation();

  // ----- Version 表示（Viteの環境変数 or フォールバック）
  const appVersion = useMemo(
    () => import.meta?.env?.VITE_APP_VERSION || "1.0.0",
    []
  );

  // ----- ダークモード（localStorage + prefers-color-scheme）
  const getSystemDark = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return getSystemDark();
  });

  useEffect(() => {
    // アプリ側のテーマ切替（必要に応じてクラス名を調整）
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("theme-dark");
      root.classList.remove("theme-light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("theme-light");
      root.classList.remove("theme-dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ----- 通知（Permission + localStorage）
  const [notifEnabled, setNotifEnabled] = useState(() => {
    const saved = localStorage.getItem("notificationsEnabled");
    return saved ? saved === "true" : false;
  });

  const requestNotification = async (enable) => {
    if (!("Notification" in window)) {
      alert(t("settings.notificationsNotSupported", "この端末は通知に対応していません。"));
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
          alert(t("settings.notificationsDenied", "通知が許可されませんでした。ブラウザ設定から変更できます。"));
        }
      }
    } else {
      setNotifEnabled(false);
      localStorage.setItem("notificationsEnabled", "false");
    }
  };

  // ----- ログアウト
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        clearUser();
        navigate("/");
      })
      .catch((err) => console.error("ログアウト失敗:", err));
  };

  // ----- 言語ラベル
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
        <h2 className="settings__title">
          {t("common.settings", "設定")}
        </h2>
        <p className="settings__subtitle">
          {t("settings.managePreferences", "アプリの設定を管理")}
        </p>
      </header>

      {/* ACCOUNT */}
      <SettingSection title={t("settings.account", "アカウント")}>
        <RowButton icon="🙋‍♂️" label={t("common.profile", "プロフィール")} to="/profile" />
        <RowButton icon="🔒" label={t("settings.password", "パスワード")} to="/settings/password" />
        <RowButton icon="💾" label={t("settings.downloadData", "データの書き出し")} to="/settings/export" />
      </SettingSection>

      {/* PREFERENCES */}
      <SettingSection title={t("settings.preferences", "基本設定")}>
        <RowToggle
          icon="🔔"
          label={t("settings.notifications", "通知")}
          checked={notifEnabled}
          onChange={requestNotification}
          description={t("settings.notificationsDesc", "学習のリマインダーを受け取る")}
        />
        <RowToggle
          icon="🌙"
          label={t("settings.darkMode", "ダークモード")}
          checked={darkMode}
          onChange={setDarkMode}
          description={t("settings.darkModeDesc", "見た目のテーマを切り替え")}
        />
        <RowButton
          icon="🌐"
          label={t("common.languageSettings", "言語設定")}
          trailing={<span className="settings__value">{langName}</span>}
          to="/language"
        />
      </SettingSection>

      {/* PREMIUM */}
      <SettingSection title={t("settings.premium", "プレミアム")}>
        <RowButton icon="💎" label={t("settings.managePlan", "プランを管理")} to="/premium" />
      </SettingSection>

      {/* SUPPORT */}
      <SettingSection title={t("settings.support", "サポート")}>
        <RowButton icon="❓" label={t("settings.help", "ヘルプ・サポート")} to="/help" />
        <RowButton icon="📮" label={t("settings.contact", "お問い合わせ")} to="/contact" />
        <RowButton icon="📄" label={t("settings.terms", "利用規約")} to="/legal/terms" />
        <RowButton icon="🛡️" label={t("settings.privacy", "プライバシー")} to="/legal/privacy" />
      </SettingSection>

      {/* DANGER */}
      <SettingSection title={t("settings.dangerZone", "危険な操作")}>
        <RowButton
          icon="🗑️"
          label={t("settings.deleteAccount", "アカウント削除")}
          to="/settings/delete-account"
          trailing={<span className="settings__chevron" aria-hidden>›</span>}
        />
      </SettingSection>

      {/* ABOUT & LOGOUT */}
      <footer className="settings__footer">
        <div className="settings__version">
          {t("settings.version", "バージョン")} {appVersion}
        </div>
        <button
          type="button"
          className="settings__logout"
          onClick={handleLogout}
          aria-label={t("common.logout", "ログアウト")}
        >
          🔐 {t("common.logout", "ログアウト")}
        </button>
      </footer>
    </div>
  );
};

export default Settings;
