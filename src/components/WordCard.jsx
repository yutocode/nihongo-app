// src/components/WordCard.jsx
import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/useAppStore";
import { useMyWordsStore } from "../store/useMyWordsStore"; // ★ 追加
import "../styles/WordCard.css";

export default function WordCard({
  wordList = [],
  level = "n5",
  lesson = "Lesson1",
  audioBase = "/audio",
  onIndexChange,
  onAdd,      // 任意: 追加ボタン押下時に先に呼ぶ（戻り値は見ない）
  onDetail,   // 任意
}) {
  const [index, setIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const { t, i18n } = useTranslation();
  const addXP = useAppStore((s) => s.addXP);
  const awardedRef = useRef(new Set()); // 1語につき一度だけXP

  // === my-wordbook store ===
  const myAdd    = useMyWordsStore((s) => s.add);
  const hasWord  = useMyWordsStore((s) => s.hasWord);
  const removeW  = useMyWordsStore((s) => s.removeWord);

  // ---- i18n / ラベル ----
  const currentLang = useMemo(() => {
    const lower = String(i18n.language || "ja").toLowerCase();
    if (lower.startsWith("tw")) return "tw";
    if (lower.startsWith("zh")) return "zh";
    if (lower.startsWith("en")) return "en";
    if (lower.startsWith("id")) return "id";
    return "ja";
  }, [i18n.language]);

  const L = useMemo(() => ({
    back:     t("wordcard.back", "← 戻る"),
    next:     t("wordcard.next", "次へ →"),
    show:     t("wordcard.showMeaning", "クリックして意味を表示"),
    meaning:  t("wordcard.meaning", "意味"),
    play:     t("wordcard.play", "🔊 音声を再生"),
    detail:   t("wordcard.detail", "詳しく"),
    add:      t("wordcard.add", "追加"),
    added:    t("wordcard.added", "追加済み"),
    notFound: t("wordcard.notFound", "❌ 翻訳が見つかりません"),
  }), [t]);

  // ---- データガード ----
  if (!Array.isArray(wordList) || wordList.length === 0) {
    return (
      <div className="word-card">
        <p>{t("common.noWordsFound", "単語が見つかりません")}</p>
      </div>
    );
  }

  const word = wordList[index] ?? {};
  const currentMeaning = word?.meanings?.[currentLang] || L.notFound;

  // ★ 追加用にメタを合成（level / lesson / idx を付与）
  const enriched = useMemo(
    () => ({ ...word, level, lesson, idx: index }),
    [word, level, lesson, index]
  );
  const isAdded = useMyWordsStore((s) => s.hasWord(enriched)); // 依存購読で自動再描画

  // ---- 音声候補 ----
  const audioCandidates = useMemo(() => {
    const trimJoin = (...p) =>
      p.filter(Boolean)
        .map((x) => (typeof x === "string" ? x.replace(/^\/+|\/+$/g, "") : x))
        .join("/");
    const enc = (s) => encodeURIComponent(s || "");
    const r = word?.reading || "";
    const arr = [];
    if (word?.audio) arr.push(`/${trimJoin(audioBase, level, lesson, word.audio)}`);
    if (r) {
      arr.push(`/${trimJoin(audioBase, level, lesson, `${index + 1}_${enc(r)}.mp3`)}`);
      arr.push(`/${trimJoin(audioBase, level, lesson, `${enc(r)}.mp3`)}`);
    }
    return arr;
  }, [word, index, level, lesson, audioBase]);

  // ---- ナビゲーション ----
  const goto = useCallback((next) => {
    setShowMeaning(false);
    setIsPlaying(false);
    setIndex(next);
    onIndexChange?.(next);
  }, [onIndexChange]);

  const handleNext = useCallback(() => {
    if (!awardedRef.current.has(index)) {
      awardedRef.current.add(index);
      addXP(1);
    }
    if (index < wordList.length - 1) goto(index + 1);
  }, [index, wordList.length, goto, addXP]);

  const handlePrev = useCallback(() => {
    if (index > 0) goto(index - 1);
  }, [index, goto]);

  // ---- 音声 ----
  const playAudio = useCallback(async () => {
    if (!audioCandidates.length) return;
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    for (const src of audioCandidates) {
      try {
        const a = audioRef.current || new Audio();
        audioRef.current = a;
        a.src = src;
        a.onended = () => setIsPlaying(false);
        a.pause(); a.currentTime = 0;
        await a.play();
        return;
      } catch {}
    }
    setIsPlaying(false);
  }, [audioCandidates]);

  // クリーンアップ
  useEffect(() => () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
  }, []);

  // キー操作
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        playAudio();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNext, handlePrev, playAudio]);

  // 意味表示でXP（初回のみ）
  const onToggleMeaning = () => {
    if (!showMeaning && !awardedRef.current.has(index)) {
      awardedRef.current.add(index);
      addXP(1);
    }
    setShowMeaning(true);
  };

  // レッスン表記を常に「Lesson n」で表示
  const lessonTitle = useMemo(() => {
    const m = String(lesson).match(/\d+/);
    return `Lesson ${m ? m[0] : ""}`.trim();
  }, [lesson]);

  // 追加ボタン動作（デフォルトは my-wordbook に保存/解除）
  const handleAdd = () => {
    onAdd?.(enriched); // 先にユーザー定義ハンドラ（任意）

    if (isAdded) {
      removeW(enriched);
    } else {
      myAdd(enriched);
    }
  };

  return (
    <div className="word-card" role="group" aria-label="Word card">
      {/* ヘッダー：左 詳しく / 中央 Lesson / 右 追加 */}
      <div className="wc-head">
        <button
          type="button"
          className="wc-head-btn left"
          onClick={() => onDetail?.(enriched)}
        >
          {L.detail}
        </button>
        <div className="wc-head-title">{lessonTitle}</div>
        <button
          type="button"
          className={`wc-head-btn right ${isAdded ? "is-added" : ""}`}
          onClick={handleAdd}
          aria-pressed={isAdded}
        >
          {isAdded ? L.added : L.add}
        </button>
      </div>

      <div className="kanji">{word?.kanji || "—"}</div>
      <div className="reading">{word?.reading || "—"}</div>

      <button
        type="button"
        className="meaning-box"
        onClick={onToggleMeaning}
        aria-expanded={showMeaning}
      >
        {showMeaning ? (
          <p><b>{L.meaning}:</b> {currentMeaning}</p>
        ) : (
          <p>{L.show}</p>
        )}
      </button>

      <div className="audio-area">
        <button
          type="button"
          className="audio-button"
          onClick={playAudio}
          disabled={isPlaying || !word?.reading}
          aria-busy={isPlaying}
        >
          {L.play}
        </button>
      </div>

      <div className="navigation">
        <button type="button" onClick={handlePrev} disabled={index === 0}>
          {L.back}
        </button>
        <button type="button" onClick={handleNext} disabled={index === wordList.length - 1}>
          {L.next}
        </button>
      </div>
    </div>
  );
}