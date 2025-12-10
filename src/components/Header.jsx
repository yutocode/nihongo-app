// src/components/Header.jsx
import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaCog, FaLayerGroup } from "react-icons/fa";

import { useAppStore } from "../store/useAppStore";
import XPBanner from "./XPBanner";

import "../styles/XPBanner.css";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const xp = useAppStore((s) => s.xp || {});

  // 現在パスからレベル推定（XPバナー用フォールバック）
  const currentLevel = useMemo(() => {
    const m = location.pathname.match(
      /^\/(?:lessons|words|grammar|adj|word-quiz)\/(n[1-5])/i
    );
    return m ? m[1].toUpperCase() : "N5";
  }, [location.pathname]);

  // 戻る先を決定（ルーティングロジック）
  const backTarget = useMemo(() => {
    const p = location.pathname;

    // ★ WordPage (/words/n1〜n5/...) はページ内の戻るボタンを使うのでヘッダーの戻るは出さない
    if (/^\/words\/n[1-5]\//i.test(p)) {
      return null;
    }

    // レッスン選択 → ホーム
    if (/^\/lessons\/n[1-5]/i.test(p)) {
      return { path: "/home", label: t("common.home", "ホーム") };
    }

    // 文法レッスン → 同カテゴリ内一覧
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

    // WordQuiz レッスン → レッスン一覧
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

    // それ以外は戻るなし
    return null;
  }, [location.pathname, t]);

  const showBack = !!backTarget;

  const handleBack = () => {
    if (backTarget) navigate(backTarget.path);
  };

  return (
    <header className="app-header" role="banner" data-testid="AppHeader">
      {/* 左：戻る or ダミー */}
      <div className="hdr-left">
        {showBack ? (
          <button
            type="button"
            className="hdr-btn is-primary back-btn"
            aria-label={backTarget.label}
            title={backTarget.label}
            onClick={handleBack}
          >
            <span className="hdr-btn-text">{backTarget.label}</span>
          </button>
        ) : (
          <div className="hdr-avatar-placeholder" aria-hidden="true" />
        )}
      </div>

      {/* 中央：XPバナー */}
      <div className="hdr-center">
        <XPBanner
          levelLabel={xp.levelLabel || currentLevel}
          percent={xp.percent ?? 0}
          compact
        />
      </div>

      {/* 右：レベル選択＆設定 */}
      <div className="hdr-right">
        <button
          type="button"
          className="hdr-icon-btn level-icon-btn"
          aria-label={t("nav.level", "Level")}
          title={t("nav.level", "レベル設定")}
          onClick={() => navigate("/level")}
        >
          <FaLayerGroup className="hdr-ic" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="hdr-icon-btn settings-icon-btn"
          aria-label={t("nav.settings", "Settings")}
          title={t("nav.settings", "設定")}
          onClick={() => navigate("/settings")}
        >
          <FaCog className="hdr-ic" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};

export default React.memo(Header);