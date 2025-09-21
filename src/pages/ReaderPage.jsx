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

import { n5Stories } from "../data/reader/n5/stories";
import ReaderHeader from "../components/ReaderHeader.jsx";
import SentenceCard from "../components/SentenceCard.jsx";
import BottomActionBar from "../components/BottomActionBar.jsx"; // ★ 修正
import WordPopup from "../components/WordPopup.jsx";
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

  const story = useMemo(() => STORY_MAP["n5"]?.[storyId], [storyId]);

  useEffect(() => {
    if (!story) navigate("/reader", { replace: true });
  }, [story, navigate]);

  useEffect(() => {
    setIdx(0);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [storyId]);

  const sentences = story?.sentences ?? [];
  const sentence = sentences[idx];
  const progress = story
    ? Math.round(((idx + 1) / sentences.length) * 100)
    : 0;

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

  const onPlay = useCallback(() => {
    if (!audioRef.current || !sentence || !story) {
      console.log("音声はまだ準備中です");
      return;
    }
    audioRef.current.src = `${story.audioBase}/${sentence.audio}`;
    audioRef.current
      .play()
      .catch((e) => console.warn("Audio play failed:", e));
  }, [sentence, story]);

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

      <BottomActionBar
        onPrev={prev}
        onNext={next}
        onPlay={onPlay}
        onCheck={() => {}}
        onSettings={() => {}}
        onTranslate={() => setShowTrans(v => !v)}
        onSlow={() => {}} // ReaderPageではスロー再生はまだ未実装
        slowActive={false}
      />

      <audio ref={audioRef} preload="none" />
    </div>
  );
}
