// src/pages/GrammarLevelSelectPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/GrammarLesson.css";

/**
 * レベル選択ページ（汎用）
 * - grammar 用だけでなく text などにも流用できるよう、見出しキーと遷移先の basePath を props で切替可能
 *
 * 使い方：
 * <GrammarLevelSelectPage />                           // /grammar 用（デフォルト）
 * <GrammarLevelSelectPage basePath="/text"
 *   i18nKey="text.levelTitle" defaultTitle="テキストレベルを選んでください" />
 */
const LEVEL_LABELS = { n5: "N5", n4: "N4", n3: "N3", n2: "N2", n1: "N1" };

export default function GrammarLevelSelectPage({
  basePath = "/grammar",
  i18nKey = "grammar.level.title",
  defaultTitle = "選擇文法級別",
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const title = t(i18nKey, { defaultValue: defaultTitle });

  const goLevel = (lv) => {
    // /grammar/n5 や /text/n5 に遷移
    navigate(`${basePath}/${lv}`);
  };

  return (
    <div className="grammar-wrap" role="main">
      <h1 className="level-head">{title}</h1>

      {/* レベルボタン */}
      <div className="grid" aria-label={title}>
        {Object.keys(LEVEL_LABELS).map((lv) => (
          <button
            key={lv}
            type="button"
            className="grammar-btn"
            onClick={() => goLevel(lv)}
            title={LEVEL_LABELS[lv]}
            aria-label={LEVEL_LABELS[lv]}
          >
            {LEVEL_LABELS[lv]}
          </button>
        ))}
      </div>
      {/* 戻り導線は共通ヘッダー（左上）に任せます */}
    </div>
  );
}