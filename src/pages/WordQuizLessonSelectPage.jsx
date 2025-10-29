// src/pages/WordQuizLessonSelectPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/LessonSelectPage.css";

// 単語レジストリ（単語帳と同じデータ取得）
import { getAllWords } from "@/data/registry/index.js";

// 共有の分割ユーティリティ（posById ベース）
import { buildBlocksByPOS, buildBlocksByNumber } from "@/utils/grouping.js";

export default function WordQuizLessonSelectPage() {
  const { level = "n5" } = useParams();
  const navigate = useNavigate();
  const normLevel = String(level).toLowerCase();

  // タブ：品詞 / 番号順 / ランダム
  const [mode, setMode] = useState("pos"); // "pos" | "number" | "random"

  // クイズ用プール（単語帳と同じデータ源）
  const allWords = useMemo(() => getAllWords(normLevel) ?? [], [normLevel]);

  // ===== ブロック作成 =====
  // 品詞ブロック（posById のレンジに基づく・各品詞1ブロック）
  const posBlocks = useMemo(() => {
    const blocks = buildBlocksByPOS(allWords, normLevel);
    // UIで必要な形に最小整形
    return blocks.map(b => ({
      key: b.key,            // 例: "pos-名詞-all"
      label: b.label,        // 例: "名詞（372語）"
      count: b.count,
      ids: b.ids,
    }));
  }, [allWords, normLevel]);

  // 番号ブロック（1–50, 51–100, ...）
  const numberBlocks = useMemo(() => {
    const blocks = buildBlocksByNumber(allWords, 50);
    // "num-1","num-2"… のキー/ラベルは buildBlocksByNumber 側で作成済み
    return blocks.map(b => ({
      key: b.key,     // 例: "num-1"
      label: b.label, // 例: "1–50"
      count: b.count,
      ids: b.ids,
    }));
  }, [allWords]);

  // ランダムブロック（番号ブロックを流用 + 全体）
  const randomBlocks = useMemo(() => {
    const perRange = numberBlocks.map(b => ({
      key: `rand-${b.key.split("-")[1]}`, // "num-3" -> "rand-3"
      label: `${b.label} からランダム10問`,
      count: b.count,
      ids: b.ids,
    }));
    return [
      ...perRange,
      { key: "rand-all", label: "全体からランダム10問", count: allWords.length, ids: allWords.map(w => w.id) },
    ];
  }, [numberBlocks, allWords]);

  // 画面に出すブロック
  const blocks = useMemo(() => {
    if (mode === "pos") return posBlocks;
    if (mode === "number") return numberBlocks;
    return randomBlocks; // "random"
  }, [mode, posBlocks, numberBlocks, randomBlocks]);

  // クリック → クイズへ
  const go = (blk) => {
    // WordQuizPage 側で pos- / num- / rand- を解釈して10問ランダム出題
    // （ids は state で渡しても良いが、キー解釈で十分なのでURLのみでOK）
    navigate(`/word-quiz/${normLevel}/${encodeURIComponent(blk.key)}`);
  };

  return (
    <main className="lesson-select-page" role="main" aria-label={`WORD QUIZ ${normLevel.toUpperCase()}`}>
      {/* タブ（単語帳と同じ見た目に） */}
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
          className={`toggle ${mode === "random" ? "active" : ""}`}
          onClick={() => setMode("random")}
        >
          ランダム
        </button>
      </div>

      {/* ブロック一覧 */}
      {blocks.length === 0 ? (
        <div className="lesson-empty">データがありません。</div>
      ) : (
        <div className="lesson-blocks" role="list">
          {blocks.map((blk) => (
            <button
              key={blk.key}
              className="lesson-block"
              role="listitem"
              onClick={() => go(blk)}
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
