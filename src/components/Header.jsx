import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaCog, FaArrowLeft, FaHome } from "react-icons/fa";
import XPBanner from "./XPBanner";
import "../styles/XPBanner.css";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // 現在パスからレベル推定
  const currentLevel = useMemo(() => {
    const m = location.pathname.match(/^\/(?:lessons|words|grammar|adj)\/(n[1-5])/i);
    return m ? m[1].toUpperCase() : "N5";
  }, [location.pathname]);

  // 戻る先を決定
  const backTarget = useMemo(() => {
    const p = location.pathname;

    // 単語：/words/nX/.. → /lessons/nX
    if (/^\/words\/n[1-5]\//i.test(p)) {
      const m = p.match(/^\/words\/(n[1-5])/i);
      if (m) return { path: `/lessons/${m[1]}`, label: t("nav.toLessonSelect", "課程選択へ") };
    }
    // /lessons/nX → /level
    if (/^\/lessons\/n[1-5]/i.test(p)) {
      return { path: "/level", label: t("nav.toLevelSelect", "レベル選択へ") };
    }

    // 文法：/grammar/nX/:cat/lessonY → /grammar/nX/:cat
    let m = p.match(/^\/grammar\/(n[1-5])\/([^/]+)\/lesson[0-9]+$/i);
    if (m) return {
      path: `/grammar/${m[1].toLowerCase()}/${m[2]}`,
      label: t("grammar.lessons.backToLessons", "レッスン一覧へ"),
    };

    // /grammar/nX/:cat → /grammar/nX
    m = p.match(/^\/grammar\/(n[1-5])\/([^/]+)$/i);
    if (m) return {
      path: `/grammar/${m[1].toLowerCase()}`,
      label: t("grammar.lessons.backToCategories", "返回分類"),
    };

    // /grammar/nX → /grammar
    if (/^\/grammar\/n[1-5]$/i.test(p)) {
      return { path: "/grammar", label: t("grammar.level.backToLevels", "返回級別") };
    }

    // 形容詞：/adj/nX/lessonY → /grammar/nX
    m = p.match(/^\/adj\/(n[1-5])\/lesson[0-9]+$/i);
    if (m) return {
      path: `/grammar/${m[1].toLowerCase()}`,
      label: t("adj.backToLessons", "レッスン一覧へ"),
    };

    // /adj/nX → /grammar/nX
    m = p.match(/^\/adj\/(n[1-5])$/i);
    if (m) return {
      path: `/grammar/${m[1].toLowerCase()}`,
      label: t("adj.backToCategories", "文法トップへ"),
    };

    return null;
  }, [location.pathname, t]);

  return (
    <header className="app-header" role="banner">
      {/* 左：ホーム＋戻る */}
      <div className="hdr-left">
        <button
          className="hdr-btn is-ghost home-btn"
          aria-label={t("nav.home", "Home")}
          title={t("nav.home", "Home")}
          onClick={() => navigate("/home")}
        >
          <FaHome className="hdr-ic" />
          <span className="hdr-btn-text">{t("nav.homeLabel", "ホーム")}</span>
        </button>

        {backTarget && (
          <button
            className="hdr-btn is-primary back-btn"
            aria-label={t("nav.back", "Back")}
            title={backTarget.label}
            onClick={() => navigate(backTarget.path)}
          >
            <FaArrowLeft className="hdr-ic" />
            <span className="hdr-btn-text">{backTarget.label}</span>
          </button>
        )}
      </div>

      {/* 中央：XP */}
      <div className="hdr-center">
        <XPBanner levelLabel={currentLevel} percent={45} compact />
      </div>

      {/* 右：設定 */}
      <div className="hdr-right">
        <button
          className="hdr-btn is-ghost"
          aria-label={t("nav.settings", "Settings")}
          title={t("nav.settings", "Settings")}
          onClick={() => navigate("/settings")}
        >
          <FaCog className="hdr-ic" />
          <span className="hdr-btn-text">{t("nav.settings", "設定")}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
