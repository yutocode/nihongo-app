// src/pages/TextLevelSelectPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/GrammarLesson.css"; // 既存の青いボタン/左寄せグリッドを再利用

const LEVEL_LABELS = { n5: "N5", n4: "N4", n3: "N3", n2: "N2", n1: "N1" };

export default function TextLevelSelectPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="grammar-wrap" role="main">
      <h1>{t("text.level.title", { defaultValue: "テキストレベルを選んでください" })}</h1>

      <div className="grid" aria-label={t("text.level.title", { defaultValue: "テキストレベルを選んでください" })}>
        {Object.keys(LEVEL_LABELS).map((lv) => (
          <button
            key={lv}
            type="button"
            className="grammar-btn"
            onClick={() => navigate(`/text/${lv}`)}
            title={LEVEL_LABELS[lv]}
            aria-label={LEVEL_LABELS[lv]}
          >
            {LEVEL_LABELS[lv]}
          </button>
        ))}
      </div>
      {/* 戻る/ホームはヘッダーのナビに任せます */}
    </div>
  );
}