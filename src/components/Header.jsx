// src/components/Header.jsx
import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaCog, FaArrowLeft } from "react-icons/fa";
import XPBanner from "./XPBanner";
import "../styles/XPBanner.css";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // 現在のURLから「N5 / N4 …」レベルを推定（/lessons, /words, /grammar, /adj をサポート）
  const currentLevel = useMemo(() => {
    const m = location.pathname.match(/^\/(?:lessons|words|grammar|adj)\/(n[1-5])/i);
    return m ? m[1].toUpperCase() : "N5";
  }, [location.pathname]);

  // ────────────────
  // 戻る先を判定（/adj を追加）
  // ────────────────
  const backTarget = useMemo(() => {
    const p = location.pathname;

    // 単語系
    if (/^\/words\/n[1-5]\//i.test(p)) {
      const m = p.match(/^\/words\/(n[1-5])/i);
      if (m) return { path: `/lessons/${m[1]}`, label: t("nav.toLessonSelect", "課程選択へ") };
    }
    if (/^\/lessons\/n[1-5]/i.test(p)) {
      return { path: "/level", label: t("nav.toLevelSelect", "レベル選択へ") };
    }

    // 文法系
    // /grammar/:level/:category/lessonX → /grammar/:level/:category
    let m = p.match(/^\/grammar\/(n[1-5])\/([^/]+)\/lesson[0-9]+$/i);
    if (m) {
      const lv = m[1].toLowerCase();
      const cat = m[2];
      return { path: `/grammar/${lv}/${cat}`, label: t("grammar.lessons.backToLessons", "レッスン一覧へ") };
    }

    // /grammar/:level/:category → /grammar/:level
    m = p.match(/^\/grammar\/(n[1-5])\/([^/]+)$/i);
    if (m) {
      const lv = m[1].toLowerCase();
      return { path: `/grammar/${lv}`, label: t("grammar.lessons.backToCategories", "返回分類") };
    }

    // /grammar/:level → /grammar
    if (/^\/grammar\/n[1-5]$/i.test(p)) {
      return { path: "/grammar", label: t("grammar.level.backToLevels", "返回級別") };
    }

    // ★ 形容詞（二択）系: /adj/:level/lessonX → /grammar/:level（文法のそのレベル一覧へ）
    m = p.match(/^\/adj\/(n[1-5])\/lesson[0-9]+$/i);
    if (m) {
      const lv = m[1].toLowerCase();
      return { path: `/grammar/${lv}`, label: t("adj.backToLessons", "レッスン一覧へ") };
    }

    // /adj/:level → /grammar/:level（形容詞トップから文法レベル一覧へ）
    m = p.match(/^\/adj\/(n[1-5])$/i);
    if (m) {
      const lv = m[1].toLowerCase();
      return { path: `/grammar/${lv}`, label: t("adj.backToCategories", "文法トップへ") };
    }

    return null;
  }, [location.pathname, t]);

  // ────────────────
  // 描画
  // ────────────────
  return (
    <header className="app-header" role="banner">
      {/* 左：ホーム & 戻る */}
      <div className="hdr-left">
        <button
          className="hdr-btn"
          aria-label={t("nav.home", "Home")}
          onClick={() => navigate("/home")}
          title={t("nav.home", "Home")}
        >
          🏠
        </button>

        {backTarget && (
          <button
            className="hdr-btn"
            aria-label={t("nav.back", "Back")}
            onClick={() => navigate(backTarget.path)}
            title={backTarget.label}
          >
            <FaArrowLeft />
            <span className="hdr-btn-text">{backTarget.label}</span>
          </button>
        )}
      </div>

      {/* 中央：XPバナー */}
      <div className="hdr-center">
        <XPBanner levelLabel={currentLevel} percent={45} compact />
      </div>

      {/* 右：設定 */}
      <div className="hdr-right">
        <button
          className="hdr-btn"
          aria-label={t("nav.settings", "Settings")}
          onClick={() => navigate("/settings")}
          title={t("nav.settings", "Settings")}
        >
          <FaCog />
        </button>
      </div>
    </header>
  );
};

export default Header;