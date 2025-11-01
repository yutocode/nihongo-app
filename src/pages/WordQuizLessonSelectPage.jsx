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

  // ===== ブロック作成（grouping.js はコロン形式キーを返す）=====
  const posBlocks = useMemo(() => buildBlocksByPOS(allWords, normLevel), [allWords, normLevel]);
  const numberBlocks = useMemo(() => buildBlocksByNumber(allWords, 50), [allWords]);

  // ラベル "101–150" → [101, 150]
  const rangeFromLabel = (label) => {
    const m = String(label).match(/(\d+)\s*[–-]\s*(\d+)/);
    return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : [null, null];
  };

  // ランダムブロック（番号レンジごと＋全体）
  const randomBlocks = useMemo(() => {
    const perRange = numberBlocks.map((b) => {
      const [start, end] = rangeFromLabel(b.label);
      return {
        key: start && end ? `rand:${start}-${end}` : `rand:all`,
        label: `${b.label} からランダム10問`,
        count: b.count,
        ids: b.ids,
      };
    });
    return [
      ...perRange,
      { key: "rand:all", label: "全体からランダム10問", count: allWords.length, ids: allWords.map((w) => w.id) },
    ];
  }, [numberBlocks, allWords]);

  // 表示するブロック
  const blocks = useMemo(() => {
    if (mode === "pos") return posBlocks;
    if (mode === "number") return numberBlocks;
    return randomBlocks;
  }, [mode, posBlocks, numberBlocks, randomBlocks]);

  // クリック → クイズへ（キーがコロン形式ならそのまま、旧ハイフンも後方互換で変換）
  const go = (blk) => {
    let lesson = blk.key;

    // すでに "pos:" / "num:" / "rand:" 形式ならそのまま
    if (/^(pos|num|rand):/.test(lesson)) {
      navigate(`/word-quiz/${normLevel}/${encodeURIComponent(lesson)}`);
      return;
    }

    // 旧ハイフン形式の後方互換（混在対策）
    if (lesson.startsWith("pos-")) {
      const pos = lesson.replace(/^pos-/, "").replace(/-all$/, "");
      lesson = `pos:${pos}`;
    } else if (lesson.startsWith("num-")) {
      const [start, end] = rangeFromLabel(blk.label);
      lesson = start && end ? `num:${start}-${end}` : "num:all";
    } else if (lesson.startsWith("rand-")) {
      const [start, end] = rangeFromLabel(blk.label);
      lesson = start && end ? `rand:${start}-${end}` : "rand:all";
    }

    navigate(`/word-quiz/${normLevel}/${encodeURIComponent(lesson)}`);
  };

  return (
    <main className="lesson-select-page" role="main" aria-label={`WORD QUIZ ${normLevel.toUpperCase()}`}>
      {/* タブ */}
      <div className="lesson-toolbar">
        <button className={`toggle ${mode === "pos" ? "active" : ""}`} onClick={() => setMode("pos")}>
          品詞で分ける
        </button>
        <button className={`toggle ${mode === "number" ? "active" : ""}`} onClick={() => setMode("number")}>
          番号順
        </button>
        <button className={`toggle ${mode === "random" ? "active" : ""}`} onClick={() => setMode("random")}>
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
