// src/components/Header.jsx
import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaCog, FaHome, FaLayerGroup } from "react-icons/fa"; // ← FaArrowLeft 削除
import XPBanner from "./XPBanner";
import "../styles/XPBanner.css";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // 現在パスからレベル推定
  const currentLevel = useMemo(() => {
    const m = location.pathname.match(
      /^\/(?:lessons|words|grammar|adj|word-quiz)\/(n[1-5])/i
    );
    return m ? m[1].toUpperCase() : "N5";
  }, [location.pathname]);

  // 戻る先を決定
  const backTarget = useMemo(() => {
    const p = location.pathname;

    // 単語帳：単語レッスン → レッスン一覧へ
    if (/^\/words\/n[1-5]\//i.test(p)) {
      const m = p.match(/^\/words\/(n[1-5])/i);
      if (m) {
        return { path: `/lessons/${m[1]}`, label: t("nav.toLessonSelect", "レッスン選択") };
      }
    }

    // レッスン選択ページ → ホーム
    if (/^\/lessons\/n[1-5]/i.test(p)) {
      return { path: "/home", label: t("common.home", "ホーム") };
    }

    // 文法レッスンページ → カテゴリ内一覧
    let m = p.match(/^\/grammar\/(n[1-5])\/([^/]+)\/lesson[0-9]+$/i);
    if (m) {
      return {
        path: `/grammar/${m[1].toLowerCase()}/${m[2]}`,
        label: t("grammar.lessons.backToLessons", "レッスン一覧"),
      };
    }

    // 文法カテゴリ内一覧 → カテゴリ選択
    m = p.match(/^\/grammar\/(n[1-5])\/([^/]+)$/i);
    if (m) {
      return {
        path: `/grammar/${m[1].toLowerCase()}`,
        label: t("grammar.lessons.backToCategories", "カテゴリ選択"),
      };
    }

    // 文法カテゴリ選択 → ホーム
    if (/^\/grammar\/(n[1-5])$/i.test(p)) {
      return { path: "/home", label: t("common.home", "ホーム") };
    }

    // WordQuiz レッスン → レッスン選択
    m = p.match(/^\/word-quiz\/(n[1-5])\/Lesson[0-9]+$/i);
    if (m) {
      return {
        path: `/word-quiz/${m[1].toLowerCase()}`,
        label: t("wordquiz.backToLessonSelect", "レッスン選択"),
      };
    }

    // WordQuiz レベル or 一覧 → ホーム
    if (/^\/word-quiz(\/n[1-5])?$/i.test(p)) {
      return { path: "/home", label: t("common.home", "ホーム") };
    }

    return null;
  }, [location.pathname, t]);

  const showBack = !!backTarget;
  const onBack = () => navigate(backTarget.path);
  const showHome = !showBack && location.pathname !== "/home";
  const onHome = () => navigate("/home");

  return (
    <header className="app-header" role="banner">
      {/* 左：ホーム or 戻る */}
      <div className="hdr-left">
        {showBack ? (
          <button
            className="hdr-btn is-primary back-btn"
            aria-label={backTarget.label}
            title={backTarget.label}
            onClick={onBack}
          >
            {/* ← アイコン削除、テキストだけに変更 */}
            <span className="hdr-btn-text">{backTarget.label}</span>
          </button>
        ) : showHome ? (
          <button
            className="hdr-btn is-ghost home-btn"
            aria-label={t("nav.home", "Home")}
            title={t("nav.home", "Home")}
            onClick={onHome}
          >
            <FaHome className="hdr-ic" />
            <span className="hdr-btn-text">{t("common.home", "ホーム")}</span>
          </button>
        ) : (
          <span className="hdr-left-spacer" />
        )}
      </div>

      {/* 中央：XP */}
      <div className="hdr-center">
        <XPBanner levelLabel={currentLevel} percent={45} compact />
      </div>

      {/* 右：レベル設定とその他 */}
      <div className="hdr-right">
        <button
          className="hdr-icon-btn level-icon-btn"
          aria-label={t("nav.level", "Level")}
          title={t("nav.level", "レベル設定")}
          onClick={() => navigate("/level")}
        >
          <FaLayerGroup className="hdr-ic" />
        </button>
        <button
          className="hdr-icon-btn settings-icon-btn"
          aria-label={t("nav.settings", "Settings")}
          title={t("nav.settings", "設定")}
          onClick={() => navigate("/settings")}
        >
          <FaCog className="hdr-ic" />
        </button>
      </div>
    </header>
  );
};

export default Header;
