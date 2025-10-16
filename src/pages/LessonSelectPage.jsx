// src/pages/LessonSelectPage.jsx
import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/LessonSelectPage.css";

// ✅ 各レベルのデータをレジストリから取得
import { getAllWords } from "@/data/registry/index.js";

// ブロック分けユーティリティ
import {
  buildBlocksByNumber,
  buildBlocksByPOS,
  buildBlocksByFreq,
} from "@/utils/grouping.js";

export default function LessonSelectPage() {
  const { level = "n5" } = useParams(); // /lessons/:level
  const navigate = useNavigate();
  const { t } = useTranslation();

  const normLevel = String(level).toLowerCase();

  // === 表示モード ===
  const [mode, setMode] = useState("number"); // "pos" | "number" | "freq"

  // === 全単語をレジストリから取得 ===
  const allWords = useMemo(() => getAllWords(normLevel), [normLevel]);

  // === モード別ブロック生成 ===
  const blocks = useMemo(() => {
    if (!allWords.length) return [];
    if (mode === "pos") return buildBlocksByPOS(allWords, normLevel);
    if (mode === "freq") return buildBlocksByFreq(allWords);
    return buildBlocksByNumber(allWords);
  }, [mode, allWords, normLevel]);

  // === ブロッククリック時 ===
  const goBlock = (blk) => {
    navigate(`/browse/${normLevel}/${mode}/${encodeURIComponent(blk.key)}`, {
      state: { ids: blk.ids, label: blk.label },
    });
  };

  const title = t("lesson.selectTitle", {
    level: normLevel.toUpperCase(),
    defaultValue: `選択 ${normLevel.toUpperCase()} レッスン`,
  });

  return (
    <main className="lesson-select-page" role="main" aria-label={title}>
      {/* === トップツールバー === */}
      <div className="lesson-toolbar">
        <button
          className={`toggle ${mode === "pos" ? "active" : ""}`}
          onClick={() => setMode("pos")}
        >
          品詞で分ける
        </button>
        <button
          className={`toggle ${mode === "number" ? "active" : ""}`}
          onClick={() => setMode("number")}
        >
          番号順
        </button>
        <button
          className={`toggle ${mode === "freq" ? "active" : ""}`}
          onClick={() => setMode("freq")}
        >
          よく出る順
        </button>
      </div>

      {/* === コンテンツ === */}
      {blocks.length === 0 ? (
        <div className="lesson-empty">
          {t("common.notFound", "データがありません。")}
        </div>
      ) : (
        <div className="lesson-blocks" role="list">
          {blocks.map((blk) => (
            <button
              key={blk.key}
              className="lesson-block"
              role="listitem"
              onClick={() => goBlock(blk)}
              aria-label={`${blk.label} (${blk.count})`}
            >
              <div className="blk-title">{blk.label}</div>
              <div className="blk-sub">{blk.count} 語</div>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
