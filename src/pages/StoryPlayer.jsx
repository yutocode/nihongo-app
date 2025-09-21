// src/pages/StoryPlayer.jsx
import React, { useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReaderHeader from "@/components/ReaderHeader.jsx";      // ← ヘッダー（戻る/進捗/ページ数/旗）
import SentenceCard from "@/components/SentenceCard.jsx";       // ← 画像＋本文（ルビ対応）
import BottomActionBar from "@/components/BottomActionBar.jsx"; // ← 下の楕円ボタン列
import "@/styles/StoryPlayer.css";

import { story1 } from "@/data/reader/n5/stories/story1.js";

export default function StoryPlayer() {
  const { level = "n5", id = "story1" } = useParams();
  const navigate = useNavigate();

  const story = story1; // 今回は固定

  const [idx, setIdx] = useState(0);
  const [showTrans, setShowTrans] = useState(true);  // 翻訳ON/OFF（ボタンで切替）
  const [slow, setSlow] = useState(false);
  const audioRef = useRef(null);

  const page = story.sentences[idx];
  const total = story.sentences.length;

  const audioSrc = useMemo(() => `${story.audioBase}/${page.audio}`, [story, page, slow]);

  const onPlay = () => {
    if (audioRef.current) audioRef.current.pause();
    const a = new Audio(audioSrc);
    a.playbackRate = slow ? 0.75 : 1.0;
    a.play();
    audioRef.current = a;
  };

  const onPrev = () => setIdx(i => Math.max(0, i - 1));
  const onNext = () => setIdx(i => Math.min(total - 1, i + 1));

  return (
    <div className="story-wrap">
      {/* 上部：戻る矢印 + 緑プログレス + ページ数 + 旗 */}
      <ReaderHeader
        current={idx + 1}
        total={total}
        onBack={() => navigate(-1)}
        onFlag={() => {}}
      />

      {/* 中央：画像＋本文（繁体字翻訳はボタンで表示/非表示） */}
      <SentenceCard
        cover={story.cover}
        html={page.jp}                     // ← ここはHTML（ruby）文字列を渡す
        showFurigana={true}
        tr={showTrans ? page.tr.tw : null} // ← 翻訳は文字列を渡す
      />

      {/* 下：楕円のコントロールバー（スクショの順番） */}
      <BottomActionBar
        onSettings={() => {}}
        onTranslate={() => setShowTrans(v => !v)}
        onPlay={onPlay}
        onSlow={() => setSlow(v => !v)}
        onPrev={onPrev}
        onNext={onNext}
        onCheck={() => {}}
        slowActive={slow}
      />
    </div>
  );
}
