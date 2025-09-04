// src/components/WordCard.jsx
import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/useAppStore";
import { useMyWordsStore } from "../store/useMyWordsStore";
import "../styles/WordCard.css";

const buildId = (w) =>
  w?.id ??
  `${w?.level ?? "n?"}:${w?.lesson ?? "Lesson?"}:${w?.idx ?? w?.kanji ?? ""}`;

export default function WordCard({
  wordList = [],
  level = "n5",
  lesson = "Lesson1",
  audioBase = "/audio",
  onIndexChange,
  onAdd,       // 任意: 追加時フック
  onDetail,    // 任意: 詳細時フック
  mode = "learn", // "learn"（通常）| "my"（My単語帳表示）
  onRemove,    // 任意: mode="my" のとき削除フック
}) {
  const isMy = mode === "my";

  const [index, setIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const { t, i18n } = useTranslation();
  const addXP = useAppStore((s) => s.addXP);
  const awardedRef = useRef(new Set());

  // --- My単語帳 store
  const addToMyBook = useMyWordsStore((s) => s.add);
  const removeWord  = useMyWordsStore((s) => s.removeWord);

  // --- 表示言語
  const currentLang = useMemo(() => {
    const lower = String(i18n.language || "ja").toLowerCase();
    if (lower.startsWith("tw")) return "tw";
    if (lower.startsWith("zh")) return "zh";
    if (lower.startsWith("en")) return "en";
    if (lower.startsWith("id")) return "id";
    return "ja";
  }, [i18n.language]);

  // --- 多言語ラベル
  const L = useMemo(
    () => ({
      back:     t("wordcard.back", "← 戻る"),
      next:     t("wordcard.next", "次へ →"),
      show:     t("wordcard.showMeaning", "クリックして意味を表示"),
      meaning:  t("wordcard.meaning", "意味"),
      play:     t("wordcard.play", "🔊 音声を再生"),
      detail:   t("wordcard.detail", "詳しく"),
      add:      t("wordcard.add", "追加"),
      added:    t("wordcard.added", "追加済み"),
      remove:   t("mywb.remove", "削除"),
      notFound: t("wordcard.notFound", "❌ 翻訳が見つかりません"),
    }),
    [t]
  );

  // --- データなしガード
  if (!Array.isArray(wordList) || wordList.length === 0) {
    return (
      <div className="word-card">
        <p>{t("common.noWordsFound", "単語が見つかりません")}</p>
      </div>
    );
  }

  const word = wordList[index] ?? {};
  const currentMeaning = word?.meanings?.[currentLang] || L.notFound;

  // --- 保存用メタ
  const enriched = useMemo(
    () => ({ ...word, level, lesson, idx: index }),
    [word, level, lesson, index]
  );

  // ✅ Zustand selector で購読 → 追加済みが即反映される
  const isAdded = useMyWordsStore(
    useCallback(
      (s) => s.items.some((w) => buildId(w) === buildId(enriched)),
      [enriched]
    )
  );

  // --- 音声候補
  const audioCandidates = useMemo(() => {
    const join = (...p) =>
      p.filter(Boolean).map((x) =>
        typeof x === "string" ? x.replace(/^\/+|\/+$/g, "") : x
      ).join("/");
    const enc = (s) => encodeURIComponent(s || "");
    const r = word?.reading || "";
    const arr = [];
    if (word?.audio) arr.push(`/${join(audioBase, level, lesson, word.audio)}`);
    if (r) {
      arr.push(`/${join(audioBase, level, lesson, `${index + 1}_${enc(r)}.mp3`)}`);
      arr.push(`/${join(audioBase, level, lesson, `${enc(r)}.mp3`)}`);
    }
    return arr;
  }, [word, index, level, lesson, audioBase]);

  // --- ページ移動
  const goto = useCallback(
    (next) => {
      setShowMeaning(false);
      setIsPlaying(false);
      setIndex(next);
      onIndexChange?.(next);
    },
    [onIndexChange]
  );

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

  // --- 音声再生
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
        a.pause();
        a.currentTime = 0;
        await a.play();
        return;
      } catch {}
    }
    setIsPlaying(false);
  }, [audioCandidates]);

  // --- クリーンアップ
  useEffect(
    () => () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    },
    []
  );

  // --- キー操作
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

  // --- 意味表示でXP加点
  const onToggleMeaning = () => {
    if (!showMeaning && !awardedRef.current.has(index)) {
      awardedRef.current.add(index);
      addXP(1);
    }
    setShowMeaning(true);
  };

  // --- レッスン見出し
  const lessonTitle = useMemo(() => {
    const m = String(lesson).match(/\d+/);
    return `Lesson ${m ? m[0] : ""}`.trim();
  }, [lesson]);

  // --- 右上ボタン動作
  const handleRight = () => {
    if (isMy) {
      onRemove?.(enriched);
      removeWord(enriched);
    } else {
      onAdd?.(enriched);
      isAdded ? removeWord(enriched) : addToMyBook(enriched);
    }
  };

  return (
    <div className="word-card" role="group" aria-label="Word card">
      {/* ヘッダー */}
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
          className={`wc-head-btn right ${!isMy && isAdded ? "is-added" : ""}`}
          onClick={handleRight}
          aria-pressed={!isMy && isAdded}
        >
          {isMy ? L.remove : isAdded ? L.added : L.add}
        </button>
      </div>

      {/* 本文 */}
      <div className="kanji">{word?.kanji || "—"}</div>
      <div className="reading">{word?.reading || "—"}</div>

      <button
        type="button"
        className="meaning-box"
        onClick={onToggleMeaning}
        aria-expanded={showMeaning}
      >
        {showMeaning ? (
          <p>
            <b>{L.meaning}:</b> {currentMeaning}
          </p>
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

      {/* ナビゲーション */}
      <div className="navigation">
        <button type="button" onClick={handlePrev} disabled={index === 0}>
          {L.back}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={index === wordList.length - 1}
        >
          {L.next}
        </button>
      </div>
    </div>
  );
}