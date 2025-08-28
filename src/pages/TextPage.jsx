// src/pages/LevelSelectPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/GrammarLesson.css"; // 共通スタイルを利用

/**
 * レベル選択ページ（Grammar/Text 共通）
 * props:
 * - basePath: 遷移先のルート（"/grammar" or "/text" など）
 * - i18nKey: タイトルの翻訳キー
 * - defaultTitle: 翻訳キーがない場合のデフォルト文言
 */
const LEVEL_LABELS = { n5: "N5", n4: "N4", n3: "N3", n2: "N2", n1: "N1" };

export default function LevelSelectPage({
  basePath = "/grammar",
  i18nKey = "grammar.level.title",
  defaultTitle = "選擇文法級別",
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const title = t(i18nKey, { defaultValue: defaultTitle });

  return (
    <div className="grammar-wrap" role="main">
      <h1 className="level-head">{title}</h1>
      <div className="grid" aria-label={title}>
        {Object.keys(LEVEL_LABELS).map((lv) => (
          <button
            key={lv}
            type="button"
            className="grammar-btn"
            onClick={() => navigate(`${basePath}/${lv}`)}
          >
            {LEVEL_LABELS[lv]}
          </button>
        ))}
      </div>
    </div>
  );
}