// src/pages/GrammarLevelSelectPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/GrammarLesson.css";

const LEVEL_LABELS = { n5: "N5", n4: "N4", n3: "N3", n2: "N2", n1: "N1" };

export default function GrammarLevelSelectPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="grammar-wrap" role="main">
      {/* タイトル（翻訳キーが無い場合でも表示されるよう defaultValue） */}
      <h1>
        {t("grammar.level.title", { defaultValue: "選擇文法級別" })}
      </h1>

      {/* レベルボタン */}
      <div className="grid" aria-label={t("grammar.level.title", { defaultValue: "選擇文法級別" })}>
        {Object.keys(LEVEL_LABELS).map((lv) => (
          <button
            key={lv}
            type="button"
            className="grammar-btn"
            onClick={() => navigate(`/grammar/${lv}`)}
            title={`${LEVEL_LABELS[lv]}`}
            aria-label={`${LEVEL_LABELS[lv]}`}
          >
            {LEVEL_LABELS[lv]}
          </button>
        ))}
      </div>
      {/* ↑ 戻る・ホームは Header.jsx の左上（🏠の隣）で表示 */}
    </div>
  );
}