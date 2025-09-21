// src/pages/StoryPlayer.jsx
import React, { useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReaderHeader from "@/components/ReaderHeader.jsx";      // 上ヘッダー（戻る/進捗/ページ数/旗）
import SentenceCard from "@/components/SentenceCard.jsx";       // 画像＋本文（ルビ対応）
import BottomActionBar from "@/components/BottomActionBar.jsx"; // 下の楕円ボタン列
import "@/styles/StoryPlayer.css";

import { story1 } from "@/data/reader/n5/stories/story1.js";

// ★ 音声がまだ無い間は false のまま。
//    音声を置いたら true に変えるだけで再生有効化。
const AUDIO_ENABLED = false;

export default function StoryPlayer() {
  // いまは固定（将来 level/id で差し替え）
  const { level = "n5", id = "story1" } = useParams();
  const navigate = useNavigate();

  const story = story1;

  const [idx, setIdx] = useState(0);
  const [showTrans, setShowTrans] = useState(true);
  const [slow, setSlow] = useState(false);
  const audioRef = useRef(null);

  const page = story.sentences[idx];
  const total = story.sentences.length;

  // 再生用パス（AUDIO_ENABLED=false の間は使わない）
  const audioSrc = useMemo(() => `${story.audioBase}/${page.audio}`, [story, page]);

  const onPlay = () => {
    if (!AUDIO_ENABLED || !page?.audio) {
      console.log("音声はまだ準備中です");
      return;
    }
    try {
      if (audioRef.current) audioRef.current.pause();
      const a = new Audio(audioSrc);
      a.playbackRate = slow ? 0.75 : 1.0;
      a.play();
      audioRef.current = a;
    } catch (e) {
      console.warn("音声の再生に失敗しました:", e);
    }
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

      {/* 中央：画像＋本文（翻訳は繁体字。ボタンでON/OFF） */}
      <SentenceCard
        cover={story.cover}
        html={page.jp}                       // ruby入りHTMLを渡す
        showFurigana={true}
        tr={showTrans ? page.tr.tw : null}   // 翻訳は“文字列”で渡す（[object Object]回避）
      />

      {/* 下：楕円コントロールバー（参考アプリの並び） */}
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
