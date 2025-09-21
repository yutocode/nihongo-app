// src/pages/ReaderPage.jsx
import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ★ Reader.css は削除済みなので不要
// import "../styles/Reader.css";

import { n5Stories } from "../data/reader/n5/stories";
import ReaderHeader from "../components/ReaderHeader.jsx";
import SentenceCard from "../components/SentenceCard.jsx";
import ControlsBar from "../components/ControlsBar.jsx";
import WordPopup from "../components/WordPopup.jsx";
import { useAppStore } from "../store/useAppStore";

// いまは N5 固定。将来 N4/N3 を追加したらここに拡張
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

  // 現在のストーリー（N5固定）
  const story = useMemo(() => STORY_MAP["n5"]?.[storyId], [storyId]);

  // ストーリーが無ければ Hub へ戻す
  useEffect(() => {
    if (!story) navigate("/reader", { replace: true });
  }, [story, navigate]);

  // ストーリー切替時の初期化
  useEffect(() => {
    setIdx(0);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [storyId]);

  const sentences = story?.sentences ?? [];
  const sentence = sentences[idx];
  const progress = story
    ? Math.round(((idx + 1) / sentences.length) * 100)
    : 0;

  // 進捗保存（簡易デバウンス）
  useEffect(() => {
    if (!story) return;
    const h = setTimeout(() => {
      try {
        saveReaderProgress("n5", story.id, idx);
      } catch (e) {
        console.warn("Failed to save reader progress:", e);
      }
    }, 150);
    return () => clearTimeout(h);
  }, [idx, story, saveReaderProgress]);

  // 再生処理
  const onPlay = useCallback(() => {
    if (!audioRef.current || !sentence || !story) return;
    audioRef.current.src = `${story.audioBase}/${sentence.audio}`;
    audioRef.current
      .play()
      .catch((e) => console.warn("Audio play failed:", e));
  }, [sentence, story]);

  // 音声終了 → 次の文へ
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnded = () =>
      setIdx((i) => Math.min(i + 1, sentences.length - 1));
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
  }, [sentences.length]);

  const next = useCallback(
    () => setIdx((i) => Math.min(i + 1, sentences.length - 1)),
    [sentences.length]
  );
  const prev = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

  // キーボード操作: ← → / Space
  useEffect(() => {
    const onKey = (e) => {
      if (
        e.target &&
        (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
      )
        return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.code === "Space") {
        e.preventDefault();
        onPlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onPlay]);

  // ストーリーが存在しない場合のフォールバック
  if (!story) {
    return (
      <div style={{ padding: "2rem", color: "#fff" }}>
        <p>Story not found. Returning to hub…</p>
      </div>
    );
  }

  return (
    <div className="reader-wrap">
      <ReaderHeader
        title={story.title}
        progress={progress}
        showFuri={showFuri}
        setShowFuri={setShowFuri}
        showTrans={showTrans}
        setShowTrans={setShowTrans}
        onBack={() => navigate("/reader")}
      />

      {sentence && (
        <SentenceCard
          key={sentence.id}
          sentence={sentence}
          lang={i18n.language}
          showFuri={showFuri}
          showTrans={showTrans}
        />
      )}

      <ControlsBar
        onPrev={prev}
        onNext={next}
        onPlay={onPlay}
        canPrev={idx > 0}
        canNext={idx < sentences.length - 1}
      />

      <audio ref={audioRef} preload="none" />
    </div>
  );
}
