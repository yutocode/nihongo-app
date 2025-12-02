// src/pages/LessonSelectPage.jsx
import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/LessonSelectPage.css";

// ✅ 各レベルのデータをレジストリから取得
import { getAllWords } from "@/data/registry/index.js";

// ブロック分けユーティリティ
import { buildBlocksByNumber, buildBlocksByPOS } from "@/utils/grouping.js";

// ✅ マイブックに入っている単語（進捗用）
import { useMyWordsStore } from "@/store/useMyWordsStore";

// ✅ ドーナツ型の進捗リング
import ProgressRing from "@/components/ui/ProgressRing";

export default function LessonSelectPage() {
  const { level = "n5" } = useParams(); // /lessons/:level
  const navigate = useNavigate();
  const { t } = useTranslation();

  const normLevel = String(level).toLowerCase();

  // === 表示モード ===
  const [mode, setMode] = useState("pos"); // "pos" | "number"

  // === 全単語をレジストリから取得 ===
  const allWords = useMemo(() => getAllWords(normLevel), [normLevel]);

  // === マイブック ===
  const myWords = useMyWordsStore((s) => s.items || []);

  // === モード別ブロック生成 ===
  const baseBlocks = useMemo(() => {
    if (!allWords.length) return [];
    if (mode === "pos") return buildBlocksByPOS(allWords, normLevel);
    // それ以外は番号順
    return buildBlocksByNumber(allWords);
  }, [mode, allWords, normLevel]);

  // === 各ブロックごとの「学習済み数」を付与 ===
  const blocks = useMemo(() => {
    if (!baseBlocks.length) return [];

    // このレベルの単語だけを対象に ID セットを作る
    const learnedIdSet = new Set(
      myWords
        .filter(
          (w) => String(w.level || "").toLowerCase() === normLevel && w.id != null
        )
        .map((w) => w.id)
    );

    return baseBlocks.map((blk) => {
      const ids = Array.isArray(blk.ids) ? blk.ids : [];
      const learnedCount = ids.reduce(
        (acc, id) => (learnedIdSet.has(id) ? acc + 1 : acc),
        0
      );
      return {
        ...blk,
        learnedCount,
      };
    });
  }, [baseBlocks, myWords, normLevel]);

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
          type="button"
          className={`toggle ${mode === "pos" ? "active" : ""}`}
          onClick={() => setMode("pos")}
        >
          品詞
        </button>
        <button
          type="button"
          className={`toggle ${mode === "number" ? "active" : ""}`}
          onClick={() => setMode("number")}
        >
          番号順
        </button>
      </div>

      {/* === コンテンツ === */}
      {blocks.length === 0 ? (
        <div className="lesson-empty">
          {t("common.notFound", "データがありません。")}
        </div>
      ) : (
        <div className="lesson-blocks" role="list">
          {blocks.map((blk) => {
            const total = blk.count || 0;
            const learned = blk.learnedCount || 0;
            const value = total > 0 ? (learned / total) * 100 : 0;

            return (
              <button
                key={blk.key}
                type="button"
                className="lesson-block"
                role="listitem"
                onClick={() => goBlock(blk)}
                aria-label={`${blk.label} (${learned}/${total} 語)`}
              >
                <div className="lesson-block-main">
                  <div className="blk-text">
                    <div className="blk-title">{blk.label}</div>
                    <div className="blk-sub">
                      {learned} / {total} 語
                    </div>
                  </div>

                  <ProgressRing
                    value={value}
                    size={40}
                    stroke={6}
                    ariaLabel={`${blk.label} の進捗`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}
