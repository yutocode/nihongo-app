// src/pages/BrowseBlockPage.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { getAllWords } from "../data/registry/index.js";
import {
  buildBlocksByNumber,
  buildBlocksByPOS,
  buildBlocksByFreq,
} from "../utils/grouping.js";

import WordCard from "../components/WordCard.jsx";
import "../styles/WordPage.css";

export default function BrowseBlockPage() {
  const { level = "n5", mode = "number", key = "" } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const normLevel = String(level).toLowerCase();

  // 全単語（id主導で取得）
  const allWords = useMemo(() => getAllWords(normLevel), [normLevel]);

  // LessonSelect から渡された state（最優先で使う）
  const stateIds = Array.isArray(state?.ids) ? state.ids.map(Number) : null;
  const stateLabel = state?.label || null;

  // state が無いとき用に、同じロジックでブロックを再生成
  const blocks = useMemo(() => {
    if (!allWords.length) return [];
    if (mode === "pos")  return buildBlocksByPOS(allWords, normLevel);
    if (mode === "freq") return buildBlocksByFreq(allWords);
    return buildBlocksByNumber(allWords);
  }, [mode, allWords, normLevel]);

  // 表示対象の words と 見出し
  const { words, label } = useMemo(() => {
    if (stateIds?.length) {
      const set = new Set(stateIds);
      const w = allWords
        .filter(x => set.has(Number(x.id)))
        .sort((a, b) => a.id - b.id);
      return { words: w, label: stateLabel || "ブロック" };
    }
    const blk = blocks.find(b => b.key === key);
    if (!blk) return { words: [], label: "ブロック" };
    const set = new Set(blk.ids);
    const w = allWords
      .filter(x => set.has(Number(x.id)))
      .sort((a, b) => a.id - b.id);
    return { words: w, label: blk.label };
  }, [allWords, stateIds, stateLabel, blocks, key]);

  if (!words.length) {
    return (
      <main style={{ padding: 16 }}>
        ブロックが見つかりません。
        <div style={{ marginTop: 8 }}>
          <button onClick={() => navigate(-1)}>戻る</button>
        </div>
      </main>
    );
  }

  // 一覧ではなく WordCard を表示（カード内で Next/Back 学習）
  return (
    <main className="word-page" style={{ padding: 12 }}>
      <header className="wp-header">
        <button onClick={() => navigate(-1)}>‹</button>
        <h1>
          {label}（{words.length}語）
        </h1>
      </header>

      <WordCard
        wordList={words}
        level={normLevel}
        lesson="LessonVirtual"
        lessonTitleOverride={label}  // カード上部にブロック名
        mode="learn"
      />
    </main>
  );
}
