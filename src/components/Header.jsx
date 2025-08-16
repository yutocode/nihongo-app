// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaCog } from "react-icons/fa";
import XPBanner from "./XPBanner";
import "../styles/XPBanner.css";   // ← 忘れずに
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <header className="app-header" role="banner">
      {/* 左：ホーム/メニュー（必要に応じて遷移先変更OK） */}
      <button
        className="hdr-btn"
        aria-label={t("nav.home", "Home")}
        onClick={() => navigate("/home")}
      >
        🎌
      </button>

      {/* 中央：XPバナー（コンパクト表示） */}
      <div className="hdr-center">
        <XPBanner levelLabel="N5" percent={45} compact />
        {/* 実データで駆動するなら <XPBanner compact /> にしてZustandのxpを更新 */}
      </div>

      {/* 右：設定 */}
      <button
        className="hdr-btn"
        aria-label={t("nav.settings", "Settings")}
        onClick={() => navigate("/settings")}
      >
        <FaCog />
      </button>
    </header>
  );
};

export default Header;
