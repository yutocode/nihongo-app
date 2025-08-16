// src/pages/Settings.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";
import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "react-i18next"; // ✅ 翻訳対応
import "../styles/Settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const { clearUser } = useAppStore();
  const { t } = useTranslation(); // ✅ 翻訳関数取得

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
      <h2>⚙️ {t("settings", "設定")}</h2>

      <div className="settings-buttons">
        <button onClick={() => navigate("/profile")}>🙋‍♂️ {t("profile", "プロフィール")}</button>
        <button onClick={() => navigate("/language")}>🌐 {t("language", "言語設定")}</button>
        <button onClick={() => navigate("/progress")}>📊 {t("progress", "進捗確認")}</button>
        <button onClick={() => navigate("/premium")}>💎 {t("premium", "プレミアム")}</button>
        <button onClick={handleLogout}>🔐 {t("logout", "ログアウト")}</button>
      </div>
    </div>
  );
};

export default Settings;
