// src/pages/Settings.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";
import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "react-i18next";
import "../styles/Settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const { clearUser } = useAppStore();
  const { t } = useTranslation();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        clearUser();
        navigate("/");
      })
      .catch((err) => console.error("ログアウト失敗:", err));
  };

  return (
    <div className="settings-page">
      <h2>⚙️ {t("common.settings", "設定")}</h2>

      <div className="settings-buttons">
        <button onClick={() => navigate("/profile")}>
          🙋‍♂️ {t("common.profile", "プロフィール")}
        </button>
        <button onClick={() => navigate("/language")}>
          🌐 {t("common.languageSettings", "言語設定")}
        </button>
        <button onClick={() => navigate("/progress")}>
          📊 {t("common.progressCheck", "進捗確認")}
        </button>
        <button onClick={() => navigate("/premium")}>
          💎 {t("common.premium", "プレミアム")}
        </button>
        <button onClick={handleLogout}>
          🔐 {t("common.logout", "ログアウト")}
        </button>
      </div>
    </div>
  );
};

export default Settings;
