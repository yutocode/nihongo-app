// src/pages/ReaderPage.jsx
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { n5Stories } from "../data/reader/n5/stories";
import ReaderHeader from "../components/ReaderHeader.jsx";
import SentenceCard from "../components/SentenceCard.jsx";
import BottomActionBar from "../components/BottomActionBar.jsx";
import { useAppStore } from "../store/useAppStore";

const STORY_MAP = { n5: n5Stories };

export default function ReaderPage() {
  const { storyId = "story1" } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [idx, setIdx] = useState(0);
  const [showFuri, setShowFuri] = useState(true);
  const [showTrans, setShowTrans] = useState(true);
  const audioRef = useRef(null);
  const saveReaderProgress = useAppStore((s) => s.saveReaderProgress);

  // N5 固定で該当ストーリーを取得
  const story = useMemo(() => STORY_MAP.n5?.[storyId], [storyId]);

  // ストーリーが無ければ一覧へ戻す
  useEffect(() => {
    if (!story) navigate("/reader", { replace: true });
  }, [story, navigate]);

  // ストーリー切替時の初期化
  useEffect(() => {
    setIdx(0);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [storyId]);

  const sentences = story?.sentences ?? [];
  const page = sentences[idx];
  const total = sentences.length;
  const progress = total ? Math.round(((idx + 1) / total) * 100) : 0;

  // 進捗保存（軽いデバウンス）
  useEffect(() => {
    if (!story) return;
    const t = setTimeout(() => {
      try {
        saveReaderProgress("n5", story.id, idx);
      } catch {}
    }, 150);
    return () => clearTimeout(t);
  }, [idx, story, saveReaderProgress]);

  // 再生（音声未用意ならメッセージ）
  const onPlay = useCallback(() => {
    if (!page || !story) return;
    if (!audioRef.current) return;
    // 音声ファイルが未配置ならここで安全にログだけ
    const url = `${story.audioBase}/${page.audio}`;
    if (!page.audio) {
      console.log("音声はまだ準備中です");
      return;
    }
    audioRef.current.src = url;
    audioRef.current
      .play()
      .catch(() => console.log("音声はまだ準備中です"));
  }, [page, story]);

  // 音声終了で自動で次へ
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const handleEnd = () => setIdx((i) => Math.min(i + 1, total - 1));
    el.addEventListener("ended", handleEnd);
    return () => el.removeEventListener("ended", handleEnd);
  }, [total]);

  const next = useCallback(
    () => setIdx((i) => Math.min(i + 1, total - 1)),
    [total]
  );
  const prev = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

  if (!story) return null;

  return (
    <div className="reader-wrap">
      <ReaderHeader
        title={story.title}
        progress={progress}
        current={idx + 1}
        total={total}
        showFuri={showFuri}
        setShowFuri={setShowFuri}
        showTrans={showTrans}
        setShowTrans={setShowTrans}
        onBack={() => navigate("/reader")}
        onFlag={() => {}}
      />

      {page && (
        <SentenceCard
          // 各ページ専用画像があれば使用。無ければカバー画像。
          cover={page.image || story.cover}
          // ルビ付きの本文（HTML文字列）
          html={page.jp}
          showFurigana={showFuri}
          // 翻訳は繁体字を前面に（他言語にしたい時はここを切り替え）
          tr={showTrans ? page.tr?.tw : null}
          // ついでに現在のUI言語が要る場合は渡せる
          lang={i18n.language}
        />
      )}

      <BottomActionBar
        onSettings={() => {}}
        onTranslate={() => setShowTrans((v) => !v)}
        onPlay={onPlay}
        onSlow={() => {}}
        slowActive={false}
        onPrev={prev}
        onNext={next}
        onCheck={() => {}}
      />

      <audio ref={audioRef} preload="none" />
    </div>
  );
}
