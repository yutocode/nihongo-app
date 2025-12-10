// src/pages/WordQuizLessonSelectPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/LessonSelectPage.css";

// 単語レジストリ（単語帳と同じデータ取得）
import { getAllWords } from "@/data/registry/index.js";

// ブロック分けユーティリティ
import { buildBlocksByPOS, buildBlocksByNumber } from "@/utils/grouping.js";

// マイブックの単語（進捗用） ※LessonSelectPage と同じストア
import { useMyWordsStore } from "@/store/useMyWordsStore";

// ドーナツ型の進捗リング
import ProgressRing from "@/components/ui/ProgressRing";

export default function WordQuizLessonSelectPage() {
  const { level = "n5" } = useParams();
  const navigate = useNavigate();
  const normLevel = String(level).toLowerCase();

  // タブ：品詞 / 番号順（初期は品詞）
  const [mode, setMode] = useState("pos"); // "pos" | "number"

  // クイズ用プール（単語帳と同じデータ源）
  const allWords = useMemo(
    () => getAllWords(normLevel) ?? [],
    [normLevel],
  );

  // マイブック：学習済み単語
  const myWords = useMyWordsStore((s) => s.items || []);

  // ===== ブロックの元データ =====
  const baseBlocks = useMemo(() => {
    if (!allWords.length) return [];
    if (mode === "pos") {
      return buildBlocksByPOS(allWords, normLevel);
    }
    // 番号順は 50 語ごと
    return buildBlocksByNumber(allWords, 50);
  }, [mode, allWords, normLevel]);

  // ===== learnedCount 付きブロック =====
  const blocks = useMemo(() => {
    if (!baseBlocks.length) return [];

    const learnedIdSet = new Set(
      myWords
        .filter(
          (w) =>
            String(w.level || "").toLowerCase() === normLevel && w.id != null,
        )
        .map((w) => w.id),
    );

    return baseBlocks.map((blk) => {
      const ids = Array.isArray(blk.ids) ? blk.ids : [];
      const learnedCount = ids.reduce(
        (acc, id) => (learnedIdSet.has(id) ? acc + 1 : acc),
        0,
      );

      return {
        ...blk,
        learnedCount,
      };
    });
  }, [baseBlocks, myWords, normLevel]);

  // ラベル "101–150" → [101, 150]（旧形式の互換）
  const rangeFromLabel = (label) => {
    const m = String(label).match(/(\d+)\s*[–-]\s*(\d+)/);
    return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : [null, null];
  };

  // クリック → クイズへ
  const go = (blk) => {
    let lesson = blk.key;

    // すでに "pos:" / "num:" 形式ならそのまま
    if (/^(pos|num):/.test(lesson)) {
      navigate(`/word-quiz/${normLevel}/${encodeURIComponent(lesson)}`);
      return;
    }

    // 旧形式の後方互換
    if (lesson.startsWith("pos-")) {
      const pos = lesson.replace(/^pos-/, "").replace(/-all$/, "");
      lesson = `pos:${pos}`;
    } else if (lesson.startsWith("num-")) {
      const [start, end] = rangeFromLabel(blk.label);
      lesson = start && end ? `num:${start}-${end}` : "num:all";
    }

    navigate(`/word-quiz/${normLevel}/${encodeURIComponent(lesson)}`);
  };

  return (
    <main
      className="lesson-select-page"
      role="main"
      aria-label={`WORD QUIZ ${normLevel.toUpperCase()}`}
    >
      {/* タブ */}
      <div className="lesson-toolbar">
        <button
          className={`toggle ${mode === "pos" ? "active" : ""}`}
          onClick={() => setMode("pos")}
          type="button"
        >
          品詞
        </button>
        <button
          className={`toggle ${mode === "number" ? "active" : ""}`}
          onClick={() => setMode("number")}
          type="button"
        >
          番号順
        </button>
      </div>

      {/* ブロック一覧 */}
      {blocks.length === 0 ? (
        <div className="lesson-empty">データがありません。</div>
      ) : (
        <div className="lesson-blocks" role="list">
          {blocks.map((blk) => {
            const total = blk.count || 0;
            const learned = blk.learnedCount || 0;
            const value = total > 0 ? (learned / total) * 100 : 0;

            return (
              <button
                key={blk.key}
                className="lesson-block"
                role="listitem"
                onClick={() => go(blk)}
                aria-label={`${blk.label} (${learned}/${total} 語)`}
                type="button"
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